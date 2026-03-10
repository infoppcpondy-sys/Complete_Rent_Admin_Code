 

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaPrint } from 'react-icons/fa';
import { Table } from 'react-bootstrap';

const BuyerFollowUps = () => {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const printRef = useRef();
  const [allData, setAllData] = useState([]); // store unfiltered data for future use

  // Create follow-up state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    Ra_Id: 'N/A',
    phoneNumber: '',
    followupStatus: '',
    followupType: '',
    followupDate: '',
    adminName: ''
  });

  // Admin names dropdown state
  const predefinedAdminNames = ['Bala', 'Madhan', 'Prabavathi', 'ThilagavatiMayavan', 'Arund', 'Gayathri', 'Nandhishwari'];
  const [showCreateAdminDropdown, setShowCreateAdminDropdown] = useState(false);
  const [selectedAdminNames, setSelectedAdminNames] = useState([]);
  const [customAdminName, setCustomAdminName] = useState('');

  // Fetch all followups
  const fetchAllFollowUps = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/followup-list-buyer`);
      setFollowups(res.data.data);
      setAllData(res.data.data);
    } catch (error) {
      console.error('Error fetching all follow-up data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch followups based on dateFilter (today/past)
  const fetchFilteredFollowUps = async (filterType) => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/followup-list-today-past-buyer?dateFilter=${filterType}`);
      setFollowups(res.data.data);
    } catch (error) {
      console.error(`Error fetching ${filterType} follow-up data:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllFollowUps();
  }, []);

  // Date range filter
  const handleDateFilter = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const filtered = allData.filter((item) => {
      const followUpDate = new Date(item.followupDate);
      return followUpDate >= start && followUpDate <= end;
    });
    setFollowups(filtered);
  };

  // Future follow-up filter
  const handleFutureFollowUps = () => {
    const today = new Date();
    const filtered = allData.filter((item) => {
      const followUpDate = new Date(item.followupDate);
      return followUpDate > today;
    });
    setFollowups(filtered);
  };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  // Determine follow-up day status
  const getFollowUpDayStatus = (followupDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const followUpDay = new Date(followupDate);
    followUpDay.setHours(0, 0, 0, 0);

    if (followUpDay.getTime() === today.getTime()) {
      return 'Today';
    } else if (followUpDay < today) {
      return 'Past';
    } else {
      return 'Future';
    }
  };

  // Get badge color based on day status
  const getDayStatusBadgeColor = (status) => {
    switch (status) {
      case 'Today':
        return { backgroundColor: '#ffc107', color: '#000', fontWeight: '600' };
      case 'Past':
        return { backgroundColor: '#dc3545', color: '#fff', fontWeight: '600' };
      case 'Future':
        return { backgroundColor: '#28a745', color: '#fff', fontWeight: '600' };
      default:
        return { backgroundColor: '#6c757d', color: '#fff', fontWeight: '600' };
    }
  };

  // Get today's date in YYYY-MM-DD format for date input min attribute
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle checkbox change for admin names
  const handleCreateAdminNameChange = (name) => {
    setSelectedAdminNames(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
    setShowCreateAdminDropdown(false);
  };

  // Get final admin names
  const getFinalCreateAdminNames = () => {
    return selectedAdminNames.join(', ');
  };

  // Handle adding custom admin name
  const handleAddCustomCreateAdminName = () => {
    if (customAdminName.trim()) {
      setSelectedAdminNames([...selectedAdminNames, customAdminName.trim()]);
      setCustomAdminName('');
      setShowCreateAdminDropdown(false);
    }
  };

  // Handle create form input change
  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle create follow-up
  const handleCreateFollowUp = async () => {
    // Validate required fields
    if (!createFormData.phoneNumber || !createFormData.followupStatus || !createFormData.followupType || !createFormData.followupDate) {
      alert('⚠️ Please fill all required fields (Phone Number, Status, Type, Date)');
      return;
    }

    const finalAdminName = getFinalCreateAdminNames();
    const dataToSend = { ...createFormData, adminName: finalAdminName };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/followup-create-buyer`,
        dataToSend
      );

      if (response.status === 201) {
        alert('✅ Follow-up created successfully!');
        setShowCreateModal(false);
        setCreateFormData({
          Ra_Id: 'N/A',
          phoneNumber: '',
          followupStatus: '',
          followupType: '',
          followupDate: '',
          adminName: ''
        });
        setSelectedAdminNames([]);
        setCustomAdminName('');
        
        // Refresh the list
        fetchAllFollowUps();
      }
    } catch (error) {
      alert('❌ Failed to create follow-up!\n' + (error.response?.data?.message || error.message));
      console.error('Error creating follow-up:', error);
    }
  };

  // Handle close create modal
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormData({
      Ra_Id: 'N/A',
      phoneNumber: '',
      followupStatus: '',
      followupType: '',
      followupDate: '',
      adminName: ''
    });
    setSelectedAdminNames([]);
    setCustomAdminName('');
    setShowCreateAdminDropdown(false);
  };

  return (
    <div className="p-4">
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <h2 className="text-xl font-bold mb-4">Tentant Follow-Up List</h2>

      {/* Create New Follow-Up Button - Right Side */}
      <div className="mb-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>+ Create RA Follow-Up</button>
      </div>

      {/* Filter Buttons */}
      <div className="mb-3 space-x-2">
        <button className="btn btn-secondary ms-2" onClick={fetchAllFollowUps}>All Follow-Up</button>
        <button className="btn btn-success ms-2" onClick={() => fetchFilteredFollowUps('today')}>Today Follow-Up</button>
        <button className="btn btn-warning ms-2" onClick={() => fetchFilteredFollowUps('past')}>Past Follow-Up</button>
        <button className="btn btn-info ms-2" onClick={handleFutureFollowUps}>Future Follow-Up</button>
      </div>

      {/* Date Range Filter */}
      <div style={{
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        backgroundColor: '#fff'
      }} className="d-flex flex-row gap-2 align-items-center flex-nowrap mb-3">
        <label className="mr-2">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="form-control mr-2"
        />
        <label className="mr-2">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="form-control mr-2"
        />
        <button onClick={handleDateFilter} className="btn btn-primary">Filter</button>
      </div>

      {/* Actions */}
      <div className="mb-3">
        <button className="btn btn-success me-2" onClick={handlePrint}>
          <FaPrint /> Print All
        </button>
        <button className="btn btn-info" onClick={fetchAllFollowUps}>
          Refresh
        </button>
      </div>

      {/* Data Table */}
      {loading ? (
        <p>Loading...</p>
      ) : followups.length === 0 ? (
        <p>No follow-up records found.</p>
      ) : (
        <div ref={printRef}>
          <h3 className='mt-5 mb-3'>All Tenant Followup Data (Today,Future,Past)</h3>
          <Table striped bordered hover responsive className="table-sm align-middle">
            <thead className="sticky-top">
              <tr className="bg-gray-100 text-center">
                <th>S.No</th>
                <th>RA ID</th>
                <th>Tenant Status</th>
                <th>Phone Number</th>
                <th>Follow-Up Status</th>
                <th>Follow-Up Type</th>
                <th>Follow-Up Date</th>
                <th>Follow-up Day</th>
                <th>Admin Name</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {followups.map((item, index) => (
                <tr key={item._id} className="text-center">
                  <td>{index + 1}</td>
                  <td>{item.Ra_Id}</td>
                  <td>{item.tenantStatus || '-'}</td>
                  <td>{item.phoneNumber || '-'}</td>
                  <td>{item.followupStatus}</td>
                  <td>{item.followupType}</td>
                  <td>{new Date(item.followupDate).toLocaleDateString()}</td>
                  <td>
                    <span style={{
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      ...getDayStatusBadgeColor(getFollowUpDayStatus(item.followupDate))
                    }}>
                      {getFollowUpDayStatus(item.followupDate)}
                    </span>
                  </td>
                  <td>{item.adminName}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Create Follow-Up Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          overflow: 'auto',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            width: '100%',
            maxWidth: '550px',
            margin: 'auto',
            position: 'relative',
            zIndex: 10000,
            animation: 'slideDown 0.3s ease'
          }}>
            <button
              onClick={handleCloseCreateModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#666',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#000'}
              onMouseLeave={(e) => e.target.style.color = '#666'}
              title="Close"
            >
              ×
            </button>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333', fontSize: '1.5rem', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Create RA Follow-Up</h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>RA ID:</label>
              <input 
                type="text" 
                value={createFormData.Ra_Id} 
                disabled 
                style={{ padding: '10px', width: '100%', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9', color: '#666' }}
              />
              <small style={{ color: '#888', marginTop: '3px', display: 'block' }}>RA ID is N/A by default</small>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Phone Number: <span style={{ color: '#dc3545' }}>*</span></label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={createFormData.phoneNumber}
                onChange={handleCreateFormChange}
                style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Follow-up Status: <span style={{ color: '#dc3545' }}>*</span></label>
              <select 
                name="followupStatus" 
                value={createFormData.followupStatus}
                onChange={handleCreateFormChange}
                style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}
              >
                <option value="">Select Status</option>
                <option value="Ring">Ring</option>
                <option value="Ready To Pay">Ready To Pay</option>
                <option value="Not Decided">Not Decided</option>
                <option value="Not Interested-Closed">Not Interested-Closed</option>
                <option value="Paid Closed">Paid Closed</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Follow-up Type: <span style={{ color: '#dc3545' }}>*</span></label>
              <select 
                name="followupType" 
                value={createFormData.followupType}
                onChange={handleCreateFormChange}
                style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}
              >
                <option value="">Select Type</option>
                <option value="Payment Followup">Payment Followup</option>
                <option value="Data Followup">Data Followup</option>
                <option value="Enquiry Followup">Enquiry Followup</option>
                <option value="Payment Closed">Payment Closed</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Follow-up Date: <span style={{ color: '#dc3545' }}>*</span></label>
              <input
                type="date"
                name="followupDate"
                value={createFormData.followupDate}
                onChange={handleCreateFormChange}
                min={getTodayDateString()}
                style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Admin Name:</label>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateAdminDropdown(!showCreateAdminDropdown)}
                  style={{
                    padding: '10px',
                    width: '100%',
                    border: '2px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{selectedAdminNames.length > 0 ? `${selectedAdminNames.length} selected` : 'Select Admin Names'}</span>
                  <span style={{ fontSize: '12px' }}>▼</span>
                </button>
                {showCreateAdminDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    border: '2px solid #007bff',
                    borderRadius: '4px',
                    marginTop: '5px',
                    zIndex: 1000,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    maxHeight: '250px',
                    overflowY: 'auto',
                    position: 'relative'
                  }}>
                    <button
                      type="button"
                      onClick={() => setShowCreateAdminDropdown(false)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#666',
                        padding: '0',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1001
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#000'}
                      onMouseLeave={(e) => e.target.style.color = '#666'}
                    >
                      ×
                    </button>
                    <div style={{ padding: '10px', paddingTop: '30px' }}>
                      {predefinedAdminNames.map(name => (
                        <div key={name} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                          <input
                            type="checkbox"
                            id={`admin_${name}`}
                            checked={selectedAdminNames.includes(name)}
                            onChange={() => handleCreateAdminNameChange(name)}
                            style={{ marginRight: '8px', cursor: 'pointer', width: '16px', height: '16px' }}
                          />
                          <label htmlFor={`admin_${name}`} style={{ cursor: 'pointer', marginBottom: 0 }}>{name}</label>
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid #ddd', marginTop: '10px', paddingTop: '10px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Add Custom Name:</label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <input
                            type="text"
                            placeholder="Enter custom name"
                            value={customAdminName}
                            onChange={(e) => setCustomAdminName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomCreateAdminName()}
                            style={{ padding: '8px', flex: 1, border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                          />
                          <button
                            onClick={handleAddCustomCreateAdminName}
                            style={{
                              padding: '8px 12px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '600',
                              minWidth: '40px'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                            title="Add custom name"
                          >
                            ✓
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {selectedAdminNames.length > 0 && (
                <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#e7f3ff', borderRadius: '4px', fontSize: '12px', color: '#0066cc' }}>
                  <strong>Selected:</strong> {getFinalCreateAdminNames()}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <button 
                onClick={handleCloseCreateModal}
                style={{
                  padding: '10px 25px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateFollowUp}
                style={{
                  padding: '10px 25px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
              >
                Create Follow-Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerFollowUps;
