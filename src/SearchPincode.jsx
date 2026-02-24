import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Card, Container, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchPincode = ({ properties = [] }) => {
  const [pincodeData, setPincodeData] = useState([]);
  const [exclusivePincodeData, setExclusivePincodeData] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [allExclusiveProperties, setAllExclusiveProperties] = useState([]);
  const [selectedPincode, setSelectedPincode] = useState(null);
  const [selectedExclusivePincode, setSelectedExclusivePincode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvedModeFilter, setApprovedModeFilter] = useState('');
  const navigate = useNavigate();

  const allPincodes = [
    '605001',
    '605002',
    '605004',
    '605005',
    '605006',
    '605007',
    '605008',
    '605009',
    '605010',
    '605011',
    '605013',
    '605014',
    '605110',
  ];

  const pincodeToAreaName = {
    '605001': 'White Town',
    '605002': 'Pondicherry',
    '605004': 'Mudaliarpet',
    '605005': 'Nellithope',
    '605006': 'Gorimedu',
    '605007': 'Ariyankuppam',
    '605008': 'Lawspet',
    '605009': 'Kadirkamam',
    '605010': 'Moolakulam',
    '605011': 'Rainbow Nagar',
    '605013': 'Saram',
    '605014': 'Kottakuppam',
    '605110': 'Villanur'
  };

  // Fetch and process approved properties
  useEffect(() => {
    const processProperties = async () => {
      try {
        setError(null);

        let propertyList = Array.isArray(properties) && properties.length > 0 ? properties : [];

        if (propertyList.length === 0) {
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_API_URL}/fetch-active-users-datas-all-rent`
            );
            propertyList = response.data?.users || [];
            console.log('Fetched approved properties from API:', propertyList.length);
          } catch (apiError) {
            console.error('Error fetching approved properties from API:', apiError);
            propertyList = [];
          }
        }

        setAllProperties(propertyList);

        const pincodeCountMap = {};
        allPincodes.forEach(pincode => {
          pincodeCountMap[pincode] = 0;
        });

        propertyList.forEach((property, idx) => {
          const pinCode =
            property.pinCode ||
            property.pincode ||
            property.postalCode ||
            property.zipCode ||
            property.propertyPincode ||
            (property.address && property.address.pincode) ||
            (property.address && property.address.pinCode);

          if (idx < 3) {
            console.log(`Approved Property ${idx}:`, {
              rentId: property.rentId,
              pinCode: property.pinCode,
              pincode: property.pincode,
              detectedPinCode: pinCode
            });
          }

          if (pinCode && !property.isDeleted) {
            const pinCodeStr = String(pinCode).trim();
            if (pincodeCountMap.hasOwnProperty(pinCodeStr)) {
              pincodeCountMap[pinCodeStr]++;
            }
          }
        });

        const result = allPincodes.map(pincode => ({
          pincode: pincode,
          count: pincodeCountMap[pincode]
        })).sort((a, b) => b.count - a.count);

        console.log('Pincode Count Results (Approved):', result);
        console.log('Total approved properties:', propertyList.length);

        setPincodeData(result);
      } catch (err) {
        console.error('Error processing approved pincode data:', err);
        setError(err.message || 'Error processing data');
        setPincodeData(
          allPincodes.map(pincode => ({
            pincode: pincode,
            count: 0
          }))
        );
      }
    };

    processProperties();
  }, []);

  // Fetch and process exclusive properties from separate API
  useEffect(() => {
    const fetchExclusiveProperties = async () => {
      try {
        let allExclusivePropsData = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          try {
            const response = await axios.get(
              `https://rentpondy.com/PPC/PPC/read-prop?page=${page}&limit=100&propertyMode=&location=&search=&createdBy=&createdDate=`
            );

            const exclusiveProps = response.data?.properties || response.data?.data || [];
            console.log(`Fetched exclusive properties page ${page}:`, exclusiveProps.length);

            if (exclusiveProps.length === 0) {
              hasMore = false;
            } else {
              allExclusivePropsData = [...allExclusivePropsData, ...exclusiveProps];
              page++;
            }
          } catch (apiError) {
            console.error('Error fetching exclusive properties page:', apiError);
            hasMore = false;
          }
        }

        setAllExclusiveProperties(allExclusivePropsData);

        const exclusivePincodeCountMap = {};
        allPincodes.forEach(pincode => {
          exclusivePincodeCountMap[pincode] = 0;
        });

        allExclusivePropsData.forEach((property, idx) => {
          const pinCode =
            property.pinCode ||
            property.pincode ||
            property.postalCode ||
            property.zipCode ||
            property.propertyPincode ||
            property.pincode ||
            (property.address && property.address.pincode) ||
            (property.address && property.address.pinCode);

          if (idx < 3) {
            console.log(`Exclusive Property ${idx}:`, {
              rentId: property.rentId || property.id,
              pinCode: property.pinCode,
              pincode: property.pincode,
              detectedPinCode: pinCode
            });
          }

          if (pinCode) {
            const pinCodeStr = String(pinCode).trim();
            if (exclusivePincodeCountMap.hasOwnProperty(pinCodeStr)) {
              exclusivePincodeCountMap[pinCodeStr]++;
            }
          }
        });

        const exclusiveResult = allPincodes.map(pincode => ({
          pincode: pincode,
          count: exclusivePincodeCountMap[pincode]
        })).sort((a, b) => b.count - a.count);

        console.log('Pincode Count Results (Exclusive):', exclusiveResult);
        console.log('Total exclusive properties:', allExclusivePropsData.length);

        setExclusivePincodeData(exclusiveResult);
        setLoading(false);
      } catch (err) {
        console.error('Error processing exclusive properties:', err);
        setExclusivePincodeData(
          allPincodes.map(pincode => ({
            pincode: pincode,
            count: 0
          }))
        );
        setLoading(false);
      }
    };

    fetchExclusiveProperties();
  }, []);

  const totalProperties = pincodeData.reduce((sum, item) => sum + item.count, 0);
  const totalExclusiveProperties = exclusivePincodeData.reduce((sum, item) => sum + item.count, 0);

  // Get combined data for 605001 and 605002
  const getCombinedPincodeData = (data) => {
    const combined605001_605002 = {
      pincode: '605001 & 605002',
      count: 0,
      combined: true,
      subPincodes: ['605001', '605002']
    };
    
    data.forEach(item => {
      if (item.pincode === '605001' || item.pincode === '605002') {
        combined605001_605002.count += item.count;
      }
    });
    
    return combined605001_605002;
  };

  const combinedApprovedData = getCombinedPincodeData(pincodeData);
  const combinedExclusiveData = getCombinedPincodeData(exclusivePincodeData);

  // Filter data to exclude 605001 and 605002 from individual cards
  const filteredPincodeData = pincodeData.filter(item => item.pincode !== '605001' && item.pincode !== '605002');
  const filteredExclusivePincodeData = exclusivePincodeData.filter(item => item.pincode !== '605001' && item.pincode !== '605002');

  const getPropertiesForPincode = (pincode) => {
    if (pincode === '605001') {
      // Return properties from both 605001 and 605002
      return allProperties.filter(property => {
        const propPincode = property.pinCode || property.pincode || property.postalCode;
        const pinCodeStr = String(propPincode).trim();
        return pinCodeStr === '605001' || pinCodeStr === '605002';
      });
    }
    return allProperties.filter(property => {
      const propPincode = property.pinCode || property.pincode || property.postalCode;
      return String(propPincode).trim() === String(pincode).trim();
    });
  };

  const getExclusivePropertiesForPincode = (pincode) => {
    if (pincode === '605001') {
      // Return properties from both 605001 and 605002
      return allExclusiveProperties.filter(property => {
        const propPincode = property.pinCode || property.pincode || property.postalCode;
        const pinCodeStr = String(propPincode).trim();
        return pinCodeStr === '605001' || pinCodeStr === '605002';
      });
    }
    return allExclusiveProperties.filter(property => {
      const propPincode = property.pinCode || property.pincode || property.postalCode;
      return String(propPincode).trim() === String(pincode).trim();
    });
  };

  const selectedPincodeProperties = selectedPincode ? getPropertiesForPincode(selectedPincode) : [];
  const selectedExclusivePincodeProperties = selectedExclusivePincode ? getExclusivePropertiesForPincode(selectedExclusivePincode) : [];

  // Sort exclusive properties by creation date (recent first)
  const sortedExclusivePincodeProperties = selectedExclusivePincodeProperties.length > 0
    ? [...selectedExclusivePincodeProperties].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  // Filter approved properties: exclude deleted and filter by mode
  const filteredApprovedProperties = selectedPincodeProperties
    .filter(property => {
      const isNotDeleted = !property.isDeleted;
      const modeMatch = !approvedModeFilter || (property.propertyMode && property.propertyMode.toLowerCase() === approvedModeFilter.toLowerCase());
      return isNotDeleted && modeMatch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handlePincodeSelect = (pincode) => setSelectedPincode(pincode);
  const handleExclusivePincodeSelect = (pincode) => setSelectedExclusivePincode(pincode);
  const handleBackToGrid = () => { 
    setSelectedPincode(null); 
    setSelectedExclusivePincode(null);
    setApprovedModeFilter('');
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="pincode-search-container py-4">
      <div className="pincode-header mb-4">
        <h1>📍 Pincode Property</h1>
        <p>View property count across all available pincodes</p>
      </div>

      {error && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>⚠️ Note:</strong> {error}
        </div>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="stat-card stat-card-total">
            <Card.Body className="text-center">
              <h3>{totalProperties}</h3>
              <p>Total Approved Properties</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card stat-card-total">
            <Card.Body className="text-center">
              <h3>{totalExclusiveProperties}</h3>
              <p>Total Exclusive Properties</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card stat-card-total">
            <Card.Body className="text-center">
              <h3>{allPincodes.length}</h3>
              <p>Total Pincodes</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Show Detailed View or Grid View */}
      {selectedPincode ? (
        <div className="properties-detail-view">
          <div className="mb-4">
            <button className="btn btn-secondary mb-3" onClick={handleBackToGrid}>← Back to Pincodes</button>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px'
            }}>
              <h2>📍 Pincode: <strong>{selectedPincode === '605001' ? '605001 & 605002' : selectedPincode}</strong> (Approved Properties)</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>{filteredApprovedProperties.length}</h3>
                  <p style={{ margin: '5px 0 0 0', fontSize: '1.1rem' }}>{filteredApprovedProperties.length === 1 ? 'Property' : 'Properties'} Found</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label htmlFor="modeFilter" style={{ fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap' }}>Filter by Property Mode:</label>
                  <select 
                    id="modeFilter"
                    className="form-select" 
                    style={{ width: '180px' }}
                    value={approvedModeFilter}
                    onChange={(e) => setApprovedModeFilter(e.target.value)}
                  >
                    <option value="">All Modes</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {filteredApprovedProperties.length === 0 ? (
            <div className="alert alert-info text-center">No approved properties found for pincode {selectedPincode}</div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th><th>Rent ID</th><th>Phone</th><th>Property Type</th><th>Mode</th>
                    <th>Area</th><th>City</th><th>Rental Amount</th><th>Plan</th><th>Status</th><th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApprovedProperties.map((property, index) => (
                    <tr key={property.rentId || index}>
                      <td>{index + 1}</td>
                      <td 
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          navigate('/dashboard/detail', {
                            state: { rentId: property.rentId, phoneNumber: property.phoneNumber }
                          })
                        }
                      >
                        <strong style={{ color: '#007bff', textDecoration: 'underline' }}>
                          {property.rentId || 'N/A'}
                        </strong>
                      </td>
                      <td>{property.phoneNumber || 'N/A'}</td>
                      <td>{property.propertyType || 'N/A'}</td>
                      <td>{property.propertyMode || 'N/A'}</td>
                      <td>{property.area || 'N/A'}</td>
                      <td>{property.city || 'N/A'}</td>
                      <td>₹{property.rentalAmount || 'N/A'}</td>
                      <td><Badge bg={property.planName === 'Paid' ? 'success' : 'warning'}>{property.planName || 'Free'}</Badge></td>
                      <td><Badge bg={property.status === 'active' ? 'success' : 'secondary'}>{property.status || 'Pending'}</Badge></td>
                      <td>{new Date(property.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      ) : selectedExclusivePincode ? (
        <div className="properties-detail-view">
          <div className="mb-4">
            <button className="btn btn-secondary mb-3" onClick={handleBackToGrid}>← Back to Pincodes</button>
            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px'
            }}>
              <h2>⭐ Pincode: <strong>{selectedExclusivePincode === '605001' ? '605001 & 605002' : selectedExclusivePincode}</strong> (Exclusive Properties)</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>{selectedExclusivePincodeProperties.length}</h3>
                  <p style={{ margin: '5px 0 0 0', fontSize: '1.1rem' }}>{selectedExclusivePincodeProperties.length === 1 ? 'Property' : 'Properties'} Found</p>
                </div>
              </div>
            </div>
          </div>
          {selectedExclusivePincodeProperties.length === 0 ? (
            <div className="alert alert-info text-center">No exclusive properties found for pincode {selectedExclusivePincode}</div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th><th>Property ID</th><th>Phone</th><th>BHK</th><th>Floor</th>
                    <th>Property Type</th><th>Rent Type</th><th>Amount</th><th>Advance</th>
                    <th>Street</th><th>Location</th><th>Created At</th><th>Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedExclusivePincodeProperties.map((property, index) => (
                    <tr key={property.propertyId || property.id || property.rentId || property._id || index}>
                      <td>{index + 1}</td>
                      <td><strong>{property.propertyId || property.id || property.rentId || property.property_id || property.ppcId || property.exclusiveId || property._id || 'N/A'}</strong></td>
                      <td>{property.phoneNumber || property.phone || 'N/A'}</td>
                      <td>{property.bhk || 'N/A'}</td>
                      <td>{property.floor || 'N/A'}</td>
                      <td>{property.propertyType || 'N/A'}</td>
                      <td>{property.rentType || property.type || 'N/A'}</td>
                      <td>₹{property.rentAmount || property.leaseAmount || property.amount || 'N/A'}</td>
                      <td>₹{property.advanceAmount || property.advance || 'N/A'}</td>
                      <td>{property.streetName || property.street || 'N/A'}</td>
                      <td>{property.location || 'N/A'}</td>
                      <td>{property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td>{property.createdBy || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* ── APPROVED PROPERTIES COMPACT GRID ── */}
          <div className="pincode-grid mt-5">
            <h5 className="mb-3">📊 Approved Properties Count by Pincode</h5>
            <Row className="g-2">
              {/* Combined Card for 605001 & 605002 */}
              <Col xl={2} lg={3} md={4} sm={6} xs={6} key="605001-605002-combined">
                <Card
                  className={`pincode-card ${combinedApprovedData.count > 0 ? 'has-properties' : 'no-properties'}`}
                  style={{
                    cursor: combinedApprovedData.count > 0 ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    border: combinedApprovedData.count > 0 ? '1.5px solid #27AE60' : '1.5px solid #e0e0e0',
                    borderRadius: '10px',
                    boxShadow: combinedApprovedData.count > 0 ? '0 0 12px rgba(39,174,96,0.4), 0 2px 8px rgba(39,174,96,0.2)' : 'none',
                  }}
                  onClick={() => combinedApprovedData.count > 0 && handlePincodeSelect('605001')}
                >
                  <Card.Body className="p-2 text-center">
                    {/* Pincode number */}
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: combinedApprovedData.count > 0 ? '#27AE60' : '#bbb',
                      letterSpacing: '0.5px',
                      lineHeight: 1.2,
                    }}>
                      {combinedApprovedData.pincode}
                    </div>
                    {/* Area names */}
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#000',
                      fontWeight: '700',
                      marginBottom: '6px',
                      whiteSpace: 'normal',
                    }}>
                      {pincodeToAreaName['605001'] || 'Unknown Area'}
                      <br />
                      {pincodeToAreaName['605002'] || 'Unknown Area'}
                    </div>
                    {/* Count box */}
                    <div style={{
                      backgroundColor: combinedApprovedData.count > 0 ? '#E8F8F5' : '#f5f5f5',
                      borderRadius: '6px',
                      padding: '6px 4px',
                      marginBottom: '6px',
                    }}>
                      <div style={{
                        fontSize: '1.7rem',
                        fontWeight: '800',
                        color: combinedApprovedData.count > 0 ? '#27AE60' : '#ccc',
                        lineHeight: 1,
                      }}>
                        {combinedApprovedData.count}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#999', marginTop: '2px' }}>
                        {combinedApprovedData.count === 1 ? 'Property' : 'Properties'}
                      </div>
                    </div>
                    {combinedApprovedData.count > 0 && (
                      <Badge bg="success" style={{ fontSize: '0.58rem', padding: '2px 8px' }}>Active</Badge>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              {filteredPincodeData.map(item => (
                <Col xl={2} lg={3} md={4} sm={6} xs={6} key={item.pincode}>
                  <Card
                    className={`pincode-card ${item.count > 0 ? 'has-properties' : 'no-properties'}`}
                    style={{
                      cursor: item.count > 0 ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                      border: item.count > 0 ? '1.5px solid #27AE60' : '1.5px solid #e0e0e0',
                      borderRadius: '10px',
                      boxShadow: item.count > 0 ? '0 0 12px rgba(39,174,96,0.4), 0 2px 8px rgba(39,174,96,0.2)' : 'none',
                    }}
                    onClick={() => item.count > 0 && handlePincodeSelect(item.pincode)}
                  >
                    <Card.Body className="p-2 text-center">
                      {/* Pincode number */}
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: item.count > 0 ? '#27AE60' : '#bbb',
                        letterSpacing: '0.5px',
                        lineHeight: 1.3,
                      }}>
                        {item.pincode}
                      </div>
                      {/* Area name */}
                      <div style={{
                        fontSize: '0.80rem',
                        color: '#000',
                        fontWeight: '700',
                        marginBottom: '6px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {pincodeToAreaName[item.pincode] || 'Unknown Area'}
                      </div>
                      {/* Count box */}
                      <div style={{
                        backgroundColor: item.count > 0 ? '#E8F8F5' : '#f5f5f5',
                        borderRadius: '6px',
                        padding: '6px 4px',
                        marginBottom: '6px',
                      }}>
                        <div style={{
                          fontSize: '1.7rem',
                          fontWeight: '800',
                          color: item.count > 0 ? '#27AE60' : '#ccc',
                          lineHeight: 1,
                        }}>
                          {item.count}
                        </div>
                        <div style={{ fontSize: '0.62rem', color: '#999', marginTop: '2px' }}>
                          {item.count === 1 ? 'Property' : 'Properties'}
                        </div>
                      </div>
                      {item.count > 0 && (
                        <Badge bg="success" style={{ fontSize: '0.58rem', padding: '2px 8px' }}>Active</Badge>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* ── EXCLUSIVE PROPERTIES COMPACT GRID ── */}
          <div className="pincode-grid mt-4">
            <h5 className="mb-3">⭐ Exclusive Properties Count by Pincode</h5>
            <Row className="g-2">
              {/* Combined Card for 605001 & 605002 */}
              <Col xl={2} lg={3} md={4} sm={6} xs={6} key="605001-605002-combined-exclusive">
                <Card
                  className={`pincode-card ${combinedExclusiveData.count > 0 ? 'has-properties' : 'no-properties'}`}
                  style={{
                    cursor: combinedExclusiveData.count > 0 ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    border: combinedExclusiveData.count > 0 ? '1.5px solid #FFD700' : '1.5px solid #e0e0e0',
                    borderRadius: '10px',
                    boxShadow: combinedExclusiveData.count > 0 ? '0 0 12px rgba(255,215,0,0.4), 0 2px 8px rgba(255,215,0,0.2)' : 'none',
                  }}
                  onClick={() => combinedExclusiveData.count > 0 && handleExclusivePincodeSelect('605001')}
                >
                  <Card.Body className="p-2 text-center">
                    {/* Pincode number */}
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: combinedExclusiveData.count > 0 ? '#DAA520' : '#bbb',
                      letterSpacing: '0.5px',
                      lineHeight: 1.2,
                    }}>
                      {combinedExclusiveData.pincode}
                    </div>
                    {/* Area names */}
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#000',
                      fontWeight: '700',
                      marginBottom: '6px',
                      whiteSpace: 'normal',
                    }}>
                      {pincodeToAreaName['605001'] || 'Unknown Area'}
                      <br />
                      {pincodeToAreaName['605002'] || 'Unknown Area'}
                    </div>
                    {/* Count box */}
                    <div style={{
                      backgroundColor: combinedExclusiveData.count > 0 ? '#FFFACD' : '#f5f5f5',
                      borderRadius: '6px',
                      padding: '6px 4px',
                      marginBottom: '6px',
                    }}>
                      <div style={{
                        fontSize: '1.7rem',
                        fontWeight: '800',
                        color: combinedExclusiveData.count > 0 ? '#DAA520' : '#ccc',
                        lineHeight: 1,
                      }}>
                        {combinedExclusiveData.count}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#999', marginTop: '2px' }}>
                        {combinedExclusiveData.count === 1 ? 'Property' : 'Properties'}
                      </div>
                    </div>
                    {combinedExclusiveData.count > 0 && (
                      <Badge bg="warning" style={{ fontSize: '0.58rem', padding: '2px 8px', color: '#333' }}>Exclusive</Badge>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              {filteredExclusivePincodeData.map(item => (
                <Col xl={2} lg={3} md={4} sm={6} xs={6} key={item.pincode}>
                  <Card
                    className={`pincode-card ${item.count > 0 ? 'has-properties' : 'no-properties'}`}
                    style={{
                      cursor: item.count > 0 ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                      border: item.count > 0 ? '1.5px solid #FFD700' : '1.5px solid #e0e0e0',
                      borderRadius: '10px',
                      boxShadow: item.count > 0 ? '0 0 12px rgba(255,215,0,0.4), 0 2px 8px rgba(255,215,0,0.2)' : 'none',
                    }}
                    onClick={() => item.count > 0 && handleExclusivePincodeSelect(item.pincode)}
                  >
                    <Card.Body className="p-2 text-center">
                      {/* Pincode number */}
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: item.count > 0 ? '#DAA520' : '#bbb',
                        letterSpacing: '0.5px',
                        lineHeight: 1.3,
                      }}>
                        {item.pincode}
                      </div>
                      {/* Area name */}
                      <div style={{
                        fontSize: '0.80rem',
                        color: '#000',
                        fontWeight: '700',
                        marginBottom: '6px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {pincodeToAreaName[item.pincode] || 'Unknown Area'}
                      </div>
                      {/* Count box */}
                      <div style={{
                        backgroundColor: item.count > 0 ? '#FFFACD' : '#f5f5f5',
                        borderRadius: '6px',
                        padding: '6px 4px',
                        marginBottom: '6px',
                      }}>
                        <div style={{
                          fontSize: '1.7rem',
                          fontWeight: '800',
                          color: item.count > 0 ? '#DAA520' : '#ccc',
                          lineHeight: 1,
                        }}>
                          {item.count}
                        </div>
                        <div style={{ fontSize: '0.62rem', color: '#999', marginTop: '2px' }}>
                          {item.count === 1 ? 'Property' : 'Properties'}
                        </div>
                      </div>
                      {item.count > 0 && (
                        <Badge bg="warning" style={{ fontSize: '0.58rem', padding: '2px 8px', color: '#333' }}>Exclusive</Badge>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </>
      )}
    </Container>
  );
};

export default SearchPincode;