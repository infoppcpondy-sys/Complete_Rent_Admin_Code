 


import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FaFlag, FaBan, FaTrash, FaUndo, FaCheck } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Table, Modal, Button, Badge } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Memoized table row component for better performance
const TableRow = React.memo(({ item, index, loading, showConfirmation, getStatusBadge }) => {
  const loginDate = useMemo(() => moment(item.loginDate).format('DD-MM-YYYY HH:mm'), [item.loginDate]);
  const updateDate = useMemo(() => item.updatedBy ? moment(item.updateDate).format('DD-MM-YYYY') : null, [item.updateDate, item.updatedBy]);
  const reportDate = useMemo(() => item.reportedBy ? moment(item.reportDate).format('DD-MM-YYYY') : null, [item.reportDate, item.reportedBy]);
  const bannedDate = useMemo(() => item.bannedBy ? moment(item.bannedDate).format('DD-MM-YYYY') : null, [item.bannedDate, item.bannedBy]);
  const deletedDate = useMemo(() => item.deletedBy ? moment(item.deletedDate).format('DD-MM-YYYY') : null, [item.deletedDate, item.deletedBy]);
  const unReportedDate = useMemo(() => item.unReportedBy ? moment(item.unReportedDate).format('DD-MM-YYYY') : null, [item.unReportedDate, item.unReportedBy]);
  const unBannedDate = useMemo(() => item.unBannedBy ? moment(item.unBannedDate).format('DD-MM-YYYY') : null, [item.unBannedDate, item.unBannedBy]);
  const unDeletedDate = useMemo(() => item.unDeletedBy ? moment(item.unDeletedDate).format('DD-MM-YYYY') : null, [item.unDeletedDate, item.unDeletedBy]);

  return (
    <tr>
      <td className="border px-4 py-2">{index + 1}</td>
      <td className="border px-4 py-2">{item.phone}</td>
      <td className="border px-4 py-2">{item.otp || 'N/A'}</td>
      <td className="border px-4 py-2">{loginDate}</td>
      <td className="border px-4 py-2">{item.otpStatus}</td>
      <td className="border px-4 py-2">{item.countryCode}</td>
      <td className="border px-4 py-2">{item.loginMode}</td>
      <td className="border px-4 py-2">{getStatusBadge(item.status || 'active')}</td>
      <td className="border px-4 py-2">
        {item.updatedBy ? `${item.updatedBy} (${updateDate})` : 'N/A'}
      </td>
      <td className="border px-4 py-2">{item.remarks || 'N/A'}</td>
      <td className="border px-4 py-2">{item.bannedReason || 'N/A'}</td>
      <td className="border px-4 py-2">{item.deleteReason || 'N/A'}</td>
      <td className="border px-4 py-2">
        {item.reportedBy ? `${item.reportedBy} (${reportDate})` : 'N/A'}
      </td>
      <td className="border px-4 py-2">
        {item.bannedBy ? `${item.bannedBy} (${bannedDate})` : 'N/A'}
      </td>
      <td className="border px-4 py-2">
        {item.deletedBy ? `${item.deletedBy} (${deletedDate})` : 'N/A'}
      </td>
      <td className="border px-4 py-2">
        {item.unReportedBy ? `${item.unReportedBy} (${unReportedDate})` : 'N/A'}
      </td>
      <td className="border px-4 py-2">
        {item.unBannedBy ? `${item.unBannedBy} (${unBannedDate})` : 'N/A'}
      </td>
      <td className="border px-4 py-2">
        {item.unDeletedBy ? `${item.unDeletedBy} (${unDeletedDate})` : 'N/A'}
      </td>
      <td className="border px-4 py-2">{item.permanentlyLoggedOut ? 'Yes' : 'No'}</td>
      <td className="border px-4 py-2 text-center">
        <div className="d-flex justify-content-center gap-2">
          {(item.status !== 'active' && item.status) && (
            <button 
              className="btn btn-sm btn-primary"
              title="Set Active"
              onClick={() => showConfirmation(item, 'setActive')}
              disabled={loading}
            >
              <FaCheck />
            </button>
          )}
          
          {item.status === 'reported' ? (
            <button 
              className="btn btn-sm btn-success"
              title="Unreport"
              onClick={() => showConfirmation(item, 'unreport')}
              disabled={loading}
            >
              <FaUndo />
            </button>
          ) : (
            <button 
              className="btn btn-sm btn-warning"
              title="Report"
              onClick={() => showConfirmation(item, 'report')}
              disabled={loading}
            >
              <FaFlag />
            </button>
          )}
          
          {item.status === 'banned' ? (
            <button 
              className="btn btn-sm btn-success"
              title="Unban"
              onClick={() => showConfirmation(item, 'unban')}
              disabled={loading}
            >
              <FaUndo />
            </button>
          ) : (
            <button 
              className="btn btn-sm btn-danger"
              title="Ban"
              onClick={() => showConfirmation(item, 'ban')}
              disabled={loading}
            >
              <FaBan />
            </button>
          )}
          
          {item.status === 'deleted' ? (
            <button 
              className="btn btn-sm btn-success"
              title="Undelete"
              onClick={() => showConfirmation(item, 'undelete')}
              disabled={loading}
            >
              <FaUndo />
            </button>
          ) : (
            <button 
              className="btn btn-sm btn-dark"
              title="Delete"
              onClick={() => showConfirmation(item, 'delete')}
              disabled={loading}
            >
              <FaTrash />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
});

const LoginReportTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
const [otpStatusFilter, setOtpStatusFilter] = useState('all');
const [remarksFilter, setRemarksFilter] = useState('all');
  const [loginModeFilter, setLoginModeFilter] = useState('all');

  const handleResetFilters = () => {
    setPhoneFilter('');
    setStartDate('');
    setEndDate('');
    setStatusFilter('all');
    setOtpStatusFilter('all');
    setRemarksFilter('all');
    setLoginModeFilter('all');
  };

  const fetchUsers = async (options = { silent: false }) => {
    if (!options.silent) {
      setLoading(true);
    } else {
      setIsPolling(true);
    }

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/alls`);

      if (!res.data) {
        throw new Error("No data received from server");
      }

      if (!Array.isArray(res.data.data)) {
        throw new Error("Unexpected data format received");
      }

      // Normalize entries by phone: keep a single record per phone.
      // Priority: if any record for a phone has otpStatus 'verified', prefer the latest verified record.
      // Otherwise prefer the latest record by loginDate.
      const normalizeByPhone = (arr) => {
        const map = new Map();
        arr.forEach((u) => {
          const phone = u.phone || '';
          if (!phone) return;

          const existing = map.get(phone);
          if (!existing) {
            map.set(phone, u);
            return;
          }

          const statusPriority = (s) => (s === 'verified' ? 2 : s === 'pending' ? 1 : 0);

          const exPriority = statusPriority(existing.otpStatus);
          const curPriority = statusPriority(u.otpStatus);

          if (curPriority > exPriority) {
            // current has higher otp priority (e.g., verified over pending)
            map.set(phone, u);
            return;
          }

          if (curPriority === exPriority) {
            // choose latest loginDate
            const exDate = existing.loginDate ? new Date(existing.loginDate) : null;
            const curDate = u.loginDate ? new Date(u.loginDate) : null;
            if (!exDate && curDate) {
              map.set(phone, u);
            } else if (exDate && curDate && curDate > exDate) {
              map.set(phone, u);
            }
          }
          // otherwise keep existing
        });

        return Array.from(map.values());
      };

      const normalized = normalizeByPhone(res.data.data);
      setUsers(normalized);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      if (!options.silent) {
        setLoading(false);
      } else {
        setIsPolling(false);
      }
    }
  };

  useEffect(() => {
    fetchUsers(); // fetch once on mount

    // Set up polling interval to refresh data every 15 seconds for real-time count updates
    const refreshInterval = setInterval(() => {
      // silent background refresh - do not toggle the main loading state
      fetchUsers({ silent: true });
    }, 15000);

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
   }, []);

 
const handleSetActiveStatus = async (user) => {
    if (!user) return;
    setLoading(true);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/set-active-status`, {
        phone: user.phone,
        adminName
      });
      await fetchUsers();
      alert(`User ${user.phone} status set to active successfully`);
    } catch (error) {
      console.error('Error setting active status:', error);
      alert(`Failed to set active status: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
      setShowConfirmModal(false); // Add this line to close the modal after action
      setSelectedUser(null); // Also reset the selected user
    }
  };

  const handleAction = async () => {
    if (!selectedUser || !actionType || !inputValue) return;
    setLoading(true);
    try {
      const payload = {
        phone: selectedUser.phone,
        adminName,
        [actionType === 'report' ? 'remarks' : 'reason']: inputValue
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/users/${actionType}`, payload);

      setSelectedUser(null);
      setInputValue('');
      setActionType('');
      setShowConfirmModal(false);
      await fetchUsers();
    } catch (error) {
      console.error(`Error during ${actionType}:`, error);
      alert(`Failed to ${actionType} user: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUndoAction = async (type) => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const endpointMap = {
        unreport: 'unreport',
        unban: 'unban',
        undelete: 'undelete'
      };

      const endpoint = endpointMap[type];
      if (!endpoint) return;

      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/${endpoint}`,
        {
          phone: selectedUser.phone,
          adminName: adminName
        }
      );
      
      await fetchUsers();
      setShowConfirmModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error(`Error during ${type}:`, error);
      alert(`Failed to ${type} user: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };
    const tableRef = useRef();
  
  const handlePrint = () => {
    const printContent = tableRef.current.innerHTML;
    const printWindow = window.open("", "", "width=1200,height=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 10px; }
            h1 { text-align: center; font-size: 24px; margin: 0 0 5px 0; font-weight: bold; }
            h2 { text-align: center; font-size: 14px; margin: 0 0 20px 0; font-weight: bold; color: #333; }
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: left; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <h1>RENT PONDY</h1>
          <h2>Login Report - ${moment().format('DD-MM-YYYY HH:mm')}</h2>
          <table>${printContent}</table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = filteredUsers.map((item, index) => ({
      'S.No': index + 1,
      'Phone': item.phone,
      'OTP': item.otp || 'N/A',
      'Login Date': moment(item.loginDate).format('DD-MM-YYYY HH:mm'),
      'OTP Status': item.otpStatus,
      'Country Code': item.countryCode,
      'Login Mode': item.loginMode,
      'Status': item.status || 'active',
      'Active Status UpdatedBy': item.updatedBy ? `${item.updatedBy} (${moment(item.updateDate).format('DD-MM-YYYY')})` : 'N/A',
      'Remarks': item.remarks || 'N/A',
      'Banned Reason': item.bannedReason || 'N/A',
      'Deleted Reason': item.deleteReason || 'N/A',
      'Reported By': item.reportedBy ? `${item.reportedBy} (${moment(item.reportDate).format('DD-MM-YYYY')})` : 'N/A',
      'Banned By': item.bannedBy ? `${item.bannedBy} (${moment(item.bannedDate).format('DD-MM-YYYY')})` : 'N/A',
      'Deleted By': item.deletedBy ? `${item.deletedBy} (${moment(item.deletedDate).format('DD-MM-YYYY')})` : 'N/A',
      'Un Reported By': item.unReportedBy ? `${item.unReportedBy} (${moment(item.unReportedDate).format('DD-MM-YYYY')})` : 'N/A',
      'Un Banned By': item.unBannedBy ? `${item.unBannedBy} (${moment(item.unBannedDate).format('DD-MM-YYYY')})` : 'N/A',
      'Un Deleted By': item.unDeletedBy ? `${item.unDeletedBy} (${moment(item.unDeletedDate).format('DD-MM-YYYY')})` : 'N/A',
      'Permanently Logged Out': item.permanentlyLoggedOut ? 'Yes' : 'No'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Login Report');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `Login_Report_${moment().format('DD-MM-YYYY')}.xlsx`);
  };

  // Export to PDF using HTML table approach
  const handleExportPDF = () => {
    if (filteredUsers.length === 0) {
      alert('No data to export. Please adjust filters.');
      return;
    }

    // Build HTML table for PDF
    let tableHTML = '<table style="border-collapse: collapse; width: 100%; font-size: 11px;">';
    tableHTML += '<thead><tr>';
    const headers = ['S.No', 'Phone', 'OTP', 'Login Date', 'OTP Status', 'Country Code', 'Login Mode', 'Status', 'Remarks', 'Permanently Logged Out'];
    headers.forEach(header => {
      tableHTML += `<th style="border: 1px solid #000; padding: 8px; background: #f0f0f0; text-align: left; font-weight: bold;">${header}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';

    // Add filtered user data
    filteredUsers.forEach((item, index) => {
      tableHTML += '<tr>';
      const rowData = [
        index + 1,
        item.phone,
        item.otp || 'N/A',
        moment(item.loginDate).format('DD-MM-YYYY HH:mm'),
        item.otpStatus,
        item.countryCode,
        item.loginMode,
        item.status || 'active',
        item.remarks || 'N/A',
        item.permanentlyLoggedOut ? 'Yes' : 'No'
      ];
      rowData.forEach(value => {
        tableHTML += `<td style="border: 1px solid #000; padding: 6px; text-align: left;">${value}</td>`;
      });
      tableHTML += '</tr>';
    });

    tableHTML += '</tbody></table>';

    // Create PDF window
    const pdfWindow = window.open("", "", "width=1400,height=900");
    pdfWindow.document.write(`
      <html>
        <head>
          <title>Login Report PDF - ${new Date().toLocaleString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 10px; }
            h1 { margin: 0 0 5px 0; text-align: center; font-size: 24px; }
            h2 { margin: 0 0 10px 0; text-align: center; font-size: 16px; }
            p { margin: 5px 0; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background: #f0f0f0; font-weight: bold; }
            tr:nth-child(even) { background: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>RENT PONDY</h1>
          <h2>Login Report - ${new Date().toLocaleString()}</h2>
          <p><strong>Total Records:</strong> ${filteredUsers.length}</p>
          ${tableHTML}
        </body>
      </html>
    `);
    pdfWindow.document.close();
    setTimeout(() => {
      pdfWindow.print();
    }, 500);
  };

  // Memoized filtered users for performance - only recalculates when filters or users change
  const filteredUsers = useMemo(() => {
    const phoneFilterTrimmed = phoneFilter.trim().toLowerCase();
    const start = startDate ? moment(startDate, 'YYYY-MM-DD').startOf('day') : null;
    const end = endDate ? moment(endDate, 'YYYY-MM-DD').endOf('day') : null;

    return users.filter(user => {
      // Quick string comparisons first (fastest)
      if (statusFilter !== 'all' && user.status !== statusFilter) return false;
      if (otpStatusFilter !== 'all' && user.otpStatus !== otpStatusFilter) return false;
      if (loginModeFilter !== 'all' && (user.loginMode || '').toLowerCase() !== loginModeFilter) return false;
      if (remarksFilter !== 'all' && user.remarks !== remarksFilter) return false;
      if (phoneFilterTrimmed && !user.phone?.toLowerCase().includes(phoneFilterTrimmed)) return false;

      // Date comparison (slower, do last)
      if (start || end) {
        const loginMoment = moment(user.loginDate);
        if (!loginMoment.isValid()) return true;
        if (start && loginMoment.isBefore(start)) return false;
        if (end && loginMoment.isAfter(end)) return false;
      }

      return true;
    });
  }, [users, statusFilter, otpStatusFilter, loginModeFilter, remarksFilter, phoneFilter, startDate, endDate]);

  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
  
  const [allowedRoles, setAllowedRoles] = useState([]);
  
  const fileName = "Login Report";

  useEffect(() => {
    if (reduxAdminName) localStorage.setItem("adminName", reduxAdminName);
    if (reduxAdminRole) localStorage.setItem("adminRole", reduxAdminRole);
  }, [reduxAdminName, reduxAdminRole]);

  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-view`, {
          userName: adminName,
          role: adminRole,
          viewedFile: fileName,
          viewTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
      } catch {}
    };
    if (adminName && adminRole) recordDashboardView();
  }, [adminName, adminRole]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-role-permissions`);
        const rolePermissions = res.data.find((perm) => perm.role === adminRole);
        const viewed = rolePermissions?.viewedFiles?.map(f => f.trim()) || [];
        setAllowedRoles(viewed);
      } catch {} finally {
        setLoading(false);
      }
    };
    if (adminRole) fetchPermissions();
  }, [adminRole]);

  const getActionTitle = (action) => {
    const titles = {
      report: 'Report User',
      ban: 'Ban User',
      delete: 'Delete User',
      unreport: 'Unreport User',
      unban: 'Unban User',
      undelete: 'Undelete User',
      setActive: 'Set Active Status'
    };
    return titles[action] || 'Confirm Action';
  };

  const getActionMessage = (action, phone) => {
    const messages = {
      report: `Are you sure you want to report user ${phone}?`,
      ban: `Are you sure you want to ban user ${phone}?`,
      delete: `Are you sure you want to delete user ${phone}? This action cannot be undone.`,
      unreport: `Are you sure you want to remove report from user ${phone}?`,
      unban: `Are you sure you want to unban user ${phone}?`,
      undelete: `Are you sure you want to restore deleted user ${phone}?`,
      setActive: `Are you sure you want to set user ${phone} status to active? This will clear all restrictions.`
    };
    return messages[action] || `Are you sure you want to perform this action on user ${phone}?`;
  };

  const showConfirmation = useCallback((user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setConfirmAction(action);
    setShowConfirmModal(true);
  }, []);


 

  const executeConfirmedAction = async () => {
  try {
    if (confirmAction === 'setActive') {
      await handleSetActiveStatus(selectedUser);
    } else if (confirmAction === 'report' || confirmAction === 'ban' || confirmAction === 'delete') {
      await handleAction(); // <-- FIX: this runs the correct logic and includes adminName
    } else {
      await handleUndoAction(confirmAction);
    }
  } catch (error) {
    console.error('Error in executeConfirmedAction:', error);
  } finally {
    setShowConfirmModal(false); // Ensure modal is closed
  }
};


  const getStatusBadge = useCallback((status) => {
    const variants = {
      active: 'success',
      reported: 'warning',
      banned: 'danger',
      deleted: 'dark'
    };
    return <Badge bg={variants[status] || 'primary'}>{status || 'active'}</Badge>;
  }, []);

  if (!allowedRoles.includes(fileName)) {
    return (
      <div className="text-center text-danger font-weight-bold mt-5">
        Only admin is allowed to view this file.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Login  - OTP - Ban - Report - Delete</h2>
      <div className="d-flex flex-row gap-2 align-items-center flex-nowrap">
        <input
          type="text"
          placeholder="Search Phone"
          value={phoneFilter}
          onChange={e => setPhoneFilter(e.target.value)}
          className="form-control"
          style={{ maxWidth: '200px' }}
        />

        <input 
          style={{width:"200px"}}
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="form-control"
        />

        <input 
          style={{width:"200px"}}
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="form-control"
        />
                <div className="mb-4">
          <label className="mr-2 font-medium">Filter by OTP Status:</label>
           <select className="border p-2 rounded"
  value={otpStatusFilter}
  onChange={(e) => setOtpStatusFilter(e.target.value)}
>
  <option value="all">All</option>
  <option value="pending">Pending</option>
  <option value="verified">Verified</option>
</select>
</div>
                <div className="mb-4">
                  <label className="mr-2 font-medium">Filter by Login Mode:</label>
                  <select value={loginModeFilter} onChange={e => setLoginModeFilter(e.target.value)} className="border p-2 rounded">
                    <option value="all">All</option>
                    <option value="web">Web</option>
                    <option value="app">App</option>
                  </select>
                </div>
        <div className="mb-4">
          <label className="mr-2 font-medium">Filter by Status:</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border p-2 rounded">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="reported">Reported</option>
            <option value="banned">Banned</option>
            <option value="deleted">Deleted</option>
            <option value="unReported">UnReported</option>
            <option value="unDeleted">UnDeleted</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="mr-2 font-medium">Filter by Remarks:</label>
          <select value={remarksFilter} onChange={e => setRemarksFilter(e.target.value)} className="border p-2 rounded">
            <option value="all">All</option>
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
            <option value="visitor">Visitor</option>
          </select>
        </div>
        {}
      </div>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{getActionTitle(confirmAction)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && getActionMessage(confirmAction, selectedUser.phone)}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={
              confirmAction?.includes('un') ? 'success' : 
              confirmAction === 'delete' ? 'danger' : 
              confirmAction === 'setActive' ? 'primary' : 'primary'
            }
            onClick={executeConfirmedAction}
            disabled={loading}
          >
            {loading ? 'Processing...' : 
             confirmAction?.includes('un') ? 'Confirm Restore' : 
             confirmAction === 'delete' ? 'Confirm Delete' : 
             confirmAction === 'setActive' ? 'Set Active' : 'Confirm'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Action Input Modal */}
      {selectedUser && (actionType === 'report' || actionType === 'ban' || actionType === 'delete') && (
        <Modal show={true} onHide={() => setSelectedUser(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{getActionTitle(actionType)}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {actionType === 'report' ? (
              <select
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="form-select mb-3"
              >
                <option value="">-- Select Remark --</option>
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
                <option value="visitor">Visitor</option>
              </select>
            ) : (
              <input
                type="text"
                placeholder={`Enter ${actionType === 'ban' ? 'ban' : 'delete'} reason`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="form-control mb-3"
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedUser(null)}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'delete' ? 'danger' : 'primary'}
              onClick={handleAction}
              disabled={!inputValue || loading}
            >
              {loading ? 'Processing...' : 
               actionType === 'report' ? 'Report User' : 
               actionType === 'ban' ? 'Ban User' : 'Delete User'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

<div ref={tableRef}>

      {/* Display filtered results count */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div className="d-flex align-items-center gap-2">
          <div style={{ 
            background: '#6c757d', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '4px', 
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            Total: {users.length} Records
          </div>
          <div style={{ 
            background: '#007bff', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '4px', 
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            Showing: {filteredUsers.length} Records
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={handleResetFilters}
            style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6 }}
          >
            Reset
          </button>

          <button
            onClick={handlePrint}
            style={{ background: '#ff6b61', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6 }}
          >
            Print
          </button>

          <button
            onClick={handleExportExcel}
            style={{ background: '#2e8b57', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6 }}
          >
            Excel
          </button>

          <button
            onClick={handleExportPDF}
            style={{ background: '#f0c419', color: '#000', border: 'none', padding: '8px 12px', borderRadius: 6 }}
          >
            PDF
          </button>
        </div>
      </div>

      <Table striped bordered hover responsive className="table-sm align-middle">
        <thead className="sticky-top">
          <tr>
            <th className="border px-4 py-2">S.No</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">OTP</th>
            <th className="border px-4 py-2">Login Date</th>
            <th className="border px-4 py-2">OTP Status</th>
            <th className="border px-4 py-2">Country Code</th>
            <th className="border px-4 py-2">Login Mode</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Active Status UpdatedBy</th>
            <th className="border px-4 py-2">Remarks</th>
                        <th className="border px-4 py-2">Banned Reason</th>
                        <th className="border px-4 py-2">Deleted Reason</th>

            <th className="border px-4 py-2">Reported By</th>
            <th className="border px-4 py-2">Banned By</th>
            <th className="border px-4 py-2">Deleted By</th>
            <th className="border px-4 py-2">Un Reported By</th>
            <th className="border px-4 py-2">Un Banned By</th>
            <th className="border px-4 py-2">Un Deleted By</th>
            <th className="border px-4 py-2">Permanently Logged Out</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
            {loading ? (
    <tr>
      <td className="border px-4 py-2 text-center" colSpan="21">
        Loading...
      </td>
    </tr>
  ) : filteredUsers.length > 0 ? (
          filteredUsers.map((item, index) => (
            <TableRow
              key={item._id}
              item={item}
              index={index}
              loading={loading}
              showConfirmation={showConfirmation}
              getStatusBadge={getStatusBadge}
            />
          ))
        ) : (
            <tr>
              <td className="border px-4 py-2 text-center" colSpan="21">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
    </div>
  );
};

export default LoginReportTable;

