from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session
from prometheus_fastapi_instrumentator import Instrumentator

from .config import settings
from .db import Base, engine, get_db
from .models import Ticket
from .schemas import StatsOut, TicketCreate, TicketOut, TicketStatusUpdate, TicketUpdate

app = FastAPI(title=settings.app_name, version=settings.app_version)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instrument Prometheus metrics at /metrics
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

@app.on_event("startup")
def startup():
    # Production containers run Alembic migrations before Uvicorn;
    # create_all ensures local runs and tests are self-contained.
    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "status": "operational",
        "docs": "/docs",
    }

@app.get("/health")
def health():
    """Cheap liveness probe for Kubernetes to verify container process is alive."""
    return {"status": "UP"}

@app.get("/ready")
def ready(db: Session = Depends(get_db)):
    """Readiness probe checking database connectivity before serving customer traffic."""
    try:
        db.execute(select(func.count(Ticket.id)))
        return {"status": "READY", "database": "CONNECTED"}
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database unreachable: {str(exc)}",
        )

@app.get("/api/tickets", response_model=list[TicketOut])
def list_tickets(
    status_filter: str | None = Query(default=None, alias="status"),
    priority_filter: str | None = Query(default=None, alias="priority"),
    category_filter: str | None = Query(default=None, alias="category"),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = select(Ticket)

    if status_filter:
        query = query.where(Ticket.status == status_filter.upper())
    if priority_filter:
        query = query.where(Ticket.priority == priority_filter.upper())
    if category_filter:
        query = query.where(Ticket.category == category_filter.upper())
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                Ticket.title.ilike(search_pattern),
                Ticket.description.ilike(search_pattern),
                Ticket.customer_email.ilike(search_pattern),
                Ticket.assignee.ilike(search_pattern),
            )
        )

    query = query.order_by(Ticket.id.desc())
    return list(db.scalars(query))

@app.get("/api/tickets/stats", response_model=StatsOut)
def get_stats(db: Session = Depends(get_db)):
    # Group by status
    status_rows = db.execute(
        select(Ticket.status, func.count(Ticket.id)).group_by(Ticket.status)
    ).all()
    counts = {s: c for s, c in status_rows}

    # Urgent tickets needing attention (HIGH or URGENT and not RESOLVED/CLOSED)
    urgent_count = db.scalar(
        select(func.count(Ticket.id)).where(
            Ticket.priority.in_(["HIGH", "URGENT"]),
            Ticket.status.in_(["OPEN", "IN_PROGRESS"]),
        )
    ) or 0

    total = sum(counts.values())
    return StatsOut(
        total=total,
        open=counts.get("OPEN", 0),
        inProgress=counts.get("IN_PROGRESS", 0),
        resolved=counts.get("RESOLVED", 0),
        closed=counts.get("CLOSED", 0),
        urgentCount=urgent_count,
    )

@app.get("/api/tickets/{ticket_id}", response_model=TicketOut)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@app.post("/api/tickets", response_model=TicketOut, status_code=status.HTTP_201_CREATED)
def create_ticket(payload: TicketCreate, db: Session = Depends(get_db)):
    ticket = Ticket(**payload.model_dump())
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

@app.put("/api/tickets/{ticket_id}", response_model=TicketOut)
def update_ticket(ticket_id: int, payload: TicketUpdate, db: Session = Depends(get_db)):
    ticket = db.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(ticket, key, value)
    
    db.commit()
    db.refresh(ticket)
    return ticket

@app.patch("/api/tickets/{ticket_id}/status", response_model=TicketOut)
def update_ticket_status(ticket_id: int, payload: TicketStatusUpdate, db: Session = Depends(get_db)):
    ticket = db.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    ticket.status = payload.status
    db.commit()
    db.refresh(ticket)
    return ticket

@app.delete("/api/tickets/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db.delete(ticket)
    db.commit()
