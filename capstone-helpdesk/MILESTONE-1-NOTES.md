# Milestone 1 Notes — Backend Architecture, Database Migrations, APIs & Automated Tests

**Project:** HelpDesk Pro — Enterprise Ticket Management System  
**Directory:** `capstone-helpdesk/backend`  
**Date:** October 2026  
**Status:** Completed  

---

## 1. Overview of Milestone 1

In Milestone 1, we established the foundational backend service for **HelpDesk Pro**, adhering to the Session 21 DevOps Final Capstone technical stack:

- **Framework:** FastAPI with Python 3.12+ / 3.13
- **ORM & DB Engine:** SQLAlchemy 2.0 with connection pooling (`pool_pre_ping=True`)
- **Database:** PostgreSQL (with `sqlite` support for isolated local unit testing)
- **Migrations:** Alembic for revision-controlled schema changes
- **Metrics & Observability:** `prometheus-fastapi-instrumentator` exposing `/metrics`
- **Validation:** Pydantic v2 schemas for request validation and response models
- **Testing:** Pytest with automated test coverage across health, readiness, and CRUD APIs

---

## 2. Directory Structure Created

```text
capstone-helpdesk/
└── backend/
    ├── alembic/
    │   ├── versions/
    │   │   └── 0001_create_tickets.py
    │   ├── env.py
    │   └── script.py.mako
    ├── app/
    │   ├── __init__.py
    │   ├── config.py
    │   ├── db.py
    │   ├── models.py
    │   ├── schemas.py
    │   └── main.py
    ├── tests/
    │   ├── __init__.py
    │   └── test_api.py
    ├── .dockerignore
    ├── .env.example
    ├── alembic.ini
    ├── Dockerfile
    ├── pytest.ini
    └── requirements.txt
```

---

## 3. Data Model & Database Migrations

### Model: `Ticket` (`app/models.py`)

| Column | Type | Constraints / Defaults | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Integer` | Primary Key, Indexed | Unique ticket identifier |
| `title` | `String(200)` | `nullable=False` | Short descriptive summary of issue |
| `description` | `Text` | Default `""` | Detailed description of the problem |
| `priority` | `String(20)` | Default `"MEDIUM"` | Priority: `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `status` | `String(30)` | Default `"OPEN"` | Status: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` |
| `category` | `String(50)` | Default `"TECHNICAL"` | Category: `TECHNICAL`, `BILLING`, `ACCESS`, `HARDWARE`, `GENERAL` |
| `customer_email` | `String(120)` | Default `"user@example.com"` | Submitter email address |
| `assignee` | `String(120)` | Default `"Unassigned"` | Assigned support engineer/agent |
| `created_at` | `DateTime(tz=True)` | UTC timestamp | Record creation time |
| `updated_at` | `DateTime(tz=True)` | UTC timestamp | Record last update time |

### Alembic Migration (`alembic/versions/0001_create_tickets.py`)
- Defines standard `upgrade()` and `downgrade()` methods for creating and tearing down the `tickets` table.
- Configured in `alembic/env.py` to bind to `settings.database_url` dynamically.

---

## 4. API Endpoints Specification

FastAPI exposes interactive OpenAPI documentation at `/docs`.

### Operational Endpoints
* `GET /`: Returns service name, version, and link to docs.
* `GET /health`: Lightweight liveness probe returning `{"status": "UP"}`. Used by Kubernetes to know the container process is alive.
* `GET /ready`: Readiness probe that executes a `SELECT count(id)` query on the database. Returns `200` with `{"status": "READY", "database": "CONNECTED"}` if healthy, or `503 Service Unavailable` if the database is unreachable.
* `GET /metrics`: Machine-readable metrics endpoint for Prometheus scraping.

### Business & REST Endpoints
* `GET /api/tickets`: Lists tickets with query parameter filtering:
  * `status`: Filter by `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`
  * `priority`: Filter by `LOW`, `MEDIUM`, `HIGH`, `URGENT`
  * `category`: Filter by category
  * `search`: Case-insensitive search across title, description, customer email, and assignee.
* `POST /api/tickets`: Creates a new ticket (validates title length $1 \le len \le 200$, priority/status enums). Returns `201 Created`.
* `GET /api/tickets/{ticket_id}`: Retrieves single ticket details by ID (returns `404` if not found).
* `PUT /api/tickets/{ticket_id}`: Updates ticket fields (title, description, priority, category, assignee).
* `PATCH /api/tickets/{ticket_id}/status`: Quick status transition endpoint for workflow actions (e.g., mark as `RESOLVED`).
* `DELETE /api/tickets/{ticket_id}`: Removes ticket from database. Returns `204 No Content`.
* `GET /api/tickets/stats`: Aggregates real-time metrics for KPI dashboard cards:
  * `total`: Total tickets in the system
  * `open`: Tickets in `OPEN` status
  * `inProgress`: Tickets in `IN_PROGRESS` status
  * `resolved`: Tickets in `RESOLVED` status
  * `closed`: Tickets in `CLOSED` status
  * `urgentCount`: Tickets with `HIGH` or `URGENT` priority that are active (`OPEN` or `IN_PROGRESS`).

---

## 5. Automated Pytest Test Suite (`tests/test_api.py`)

A comprehensive test suite was written covering:
1. `test_root`: API metadata and documentation URLs.
2. `test_health`: Liveness probe status.
3. `test_ready`: Readiness probe DB connectivity.
4. `test_metrics`: Prometheus metrics emission.
5. `test_create_ticket_success`: Payload validation, default values, and status 201 response.
6. `test_create_ticket_validation_error`: Edge-case input verification (empty titles and invalid enums return 422).
7. `test_get_ticket_by_id`: Single ticket fetching and 404 handling.
8. `test_list_and_filter_tickets`: Query filter mechanics (status and priority filters).
9. `test_update_ticket`: Partial and full PUT updates.
10. `test_patch_ticket_status`: Status transition PATCH endpoint.
11. `test_delete_ticket`: 204 deletion verification and subsequent 404 confirmation.
12. `test_stats_endpoint`: Dashboard KPI calculation verification.

---

## 6. Verification Commands

To run migrations and start the backend locally:

```bash
cd capstone-helpdesk/backend

# Create virtual environment & install requirements
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Run automated tests
pytest -v

# Start FastAPI dev server
uvicorn app.main:app --reload --port 8000
```
