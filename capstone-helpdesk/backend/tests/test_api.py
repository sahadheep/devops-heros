import os
import pytest

# Ensure tests use an isolated SQLite database
os.environ["DATABASE_URL"] = "sqlite:///./test_helpdesk.db"

from fastapi.testclient import TestClient
from app.main import app
from app.db import Base, engine

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "HelpDesk Pro API"
    assert data["docs"] == "/docs"

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "UP"}

def test_ready():
    response = client.get("/ready")
    assert response.status_code == 200
    assert response.json()["status"] == "READY"

def test_metrics():
    response = client.get("/metrics")
    assert response.status_code == 200
    assert "http_requests_total" in response.text or "process_cpu_seconds_total" in response.text

def test_create_ticket_success():
    payload = {
        "title": "VPN connection drops frequently",
        "description": "User experiences disconnection every 10 minutes when connecting to corporate VPN.",
        "priority": "HIGH",
        "status": "OPEN",
        "category": "TECHNICAL",
        "customer_email": "alice@company.com",
        "assignee": "NetOps Team"
    }
    response = client.post("/api/tickets", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["title"] == payload["title"]
    assert data["priority"] == "HIGH"
    assert data["customer_email"] == "alice@company.com"

def test_create_ticket_validation_error():
    # Empty title should fail Pydantic validation (min_length=1)
    response = client.post("/api/tickets", json={"title": ""})
    assert response.status_code == 422

    # Invalid priority enum value
    response = client.post("/api/tickets", json={"title": "Test", "priority": "UNKNOWN"})
    assert response.status_code == 422

def test_get_ticket_by_id():
    # Create ticket
    create_res = client.post("/api/tickets", json={"title": "Keyboard malfunction", "category": "HARDWARE"})
    ticket_id = create_res.json()["id"]

    # Fetch by ID
    get_res = client.get(f"/api/tickets/{ticket_id}")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "Keyboard malfunction"

    # Non-existent ticket
    not_found_res = client.get("/api/tickets/99999")
    assert not_found_res.status_code == 404

def test_list_and_filter_tickets():
    # Create 3 tickets with different statuses
    client.post("/api/tickets", json={"title": "Issue 1", "status": "OPEN", "priority": "LOW"})
    client.post("/api/tickets", json={"title": "Issue 2", "status": "RESOLVED", "priority": "MEDIUM"})
    client.post("/api/tickets", json={"title": "Issue 3", "status": "OPEN", "priority": "URGENT"})

    # List all
    all_res = client.get("/api/tickets")
    assert all_res.status_code == 200
    assert len(all_res.json()) == 3

    # Filter by status OPEN
    open_res = client.get("/api/tickets?status=OPEN")
    assert open_res.status_code == 200
    assert len(open_res.json()) == 2

    # Filter by priority URGENT
    urgent_res = client.get("/api/tickets?priority=URGENT")
    assert urgent_res.status_code == 200
    assert len(urgent_res.json()) == 1
    assert urgent_res.json()[0]["title"] == "Issue 3"

def test_update_ticket():
    create_res = client.post("/api/tickets", json={"title": "Printer offline", "status": "OPEN"})
    ticket_id = create_res.json()["id"]

    # Update title and priority
    update_res = client.put(f"/api/tickets/{ticket_id}", json={
        "title": "Office 3rd Floor Printer offline",
        "priority": "HIGH",
        "assignee": "Helpdesk Agent 1"
    })
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["title"] == "Office 3rd Floor Printer offline"
    assert updated["priority"] == "HIGH"
    assert updated["assignee"] == "Helpdesk Agent 1"

def test_patch_ticket_status():
    create_res = client.post("/api/tickets", json={"title": "Password Reset"})
    ticket_id = create_res.json()["id"]

    patch_res = client.patch(f"/api/tickets/{ticket_id}/status", json={"status": "RESOLVED"})
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "RESOLVED"

def test_delete_ticket():
    create_res = client.post("/api/tickets", json={"title": "Spam ticket"})
    ticket_id = create_res.json()["id"]

    del_res = client.delete(f"/api/tickets/{ticket_id}")
    assert del_res.status_code == 204

    # Confirm it no longer exists
    get_res = client.get(f"/api/tickets/{ticket_id}")
    assert get_res.status_code == 404

def test_stats_endpoint():
    client.post("/api/tickets", json={"title": "Ticket A", "status": "OPEN", "priority": "URGENT"})
    client.post("/api/tickets", json={"title": "Ticket B", "status": "IN_PROGRESS", "priority": "HIGH"})
    client.post("/api/tickets", json={"title": "Ticket C", "status": "RESOLVED", "priority": "LOW"})

    stats_res = client.get("/api/tickets/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total"] == 3
    assert stats["open"] == 1
    assert stats["inProgress"] == 1
    assert stats["resolved"] == 1
    assert stats["closed"] == 0
    assert stats["urgentCount"] == 2
