import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Card, Container, Row, Col, Badge, Spinner, Modal, Button } from 'react-bootstrap';
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
  const [approvedRentIdSearch, setApprovedRentIdSearch] = useState('');
  const [approvedPlanTypeFilter, setApprovedPlanTypeFilter] = useState('');
  const [exclusiveModeFilter, setExclusiveModeFilter] = useState('');
  const [selectedPropertyForSend, setSelectedPropertyForSend] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [toPhoneNumber, setToPhoneNumber] = useState('');
  const [sendValidationError, setSendValidationError] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [remarkInputs, setRemarkInputs] = useState({});
  const [savingRemark, setSavingRemark] = useState({});

  const adminName = localStorage.getItem('adminName') || 'Admin';

  const handleRemarkInputChange = (key, value) => {
    setRemarkInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveApprovedRemark = async (rentId) => {
    const text = (remarkInputs[`approved_${rentId}`] || '').trim();
    if (!text) return;
    setSavingRemark(prev => ({ ...prev, [`approved_${rentId}`]: true }));
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/add-rent-remark`,
        { rentId, text, adminName }
      );
      const updatedRemarks = res.data?.remarks || [];
      setAllProperties(prev => prev.map(p =>
        p.rentId === rentId ? { ...p, remarks: updatedRemarks } : p
      ));
      setRemarkInputs(prev => ({ ...prev, [`approved_${rentId}`]: '' }));
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving remark');
    } finally {
      setSavingRemark(prev => ({ ...prev, [`approved_${rentId}`]: false }));
    }
  };

  const handleSaveExclusiveRemark = async (id) => {
    const text = (remarkInputs[`exclusive_${id}`] || '').trim();
    if (!text) return;
    setSavingRemark(prev => ({ ...prev, [`exclusive_${id}`]: true }));
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/add-whitetown-remark/${id}`,
        { text, adminName }
      );
      const updatedRemarks = res.data?.remarks || [];
      setAllExclusiveProperties(prev => prev.map(p =>
        p._id === id ? { ...p, remarks: updatedRemarks } : p
      ));
      setRemarkInputs(prev => ({ ...prev, [`exclusive_${id}`]: '' }));
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving remark');
    } finally {
      setSavingRemark(prev => ({ ...prev, [`exclusive_${id}`]: false }));
    }
  };

  const renderLatestRemark = (remarks) => {
    if (!remarks || remarks.length === 0) return <span style={{ color: '#999' }}>-</span>;
    const latest = remarks[remarks.length - 1];
    return (
      <div style={{ fontSize: '12px' }}>
        <div>{latest.text}</div>
        <div style={{ color: '#666', fontSize: '10px' }}>
          {latest.adminName} • {latest.date ? new Date(latest.date).toLocaleString() : ''}
        </div>
      </div>
    );
  };
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

  // ===== HANDLE SEND WHATSAPP FOR APPROVED PROPERTIES =====
  const handleSendWhatsAppApproved = (property) => {
    const message = `🏠 *Property Details – RENT PONDY*

Hello Tenant 👋,

📞 *Owner Phone:* ${property.phoneNumber || 'N/A'}
🏢 *Property Type:* ${property.propertyType || 'N/A'}
📌 *Mode:* ${property.propertyMode || 'N/A'}
🛏️ *BHK:* ${property.bedrooms || 'N/A'}
🏢 *Floor:* ${property.floorNo || 'N/A'}
📐 *Area:* ${property.area || 'N/A'}
🌆 *City:* ${property.city || 'N/A'}
💰 *Rental Amount:* ₹${property.rentalAmount || 'N/A'}

Thank you for choosing *RENT PONDY*! 🙏`;
    
    setSelectedPropertyForSend(property);
    setMessageContent(message);
  };

  // ===== HANDLE SEND WHATSAPP FOR EXCLUSIVE PROPERTIES =====
  const handleSendWhatsAppExclusive = (property) => {
    const mapUrl = getPropertyMapUrl(property);
    const message = `🏡 *Exclusive Property – RENT PONDY*

Hello Tenant 👋,

📞 *Owner Phone:* ${property.phoneNumber || property.phone || 'N/A'}
🛏️ *BHK:* ${property.bhk || 'N/A'}
🏢 *Floor:* ${property.floor || 'N/A'}
🏠 *Property Type:* ${property.propertyType || 'N/A'}
📌 *Property Mode:* ${property.propertyMode || 'N/A'}
📄 *Rent Type:* ${property.rentType || property.type || 'N/A'}
💰 *Amount:* ₹${property.rentAmount || property.leaseAmount || property.amount || 'N/A'}
💵 *Advance:* ₹${property.advanceAmount || property.advance || 'N/A'}
📍 *Street:* ${property.streetName || property.street || 'N/A'}
🌆 *Location:* ${property.location || 'N/A'}
${mapUrl ? `🗺️ *Map URL:* ${mapUrl}` : ''}

Thank you for choosing *RENT PONDY*! 🙏`;
    
    setSelectedPropertyForSend(property);
    setMessageContent(message);
  };

  // ===== CLOSE MESSAGE EDITOR =====
  const handleCloseMessageEditor = () => {
    setSelectedPropertyForSend(null);
    setMessageContent('');
    setToPhoneNumber('');
    setSendValidationError('');
  };

  // ===== VALIDATE AND SEND MESSAGE =====
  const handleSendMessage = async () => {
    if (!toPhoneNumber.trim()) {
      setSendValidationError('⚠️ Please enter tenant phone number');
      return;
    }
    if (toPhoneNumber.length < 10) {
      setSendValidationError('⚠️ Phone number must be at least 10 digits');
      return;
    }

    try {
      setSendingMessage(true);
      setSendValidationError('');

      // Format phone number: add +91 if not present and remove any spaces/dashes
      let formattedNumber = toPhoneNumber.trim().replace(/\s|-/g, '');
      
      // Add country code +91 if not already present
      if (!formattedNumber.startsWith('+')) {
        formattedNumber = '+91' + formattedNumber.slice(-10);
      }

      console.log('Sending message to:', formattedNumber);
      console.log('API URL:', process.env.REACT_APP_API_URL);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/send-message`,
        {
          to: formattedNumber,
          message: messageContent
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Message sent successfully - close modal
      console.log('Message sent successfully:', response.data);
      handleCloseMessageEditor();
      alert('✅ Message sent successfully!');
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
      setSendValidationError(`❌ Failed to send message: ${errorMsg}`);
    } finally {
      setSendingMessage(false);
    }
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

        // Fetch free and paid plans to create a mapping
        let planTypeMap = {};
        try {
          const freeRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-free-plans`);
          const paidRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-paid-plans`);

          // Map free properties
          if (freeRes.data.data && Array.isArray(freeRes.data.data)) {
            freeRes.data.data.forEach(item => {
              if (item.properties && Array.isArray(item.properties)) {
                item.properties.forEach(prop => {
                  planTypeMap[prop.rentId] = 'Free';
                });
              }
            });
          }

          // Map paid properties
          if (paidRes.data.data && Array.isArray(paidRes.data.data)) {
            paidRes.data.data.forEach(item => {
              if (item.properties && Array.isArray(item.properties)) {
                item.properties.forEach(prop => {
                  planTypeMap[prop.rentId] = 'Paid';
                });
              }
            });
          }
        } catch (planError) {
          console.error('Error fetching plan data:', planError);
        }

        // Add planName to properties
        propertyList = propertyList.map(prop => ({
          ...prop,
          planName: planTypeMap[prop.rentId] || 'Free'
        }));

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
              detectedPinCode: pinCode,
              planName: property.planName
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

  // Filter exclusive properties by mode
  const filteredExclusiveProperties = sortedExclusivePincodeProperties
    .filter(property => {
      const modeMatch = !exclusiveModeFilter || (property.propertyMode && property.propertyMode.toLowerCase() === exclusiveModeFilter.toLowerCase());
      return modeMatch;
    });

  // Filter approved properties: exclude deleted and filter by mode, rent ID, and plan type
  const filteredApprovedProperties = selectedPincodeProperties
    .filter(property => {
      const isNotDeleted = !property.isDeleted;
      const modeMatch = !approvedModeFilter || (property.propertyMode && property.propertyMode.toLowerCase() === approvedModeFilter.toLowerCase());
      const rentIdMatch = !approvedRentIdSearch || (property.rentId && String(property.rentId).toLowerCase().includes(approvedRentIdSearch.toLowerCase()));
      const planTypeMatch = !approvedPlanTypeFilter || (property.planName && property.planName.toLowerCase() === approvedPlanTypeFilter.toLowerCase());
      return isNotDeleted && modeMatch && rentIdMatch && planTypeMatch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handlePincodeSelect = (pincode) => setSelectedPincode(pincode);
  const handleExclusivePincodeSelect = (pincode) => setSelectedExclusivePincode(pincode);
  const handleBackToGrid = () => { 
    setSelectedPincode(null); 
    setSelectedExclusivePincode(null);
    setApprovedModeFilter('');
    setApprovedRentIdSearch('');
    setApprovedPlanTypeFilter('');
    setExclusiveModeFilter('');
  };

  // ===== GET PROPERTY MAP URL =====
  const getPropertyMapUrl = (property) => {
    // Use the actual URL stored in the property
    return property.url || null;
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Rent ID"
                    style={{ width: '180px' }}
                    value={approvedRentIdSearch}
                    onChange={(e) => setApprovedRentIdSearch(e.target.value)}
                  />
                  <label htmlFor="approvedPlanTypeFilter" style={{ fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap' }}>Plan Type:</label>
                  <select 
                    id="approvedPlanTypeFilter"
                    className="form-select" 
                    style={{ width: '120px' }}
                    value={approvedPlanTypeFilter}
                    onChange={(e) => setApprovedPlanTypeFilter(e.target.value)}
                  >
                    <option value="">All Plans</option>
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                  <label htmlFor="modeFilter" style={{ fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap' }}>Mode:</label>
                  <select 
                    id="modeFilter"
                    className="form-select" 
                    style={{ width: '150px' }}
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
                    <th>S.No</th><th>Rent ID</th><th>Phone</th><th>Property Type</th><th>Mode</th><th>BHK</th><th>Floor</th>
                    <th>Area</th><th>City</th><th>Rental Amount</th><th>Plan Type</th><th>Status</th><th>Send WhatsApp</th><th>Created</th>
                    <th>Remark</th><th>Remark Record</th>
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
                      <td>{property.bedrooms || 'N/A'}</td>
                      <td>{property.floorNo || 'N/A'}</td>
                      <td>{property.area || 'N/A'}</td>
                      <td>{property.city || 'N/A'}</td>
                      <td>₹{property.rentalAmount || 'N/A'}</td>
                      <td><Badge bg={property.planName === 'Paid' ? 'success' : 'warning'}>{property.planName || 'Free'}</Badge></td>
                      <td><Badge bg={property.status === 'active' ? 'success' : 'secondary'}>{property.status || 'Pending'}</Badge></td>
                      <td>
                        <button className="btn btn-sm btn-success" title="Send WhatsApp" onClick={() => handleSendWhatsAppApproved(property)} style={{ padding: '4px 10px', fontSize: '12px' }}>
                          📱 Send
                        </button>
                      </td>
                      <td>{new Date(property.createdAt).toLocaleDateString()}</td>
                      <td style={{ minWidth: '180px' }}>
                        <textarea
                          rows={2}
                          placeholder="Enter remark"
                          value={remarkInputs[`approved_${property.rentId}`] || ''}
                          onChange={(e) => handleRemarkInputChange(`approved_${property.rentId}`, e.target.value)}
                          style={{ fontSize: '12px', width: '100%', padding: '4px', border: '1px solid #ced4da', borderRadius: '4px' }}
                        />
                        <button
                          className="btn btn-sm btn-primary mt-1"
                          style={{ fontSize: '12px', padding: '4px 10px' }}
                          disabled={!(remarkInputs[`approved_${property.rentId}`] || '').trim() || savingRemark[`approved_${property.rentId}`]}
                          onClick={() => handleSaveApprovedRemark(property.rentId)}
                        >
                          {savingRemark[`approved_${property.rentId}`] ? 'Saving...' : 'Save'}
                        </button>
                      </td>
                      <td style={{ minWidth: '200px', maxWidth: '280px' }}>
                        {renderLatestRemark(property.remarks)}
                      </td>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>{filteredExclusiveProperties.length}</h3>
                  <p style={{ margin: '5px 0 0 0', fontSize: '1.1rem' }}>{filteredExclusiveProperties.length === 1 ? 'Property' : 'Properties'} Found</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label htmlFor="exclusivePropertyModeFilter" style={{ fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap' }}>Filter by Property Mode:</label>
                  <select 
                    id="exclusivePropertyModeFilter"
                    className="form-select" 
                    style={{ width: '180px' }}
                    value={exclusiveModeFilter}
                    onChange={(e) => setExclusiveModeFilter(e.target.value)}
                  >
                    <option value="">All Modes</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {filteredExclusiveProperties.length === 0 ? (
            <div className="alert alert-info text-center">No exclusive properties found for pincode {selectedExclusivePincode}</div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th><th>Property ID</th><th>Phone</th><th>BHK</th><th>Floor</th>
                    <th>Property Type</th><th>Property Mode</th><th>Rent Type</th><th>Amount</th><th>Advance</th>
                    <th>Street</th><th>Location</th><th>Created At</th><th>Map URL</th><th>Send WhatsApp</th><th>Created By</th>
                    <th>Remark</th><th>Remark Record</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExclusiveProperties.map((property, index) => (
                    <tr key={property.propertyId || property.id || property.rentId || property._id || index}>
                      <td>{index + 1}</td>
                      <td><strong>{property.propertyId || property.id || property.rentId || property.property_id || property.ppcId || property.exclusiveId || property._id || 'N/A'}</strong></td>
                      <td>{property.phoneNumber || property.phone || 'N/A'}</td>
                      <td>{property.bhk || 'N/A'}</td>
                      <td>{property.floor || 'N/A'}</td>
                      <td>{property.propertyType || 'N/A'}</td>
                      <td>{property.propertyMode || 'N/A'}</td>
                      <td>{property.rentType || property.type || 'N/A'}</td>
                      <td>₹{property.rentAmount || property.leaseAmount || property.amount || 'N/A'}</td>
                      <td>₹{property.advanceAmount || property.advance || 'N/A'}</td>
                      <td>{property.streetName || property.street || 'N/A'}</td>
                      <td>{property.location || 'N/A'}</td>
                      <td>{property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        {getPropertyMapUrl(property) ? (
                          <a 
                            href={getPropertyMapUrl(property)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-info" 
                            title="View Map URL"
                            style={{ padding: '4px 10px', fontSize: '12px', textDecoration: 'none' }}
                          >
                            🔗 View
                          </a>
                        ) : (
                          <span style={{ color: '#999', fontSize: '12px' }}>-</span>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-success" title="Send WhatsApp" onClick={() => handleSendWhatsAppExclusive(property)} style={{ padding: '4px 10px', fontSize: '12px' }}>
                          📱 Send
                        </button>
                      </td>
                      <td>{property.createdBy || 'N/A'}</td>
                      <td style={{ minWidth: '180px' }}>
                        <textarea
                          rows={2}
                          placeholder="Enter remark"
                          value={remarkInputs[`exclusive_${property._id}`] || ''}
                          onChange={(e) => handleRemarkInputChange(`exclusive_${property._id}`, e.target.value)}
                          style={{ fontSize: '12px', width: '100%', padding: '4px', border: '1px solid #ced4da', borderRadius: '4px' }}
                        />
                        <button
                          className="btn btn-sm btn-primary mt-1"
                          style={{ fontSize: '12px', padding: '4px 10px' }}
                          disabled={!(remarkInputs[`exclusive_${property._id}`] || '').trim() || savingRemark[`exclusive_${property._id}`]}
                          onClick={() => handleSaveExclusiveRemark(property._id)}
                        >
                          {savingRemark[`exclusive_${property._id}`] ? 'Saving...' : 'Save'}
                        </button>
                      </td>
                      <td style={{ minWidth: '200px', maxWidth: '280px' }}>
                        {renderLatestRemark(property.remarks)}
                      </td>
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

      {/* ===== SEND WHATSAPP MESSAGE POPUP ===== */}
      <Modal show={selectedPropertyForSend !== null} onHide={handleCloseMessageEditor} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>📱 WhatsApp Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPropertyForSend && (
            <div>
              {/* To Phone Number Section */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>📞 To:</label>
                <input
                  type="text"
                  value={toPhoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setToPhoneNumber(value);
                    setSendValidationError('');
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: sendValidationError ? '2px solid #dc3545' : '1px solid #dee2e6',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    backgroundColor: sendValidationError ? '#ffe5e5' : '#fff'
                  }}
                  placeholder="Enter tenant phone number (numbers only)"
                  maxLength="15"
                />
                <small style={{ color: '#6c757d', marginTop: '5px', display: 'block' }}>Phone number: {toPhoneNumber.length} digits</small>
                {sendValidationError && (
                  <small style={{ color: '#dc3545', marginTop: '5px', display: 'block', fontWeight: 'bold' }}>
                    {sendValidationError}
                  </small>
                )}
              </div>

              {/* Message Edit Section */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>✏️ Edit Message</label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  style={{
                    width: '100%',
                    height: '250px',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #dee2e6',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    resize: 'vertical'
                  }}
                  placeholder="Edit your message here..."
                />
                <small style={{ color: '#6c757d', marginTop: '5px', display: 'block' }}>Message length: {messageContent.length} characters</small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMessageEditor}>
            Close
          </Button>
          <Button 
            variant="success" 
            onClick={handleSendMessage}
            disabled={!toPhoneNumber.trim() || sendingMessage}
          >
            {sendingMessage ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  style={{ marginRight: '5px' }}
                />
                Sending...
              </>
            ) : (
              '📤 Send'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SearchPincode;