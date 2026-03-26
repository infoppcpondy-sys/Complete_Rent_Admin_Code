import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { FaPrint } from 'react-icons/fa';
import { Table } from 'react-bootstrap';

// ✅ Moved OUTSIDE — stable reference, no re-mount on parent re-render
const RemarksInput = ({ name, value, onChange, disabled }) => (
  <div style={{ marginBottom: '15px' }}>
    <label style={{
      fontWeight: 'bold', display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: '5px', color: '#555'
    }}>
      <span>Remarks:</span>
      <span style={{
        fontSize: '12px', fontWeight: 'normal',
        color: value.length >= 50 ? '#dc3545' : value.length >= 40 ? '#fd7e14' : '#6c757d'
      }}>
        {value.length}/50
      </span>
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder="Enter remarks (max 50 characters)"
      maxLength={50}
      style={{
        padding: '10px', width: '100%', fontSize: '14px', borderRadius: '4px',
        border: `2px solid ${value.length >= 50 ? '#dc3545' : '#ddd'}`,
        boxSizing: 'border-box'
      }}
    />
    {value.length >= 50 && (
      <small style={{ color: '#dc3545', marginTop: '3px', display: 'block' }}>
        Maximum 50 characters reached.
      </small>
    )}
  </div>
);

// ✅ Moved OUTSIDE — stable reference, no re-mount on parent re-render
const AdminDropdown = ({ show, onClose, names, selectedNames, onNameChange, customName, onCustomChange, onAddCustom, onKeyPress }) => (
  show ? (
    <div style={{
      position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff',
      border: '2px solid #007bff', borderRadius: '4px', marginTop: '5px', zIndex: 1000,
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)', maxHeight: '250px', overflowY: 'auto'
    }}>
      <button type="button" onClick={onClose}
        style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}
        onMouseEnter={(e) => e.target.style.color = '#000'} onMouseLeave={(e) => e.target.style.color = '#666'}>×</button>
      <div style={{ padding: '10px', paddingTop: '30px' }}>
        {names.map(name => (
          <div key={name} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" id={`chk_${name}`} checked={selectedNames.includes(name)} onChange={() => onNameChange(name)}
              style={{ marginRight: '8px', cursor: 'pointer', width: '16px', height: '16px' }} />
            <label htmlFor={`chk_${name}`} style={{ cursor: 'pointer', marginBottom: 0 }}>{name}</label>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #ddd', marginTop: '10px', paddingTop: '10px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Add Custom Name:</label>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input type="text" placeholder="Enter custom name" value={customName} onChange={onCustomChange} onKeyPress={onKeyPress}
              style={{ padding: '8px', flex: 1, border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }} />
            <button onClick={onAddCustom}
              style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', minWidth: '40px' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'} onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}>✓</button>
          </div>
        </div>
      </div>
    </div>
  ) : null
);

