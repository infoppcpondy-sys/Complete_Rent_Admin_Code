import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import PMBulkmessage from './PMBulkmessage';
import './PMBulkdashboard.css';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5005";

/* ── Login Form ──────────────────────────────────────────────────────────────── */
const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      return setError("⚠️ Please enter username.");
    }
    if (!password.trim()) {
      return setError("⚠️ Please enter password.");
    }

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        localStorage.setItem("pmAuthenticated", "true");
        localStorage.setItem("pmUsername", username);
        localStorage.setItem("pmEmail", username + "@rentpondy.com");
        onLoginSuccess();
        setLoading(false);
      } else {
        setError("❌ Invalid username or password.");
        setLoading(false);
      }
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) handleLogin(e);
  };

  return (
    <div className="pm-bulk-login-container">
      <div className="pm-bulk-login-box">
        <div className="pm-bulk-login-header">
          <div style={{ fontSize: 48, marginBottom: 16 }}></div>
          <h2 className="pm-bulk-login-title">PONDY MATRIMONY</h2>
          <p className="pm-bulk-login-subtitle">WhatsApp Bulk Campaign Manager</p>
        </div>

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <div className="pm-bulk-form-group">
            <label className="pm-bulk-form-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter username"
              className="pm-bulk-form-control"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="pm-bulk-form-group">
            <label className="pm-bulk-form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter password"
              className="pm-bulk-form-control"
              disabled={loading}
            />
          </div>

          {error && <div className="pm-bulk-login-error-box">{error}</div>}

          <button
            type="submit"
            className="pm-bulk-login-btn"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <span className="pm-bulk-spinner" /> Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>

          <div className="pm-bulk-credential-hint">
            <p style={{ margin: 0, fontSize: 12, color: "#718096" }}>
              <strong>Demo Credentials:</strong><br />
              Username: <code style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: 4 }}>admin</code><br />
              Password: <code style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: 4 }}>admin</code>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

const PMBulkdashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pmData, setPmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0, pending: 0 });
  const [campaigns, setCampaigns] = useState([]);
  const [showBulkSender, setShowBulkSender] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    // Check if PM is authenticated
    const pmAuthenticated = localStorage.getItem('pmAuthenticated');
    const pmEmail = localStorage.getItem('pmEmail');
    const pmDataStr = localStorage.getItem('pmData');

    if (pmAuthenticated === 'true') {
      setIsAuthenticated(true);
      try {
        if (pmDataStr) {
          setPmData(JSON.parse(pmDataStr));
        } else {
          setPmData({ email: pmEmail });
        }
      } catch (error) {
        console.error('Failed to parse PM data:', error);
      }
      fetchStats();
      fetchCampaigns();
    }

    setLoading(false);
  }, [navigate]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch(`${API_BASE}/PPC/pm-bulk-stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('pmToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || { total: 0, sent: 0, failed: 0, pending: 0 });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setLoadingStats(false);
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${API_BASE}/PPC/pm-bulk-campaigns?limit=5&page=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('pmToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pmAuthenticated');
    localStorage.removeItem('pmEmail');
    localStorage.removeItem('pmToken');
    localStorage.removeItem('pmData');
    localStorage.removeItem('pmUsername');
    
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    fetchStats();
    fetchCampaigns();
  };

  const handleBulkSendSuccess = () => {
    setShowBulkSender(false);
    toast.success('Bulk campaign created successfully!');
    fetchStats();
    fetchCampaigns();
  };

  if (loading) {
    return (
      <Container className="pm-bulk-dashboard-container">
        <div className="loading">Loading...</div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Container fluid className="pm-bulk-dashboard-container">
      {showBulkSender ? (
        <PMBulkmessage 
          onClose={() => setShowBulkSender(false)}
          onSent={handleBulkSendSuccess}
        />
      ) : (
        <>
          <Row className="pm-bulk-header">
            <Col md={8}>
              <h1>PM Bulk Messaging</h1>
              <p>Send WhatsApp messages to multiple contacts at once</p>
            </Col>
            <Col md={4} className="text-end">
              <Button
                variant="danger"
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </Button>
            </Col>
          </Row>

          <Alert variant="info" className="mt-3">
            <strong>Bulk Messaging:</strong> Send personalized WhatsApp messages to hundreds of contacts efficiently using the Wasender API.
          </Alert>

          {/* Statistics Cards */}
          <Row className="mt-4">
            <Col md={6} lg={3} className="mb-3">
              <Card className="pm-bulk-card stats-card">
                <Card.Body>
                  <div className="card-icon total">📊</div>
                  <h5>Total Messages</h5>
                  <div className="card-number">{stats.total}</div>
                  <p className="card-label">All Time</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3} className="mb-3">
              <Card className="pm-bulk-card stats-card success">
                <Card.Body>
                  <div className="card-icon sent">✅</div>
                  <h5>Sent</h5>
                  <div className="card-number">{stats.sent}</div>
                  <p className="card-label">Successfully Delivered</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3} className="mb-3">
              <Card className="pm-bulk-card stats-card warning">
                <Card.Body>
                  <div className="card-icon pending">⏳</div>
                  <h5>Pending</h5>
                  <div className="card-number">{stats.pending}</div>
                  <p className="card-label">In Progress</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3} className="mb-3">
              <Card className="pm-bulk-card stats-card danger">
                <Card.Body>
                  <div className="card-icon failed">❌</div>
                  <h5>Failed</h5>
                  <div className="card-number">{stats.failed}</div>
                  <p className="card-label">Delivery Issues</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Success Rate */}
          {stats.total > 0 && (
            <Row className="mt-3">
              <Col md={12}>
                <Card className="pm-bulk-card">
                  <Card.Body>
                    <h6 className="mb-3">Success Rate</h6>
                    <ProgressBar 
                      now={(stats.sent / stats.total) * 100} 
                      label={`${Math.round((stats.sent / stats.total) * 100)}%`}
                      className="bulk-progress-bar"
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Action Buttons */}
          <Row className="mt-4">
            <Col md={12}>
              <Card className="pm-bulk-card">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <div className="action-buttons">
                    <Button 
                      variant="primary" 
                      className="action-btn bulk-btn"
                      onClick={() => setShowBulkSender(true)}
                      size="lg"
                    >
                      📤 Send Bulk Message
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="action-btn"
                      onClick={fetchCampaigns}
                    >
                      🔄 Refresh Campaigns
                    </Button>
                    <Button 
                      variant="info" 
                      className="action-btn"
                      onClick={fetchStats}
                    >
                      📊 Refresh Stats
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Campaigns */}
          <Row className="mt-4">
            <Col md={12}>
              <Card className="pm-bulk-card">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Recent Campaigns</h5>
                </Card.Header>
                <Card.Body>
                  {campaigns.length > 0 ? (
                    <div className="campaigns-list">
                      {campaigns.map((campaign) => (
                        <div key={campaign._id} className="campaign-item">
                          <div className="campaign-header">
                            <h6>{campaign.campaignName || 'Unnamed Campaign'}</h6>
                            <Badge bg={
                              campaign.status === 'sent' ? 'success' :
                              campaign.status === 'pending' ? 'warning' :
                              'danger'
                            }>
                              {campaign.status}
                            </Badge>
                          </div>
                          <p className="campaign-message">{campaign.message}</p>
                          <div className="campaign-stats">
                            <span>📱 {campaign.totalRecipients} recipients</span>
                            <span>✅ {campaign.sentCount || 0} sent</span>
                            <span>⏳ {campaign.pendingCount || 0} pending</span>
                            <span>❌ {campaign.failedCount || 0} failed</span>
                          </div>
                          <ProgressBar 
                            now={(campaign.sentCount / campaign.totalRecipients) * 100}
                            className="campaign-progress"
                            style={{ height: '6px' }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No campaigns yet. Start by sending your first bulk message!</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default PMBulkdashboard;
