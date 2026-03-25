import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FaBan, FaTrash, FaUndo } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Table, Modal, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const remarksMap = {
  visitor: 'Visitor',
  seller: 'Owner',
  buyer: 'Tenant',
};

const getDisplayRemarks = (r) => remarksMap[r] || r || 'N/A';

// ─────────────────────────────────────────────────────────────
// TableRow
// ─────────────────────────────────────────────────────────────
const TableRow = React.memo(({ item, index, updatingPhones, showConfirmation, onMarkPaid, onMarkRemark }) => {
  const isUpdating = updatingPhones.has(item.phone);

  const fmt       = (d) => (d ? moment(d).format('DD-MM-YYYY') : null);
  const fmtFull   = (d) => (d ? moment(d).format('DD-MM-YYYY HH:mm') : 'N/A');

  const loginDate      = fmtFull(item.loginDate);
  const bannedDate     = fmt(item.bannedDate);
  const deletedDate    = fmt(item.deletedDate);
  const unBannedDate   = fmt(item.unBannedDate);
  const unDeletedDate  = fmt(item.unDeletedDate);
  const conversionDate = fmt(item.conversionDate);
  const updateDate     = fmt(item.updateDate);

  return (
    <tr>
      <td className="border px-4 py-2">{index + 1}</td>
      <td className="border px-4 py-2">{item.phone}</td>
      <td className="border px-4 py-2">{item.otp || 'N/A'}</td>
      <td className="border px-4 py-2">{loginDate}</td>
      <td className="border px-4 py-2">{item.otpStatus}</td>
      <td className="border px-4 py-2">{item.bannedReason || 'N/A'}</td>
      <td className="border px-4 py-2">{item.deleteReason || 'N/A'}</td>

      {/* Banned By / Unbanned By */}
      <td className="border px-4 py-2">
        {item.bannedBy && (
          <div>
            <span className="badge bg-danger me-1">Banned</span>
            {item.bannedBy}{bannedDate ? ` (${bannedDate})` : ''}
          </div>
        )}
        {item.unBannedBy && (
          <div className={item.bannedBy ? 'mt-1' : ''}>
            <span className="badge bg-success me-1">Unbanned</span>
            {item.unBannedBy}{unBannedDate ? ` (${unBannedDate})` : ''}
          </div>
        )}
        {!item.bannedBy && !item.unBannedBy && 'N/A'}
      </td>

      {/* Deleted By / Undeleted By */}
      <td className="border px-4 py-2">
        {item.deletedBy && (
          <div>
            <span className="badge bg-dark me-1">Deleted</span>
            {item.deletedBy}{deletedDate ? ` (${deletedDate})` : ''}
          </div>
        )}
        {item.unDeletedBy && (
          <div className={item.deletedBy ? 'mt-1' : ''}>
            <span className="badge bg-success me-1">Undeleted</span>
            {item.unDeletedBy}{unDeletedDate ? ` (${unDeletedDate})` : ''}
          </div>
        )}
        {!item.deletedBy && !item.unDeletedBy && 'N/A'}
      </td>

      {/* Remark Dropdown */}
      <td className="border px-4 py-2 text-center">
        <select
          className="form-select form-select-sm"
          value={item.remarks || ''}
          onChange={(e) => onMarkRemark(item, e.target.value)}
          disabled={isUpdating}
        >
          <option value="">Select Remark</option>
          <option value="seller">Owner</option>
          <option value="buyer">Tenant</option>
          <option value="visitor">Visitor</option>
        </select>
      </td>

      {/* Remark Status */}
      <td className="border px-4 py-2 text-center">
        {item.remarks === 'seller' && (
          <div>
            <span className="badge bg-primary d-block mb-1">Owner</span>
            {item.updatedBy && <small className="text-muted d-block">{item.updatedBy}{updateDate ? ` (${updateDate})` : ''}</small>}
          </div>
        )}
        {item.remarks === 'buyer' && (
          <div>
            <span className="badge bg-info d-block mb-1">Tenant</span>
            {item.updatedBy && <small className="text-muted d-block">{item.updatedBy}{updateDate ? ` (${updateDate})` : ''}</small>}
          </div>
        )}
        {item.remarks === 'visitor' && (
          <div>
            <span className="badge bg-warning d-block mb-1">Visitor</span>
            {item.updatedBy && <small className="text-muted d-block">{item.updatedBy}{updateDate ? ` (${updateDate})` : ''}</small>}
          </div>
        )}
        {!item.remarks && <span className="badge bg-secondary">No Remark</span>}
      </td>

      {/* Conversion Dropdown */}
      <td className="border px-4 py-2 text-center">
        <select
          className="form-select form-select-sm"
          value={item.conversionStatus || 'pending'}
          onChange={(e) => onMarkPaid(item, e.target.value)}
          disabled={isUpdating}
        >
          <option value="pending">Pending</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </td>

      {/* Conversion Status */}
      <td className="border px-4 py-2 text-center">
        {item.conversionStatus === 'paid' && (
          <div>
            <span className="badge bg-success d-block mb-1">Paid{conversionDate ? ` (${conversionDate})` : ''}</span>
            {item.conversionUpdatedBy && <small className="text-muted d-block">{item.conversionUpdatedBy}</small>}
          </div>
        )}
        {item.conversionStatus === 'free' && (
          <div>
            <span className="badge bg-info d-block mb-1">Free{conversionDate ? ` (${conversionDate})` : ''}</span>
            {item.conversionUpdatedBy && <small className="text-muted d-block">{item.conversionUpdatedBy}</small>}
          </div>
        )}
        {(!item.conversionStatus || item.conversionStatus === 'pending') && (
          <span className="badge bg-secondary">Pending</span>
        )}
      </td>

      {/* Actions */}
      <td className="border px-4 py-2 text-center">
        <div className="d-flex justify-content-center gap-2">
          {item.status === 'banned' ? (
            <button className="btn btn-sm btn-success" title="Unban"
              onClick={() => showConfirmation(item, 'unban')} disabled={isUpdating}>
              <FaUndo />
            </button>
          ) : (
            <button className="btn btn-sm btn-danger" title="Ban"
              onClick={() => showConfirmation(item, 'ban')} disabled={isUpdating}>
              <FaBan />
            </button>
          )}
          {item.status === 'deleted' ? (
            <button className="btn btn-sm btn-success" title="Undelete"
              onClick={() => showConfirmation(item, 'undelete')} disabled={isUpdating}>
              <FaUndo />
            </button>
          ) : (
            <button className="btn btn-sm btn-dark" title="Delete"
              onClick={() => showConfirmation(item, 'delete')} disabled={isUpdating}>
              <FaTrash />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
});

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
const LoginReportTable = () => {
  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  const adminName = reduxAdminName || localStorage.getItem('adminName');
  const adminRole = reduxAdminRole || localStorage.getItem('adminRole');

  const [users, setUsers]                   = useState([]);
  const [loading, setLoading]               = useState(false);
  const [updatingPhones, setUpdatingPhones] = useState(new Set());
  const [allowedRoles, setAllowedRoles]     = useState([]);

  // filters
  const [phoneFilter, setPhoneFilter]         = useState('');
  const [startDate, setStartDate]             = useState('');
  const [endDate, setEndDate]                 = useState('');
  const [statusFilter, setStatusFilter]       = useState('all');
  const [otpStatusFilter, setOtpStatusFilter] = useState('all');
  const [loginModeFilter, setLoginModeFilter] = useState('all');
  const [remarksFilter, setRemarksFilter]     = useState('all');

  // modal
  const [selectedUser, setSelectedUser]         = useState(null);
  const [actionType, setActionType]             = useState('');
  const [confirmAction, setConfirmAction]       = useState(null);
  const [inputValue, setInputValue]             = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const tableRef = useRef();
  const fileName = 'Login Report';

  // ── helpers ──────────────────────────────────────────────

  const normalize = (phone) => String(phone || '').replace(/\D/g, '').slice(-10);

  const setPhoneUpdating = useCallback((phone, on) => {
    setUpdatingPhones((prev) => {
      const next = new Set(prev);
      on ? next.add(phone) : next.delete(phone);
      return next;
    });
  }, []);

  /**
   * updateUser: directly patches a single user in state by phone.
   * No polling to fight — state is the single source of truth after initial load.
   */
  const updateUser = useCallback((phone, fields) => {
    const key = normalize(phone);
    setUsers((prev) =>
      prev.map((u) => (normalize(u.phone) === key ? { ...u, ...fields } : u))
    );
  }, []);

  // ── initial fetch (ONCE only — no polling) ───────────────

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/alls`);
        if (!res.data || !Array.isArray(res.data.data)) return;

        // De-duplicate by phone
        const map = new Map();
        res.data.data.forEach((u) => {
          const phone = u.phone || '';
          if (!phone) return;
          const existing = map.get(phone);
          if (!existing) { map.set(phone, u); return; }

          const pri = (s) => (s === 'verified' ? 2 : s === 'pending' ? 1 : 0);
          const ep = pri(existing.otpStatus);
          const cp = pri(u.otpStatus);
          if (cp > ep) { map.set(phone, u); return; }
          if (cp === ep) {
            const ed = existing.loginDate ? new Date(existing.loginDate) : null;
            const cd = u.loginDate        ? new Date(u.loginDate)        : null;
            let keep = existing;
            if (!ed && cd) keep = u;
            else if (ed && cd && cd > ed) keep = u;
            const other = keep === existing ? u : existing;
            if (other.conversionStatus && other.conversionStatus !== 'pending') {
              keep = {
                ...keep,
                conversionStatus:    other.conversionStatus,
                conversionDate:      other.conversionDate,
                conversionUpdatedBy: other.conversionUpdatedBy,
                conversion:          other.conversion,
              };
            }
            map.set(phone, keep);
          }
        });

        setUsers(Array.from(map.values()));
      } catch (err) {
        console.error('fetchUsers error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    // ← intentionally no interval / no re-fetch
  }, []);

  // ── permissions + record view ────────────────────────────

  useEffect(() => {
    if (reduxAdminName) localStorage.setItem('adminName', reduxAdminName);
    if (reduxAdminRole) localStorage.setItem('adminRole', reduxAdminRole);
  }, [reduxAdminName, reduxAdminRole]);

  useEffect(() => {
    if (!adminName || !adminRole) return;
    axios
      .post(`${process.env.REACT_APP_API_URL}/record-view`, {
        userName: adminName,
        role: adminRole,
        viewedFile: fileName,
        viewTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
      .catch(() => {});
  }, [adminName, adminRole]);

  useEffect(() => {
    if (!adminRole) return;
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-role-permissions`)
      .then((res) => {
        const perm = res.data.find((p) => p.role === adminRole);
        setAllowedRoles(perm?.viewedFiles?.map((f) => f.trim()) || []);
      })
      .catch(() => {});
  }, [adminRole]);

  // ── actions ──────────────────────────────────────────────

  const handleAction = async () => {
    if (!selectedUser || !actionType || !inputValue) return;
    const phone = selectedUser.phone;
    setPhoneUpdating(phone, true);

    const now    = new Date().toISOString();
    const fields =
      actionType === 'ban'
        ? { status: 'banned',  bannedReason: inputValue, bannedDate: now,  bannedBy: adminName }
        : { status: 'deleted', deleteReason: inputValue, deletedDate: now, deletedBy: adminName };

    // snapshot for rollback
    const snap = { ...users.find((u) => u.phone === phone) };

    // update UI immediately
    updateUser(phone, fields);
    setSelectedUser(null);
    setInputValue('');
    setActionType('');
    setShowConfirmModal(false);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/users/${actionType}`, {
        phone,
        adminName,
        reason: inputValue,
      });
    } catch (err) {
      console.error(err);
      alert(`Failed to ${actionType}: ${err.response?.data?.message || err.message}`);
      if (snap.phone) updateUser(phone, snap); // rollback
    } finally {
      setPhoneUpdating(phone, false);
    }
  };

  const handleUndoAction = async (type) => {
    if (!selectedUser) return;
    const phone = selectedUser.phone;
    setPhoneUpdating(phone, true);

    const now    = new Date().toISOString();
    const fields =
      type === 'unban'
        ? { status: 'active',    unBannedBy: adminName,  unBannedDate: now,  bannedDate: null,  bannedReason: null  }
        : { status: 'unDeleted', unDeletedBy: adminName, unDeletedDate: now, deletedDate: null, deleteReason: null  };

    const snap = { ...users.find((u) => u.phone === phone) };

    updateUser(phone, fields);
    setShowConfirmModal(false);
    setSelectedUser(null);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/users/${type}`, { phone, adminName });
    } catch (err) {
      console.error(err);
      alert(`Failed to ${type}: ${err.response?.data?.message || err.message}`);
      if (snap.phone) updateUser(phone, snap);
    } finally {
      setPhoneUpdating(phone, false);
    }
  };

  const handleMarkConversionPaid = useCallback(
    async (user, status) => {
      const phone = user.phone;
      const now   = new Date().toISOString();
      const snap  = {
        conversionStatus:    user.conversionStatus,
        conversionDate:      user.conversionDate,
        conversionUpdatedBy: user.conversionUpdatedBy,
        updateDate:          user.updateDate,
        conversion:          user.conversion,
      };

      setPhoneUpdating(phone, true);
      updateUser(phone, {
        conversionStatus:    status,
        conversion:          status !== 'pending',
        conversionDate:      status !== 'pending' ? now : null,
        conversionUpdatedBy: adminName,
        updateDate:          now,
      });

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/user/update-conversion-status`,
          { phone, adminName, conversionStatus: status }
        );
        if (res.data?.data) {
          const s = res.data.data;
          updateUser(phone, {
            conversionStatus:    s.conversionStatus,
            conversion:          s.conversion,
            conversionDate:      s.conversionDate,
            conversionUpdatedBy: s.conversionUpdatedBy,
            updateDate:          s.updateDate,
          });
        }
      } catch (err) {
        console.error(err);
        alert(`Failed to update conversion: ${err.response?.data?.message || err.message}`);
        updateUser(phone, snap);
      } finally {
        setPhoneUpdating(phone, false);
      }
    },
    [adminName, updateUser, setPhoneUpdating]
  );

  const handleMarkRemark = useCallback(
    async (user, remark) => {
      const phone = user.phone;
      const now   = new Date().toISOString();
      const snap  = {
        remarks:    user.remarks,
        updatedBy:  user.updatedBy,
        updateDate: user.updateDate,
      };

      setPhoneUpdating(phone, true);
      updateUser(phone, { remarks: remark, updatedBy: adminName, updateDate: now });

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/user/update-remarks`,
          { phone, adminName, remarks: remark }
        );
        if (res.data?.data) {
          const s = res.data.data;
          updateUser(phone, { remarks: s.remarks, updatedBy: s.updatedBy, updateDate: s.updateDate });
        }
      } catch (err) {
        console.error(err);
        alert(`Failed to update remarks: ${err.response?.data?.message || err.message}`);
        updateUser(phone, snap);
      } finally {
        setPhoneUpdating(phone, false);
      }
    },
    [adminName, updateUser, setPhoneUpdating]
  );

  // ── modal helpers ────────────────────────────────────────

  const showConfirmation = useCallback((user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setConfirmAction(action);
    setShowConfirmModal(true);
  }, []);

  const executeConfirmedAction = async () => {
    if (confirmAction === 'ban' || confirmAction === 'delete') {
      setShowConfirmModal(false); // reason modal opens
    } else {
      await handleUndoAction(confirmAction);
    }
  };

  const getActionTitle = (a) =>
    ({ ban: 'Ban User', delete: 'Delete User', unban: 'Unban User', undelete: 'Undelete User' }[a] || 'Confirm');

  const getActionMessage = (a, phone) =>
    ({
      ban:      `Are you sure you want to ban user ${phone}?`,
      delete:   `Are you sure you want to delete user ${phone}? This cannot be undone.`,
      unban:    `Are you sure you want to unban user ${phone}?`,
      undelete: `Are you sure you want to restore deleted user ${phone}?`,
    }[a] || `Confirm action on ${phone}?`);

  // ── filters ──────────────────────────────────────────────

  const handleResetFilters = () => {
    setPhoneFilter(''); setStartDate(''); setEndDate('');
    setStatusFilter('all'); setOtpStatusFilter('all');
    setLoginModeFilter('all'); setRemarksFilter('all');
  };

  const filteredUsers = useMemo(() => {
    const q     = phoneFilter.trim().toLowerCase();
    const start = startDate ? moment(startDate, 'YYYY-MM-DD').startOf('day') : null;
    const end   = endDate   ? moment(endDate,   'YYYY-MM-DD').endOf('day')   : null;
    return users.filter((u) => {
      if (statusFilter    !== 'all' && u.status    !== statusFilter)                          return false;
      if (otpStatusFilter !== 'all' && u.otpStatus !== otpStatusFilter)                       return false;
      if (loginModeFilter !== 'all' && (u.loginMode || '').toLowerCase() !== loginModeFilter) return false;
      if (remarksFilter   !== 'all' && u.remarks   !== remarksFilter)                         return false;
      if (q && !u.phone?.toLowerCase().includes(q))                                           return false;
      if (start || end) {
        const m = moment(u.loginDate);
        if (!m.isValid()) return true;
        if (start && m.isBefore(start)) return false;
        if (end   && m.isAfter(end))    return false;
      }
      return true;
    });
  }, [users, statusFilter, otpStatusFilter, loginModeFilter, remarksFilter, phoneFilter, startDate, endDate]);

  // ── export ───────────────────────────────────────────────

  const handlePrint = () => {
    const w = window.open('', '', 'width=1200,height=800');
    w.document.write(`<html><head><title>Print</title>
      <style>body{font-family:Arial;margin:10px}
      table{border-collapse:collapse;width:100%;font-size:12px}
      th,td{border:1px solid #000;padding:6px;text-align:left}th{background:#f0f0f0}</style></head>
      <body><h1 style="text-align:center">RENT PONDY</h1>
      <h2 style="text-align:center">Login Report - ${moment().format('DD-MM-YYYY HH:mm')}</h2>
      <table>${tableRef.current.innerHTML}</table></body></html>`);
    w.document.close();
    w.print();
  };

  const handleExportExcel = () => {
    const data = filteredUsers.map((item, i) => ({
      'S.No': i + 1,
      Phone: item.phone,
      OTP: item.otp || 'N/A',
      'Login Date': moment(item.loginDate).format('DD-MM-YYYY HH:mm'),
      'OTP Status': item.otpStatus,
      Remarks: item.remarks || 'N/A',
      'Banned Reason': item.bannedReason || 'N/A',
      'Deleted Reason': item.deleteReason || 'N/A',
      'Banned By / Unbanned By': [
        item.bannedBy   ? `Banned: ${item.bannedBy} (${moment(item.bannedDate).format('DD-MM-YYYY')})`       : '',
        item.unBannedBy ? `Unbanned: ${item.unBannedBy} (${moment(item.unBannedDate).format('DD-MM-YYYY')})` : '',
      ].filter(Boolean).join(' | ') || 'N/A',
      'Deleted By / Undeleted By': [
        item.deletedBy   ? `Deleted: ${item.deletedBy} (${moment(item.deletedDate).format('DD-MM-YYYY')})`       : '',
        item.unDeletedBy ? `Undeleted: ${item.unDeletedBy} (${moment(item.unDeletedDate).format('DD-MM-YYYY')})` : '',
      ].filter(Boolean).join(' | ') || 'N/A',
      'Remark Status': item.remarks ? getDisplayRemarks(item.remarks) : 'No Remark',
      'Remark Updated By': item.updatedBy || 'N/A',
      'Conversion Status': item.conversionStatus || 'pending',
      'Conversion Date': item.conversionDate ? moment(item.conversionDate).format('DD-MM-YYYY') : 'N/A',
      'Conversion Updated By': item.conversionUpdatedBy || 'N/A',
    }));
    const ws  = XLSX.utils.json_to_sheet(data);
    const wb  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Login Report');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(
      new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      `Login_Report_${moment().format('DD-MM-YYYY')}.xlsx`
    );
  };

  const handleExportPDF = () => {
    if (!filteredUsers.length) { alert('No data to export.'); return; }
    const headers = ['S.No','Phone','Login Date','OTP Status','Banned Reason','Delete Reason','Remark Status','Conversion Status'];
    let html = `<table style="border-collapse:collapse;width:100%;font-size:11px"><thead><tr>
      ${headers.map((h) => `<th style="border:1px solid #000;padding:8px;background:#f0f0f0">${h}</th>`).join('')}
      </tr></thead><tbody>`;
    filteredUsers.forEach((item, i) => {
      html += `<tr>${[
        i + 1, item.phone,
        moment(item.loginDate).format('DD-MM-YYYY HH:mm'),
        item.otpStatus,
        item.bannedReason || 'N/A',
        item.deleteReason || 'N/A',
        item.remarks ? getDisplayRemarks(item.remarks) : 'No Remark',
        item.conversionStatus || 'pending',
      ].map((v) => `<td style="border:1px solid #000;padding:6px">${v}</td>`).join('')}</tr>`;
    });
    html += '</tbody></table>';
    const w = window.open('', '', 'width=1400,height=900');
    w.document.write(`<html><head><title>Login Report PDF</title>
      <style>body{font-family:Arial;margin:10px}th{background:#f0f0f0}
      tr:nth-child(even){background:#f9f9f9}</style></head>
      <body><h1 style="text-align:center">RENT PONDY</h1>
      <h2 style="text-align:center">Login Report - ${new Date().toLocaleString()}</h2>
      <p><strong>Total Records:</strong> ${filteredUsers.length}</p>${html}</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  // ── guard ────────────────────────────────────────────────

  // if (!allowedRoles.includes(fileName)) {
  //   return (
  //     <div className="text-center text-danger font-weight-bold mt-5">
  //       Only admin is allowed to view this file.
  //     </div>
  //   );
  // }

  // ── render ───────────────────────────────────────────────

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Login - OTP - Ban - Report - Delete</h2>

      {/* Filters */}
      <div className="d-flex flex-row gap-2 align-items-center flex-wrap mb-3">
        <input
          type="text" placeholder="Search Phone" value={phoneFilter}
          onChange={(e) => setPhoneFilter(e.target.value)}
          className="form-control" style={{ maxWidth: 200 }}
        />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
          className="form-control" style={{ width: 160 }} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
          className="form-control" style={{ width: 160 }} />

        <div>
          <label className="me-1 fw-medium">OTP Status:</label>
          <select className="border p-2 rounded" value={otpStatusFilter} onChange={(e) => setOtpStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
          </select>
        </div>
        <div>
          <label className="me-1 fw-medium">Login Mode:</label>
          <select className="border p-2 rounded" value={loginModeFilter} onChange={(e) => setLoginModeFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="web">Web</option>
            <option value="app">App</option>
          </select>
        </div>
        <div>
          <label className="me-1 fw-medium">Status:</label>
          <select className="border p-2 rounded" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="reported">Reported</option>
            <option value="banned">Banned</option>
            <option value="deleted">Deleted</option>
            <option value="unReported">UnReported</option>
            <option value="unDeleted">UnDeleted</option>
          </select>
        </div>
        <div>
          <label className="me-1 fw-medium">Remarks:</label>
          <select className="border p-2 rounded" value={remarksFilter} onChange={(e) => setRemarksFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="seller">Owner</option>
            <option value="buyer">Tenant</option>
            <option value="visitor">Visitor</option>
          </select>
        </div>
      </div>

      {/* Confirm Modal (unban / undelete) */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{getActionTitle(confirmAction)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{selectedUser && getActionMessage(confirmAction, selectedUser.phone)}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
          <Button
            variant={confirmAction === 'unban' || confirmAction === 'undelete' ? 'success' : 'primary'}
            onClick={executeConfirmedAction}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reason Input Modal (ban / delete) */}
      {selectedUser && (actionType === 'ban' || actionType === 'delete') && (
        <Modal show onHide={() => { setSelectedUser(null); setInputValue(''); setActionType(''); }} centered>
          <Modal.Header closeButton>
            <Modal.Title>{getActionTitle(actionType)}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              placeholder={`Enter ${actionType === 'ban' ? 'ban' : 'delete'} reason`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="form-control"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setSelectedUser(null); setInputValue(''); setActionType(''); }}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'delete' ? 'danger' : 'primary'}
              onClick={handleAction}
              disabled={!inputValue}
            >
              {actionType === 'ban' ? 'Ban User' : 'Delete User'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex gap-2">
          <span style={{ background: '#6c757d', color: '#fff', padding: '8px 16px', borderRadius: 4, fontWeight: 'bold', fontSize: 14 }}>
            Total: {users.length} Records
          </span>
          <span style={{ background: '#007bff', color: '#fff', padding: '8px 16px', borderRadius: 4, fontWeight: 'bold', fontSize: 14 }}>
            Showing: {filteredUsers.length} Records
          </span>
        </div>
        <div className="d-flex gap-2">
          {[
            { label: 'Reset', bg: '#6c757d', tc: '#fff', fn: handleResetFilters },
            { label: 'Print', bg: '#ff6b61', tc: '#fff', fn: handlePrint },
            { label: 'Excel', bg: '#2e8b57', tc: '#fff', fn: handleExportExcel },
            { label: 'PDF',   bg: '#f0c419', tc: '#000', fn: handleExportPDF },
          ].map((b) => (
            <button key={b.label} onClick={b.fn}
              style={{ background: b.bg, color: b.tc, border: 'none', padding: '8px 12px', borderRadius: 6 }}>
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div ref={tableRef}>
        <Table striped bordered hover responsive className="table-sm align-middle">
          <thead className="sticky-top">
            <tr>
              <th>S.No</th>
              <th>Phone</th>
              <th>OTP</th>
              <th>Login Date</th>
              <th>OTP Status</th>
              <th>Banned Reason</th>
              <th>Deleted Reason</th>
              <th>Banned By / Un Banned By</th>
              <th>Deleted By / Un Deleted By</th>
              <th>Remark</th>
              <th>Remark Status</th>
              <th>Conversion</th>
              <th>Conversion Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="14" className="text-center py-4">Loading...</td></tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((item, index) => (
                <TableRow
                  key={item._id || item.phone}
                  item={item}
                  index={index}
                  updatingPhones={updatingPhones}
                  showConfirmation={showConfirmation}
                  onMarkPaid={handleMarkConversionPaid}
                  onMarkRemark={handleMarkRemark}
                />
              ))
            ) : (
              <tr><td colSpan="14" className="text-center py-4">No records found.</td></tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default LoginReportTable;