const FollowUpGetTable = () => {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [createdAtStartDate, setCreatedAtStartDate] = useState('');
  const [createdAtEndDate, setCreatedAtEndDate] = useState('');
  const [properties, setProperties] = useState({});
  const [pendingRentIds, setPendingRentIds] = useState([]);
  const printRef = useRef();

  // Edit follow-up state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [editFormData, setEditFormData] = useState({
    followupStatus: '',
    followupType: '',
    followupDate: '',
    remarks: ''
  });

  // Create follow-up state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    rentId: 'N/A',
    phoneNumber: '',
    followupStatus: '',
    followupType: '',
    followupDate: '',
    adminName: '',
    remarks: ''
  });

  // Admin names dropdown state
  const predefinedAdminNames = ['Bala', 'Madhan', 'Prabavathi', 'ThilagavatiMayavan', 'Arund', 'Gayathri', 'Nandhishwari'];
  const [showCreateAdminDropdown, setShowCreateAdminDropdown] = useState(false);
  const [selectedAdminNames, setSelectedAdminNames] = useState([]);
  const [customAdminName, setCustomAdminName] = useState('');
  const [showEditAdminDropdown, setShowEditAdminDropdown] = useState(false);
  const [selectedEditAdminNames, setSelectedEditAdminNames] = useState([]);
  const [customEditAdminName, setCustomEditAdminName] = useState('');

  const fetchAllFollowUps = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/followup-list`);
      setFollowups(res.data.data);
    } catch (error) {
      console.error('Error fetching all follow-up data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredFollowUps = async (filterType) => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/followup-list-today-past?dateFilter=${filterType}`);
      setFollowups(res.data.data);
    } catch (error) {
      console.error(`Error fetching ${filterType} follow-up data:`, error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-alls-datas-all`);
      const propertiesMap = {};
      if (res.data.users && Array.isArray(res.data.users)) {
        res.data.users.forEach(property => {
          propertiesMap[property.rentId] = property.status;
        });
      }
      setProperties(propertiesMap);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchPendingProperties = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/properties/pending-rent`);
      const pendingIds = [];
      if (res.data.users && Array.isArray(res.data.users)) {
        res.data.users.forEach(property => {
          if (property.rentId) pendingIds.push(String(property.rentId));
        });
      }
      setPendingRentIds(pendingIds);
    } catch (error) {
      console.error('Error fetching pending properties:', error);
    }
  };

  useEffect(() => {
    fetchAllFollowUps();
    fetchProperties();
    fetchPendingProperties();
  }, []);

  const handleDateFilter = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const filtered = followups.filter((item) => {
      const followUpDate = new Date(item.followupDate);
      return followUpDate >= start && followUpDate <= end;
    });
    setFollowups(filtered);
  };

  const handleCreatedAtFilter = () => {
    const start = new Date(createdAtStartDate);
    const end = new Date(createdAtEndDate);
    end.setHours(23, 59, 59, 999);
    const filtered = followups.filter((item) => {
      const createdDate = new Date(item.createdAt);
      return createdDate >= start && createdDate <= end;
    });
    setFollowups(filtered);
  };

  const handleFutureFollowUps = () => {
    const today = new Date();
    const filtered = followups.filter((item) => new Date(item.followupDate) > today);
    setFollowups(filtered);
  };

  const handleStatusFilter = (status) => {
    const filtered = followups.filter((item) => item.followupStatus === status);
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

  // ── Edit ──
  const handleEdit = useCallback((followUp) => {
    setEditingFollowUp(followUp);
    setEditFormData({
      followupStatus: followUp.followupStatus,
      followupType: followUp.followupType,
      followupDate: followUp.followupDate.split('T')[0],
      remarks: followUp.remarks || ''
    });
    if (followUp.adminName && followUp.adminName.trim()) {
      setSelectedEditAdminNames(followUp.adminName.split(',').map(name => name.trim()));
    } else {
      setSelectedEditAdminNames([]);
    }
    setCustomEditAdminName('');
    setShowEditModal(true);
  }, []);

  const handleSaveEdit = async () => {
    if (!editingFollowUp._id) { alert('Error: Follow-up ID not found'); return; }
    const finalAdminName = getFinalEditAdminNames();
    const dataToSend = { ...editFormData, adminName: finalAdminName };
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/followup-update/${editingFollowUp._id}`, dataToSend);
      if (response.status === 200) {
        alert('✅ Follow-up updated successfully!');
        setShowEditModal(false);
        setEditingFollowUp(null);
        setEditFormData({ followupStatus: '', followupType: '', followupDate: '', remarks: '' });
        setSelectedEditAdminNames([]);
        setCustomEditAdminName('');
        fetchAllFollowUps();
      }
    } catch (error) {
      alert('❌ Failed to update follow-up!\n' + (error.response?.data?.message || error.message));
    }
  };

  const handleCloseModal = useCallback(() => {
    setShowEditModal(false);
    setEditingFollowUp(null);
    setEditFormData({ followupStatus: '', followupType: '', followupDate: '', remarks: '' });
    setSelectedEditAdminNames([]);
    setCustomEditAdminName('');
    setShowEditAdminDropdown(false);
  }, []);

  const handleEditFormChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'remarks' && value.length > 50) return;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // ── Create ──
  const handleCreateAdminNameChange = useCallback((name) => {
    setSelectedAdminNames(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
    setShowCreateAdminDropdown(false);
  }, []);

  const handleEditAdminNameChange = useCallback((name) => {
    setSelectedEditAdminNames(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
    setShowEditAdminDropdown(false);
  }, []);

  const getFinalCreateAdminNames = () => selectedAdminNames.join(', ');
  const getFinalEditAdminNames = () => selectedEditAdminNames.join(', ');

  const handleAddCustomCreateAdminName = useCallback(() => {
    if (customAdminName.trim()) {
      setSelectedAdminNames(prev => [...prev, customAdminName.trim()]);
      setCustomAdminName('');
      setShowCreateAdminDropdown(false);
    }
  }, [customAdminName]);

  const handleAddCustomEditAdminName = useCallback(() => {
    if (customEditAdminName.trim()) {
      setSelectedEditAdminNames(prev => [...prev, customEditAdminName.trim()]);
      setCustomEditAdminName('');
      setShowEditAdminDropdown(false);
    }
  }, [customEditAdminName]);

  const handleBulkPaidClose = async () => {
    if (followups.length === 0) { alert('⚠️ No follow-ups to update'); return; }
    const toUpdate = followups.filter(item => item.followupStatus !== 'Paid Closed' && item.followupStatus !== 'Not Interested-Closed');
    if (toUpdate.length === 0) { alert('⚠️ All visible follow-ups are already closed'); return; }
    const confirmed = window.confirm(`Are you sure you want to mark ${toUpdate.length} follow-up(s) as Paid Closed?`);
    if (!confirmed) return;
    try {
      let successCount = 0; let errorCount = 0;
      for (const followup of toUpdate) {
        try {
          await axios.put(`${process.env.REACT_APP_API_URL}/followup-update/${followup._id}`, {
            followupStatus: 'Paid Closed', followupType: followup.followupType, followupDate: followup.followupDate
          });
          successCount++;
        } catch (err) { errorCount++; }
      }
      if (successCount > 0) alert(`✅ Successfully marked ${successCount} follow-up(s) as Paid Closed!`);
      if (errorCount > 0) alert(`⚠️ Failed to update ${errorCount} follow-up(s)`);
      fetchAllFollowUps();
    } catch (error) { alert('❌ Error during bulk update'); }
  };

  const handleCreateFollowUp = async () => {
    if (!createFormData.phoneNumber || !createFormData.followupStatus || !createFormData.followupType || !createFormData.followupDate) {
      alert('⚠️ Please fill all required fields (Phone Number, Status, Type, Date)'); return;
    }
    const finalAdminName = getFinalCreateAdminNames();
    const dataToSend = { ...createFormData, adminName: finalAdminName };
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/followup-create`, dataToSend);
      if (response.status === 201) {
        alert('✅ Follow-up created successfully!');
        setShowCreateModal(false);
        setCreateFormData({ rentId: 'N/A', phoneNumber: '', followupStatus: '', followupType: '', followupDate: '', adminName: '', remarks: '' });
        setSelectedAdminNames([]);
        setCustomAdminName('');
        fetchAllFollowUps();
      }
    } catch (error) {
      alert('❌ Failed to create follow-up!\n' + (error.response?.data?.message || error.message));
    }
  };

  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
    setCreateFormData({ rentId: 'N/A', phoneNumber: '', followupStatus: '', followupType: '', followupDate: '', adminName: '', remarks: '' });
    setSelectedAdminNames([]);
    setCustomAdminName('');
    setShowCreateAdminDropdown(false);
  }, []);

  const handleCreateFormChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'remarks' && value.length > 50) return;
    setCreateFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // ── Helpers ──
  const getFollowUpDayStatus = (followupDate) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const followUpDay = new Date(followupDate); followUpDay.setHours(0, 0, 0, 0);
    if (followUpDay.getTime() === today.getTime()) return 'Today';
    else if (followUpDay < today) return 'Past';
    else return 'Future';
  };

  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const getPropertyStatusDisplay = (rentId) => {
    if (rentId === 'N/A' || rentId === null || rentId === undefined) {
      return { code: 'No Property Data', label: 'No Property Data', backgroundColor: '#9E9E9E', textColor: '#ffffff' };
    }
    let code = 'ES', label = 'Expired', backgroundColor = '#000000', textColor = '#ffffff';
    const rentIdString = String(rentId);
    if (pendingRentIds.includes(rentIdString)) {
      return { code: 'PE', label: 'Pending', backgroundColor: '#007BFF', textColor: '#ffffff' };
    }
    const status = properties[rentId];
    if (status) {
      switch (status.toLowerCase()) {
        case 'complete': code = 'PA'; label = 'Pre-Approved'; backgroundColor = '#FFC107'; textColor = '#000000'; break;
        case 'incomplete': code = 'PE'; label = 'Pending'; backgroundColor = '#007BFF'; textColor = '#ffffff'; break;
        case 'active': code = 'AP'; label = 'Approved'; backgroundColor = '#28A745'; textColor = '#ffffff'; break;
        case 'delete': code = 'DE'; label = 'Deleted'; backgroundColor = '#DC3545'; textColor = '#ffffff'; break;
        default: code = 'ES'; label = 'Expired'; backgroundColor = '#000000'; textColor = '#ffffff';
      }
    }
    return { code, label, backgroundColor, textColor };
  };

  const getDayStatusBadgeColor = (status) => {
    switch (status) {
      case 'Today': return { backgroundColor: '#ffc107', color: '#000', fontWeight: '600' };
      case 'Past': return { backgroundColor: '#dc3545', color: '#fff', fontWeight: '600' };
      case 'Future': return { backgroundColor: '#28a745', color: '#fff', fontWeight: '600' };
      default: return { backgroundColor: '#6c757d', color: '#fff', fontWeight: '600' };
    }
  };

  // ── Table ──
  const tableHead = (bgColor, textColor) => (
    <tr style={bgColor ? { backgroundColor: bgColor, color: textColor } : {}} className="text-center">
      <th>S.No</th><th>Rent ID</th><th>Property Status</th><th>Phone Number</th>
      <th>Follow-Up Status</th><th>Follow-Up Type</th><th>Follow-Up Date</th>
      <th>Follow-up Day</th><th>Admin Name</th><th>Remarks</th><th>Created At</th><th>Edit Followup</th>
    </tr>
  );

  const renderRow = (item, index, rowBg) => {
    const { label, backgroundColor, textColor } = getPropertyStatusDisplay(item.rentId);
    return (
      <tr key={item._id} className="text-center" style={rowBg ? { backgroundColor: rowBg } : {}}>
        <td>{index + 1}</td>
        <td>{item.rentId}</td>
        <td>
          <span style={{ padding: '5px 10px', borderRadius: '4px', backgroundColor, color: textColor, fontWeight: 'bold', fontSize: '12px', display: 'inline-block' }}>
            {label}
          </span>
        </td>
        <td>{item.phoneNumber || '-'}</td>
        <td>
          {item.followupStatus === 'Paid Closed' || item.followupStatus === 'Not Interested-Closed' ? (
            <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', backgroundColor: item.followupStatus === 'Paid Closed' ? '#28a745' : '#dc3545', color: 'white' }}>
              {item.followupStatus}
            </span>
          ) : item.followupStatus}
        </td>
        <td>{item.followupType}</td>
        <td>{new Date(item.followupDate).toLocaleDateString()}</td>
        <td>
          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', ...getDayStatusBadgeColor(getFollowUpDayStatus(item.followupDate)) }}>
            {getFollowUpDayStatus(item.followupDate)}
          </span>
        </td>
        <td>{item.adminName}</td>
        <td>
          {item.remarks ? (
            <span style={{
              display: 'inline-block', maxWidth: '150px', overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px',
              color: '#555', cursor: 'default'
            }} title={item.remarks}>
              {item.remarks}
            </span>
          ) : (
            <span style={{ color: '#aaa', fontSize: '12px' }}>—</span>
          )}
        </td>
        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
        <td>
          <button className="btn btn-sm btn-warning" onClick={() => handleEdit(item)}>✏️ Edit</button>
        </td>
      </tr>
    );
  };

  return (
    <div className="p-4">
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .toolbar-card { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 14px 18px; margin-bottom: 12px; }
        .filter-row { display: flex; align-items: center; gap: 10px; flex-wrap: nowrap; }
        .filter-label { font-weight: 700; font-size: 13px; color: #444; white-space: nowrap; min-width: 110px; }
        .filter-date-group { display: flex; align-items: center; gap: 6px; flex: 1; }
        .filter-date-group label { font-size: 12px; color: #666; white-space: nowrap; margin: 0; }
        .filter-date-group input[type="date"] { padding: 5px 8px; border: 1px solid #ced4da; border-radius: 4px; font-size: 13px; height: 34px; width: 150px; }
        .filter-divider { height: 1px; background: #f0f0f0; margin: 10px 0; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700' }}>Follow-Up List</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
          + Create Property Follow-Up
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#444', marginRight: '4px' }}>Filter:</span>
          <button className="btn btn-secondary btn-sm" onClick={fetchAllFollowUps}>All</button>
          <button className="btn btn-success btn-sm" onClick={() => fetchFilteredFollowUps('today')}>Today</button>
          <button className="btn btn-warning btn-sm" onClick={() => fetchFilteredFollowUps('past')}>Past</button>
          <button className="btn btn-info btn-sm" onClick={handleFutureFollowUps}>Future</button>
          <button className="btn btn-success btn-sm" onClick={() => handleStatusFilter('Paid Closed')}>✓ Paid Closed</button>
          <button className="btn btn-danger btn-sm" onClick={() => handleStatusFilter('Not Interested-Closed')}>✗ Not Interested</button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button className="btn btn-success btn-sm" onClick={handlePrint}><FaPrint style={{ marginRight: '4px' }} />Print All</button>
            <button className="btn btn-outline-secondary btn-sm" onClick={fetchAllFollowUps}>↺ Refresh</button>
          </div>
        </div>
        <div className="filter-divider" />
        <div className="filter-row" style={{ marginBottom: '10px' }}>
          <span className="filter-label">📅 Follow-Up Date:</span>
          <div className="filter-date-group">
            <label>From</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <label>To</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <button onClick={handleDateFilter} className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>Filter</button>
          </div>
        </div>
        <div className="filter-row">
          <span className="filter-label">🗓 Created At:</span>
          <div className="filter-date-group">
            <label>From</label>
            <input type="date" value={createdAtStartDate} onChange={(e) => setCreatedAtStartDate(e.target.value)} />
            <label>To</label>
            <input type="date" value={createdAtEndDate} onChange={(e) => setCreatedAtEndDate(e.target.value)} />
            <button onClick={handleCreatedAtFilter} className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>Filter</button>
          </div>
        </div>
      </div>

      {/* Tables */}
      {loading ? (
        <p>Loading...</p>
      ) : followups.length === 0 ? (
        <p>No follow-up records found.</p>
      ) : (
        <div ref={printRef}>
          <h5 className="mt-4 mb-2" style={{ fontWeight: '600', color: '#333' }}>All Property Followup Data (Today, Future, Past)</h5>
          <Table striped bordered hover responsive className="table-sm align-middle">
            <thead className="sticky-top">{tableHead()}</thead>
            <tbody>
              {followups.filter(item => item.followupStatus !== 'Not Interested-Closed' && item.followupStatus !== 'Paid Closed')
                .map((item, index) => renderRow(item, index))}
            </tbody>
          </Table>
        </div>
      )}

      {followups.filter(item => getFollowUpDayStatus(item.followupDate) === 'Today' && item.followupStatus !== 'Not Interested-Closed' && item.followupStatus !== 'Paid Closed').length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h5 className="mb-2" style={{ color: '#d39e00', borderBottom: '2px solid #ffc107', paddingBottom: '8px', fontWeight: '700' }}>📅 Today Follow-Ups</h5>
          <Table striped bordered hover responsive className="table-sm align-middle">
            <thead className="sticky-top">{tableHead('#fff3cd', '#856404')}</thead>
            <tbody>
              {followups.filter(item => getFollowUpDayStatus(item.followupDate) === 'Today' && item.followupStatus !== 'Not Interested-Closed' && item.followupStatus !== 'Paid Closed')
                .map((item, index) => renderRow(item, index, '#fffbf0'))}
            </tbody>
          </Table>
        </div>
      )}

      {followups.filter(item => getFollowUpDayStatus(item.followupDate) === 'Future' && item.followupStatus !== 'Not Interested-Closed' && item.followupStatus !== 'Paid Closed').length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h5 className="mb-2" style={{ color: '#28a745', borderBottom: '2px solid #28a745', paddingBottom: '8px', fontWeight: '700' }}>➡️ Future Follow-Ups</h5>
          <Table striped bordered hover responsive className="table-sm align-middle">
            <thead className="sticky-top">{tableHead('#d4edda', '#155724')}</thead>
            <tbody>
              {followups.filter(item => getFollowUpDayStatus(item.followupDate) === 'Future' && item.followupStatus !== 'Not Interested-Closed' && item.followupStatus !== 'Paid Closed')
                .map((item, index) => renderRow(item, index, '#f1f9f1'))}
            </tbody>
          </Table>
        </div>
      )}

      {followups.filter(item => getFollowUpDayStatus(item.followupDate) === 'Past' && item.followupStatus !== 'Not Interested-Closed' && item.followupStatus !== 'Paid Closed').length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h5 className="mb-2" style={{ color: '#dc3545', borderBottom: '2px solid #dc3545', paddingBottom: '8px', fontWeight: '700' }}>⏰ Past Follow-Ups (Overdue)</h5>
          <Table striped bordered hover responsive className="table-sm align-middle">
            <thead className="sticky-top">{tableHead('#f8d7da', '#721c24')}</thead>
            <tbody>
              {followups.filter(item => getFollowUpDayStatus(item.followupDate) === 'Past' && item.followupStatus !== 'Not Interested-Closed' && item.followupStatus !== 'Paid Closed')
                .map((item, index) => renderRow(item, index, '#fff5f5'))}
            </tbody>
          </Table>
        </div>
      )}

      {followups.filter(item => item.followupStatus === 'Not Interested-Closed' || item.followupStatus === 'Paid Closed').length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h5 className="mb-2" style={{ color: '#6c757d', borderBottom: '2px solid #6c757d', paddingBottom: '8px', fontWeight: '700' }}>✓ Closed Follow-Ups (Not Interested-Closed / Paid Closed)</h5>
          <Table striped bordered hover responsive className="table-sm align-middle">
            <thead className="sticky-top">{tableHead('#e2e3e5', '#383d41')}</thead>
            <tbody>
              {followups.filter(item => item.followupStatus === 'Not Interested-Closed' || item.followupStatus === 'Paid Closed')
                .map((item, index) => renderRow(item, index, '#f8f9fa'))}
            </tbody>
          </Table>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {showEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, overflow: 'auto', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', width: '100%', maxWidth: '550px', margin: 'auto', position: 'relative', zIndex: 10000, animation: 'slideDown 0.3s ease' }}>
            <button onClick={handleCloseModal} style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'transparent', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#666', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={(e) => e.target.style.color = '#000'} onMouseLeave={(e) => e.target.style.color = '#666'}>×</button>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333', fontSize: '1.5rem', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Edit Follow-Up</h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Rent ID:</label>
              <input type="text" value={editingFollowUp?.rentId || ''} disabled style={{ padding: '10px', width: '100%', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9', color: '#666' }} />
            </div>

            {[
              { label: 'Follow-up Status', name: 'followupStatus', options: ['Ring', 'Ready To Pay', 'Not Decided', 'Not Interested-Closed', 'Paid Closed'] },
              { label: 'Follow-up Type', name: 'followupType', options: ['Payment Followup', 'Data Followup', 'Enquiry Followup', 'Payment Closed'] }
            ].map(({ label, name, options }) => (
              <div key={name} style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>{label}:</label>
                <select name={name} value={editFormData[name]} onChange={handleEditFormChange}
                  style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
                  <option value="">Select</option>
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Follow-up Date:</label>
              <input type="date" name="followupDate" value={editFormData.followupDate} onChange={handleEditFormChange} min={getTodayDateString()}
                style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }} />
            </div>

            <RemarksInput
              name="remarks"
              value={editFormData.remarks}
              onChange={handleEditFormChange}
              disabled={false}
            />

            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Admin Name:</label>
              <div style={{ position: 'relative' }}>
                <button type="button" onClick={() => setShowEditAdminDropdown(!showEditAdminDropdown)}
                  style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px', backgroundColor: '#fff', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{selectedEditAdminNames.length > 0 ? `${selectedEditAdminNames.length} selected` : 'Select Admin Names'}</span>
                  <span style={{ fontSize: '12px' }}>▼</span>
                </button>
                <AdminDropdown show={showEditAdminDropdown} onClose={() => setShowEditAdminDropdown(false)}
                  names={predefinedAdminNames} selectedNames={selectedEditAdminNames} onNameChange={handleEditAdminNameChange}
                  customName={customEditAdminName} onCustomChange={(e) => setCustomEditAdminName(e.target.value)}
                  onAddCustom={handleAddCustomEditAdminName} onKeyPress={(e) => e.key === 'Enter' && handleAddCustomEditAdminName()} />
              </div>
              {selectedEditAdminNames.length > 0 && (
                <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#e7f3ff', borderRadius: '4px', fontSize: '12px', color: '#0066cc' }}>
                  <strong>Selected:</strong> {getFinalEditAdminNames()}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <button onClick={handleCloseModal} style={{ padding: '10px 25px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'} onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}>Cancel</button>
              <button onClick={handleSaveEdit} style={{ padding: '10px 25px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'} onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Modal ── */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, overflow: 'auto', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', width: '100%', maxWidth: '550px', margin: 'auto', position: 'relative', zIndex: 10000, animation: 'slideDown 0.3s ease' }}>
            <button onClick={handleCloseCreateModal} style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'transparent', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#666', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={(e) => e.target.style.color = '#000'} onMouseLeave={(e) => e.target.style.color = '#666'}>×</button>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333', fontSize: '1.5rem', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Create New Follow-Up</h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Rent ID:</label>
              <input type="text" value={createFormData.rentId} disabled style={{ padding: '10px', width: '100%', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9', color: '#666' }} />
              <small style={{ color: '#888', marginTop: '3px', display: 'block' }}>Rent ID is N/A by default</small>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Phone Number: <span style={{ color: '#dc3545' }}>*</span></label>
              <input type="text" name="phoneNumber" placeholder="Enter phone number" value={createFormData.phoneNumber} onChange={handleCreateFormChange}
                style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
            </div>

            {[
              { label: 'Follow-up Status', name: 'followupStatus', options: ['Ring', 'Ready To Pay', 'Not Decided', 'Not Interested-Closed', 'Paid Closed'] },
              { label: 'Follow-up Type', name: 'followupType', options: ['Payment Followup', 'Data Followup', 'Enquiry Followup', 'Payment Closed'] }
            ].map(({ label, name, options }) => (
              <div key={name} style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>{label}: <span style={{ color: '#dc3545' }}>*</span></label>
                <select name={name} value={createFormData[name]} onChange={handleCreateFormChange}
                  style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
                  <option value="">Select</option>
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Follow-up Date: <span style={{ color: '#dc3545' }}>*</span></label>
              <input type="date" name="followupDate" value={createFormData.followupDate} onChange={handleCreateFormChange} min={getTodayDateString()}
                style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }} />
            </div>

            <RemarksInput
              name="remarks"
              value={createFormData.remarks}
              onChange={handleCreateFormChange}
              disabled={false}
            />

            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Admin Name:</label>
              <div style={{ position: 'relative' }}>
                <button type="button" onClick={() => setShowCreateAdminDropdown(!showCreateAdminDropdown)}
                  style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px', backgroundColor: '#fff', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{selectedAdminNames.length > 0 ? `${selectedAdminNames.length} selected` : 'Select Admin Names'}</span>
                  <span style={{ fontSize: '12px' }}>▼</span>
                </button>
                <AdminDropdown show={showCreateAdminDropdown} onClose={() => setShowCreateAdminDropdown(false)}
                  names={predefinedAdminNames} selectedNames={selectedAdminNames} onNameChange={handleCreateAdminNameChange}
                  customName={customAdminName} onCustomChange={(e) => setCustomAdminName(e.target.value)}
                  onAddCustom={handleAddCustomCreateAdminName} onKeyPress={(e) => e.key === 'Enter' && handleAddCustomCreateAdminName()} />
              </div>
              {selectedAdminNames.length > 0 && (
                <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#e7f3ff', borderRadius: '4px', fontSize: '12px', color: '#0066cc' }}>
                  <strong>Selected:</strong> {getFinalCreateAdminNames()}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <button onClick={handleCloseCreateModal} style={{ padding: '10px 25px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'} onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}>Cancel</button>
              <button onClick={handleCreateFollowUp} style={{ padding: '10px 25px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'} onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}>Create Follow-Up</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUpGetTable;