import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API_BASE = '/api';

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    urgentCount: 0,
  });
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('UP');

  const loadData = async () => {
    try {
      setError('');
      const [ticketsRes, statsRes, healthRes] = await Promise.all([
        fetch(`${API_BASE}/tickets`),
        fetch(`${API_BASE}/tickets/stats`),
        fetch('/health').catch(() => null),
      ]);

      if (!ticketsRes.ok || !statsRes.ok) {
        throw new Error('Backend API unavailable. Check if FastAPI server is running.');
      }

      const ticketsData = await ticketsRes.json();
      const statsData = await statsRes.json();
      setTickets(ticketsData);
      setStats(statsData);
      setServerStatus(healthRes && healthRes.ok ? 'UP' : 'OFFLINE');
    } catch (err) {
      setError(err.message || 'Error connecting to backend service');
      setServerStatus('OFFLINE');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll stats and server health periodically
    const timer = setInterval(loadData, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleAdvanceStatus = async (ticket) => {
    const statusCycle = {
      OPEN: 'IN_PROGRESS',
      IN_PROGRESS: 'RESOLVED',
      RESOLVED: 'CLOSED',
      CLOSED: 'OPEN',
    };
    const nextStatus = statusCycle[ticket.status] || 'OPEN';

    try {
      const res = await fetch(`${API_BASE}/tickets/${ticket.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Failed to advance ticket status:', err);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm(`Are you sure you want to delete Ticket #${ticketId}?`)) return;

    try {
      const res = await fetch(`${API_BASE}/tickets/${ticketId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Failed to delete ticket:', err);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      priority: formData.get('priority'),
      customer_email: formData.get('customer_email') || 'user@example.com',
      assignee: formData.get('assignee') || 'Support Agent',
      status: 'OPEN',
    };

    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowModal(false);
        e.currentTarget.reset();
        loadData();
      }
    } catch (err) {
      alert(`Failed to create ticket: ${err.message}`);
    }
  };

  // Filter logic
  const filteredTickets = tickets.filter((t) => {
    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'URGENT'
        ? (t.priority === 'URGENT' || t.priority === 'HIGH') && t.status !== 'RESOLVED' && t.status !== 'CLOSED'
        : t.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'ALL' || t.category === categoryFilter;

    const matchesSearch =
      searchQuery.trim() === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">H</div>
          <div className="brand-info">
            <h2>HelpDesk Pro</h2>
            <span>DevOps Capstone</span>
          </div>
        </div>

        <nav className="nav-section">
          <span className="nav-label">Workspace</span>
          <a
            className={`nav-item ${statusFilter === 'ALL' && categoryFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => { setStatusFilter('ALL'); setCategoryFilter('ALL'); }}
          >
            <span>📊</span> Dashboard
          </a>
          <a
            className={`nav-item ${statusFilter === 'OPEN' ? 'active' : ''}`}
            onClick={() => setStatusFilter('OPEN')}
          >
            <span>📥</span> Open Queue ({stats.open})
          </a>
          <a
            className={`nav-item ${statusFilter === 'URGENT' ? 'active' : ''}`}
            onClick={() => setStatusFilter('URGENT')}
          >
            <span>🚨</span> Urgent Escalations ({stats.urgentCount})
          </a>
          <a
            className={`nav-item ${statusFilter === 'IN_PROGRESS' ? 'active' : ''}`}
            onClick={() => setStatusFilter('IN_PROGRESS')}
          >
            <span>⏳</span> In Progress ({stats.inProgress})
          </a>
          <a
            className={`nav-item ${statusFilter === 'RESOLVED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('RESOLVED')}
          >
            <span>✅</span> Resolved Tickets ({stats.resolved})
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="server-badge">
            <span>
              <span className={`live-dot ${serverStatus === 'UP' ? '' : 'down'}`}></span>
              Backend API
            </span>
            <strong style={{ color: serverStatus === 'UP' ? '#10b981' : '#ef4444' }}>
              {serverStatus}
            </strong>
          </div>

          <div className="user-profile">
            <div className="user-avatar">SR</div>
            <div className="user-info">
              <b>Support Engineer</b>
              <small>DevOps Admin</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="main-content">
        <header className="top-header">
          <div className="title-area">
            <p className="breadcrumb">INCIDENT MANAGEMENT / RESOLVE TICKETS</p>
            <h1>Service Operations Center 🛡️</h1>
            <p>Monitor customer requests, critical incident queues, and system alerts.</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={loadData}>
              ↻ Refresh
            </button>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <span>＋</span> New Ticket
            </button>
          </div>
        </header>

        {/* Error / Offline Alert */}
        {error && (
          <div className="alert-banner">
            <div>
              <strong>⚠ Service Notice:</strong> {error}
            </div>
            <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={loadData}>
              Retry Connection
            </button>
          </div>
        )}

        {/* KPI Metrics */}
        <section className="stats-grid">
          <StatCard
            label="Total Incidents"
            value={stats.total}
            icon="📁"
            footer="All registered tickets"
          />
          <StatCard
            label="Open Issues"
            value={stats.open}
            icon="📥"
            footer="Awaiting investigation"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon="⚙️"
            footer="Being resolved actively"
          />
          <StatCard
            label="Resolved"
            value={stats.resolved}
            icon="✅"
            footer="Successfully closed"
          />
          <StatCard
            label="Urgent Priority"
            value={stats.urgentCount}
            icon="🚨"
            footer="High / Critical SLA risk"
            isUrgent={stats.urgentCount > 0}
          />
        </section>

        {/* Dashboard Split View */}
        <div className="dashboard-grid">
          {/* Main Tickets Panel */}
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Support Tickets Queue</h2>
                <p>Real-time queue of all reported incidents and support requests.</p>
              </div>

              {/* Status Filters */}
              <div className="filter-tabs">
                {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((tab) => (
                  <button
                    key={tab}
                    className={`filter-tab ${statusFilter === tab ? 'active' : ''}`}
                    onClick={() => setStatusFilter(tab)}
                  >
                    {tab === 'ALL' ? 'All' : tab.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Controls Bar */}
            <div className="controls-bar">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by title, description, customer or agent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="btn-secondary"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ padding: '8px 12px' }}
              >
                <option value="ALL">All Categories</option>
                <option value="TECHNICAL">Technical</option>
                <option value="BILLING">Billing</option>
                <option value="ACCESS">Access & Security</option>
                <option value="HARDWARE">Hardware</option>
                <option value="GENERAL">General</option>
              </select>
            </div>

            {/* Table */}
            {loading ? (
              <div className="empty-state">Loading tickets from database…</div>
            ) : filteredTickets.length === 0 ? (
              <div className="empty-state">
                No tickets match the selected filters.
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Ticket</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Customer & Assignee</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>
                          <div className="ticket-cell">
                            <span className="ticket-id">#{ticket.id}</span>
                            <span className="ticket-title">{ticket.title}</span>
                            <span className="ticket-desc">{ticket.description}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge" style={{ background: '#1e293b', color: '#94a3b8' }}>
                            {ticket.category}
                          </span>
                        </td>
                        <td>
                          <span className={`priority-pill priority-${ticket.priority.toLowerCase()}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td>
                          <div>
                            <b>{ticket.customer_email}</b>
                            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                              Assigned: {ticket.assignee}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-${ticket.status.toLowerCase()}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <div className="action-group">
                            <button
                              className="btn-icon"
                              title="Advance Status (Open -> In Progress -> Resolved -> Closed)"
                              onClick={() => handleAdvanceStatus(ticket)}
                            >
                              ↻
                            </button>
                            <button
                              className="btn-icon delete"
                              title="Delete Ticket"
                              onClick={() => handleDeleteTicket(ticket.id)}
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Right Rail: Infrastructure & Recent Activity */}
          <aside className="side-rail">
            <div className="panel">
              <div className="panel-header" style={{ marginBottom: '12px' }}>
                <div>
                  <h2>DevOps Pipeline</h2>
                  <p>Deployment Status</p>
                </div>
              </div>

              <div className="devops-pipeline">
                <div className="pipeline-step active">
                  <span>Git</span>
                  <small>main</small>
                </div>
                <div className="pipeline-connector active"></div>
                <div className="pipeline-step active">
                  <span>Test</span>
                  <small>Pytest</small>
                </div>
                <div className="pipeline-connector active"></div>
                <div className="pipeline-step active">
                  <span>Scan</span>
                  <small>Trivy</small>
                </div>
                <div className="pipeline-connector active"></div>
                <div className="pipeline-step active">
                  <span>Deploy</span>
                  <small>Helm</small>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="server-badge">
                  <span>FastAPI Service</span>
                  <span style={{ color: '#10b981' }}>:8000</span>
                </div>
                <div className="server-badge">
                  <span>PostgreSQL DB</span>
                  <span style={{ color: '#10b981' }}>Connected</span>
                </div>
                <div className="server-badge">
                  <span>Prometheus</span>
                  <a href="/metrics" target="_blank" style={{ color: '#818cf8', textDecoration: 'none' }}>
                    /metrics ↗
                  </a>
                </div>
                <div className="server-badge">
                  <span>API Docs</span>
                  <a href="/docs" target="_blank" style={{ color: '#818cf8', textDecoration: 'none' }}>
                    Swagger ↗
                  </a>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header" style={{ marginBottom: '12px' }}>
                <div>
                  <h2>Activity Log</h2>
                  <p>Recent operational events</p>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon">🚨</div>
                <div className="activity-details">
                  <b>High priority ticket created</b>
                  <small>VPN gateway dropouts • 10m ago</small>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">⚙️</div>
                <div className="activity-details">
                  <b>Kubernetes pod healthy</b>
                  <small>Liveness & Readiness passed • 24m ago</small>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">✅</div>
                <div className="activity-details">
                  <b>Ticket #102 marked Resolved</b>
                  <small>SSL certificate renewal • 1h ago</small>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📦</div>
                <div className="activity-details">
                  <b>GHCR image built & scanned</b>
                  <small>Zero critical vulnerabilities • 2h ago</small>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Modal: Create Ticket */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <p className="breadcrumb">NEW INCIDENT</p>
                  <h2>Open Support Ticket</h2>
                </div>
                <button className="btn-close" onClick={() => setShowModal(false)}>
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateTicket}>
                <div className="form-group">
                  <label>Ticket Summary *</label>
                  <input
                    name="title"
                    required
                    placeholder="e.g. Cannot access staging database"
                  />
                </div>

                <div className="form-group">
                  <label>Detailed Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Provide details about error codes, environment, and impact..."
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" defaultValue="TECHNICAL">
                      <option value="TECHNICAL">Technical</option>
                      <option value="BILLING">Billing</option>
                      <option value="ACCESS">Access & Security</option>
                      <option value="HARDWARE">Hardware</option>
                      <option value="GENERAL">General</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Priority</label>
                    <select name="priority" defaultValue="MEDIUM">
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent (SLA Alert)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Requester Email</label>
                    <input
                      name="customer_email"
                      type="email"
                      defaultValue="alice@company.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Assignee</label>
                    <input
                      name="assignee"
                      defaultValue="Support Agent"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                  Create Support Ticket
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, footer, isUrgent }) {
  return (
    <div className={`stat-card ${isUrgent ? 'urgent-card' : ''}`}>
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <div className="stat-value" style={{ color: isUrgent ? '#ef4444' : 'var(--text-main)' }}>
        {value}
      </div>
      <div className="stat-footer">{footer}</div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
