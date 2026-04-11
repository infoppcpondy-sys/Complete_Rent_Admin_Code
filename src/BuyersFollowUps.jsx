import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { FaPrint } from 'react-icons/fa';
import { Table } from 'react-bootstrap';

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

const dedupeFollowups = (arr) => {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  return arr.filter(item => {
    const dateKey = item.followupDate ? new Date(item.followupDate).toISOString() : '';
    const key = `${item.Ra_Id}|${item.phoneNumber}|${dateKey}|${item.followupStatus}|${item.followupType}|${item.adminName}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const BuyerFollowUps = () => {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [createdAtStartDate, setCreatedAtStartDate] = useState('');
  const [createdAtEndDate, setCreatedAtEndDate] = useState('');
  const [tenantStatusCache, setTenantStatusCache] = useState({});
  const [activeRaData, setActiveRaData] = useState([]);
  const [pendingRaData, setPendingRaData] = useState([]);
  const [statusDataLoaded, setStatusDataLoaded] = useState(false);
  const printRef = useRef();
  const [allData, setAllData] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    Ra_Id: 'N/A',
    phoneNumber: '',
    followupStatus: '',
    followupType: '',
    followupDate: '',
    adminName: '',
    remarks: ''
  });

  const predefinedAdminNames = ['Bala', 'Madhan', 'Prabavathi', 'ThilagavatiMayavan', 'Arund', 'Gayathri', 'Nandhishwari'];
  const [showCreateAdminDropdown, setShowCreateAdminDropdown] = useState(false);
  const [selectedAdminNames, setSelectedAdminNames] = useState([]);
  const [customAdminName, setCustomAdminName] = useState('');

  // Edit follow-up state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [editFormData, setEditFormData] = useState({
    followupStatus: '',
    followupType: '',
    followupDate: '',
    remarks: ''
  });
  const [showEditAdminDropdown, setShowEditAdminDropdown] = useState(false);
  const [selectedEditAdminNames, setSelectedEditAdminNames] = useState([]);
  const [customEditAdminName, setCustomEditAdminName] = useState('');

  const fetchAllFollowUps = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/followup-list-buyer`);
      const deduped = dedupeFollowups(res.data.data);
      setFollowups(deduped);
      setAllData(deduped);
    } catch (error) {
      console.error('Error fetching all follow-up data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredFollowUps = async (filterType) => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/followup-list-today-past-buyer?dateFilter=${filterType}`);
      setFollowups(dedupeFollowups(res.data.data));
    } catch (error) {
      console.error(`Error fetching ${filterType} follow-up data:`, error);
    } finally {
      setLoading(false);
    }
  };

  const getTenantStatusFromCache = (raId) => {
    try {
      if (raId === 'N/A' || raId === null || raId === undefined) return 'No Tenant Data';
      const activeRecord = activeRaData.find(item => item.Ra_Id === parseInt(raId));
      if (activeRecord) return activeRecord.isDeleted === true ? 'Deleted' : 'Active';
      const pendingRecord = pendingRaData.find(item => item.Ra_Id === parseInt(raId));
      if (pendingRecord) return pendingRecord.isDeleted === true ? 'Deleted' : 'Pending';
      return '-';
    } catch (error) {
      console.error(`Error getting status for RA_Id ${raId}:`, error);
      return '-';
    }
  };

  const loadRaStatusData = async () => {
    try {
      const [activeRes, pendingRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/raActive-buyerAssistance-all-plans-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/fetch-buyerAssistance-pending-rent`)
      ]);
      const activeData = Array.isArray(activeRes.data.data) ? activeRes.data.data : [activeRes.data.data];
      const pendingData = Array.isArray(pendingRes.data.data) ? pendingRes.data.data : [pendingRes.data.data];
      setActiveRaData(activeData);
      setPendingRaData(pendingData);
      setStatusDataLoaded(true);
    } catch (error) {
      console.error('Error loading RA status data:', error);
      setStatusDataLoaded(true);
    }
  };

  useEffect(() => {
    fetchAllFollowUps();
    loadRaStatusData();
  }, []);

  useEffect(() => {
    if (statusDataLoaded && followups.length > 0) {
      const newCache = {};
      followups.forEach((item) => {
        newCache[item.Ra_Id] = getTenantStatusFromCache(item.Ra_Id);
      });
      setTenantStatusCache(newCache);
    }
  }, [statusDataLoaded, followups]);

  const handleDateFilter = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const filtered = allData.filter((item) => {
      const followUpDate = new Date(item.followupDate);
      return followUpDate >= start && followUpDate <= end;
    });
    setFollowups(filtered);
  };

  const handleCreatedAtFilter = () => {
    const start = new Date(createdAtStartDate);
    const end = new Date(createdAtEndDate);
    end.setHours(23, 59, 59, 999);
    const filtered = allData.filter((item) => {
      const createdDate = new Date(item.createdAt);
      return createdDate >= start && createdDate <= end;
    });
    setFollowups(filtered);
  };

  const handleFutureFollowUps = () => {
    const today = new Date();
    const filtered = allData.filter((item) => new Date(item.followupDate) > today);
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

  const getFollowUpDayStatus = (followupDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followUpDay = new Date(followupDate);
    followUpDay.setHours(0, 0, 0, 0);
    if (followUpDay.getTime() === today.getTime()) return 'Today';
    else if (followUpDay < today) return 'Past';
    else return 'Future';
  };

  const getTenantStatusBadgeColor = (status) => {
    switch (status) {
      case 'Active': return { backgroundColor: '#28a745', color: '#fff', fontWeight: '600' };
      case 'Pending': return { backgroundColor: '#007bff', color: '#fff', fontWeight: '600' };
      case 'Deleted': return { backgroundColor: '#dc3545', color: '#fff', fontWeight: '600' };
      case 'No Tenant Data': return { backgroundColor: '#9E9E9E', color: '#fff', fontWeight: '600' };
      default: return { backgroundColor: '#6c757d', color: '#fff', fontWeight: '600' };
    }
  };

  const getDayStatusBadgeColor = (status) => {
    switch (status) {
      case 'Today': return { backgroundColor: '#ffc107', color: '#000', fontWeight: '600' };
      case 'Past': return { backgroundColor: '#dc3545', color: '#fff', fontWeight: '600' };
      case 'Future': return { backgroundColor: '#28a745', color: '#fff', fontWeight: '600' };
      default: return { backgroundColor: '#6c757d', color: '#fff', fontWeight: '600' };
    }
  };

  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const handleCreateAdminNameChange = (name) => {
    setSelectedAdminNames(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
    setShowCreateAdminDropdown(false);
  };

  const getFinalCreateAdminNames = () => selectedAdminNames.join(', ');

  const handleAddCustomCreateAdminName = () => {
    if (customAdminName.trim()) {
      setSelectedAdminNames([...selectedAdminNames, customAdminName.trim()]);
      setCustomAdminName('');
      setShowCreateAdminDropdown(false);
    }
  };

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'remarks' && value.length > 50) return;
    setCreateFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Edit handlers ──
  const handleEdit = useCallback((followUp) => {
    setEditingFollowUp(followUp);
    setEditFormData({
      followupStatus: followUp.followupStatus,
      followupType: followUp.followupType,
      followupDate: followUp.followupDate ? followUp.followupDate.split('T')[0] : '',
      remarks: followUp.remarks || ''
    });
    if (followUp.adminName && followUp.adminName.trim()) {
      setSelectedEditAdminNames(followUp.adminName.split(',').map(n => n.trim()));
    } else {
      setSelectedEditAdminNames([]);
    }
    setCustomEditAdminName('');
    setShowEditModal(true);
  }, []);

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'remarks' && value.length > 50) return;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const getFinalEditAdminNames = () => selectedEditAdminNames.join(', ');

  const handleEditAdminNameChange = (name) => {
    setSelectedEditAdminNames(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
    setShowEditAdminDropdown(false);
  };

  const handleAddCustomEditAdminName = () => {
    if (customEditAdminName.trim()) {
      setSelectedEditAdminNames(prev => [...prev, customEditAdminName.trim()]);
      setCustomEditAdminName('');
      setShowEditAdminDropdown(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingFollowUp(null);
    setEditFormData({ followupStatus: '', followupType: '', followupDate: '', remarks: '' });
    setSelectedEditAdminNames([]);
    setCustomEditAdminName('');
    setShowEditAdminDropdown(false);
  };

  const handleSaveEdit = async () => {
    if (!editingFollowUp?._id) { alert('Error: Follow-up ID not found'); return; }
    const finalAdminName = getFinalEditAdminNames();
    const dataToSend = { ...editFormData, adminName: finalAdminName };
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/followup-update-buyer/${editingFollowUp._id}`,
        dataToSend
      );
      if (response.status === 200) {
        alert('✅ Follow-up updated successfully!');
        handleCloseEditModal();
        fetchAllFollowUps();
      }
    } catch (error) {
      alert('❌ Failed to update follow-up!\n' + (error.response?.data?.message || error.message));
    }
  };

  const handleCreateFollowUp = async () => {
    if (!createFormData.phoneNumber || !createFormData.followupStatus || !createFormData.followupType || !createFormData.followupDate) {
      alert('⚠️ Please fill all required fields (Phone Number, Status, Type, Date)');
      return;
    }
    const finalAdminName = getFinalCreateAdminNames();
    const dataToSend = { ...createFormData, adminName: finalAdminName };
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/followup-create-buyer`, dataToSend);
      if (response.status === 201) {
        alert('✅ Follow-up created successfully!');
        setShowCreateModal(false);
        setCreateFormData({ Ra_Id: 'N/A', phoneNumber: '', followupStatus: '', followupType: '', followupDate: '', adminName: '', remarks: '' });
        setSelectedAdminNames([]);
        setCustomAdminName('');
        fetchAllFollowUps();
      }
    } catch (error) {
      alert('❌ Failed to create follow-up!\n' + (error.response?.data?.message || error.message));
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormData({ Ra_Id: 'N/A', phoneNumber: '', followupStatus: '', followupType: '', followupDate: '', adminName: '', remarks: '' });
    setSelectedAdminNames([]);
    setCustomAdminName('');
    setShowCreateAdminDropdown(false);
  };

  // Reusable table columns
  const tableColumns = (
    <tr className="text-center">
      <th>S.No</th>
      <th>RA ID</th>
      <th>Tenant Status</th>
      <th>Phone Number</th>
      <th>Follow-Up Status</th>
      <th>Follow-Up Type</th>
      <th>Follow-Up Date</th>
      <th>Follow-up Day</th>
      <th>Admin Name</th>
      <th>Remarks</th>
      <th>Created At</th>
      <th>Edit Followup</th>
    </tr>
  );

  const renderTableRow = (item, index) => (
    <tr key={item._id} className="text-center">
      <td>{index + 1}</td>
      <td>{item.Ra_Id}</td>
      <td>
        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', ...getTenantStatusBadgeColor(tenantStatusCache[item.Ra_Id] || '-') }}>
          {tenantStatusCache[item.Ra_Id] || 'Loading...'}
        </span>
      </td>
      <td>{item.phoneNumber || '-'}</td>
      <td>{item.followupStatus}</td>
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
            textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle'
          }} title={item.remarks}>
            {item.remarks}
          </span>
        ) : '-'}
      </td>
      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
      <td>
        <button className="btn btn-sm btn-warning" onClick={() => handleEdit(item)}>✏️ Edit</button>
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .toolbar-card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 14px 18px;
          margin-bottom: 12px;
        }
        .filter-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: nowrap;
        }
        .filter-label {
          font-weight: 700;
          font-size: 13px;
          color: #444;
          white-space: nowrap;
          min-width: 110px;
        }
        .filter-date-group {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
        }
        .filter-date-group label {
          font-size: 12px;
          color: #666;
          white-space: nowrap;
          margin: 0;
        }
        .filter-date-group input[type="date"] {
          padding: 5px 8px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 13px;
          height: 34px;
          width: 150px;
        }
        .filter-divider {
          height: 1px;
          background: #f0f0f0;
          margin: 10px 0;
        }
      `}</style>

      {/* ── Header Row: Title + Create Button ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700' }}>Tenant Follow-Up List</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
          + Create RA Follow-Up
        </button>
      </div>

      {/* ── Toolbar Card: Filter Buttons + Date Filters + Actions ── */}
      <div className="toolbar-card">

        {/* Row 1: Quick Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#444', marginRight: '4px' }}>Filter:</span>
          <button className="btn btn-secondary btn-sm" onClick={fetchAllFollowUps}>All</button>
          <button className="btn btn-success btn-sm" onClick={() => fetchFilteredFollowUps('today')}>Today</button>
          <button className="btn btn-warning btn-sm" onClick={() => fetchFilteredFollowUps('past')}>Past</button>
          <button className="btn btn-info btn-sm" onClick={handleFutureFollowUps}>Future</button>

          {/* Actions pushed to right */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button className="btn btn-success btn-sm" onClick={handlePrint}>
              <FaPrint style={{ marginRight: '4px' }} />Print All
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={fetchAllFollowUps}>
              ↺ Refresh
            </button>
          </div>
        </div>

        <div className="filter-divider" />

        {/* Row 2: Follow-Up Date Filter */}
        <div className="filter-row" style={{ marginBottom: '10px' }}>
          <span className="filter-label">📅 Follow-Up Date:</span>
          <div className="filter-date-group">
            <label>From</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <label>To</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <button onClick={handleDateFilter} className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
              Filter
            </button>
          </div>
        </div>

        {/* Row 3: Created At Filter */}
        <div className="filter-row">
          <span className="filter-label">🗓 Created At:</span>
          <div className="filter-date-group">
            <label>From</label>
            <input type="date" value={createdAtStartDate} onChange={(e) => setCreatedAtStartDate(e.target.value)} />
            <label>To</label>
            <input type="date" value={createdAtEndDate} onChange={(e) => setCreatedAtEndDate(e.target.value)} />
            <button onClick={handleCreatedAtFilter} className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
              Filter
            </button>
          </div>
        </div>

      </div>

      {/* ── Data Tables ── */}
      {loading ? (
        <p>Loading...</p>
      ) : followups.length === 0 ? (
        <p>No follow-up records found.</p>
      ) : (
        <div ref={printRef}>
          <h5 className="mt-4 mb-2" style={{ fontWeight: '600', color: '#333' }}>All Tenant Followup Data (Today, Future, Past)</h5>
          <Table striped bordered hover responsive className="table-sm align-middle">
            <thead className="sticky-top">{tableColumns}</thead>
            <tbody>{followups.map((item, index) => renderTableRow(item, index))}</tbody>
          </Table>
        </div>
      )}

      {/* Today Follow-Ups */}
      {followups.filter(item => getFollowUpDayStatus(item.followupDate) === 'Today' && item.followupStatus !== 'Not Interested-Closed' && item.followupStatus !== 'Paid Closed').length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h5 className="mb-2" style={{ color: '#d39e00', borderBottom: '2px solid #ffc107', paddingBottom: '8px', fontWeight: '700' }}>
            📅 Today Follow-Ups
          </h5>
          <Table striped bordered hover responsive className="table-sm align-middle">
            <thead className="sticky-top">
              <tr style={{ backgroundColor: '#fff3cd', color: '#856404' }} className="text-center">
                <th>S.No</th><th>RA ID</th><th>Tenant Status</th><th>Phone Number</th>
                <th>Follow-Up Status</th><th>Follow-Up Type</th><th>Follow-Up Date</th>
                <th>Follow-up Day</th><th>Admin Name</th><th>Remarks</th><th>Created At</th><th>Edit Followup</th>
              </tr>
            </thead>
            <tbody>
              {followups.filter(item => getFollowUpDayStatus(item.followupDate) === 'Today' && item.followupStatus !== 'Not Interested-Closed' && item.followupStatus !== 'Paid Closed')
                .map((item, index) => renderTableRow(item, index))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Future Follow-Ups */}
      {followups.filter(item => getFollowUpDayStatus(item.followupDate) === 'Future' && item.followupStatus !== 'Not Interested-Closed' && item.followupStatus !== 'Paid Closed').length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h5 className="mb-2" style={{ color: '#28a745', borderBottom: '2px solid #28a745', paddingBottom: '8px', fontWeight: '700' }}>
            🚀 Future Follow-Ups
          </h5>
          <Table striped bordered hover responsive className="table-sm align-middle">
            <thead className="sticky-top">
              <tr style={{ backgroundColor: '#d4edda', color: '#155724' }} className="text-center">
                <th>S.No</th><th>RA ID</th><th>Tenant Status</th><th>Phone Number</th>
                <th>Follow-Up Status</th><th>Follow-Up Type</th><th>Follow-Up Date</th>
                <th>Follow-up Day</th><th>Admin Name</th><th>Remarks</th><th>Created At</th><th>Edit Followup</th>
              </tr>
            </thead>
            <tbody>
              {followups.filter(item => getFollowUpDayStatus(item.followupDate) === 'Future' && item.followupStatus !== 'Not Interested-Closed' && item.followupStatus !== 'Paid Closed')
                .map((item, index) => renderTableRow(item, index))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Past Follow-Ups */}
      {followups.filter(item => getFollowUpDayStatus(item.followupDate) === 'Past' && item.followupStatus !== 'Not Interested-Closed' && item.followupStatus !== 'Paid Closed').length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h5 className="mb-2" style={{ color: '#dc3545', borderBottom: '2px solid #dc3545', paddingBottom: '8px', fontWeight: '700' }}>
            ⏰ Past Follow-Ups (Overdue)
          </h5>
          <Table striped bordered hover responsive className="table-sm align-middle">
            <thead className="sticky-top">
              <tr style={{ backgroundColor: '#f8d7da', color: '#721c24' }} className="text-center">
                <th>S.No</th><th>RA ID</th><th>Tenant Status</th><th>Phone Number</th>
                <th>Follow-Up Status</th><th>Follow-Up Type</th><th>Follow-Up Date</th>
                <th>Follow-up Day</th><th>Admin Name</th><th>Remarks</th><th>Created At</th><th>Edit Followup</th>
              </tr>
            </thead>
            <tbody>
              {followups.filter(item => getFollowUpDayStatus(item.followupDate) === 'Past' && item.followupStatus !== 'Not Interested-Closed' && item.followupStatus !== 'Paid Closed')
                .map((item, index) => renderTableRow(item, index))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Closed Follow-Ups */}
      {followups.filter(item => item.followupStatus === 'Not Interested-Closed' || item.followupStatus === 'Paid Closed').length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h5 className="mb-2" style={{ color: '#6c757d', borderBottom: '2px solid #6c757d', paddingBottom: '8px', fontWeight: '700' }}>
            ✓ Closed Follow-Ups (Not Interested-Closed / Paid Closed)
          </h5>
          <Table striped bordered hover responsive className="table-sm align-middle">
            <thead className="sticky-top">
              <tr style={{ backgroundColor: '#e2e3e5', color: '#383d41' }} className="text-center">
                <th>S.No</th><th>RA ID</th><th>Tenant Status</th><th>Phone Number</th>
                <th>Follow-Up Status</th><th>Follow-Up Type</th><th>Follow-Up Date</th>
                <th>Follow-up Day</th><th>Admin Name</th><th>Remarks</th><th>Created At</th><th>Edit Followup</th>
              </tr>
            </thead>
            <tbody>
              {followups.filter(item => item.followupStatus === 'Not Interested-Closed' || item.followupStatus === 'Paid Closed')
                .map((item, index) => renderTableRow(item, index))}
            </tbody>
          </Table>
        </div>
      )}

      {/* ── Edit Follow-Up Modal ── */}
      {showEditModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 9999,
          overflow: 'auto', padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '8px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)', width: '100%', maxWidth: '550px',
            margin: 'auto', position: 'relative', zIndex: 10000, animation: 'slideDown 0.3s ease'
          }}>
            <button onClick={handleCloseEditModal} style={{
              position: 'absolute', top: '15px', right: '15px', backgroundColor: 'transparent',
              border: 'none', fontSize: '28px', cursor: 'pointer', color: '#666',
              width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>×</button>

            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333', fontSize: '1.5rem', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
              Edit Follow-Up
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>RA ID:</label>
              <input type="text" value={editingFollowUp?.Ra_Id || ''} disabled
                style={{ padding: '10px', width: '100%', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9', color: '#666' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Phone Number:</label>
              <input type="text" value={editingFollowUp?.phoneNumber || ''} disabled
                style={{ padding: '10px', width: '100%', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9', color: '#666' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Follow-up Status:</label>
              <select name="followupStatus" value={editFormData.followupStatus} onChange={handleEditFormChange}
                style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
                <option value="">Select Status</option>
                <option value="Ring">Ring</option>
                <option value="Ready To Pay">Ready To Pay</option>
                <option value="Not Decided">Not Decided</option>
                <option value="Not Interested-Closed">Not Interested-Closed</option>
                <option value="Paid Closed">Paid Closed</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Follow-up Type:</label>
              <select name="followupType" value={editFormData.followupType} onChange={handleEditFormChange}
                style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
                <option value="">Select Type</option>
                <option value="Payment Followup">Payment Followup</option>
                <option value="Data Followup">Data Followup</option>
                <option value="Enquiry Followup">Enquiry Followup</option>
                <option value="Payment Closed">Payment Closed</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Follow-up Date:</label>
              <input type="date" name="followupDate" value={editFormData.followupDate}
                onChange={handleEditFormChange} min={getTodayDateString()}
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
                  style={{
                    padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px',
                    fontSize: '14px', backgroundColor: '#fff', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                  <span>{selectedEditAdminNames.length > 0 ? `${selectedEditAdminNames.length} selected` : 'Select Admin Names'}</span>
                  <span style={{ fontSize: '12px' }}>▼</span>
                </button>
                {showEditAdminDropdown && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    backgroundColor: '#fff', border: '2px solid #007bff', borderRadius: '4px',
                    marginTop: '5px', zIndex: 1000, boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    maxHeight: '250px', overflowY: 'auto'
                  }}>
                    <button type="button" onClick={() => setShowEditAdminDropdown(false)}
                      style={{
                        position: 'absolute', top: '5px', right: '5px', backgroundColor: 'transparent',
                        border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666',
                        width: '24px', height: '24px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', zIndex: 1001
                      }}>×</button>
                    <div style={{ padding: '10px', paddingTop: '30px' }}>
                      {predefinedAdminNames.map(name => (
                        <div key={name} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                          <input type="checkbox" id={`edit_admin_${name}`} checked={selectedEditAdminNames.includes(name)}
                            onChange={() => handleEditAdminNameChange(name)}
                            style={{ marginRight: '8px', cursor: 'pointer', width: '16px', height: '16px' }} />
                          <label htmlFor={`edit_admin_${name}`} style={{ cursor: 'pointer', marginBottom: 0 }}>{name}</label>
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid #ddd', marginTop: '10px', paddingTop: '10px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Add Custom Name:</label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <input type="text" placeholder="Enter custom name" value={customEditAdminName}
                            onChange={(e) => setCustomEditAdminName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomEditAdminName()}
                            style={{ padding: '8px', flex: 1, border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }} />
                          <button onClick={handleAddCustomEditAdminName}
                            style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', minWidth: '40px' }}
                            title="Add custom name">✓</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {selectedEditAdminNames.length > 0 && (
                <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#e7f3ff', borderRadius: '4px', fontSize: '12px', color: '#0066cc' }}>
                  <strong>Selected:</strong> {getFinalEditAdminNames()}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <button onClick={handleCloseEditModal}
                style={{ padding: '10px 25px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Cancel</button>
              <button onClick={handleSaveEdit}
                style={{ padding: '10px 25px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Follow-Up Modal — unchanged */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 9999,
          overflow: 'auto', padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '8px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)', width: '100%', maxWidth: '550px',
            margin: 'auto', position: 'relative', zIndex: 10000, animation: 'slideDown 0.3s ease'
          }}>
            <button onClick={handleCloseCreateModal} style={{
              position: 'absolute', top: '15px', right: '15px', backgroundColor: 'transparent',
              border: 'none', fontSize: '28px', cursor: 'pointer', color: '#666',
              padding: '0', width: '30px', height: '30px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s'
            }}
              onMouseEnter={(e) => e.target.style.color = '#000'}
              onMouseLeave={(e) => e.target.style.color = '#666'}
              title="Close">×</button>

            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333', fontSize: '1.5rem', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
              Create RA Follow-Up
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>RA ID:</label>
              <input type="text" value={createFormData.Ra_Id} disabled
                style={{ padding: '10px', width: '100%', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9', color: '#666' }} />
              <small style={{ color: '#888', marginTop: '3px', display: 'block' }}>RA ID is N/A by default</small>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Phone Number: <span style={{ color: '#dc3545' }}>*</span></label>
              <input type="text" name="phoneNumber" placeholder="Enter phone number"
                value={createFormData.phoneNumber} onChange={handleCreateFormChange}
                style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Follow-up Status: <span style={{ color: '#dc3545' }}>*</span></label>
              <select name="followupStatus" value={createFormData.followupStatus} onChange={handleCreateFormChange}
                style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
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
              <select name="followupType" value={createFormData.followupType} onChange={handleCreateFormChange}
                style={{ padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
                <option value="">Select Type</option>
                <option value="Payment Followup">Payment Followup</option>
                <option value="Data Followup">Data Followup</option>
                <option value="Enquiry Followup">Enquiry Followup</option>
                <option value="Payment Closed">Payment Closed</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Follow-up Date: <span style={{ color: '#dc3545' }}>*</span></label>
              <input type="date" name="followupDate" value={createFormData.followupDate}
                onChange={handleCreateFormChange} min={getTodayDateString()}
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
                  style={{
                    padding: '10px', width: '100%', border: '2px solid #ddd', borderRadius: '4px',
                    fontSize: '14px', backgroundColor: '#fff', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                  <span>{selectedAdminNames.length > 0 ? `${selectedAdminNames.length} selected` : 'Select Admin Names'}</span>
                  <span style={{ fontSize: '12px' }}>▼</span>
                </button>
                {showCreateAdminDropdown && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    backgroundColor: '#fff', border: '2px solid #007bff', borderRadius: '4px',
                    marginTop: '5px', zIndex: 1000, boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    maxHeight: '250px', overflowY: 'auto'
                  }}>
                    <button type="button" onClick={() => setShowCreateAdminDropdown(false)}
                      style={{
                        position: 'absolute', top: '5px', right: '5px', backgroundColor: 'transparent',
                        border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666',
                        padding: '0', width: '24px', height: '24px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', zIndex: 1001
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#000'}
                      onMouseLeave={(e) => e.target.style.color = '#666'}>×</button>
                    <div style={{ padding: '10px', paddingTop: '30px' }}>
                      {predefinedAdminNames.map(name => (
                        <div key={name} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                          <input type="checkbox" id={`admin_${name}`} checked={selectedAdminNames.includes(name)}
                            onChange={() => handleCreateAdminNameChange(name)}
                            style={{ marginRight: '8px', cursor: 'pointer', width: '16px', height: '16px' }} />
                          <label htmlFor={`admin_${name}`} style={{ cursor: 'pointer', marginBottom: 0 }}>{name}</label>
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid #ddd', marginTop: '10px', paddingTop: '10px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Add Custom Name:</label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <input type="text" placeholder="Enter custom name" value={customAdminName}
                            onChange={(e) => setCustomAdminName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomCreateAdminName()}
                            style={{ padding: '8px', flex: 1, border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }} />
                          <button onClick={handleAddCustomCreateAdminName}
                            style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', minWidth: '40px' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                            title="Add custom name">✓</button>
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
              <button onClick={handleCloseCreateModal}
                style={{ padding: '10px 25px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'background-color 0.3s' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}>Cancel</button>
              <button onClick={handleCreateFollowUp}
                style={{ padding: '10px 25px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'background-color 0.3s' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}>Create Follow-Up</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerFollowUps;