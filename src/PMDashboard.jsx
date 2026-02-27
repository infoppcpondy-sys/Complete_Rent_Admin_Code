import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PMDashboard.css';

const PMDashboard = () => {
  const navigate = useNavigate();
  const [pmData, setPmData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if PM is authenticated
    const pmAuthenticated = localStorage.getItem('pmAuthenticated');
    const pmEmail = localStorage.getItem('pmEmail');
    const pmDataStr = localStorage.getItem('pmData');

    if (!pmAuthenticated || pmAuthenticated !== 'true') {
      // Redirect to PM login if not authenticated
      navigate('/dashboard/pm', { replace: true });
      return;
    }

    try {
      if (pmDataStr) {
        setPmData(JSON.parse(pmDataStr));
      } else {
        setPmData({ email: pmEmail });
      }
    } catch (error) {
      console.error('Failed to parse PM data:', error);
    }

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    // Clear PM authentication data
    localStorage.removeItem('pmAuthenticated');
    localStorage.removeItem('pmEmail');
    localStorage.removeItem('pmToken');
    localStorage.removeItem('pmData');
    
    toast.success('Logged out successfully');
    navigate('/dashboard/pm', { replace: true });
  };

  if (loading) {
    return (
      <Container className="pm-dashboard-container">
        <div className="loading">Loading...</div>
      </Container>
    );
  }

  return (
    <Container fluid className="pm-dashboard-container">
      <Row className="pm-header">
        <Col md={8}>
          <h1>PM Dashboard</h1>
          <p>Welcome, {pmData?.email || 'Property Manager'}</p>
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
        <strong>Note:</strong> This is an isolated PM dashboard. It operates independently from the main admin system.
      </Alert>

      <Row className="mt-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="pm-card">
            <Card.Body>
              <h5>Properties</h5>
              <div className="card-number">0</div>
              <p className="card-label">Total Properties</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="pm-card">
            <Card.Body>
              <h5>Tenants</h5>
              <div className="card-number">0</div>
              <p className="card-label">Active Tenants</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="pm-card">
            <Card.Body>
              <h5>Revenue</h5>
              <div className="card-number">$0</div>
              <p className="card-label">Monthly Revenue</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="pm-card">
            <Card.Body>
              <h5>Tasks</h5>
              <div className="card-number">0</div>
              <p className="card-label">Pending Tasks</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="action-buttons">
                <Button variant="primary" className="action-btn">
                  Add Property
                </Button>
                <Button variant="secondary" className="action-btn">
                  View Properties
                </Button>
                <Button variant="success" className="action-btn">
                  Manage Tenants
                </Button>
                <Button variant="info" className="action-btn">
                  View Reports
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PMDashboard;
