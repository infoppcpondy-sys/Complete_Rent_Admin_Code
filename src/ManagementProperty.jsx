
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, Container, Form, Spinner } from "react-bootstrap";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { getFirstPhotoUrl } from './utils/mediaHelper';

const ManagementProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ rentId: "", address: "" });
  const navigate = useNavigate();
            
  const adminName = useSelector((state) => state.admin.name);
  
  // ✅ Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users-datas-all-rent`);
        setProperties(response.data.users || []);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // ✅ Record view on mount
  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-view`, {
          userName: adminName,
          viewedFile: "Management Property",
          viewTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
      } catch (err) {}
    };

    if (adminName) {
      recordDashboardView();
    }
  }, [adminName]);
    
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredProperties = properties.filter(
    (property) =>
      (property.rentId?.toString() || "").toLowerCase().includes(filters.rentId.toLowerCase()) &&
      (property.rentalPropertyAddress || property.area || "").toLowerCase().includes(filters.address.toLowerCase())
  );

  if (loading) {
    return (
      <Container fluid className="py-4 text-center">
        <Spinner animation="border" />
        <p>Loading properties...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Property Management</h2>
      <Form className="mb-4">
        <Row className="g-3">
          <Col xs={12} md={6} lg={4}>
            <Form.Group controlId="filterRentId">
              <Form.Label>Filter by Rent ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Rent ID"
                name="rentId"
                value={filters.rentId}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={8}>
            <Form.Group controlId="filterAddress">
              <Form.Label>Filter by Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter property address"
                name="address"
                value={filters.address}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      
      {filteredProperties.length === 0 ? (
        <p className="text-center text-muted">No properties found.</p>
      ) : (
        <Row xs={1} sm={1} md={2} lg={2} className="g-4">
          {filteredProperties.slice(0, 20).map((property) => (
            <Col key={property._id || property.rentId}>
              <Card className="mb-4 shadow-sm h-100">
                <Card.Body className="d-flex flex-column">
                  <Row>
                    <Col xs={12} md={4} className="d-flex">
                      <Card.Img
                        src={getFirstPhotoUrl(property.photos)}
                        alt={property.rentId}
                        className="w-100 object-fit-cover"
                        style={{ height: '150px', objectFit: 'cover' }}
                      />
                    </Col>
                    <Col xs={12} md={8} className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center">
                        <Card.Title>Rent ID: {property.rentId}</Card.Title>
                        <span className="fw-bold text-primary">₹{property.rentalAmount || 'N/A'}</span>
                      </div>
                      <Card.Text className="text-muted mb-2">
                        {property.rentalPropertyAddress || property.area || 'No address'}
                      </Card.Text>
                      <Card.Text className="fw-bold mb-2">{property.propertyType || 'N/A'}</Card.Text>
                      <Card.Text className={`fw-bold mb-2 ${property.status === 'active' ? 'text-success' : 'text-warning'}`}>
                        {property.status?.toUpperCase() || 'PENDING'}
                      </Card.Text>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col>
                      <div className="d-flex justify-content-around">
                        <Button variant="light" className="text-primary d-flex align-items-center">
                          <FaBed className="me-2" /> {property.bedrooms || 'N/A'}
                        </Button>
                        <Button variant="light" className="text-primary d-flex align-items-center">
                          <FaBath className="me-2" /> {property.attachedBathrooms || 'N/A'}
                        </Button>
                        <Button variant="light" className="text-primary d-flex align-items-center">
                          <FaRulerCombined className="me-2" /> {property.totalArea || 'N/A'} {property.areaUnit || ''}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col className="d-flex justify-content-between">
                      <Button 
                        variant="link" 
                        className="text-decoration-none text-primary"
                        onClick={() => navigate('/dashboard/detail', { state: { rentId: property.rentId, phoneNumber: property.phoneNumber } })}
                      >
                        View &gt;
                      </Button>
                      <Button 
                        variant="warning" 
                        className="text-white"
                        onClick={() => navigate('/dashboard/edit-property', { state: { rentId: property.rentId, phoneNumber: property.phoneNumber } })}
                      >
                        Edit
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ManagementProperty;
