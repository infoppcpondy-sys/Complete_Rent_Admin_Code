import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import { FaEdit, FaPlus, FaSave, FaTimes, FaSync, FaShieldAlt } from "react-icons/fa";
import { MdDeleteForever, MdSecurity } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ── All pages mapped from Rent Pondy Sidebar.jsx + Dashboard.jsx ──────────────
const ALL_FILES = [
  // Dashboard
  { key: "Statistics", label: "Daily Report (Staff)", section: "Dashboard" },
  { key: "Rent Property Daily Report", label: "RP Daily Report - Status - Customer care", section: "Dashboard" },
  { key: "Rent Detail DailyReport", label: "RP Daily Request - photo - offer - Address - Login", section: "Dashboard" },
  { key: "Rent Property Payment DailyReport", label: "RP Payment(PayU) Daily Report", section: "Dashboard" },
  { key: "Tenant Assist Payment Daily", label: "Tenant Assist - Payment Daily", section: "Dashboard" },
  // Login User Report
  { key: "Login Report", label: "Login(OTP) Report", section: "Login User Report" },
  { key: "Login Users Datas", label: "Login Users Report", section: "Login User Report" },
  { key: "Users Log", label: "Login User Activity", section: "Login User Report" },
  { key: "Login Separate User", label: "User Login History", section: "Login User Report" },
  { key: "Admin Report", label: "RP General Report (Admin)", section: "Login User Report" },
  // Login Direct
  { key: "Login Verify Directly", label: "Direct Login User", section: "Login Direct" },
  { key: "MyAccount", label: "User - My Account", section: "Login Direct" },
  { key: "RP All Property", label: "RP All Property", section: "Login Direct" },
  { key: "Apply OnDemad Property", label: "Set As On Demand Property", section: "Login Direct" },
  { key: "Set RentId", label: "Set RentId Property", section: "Login Direct" },
  // Notification
  { key: "Admin Notification", label: "User Notification Record", section: "Notification" },
  { key: "Notification Send", label: "Notification Send Form", section: "Notification" },
  // Whatsapp Send
  { key: "Bulk Whatsapp", label: "Bulk Message", section: "Whatsapp Send" },
  { key: "Single Whatsapp", label: "Single Message", section: "Whatsapp Send" },
  // Office Setup
  { key: "Office", label: "Create Office - List", section: "Office Setup" },
  { key: "Users", label: "Create Staff - List", section: "Office Setup" },
  { key: "BuyerPlan", label: "Create Tenant Plan - List", section: "Office Setup" },
  { key: "AddPlan", label: "Create Owners Plan - List", section: "Office Setup" },
  { key: "Payment Type", label: "Add Payment Type - List", section: "Office Setup" },
  { key: "State", label: "Add State - List", section: "Office Setup" },
  { key: "District", label: "Add District - List", section: "Office Setup" },
  { key: "City", label: "Add City - List", section: "Office Setup" },
  { key: "Area", label: "Add Area - List", section: "Office Setup" },
  { key: "Roll", label: "Rolls", section: "Office Setup" },
  { key: "AdminLog", label: "Admin Log Record", section: "Office Setup" },
  { key: "Text Editer", label: "Text Editors T&C - Policy", section: "Office Setup" },
  { key: "AdminSetForm", label: "Admin Set Property", section: "Office Setup" },
  { key: "Get User Profile", label: "RP User Profile", section: "Office Setup" },
  // Marketing Team
  { key: "Add Property Marketing", label: "Add Property (Marketing)", section: "Marketing Team" },
  // Tenant Assistant
  { key: "Matched Property Table", label: "Matched Properties", section: "Tenant Assistant" },
  { key: "Add Buyer Assistance", label: "Add Tenant Assistance", section: "Tenant Assistant" },
  { key: "Get Buyer Assistances", label: "Manage All Tenant Assistance", section: "Tenant Assistant" },
  { key: "Buyer Active Assistant", label: "Approved - Tenant Assistant", section: "Tenant Assistant" },
  { key: "Pending Assistant", label: "Pending - Tenant Assistant", section: "Tenant Assistant" },
  { key: "Buyer Assistant Viewed", label: "Tenant Assistant Viewed User", section: "Tenant Assistant" },
  { key: "Expired Assistant", label: "Expired Assistant", section: "Tenant Assistant" },
  { key: "Removed Tenant", label: "Removed Tenant Assistant", section: "Tenant Assistant" },
  { key: "BaFree Bills", label: "RA Free Bills", section: "Tenant Assistant" },
  { key: "BaPaid Bill", label: "RA Paid Bills", section: "Tenant Assistant" },
  // RENT Property
  { key: "Search Property", label: "Search Property", section: "RENT Property" },
  { key: "Search Pincode", label: "Search Pincode", section: "RENT Property" },
  { key: "Add Property", label: "Add Property", section: "RENT Property" },
  { key: "Manage Property", label: "Manage Properties", section: "RENT Property" },
  { key: "Approved Property", label: "Approved Properties", section: "RENT Property" },
  { key: "PreApproved Property", label: "PreApproved Properties", section: "RENT Property" },
  { key: "Pending Property", label: "Pending Properties", section: "RENT Property" },
  { key: "Removed Property", label: "Removed Properties", section: "RENT Property" },
  { key: "Expire Property", label: "Expired Properties", section: "RENT Property" },
  { key: "Delete Properties", label: "Permanent Deleted Properties", section: "RENT Property" },
  { key: "Feature Property", label: "Featured Properties", section: "RENT Property" },
  { key: "Paid Property", label: "Paid Properties", section: "RENT Property" },
  { key: "Free Property", label: "Free Properties", section: "RENT Property" },
  { key: "Set Property Message", label: "Send Property Message", section: "RENT Property" },
  { key: "Fetch All Address", label: "Get All Properties Address", section: "RENT Property" },
  { key: "Get All Property Datas", label: "Get All Property Data", section: "RENT Property" },
  // RP Property Accounts
  { key: "Free Bills", label: "Free Bills", section: "RP Property Accounts" },
  { key: "Paid Bills", label: "Paid Bills", section: "RP Property Accounts" },
  { key: "Payment Success", label: "Payment Paid Success", section: "RP Property Accounts" },
  { key: "Payment Failed", label: "Payment Paid Failed", section: "RP Property Accounts" },
  { key: "Payment PayNow", label: "Payment Pay Now", section: "RP Property Accounts" },
  { key: "Payment PayLater", label: "Payment Pay Later", section: "RP Property Accounts" },
  { key: "All Bills", label: "All Bills Data", section: "RP Property Accounts" },
  // Mobile view Leads - Ads
  { key: "Upload Groom", label: "Upload Groom", section: "Mobile view Leads - Ads" },
  { key: "Upload Bride", label: "Upload Bride", section: "Mobile view Leads - Ads" },
  { key: "Upload Ads Images", label: "Upload Ads Images", section: "Mobile view Leads - Ads" },
  { key: "Upload Detail Ads Images", label: "Upload Detail Ads Images", section: "Mobile view Leads - Ads" },
  // Customer Care
  { key: "Customer Care", label: "Customer Care", section: "Customer Care" },
  { key: "Contact Form Datas", label: "Contact Us Report", section: "Customer Care" },
  { key: "Help Request Table", label: "User - Need Help", section: "Customer Care" },
  { key: "Report Property Table", label: "Property Reported (User)", section: "Customer Care" },
  { key: "SoldOut Table", label: "Property Reported - Rent Out", section: "Customer Care" },
  // Property List
  { key: "Developer Property", label: "Developer Property", section: "Property List" },
  { key: "Owner Property", label: "Owner Property", section: "Property List" },
  { key: "Promotor Property", label: "Promotor Property", section: "Property List" },
  { key: "Agent Property", label: "Agent Property", section: "Property List" },
  { key: "PostBy Property", label: "PostedBy Properties", section: "Property List" },
  { key: "Py Property", label: "Py Properties", section: "Property List" },
  // Tenant Account
  { key: "Buyer Payment Success", label: "Tenant Assistant Paid Success", section: "Tenant Account" },
  { key: "Buyer Payment Failed", label: "Tenant Assistant Paid Failed", section: "Tenant Account" },
  { key: "Buyer Payment PayNow", label: "Tenant Assistant Pay Now", section: "Tenant Account" },
  { key: "Buyer Payment PayLater", label: "Tenant Assistant Pay Later", section: "Tenant Account" },
  { key: "All Buyer Bills", label: "Manage All RA Bills", section: "Tenant Account" },
  // Business Support
  { key: "Search Data", label: "User Searched History", section: "Business Support" },
  { key: "BuyerList Interest", label: "Tenant List - Interested Owner", section: "Business Support" },
  { key: "Interest Table", label: "Received Interest", section: "Business Support" },
  { key: "Contact Table", label: "Contact Viewed", section: "Business Support" },
  { key: "Called List", label: "Called Owner List", section: "Business Support" },
  { key: "ShortList Favorite Table", label: "Favorite List", section: "Business Support" },
  { key: "ShortList FavoriteRemoved Table", label: "Favorite List - Removed", section: "Business Support" },
  { key: "Viewed Property Table", label: "All Property Viewed History", section: "Business Support" },
  { key: "LastViewed Property", label: "Last Viewed Property", section: "Business Support" },
  { key: "Offers Raised Table", label: "Offers Raised", section: "Business Support" },
  { key: "PhotoRequest Table", label: "Photo Request", section: "Business Support" },
  { key: "Address Request", label: "Get Address Request Data", section: "Business Support" },
  { key: "All Views Datas", label: "All Views Data", section: "Business Support" },
  // Lead Menu
  { key: "Help LoanLead", label: "Help Loan Lead", section: "Lead Menu" },
  { key: "New Property Lead", label: "New Property Lead", section: "Lead Menu" },
  { key: "FreeUser Lead", label: "Free User Lead", section: "Lead Menu" },
  { key: "Groom Click Datas", label: "User Click Groom Data", section: "Lead Menu" },
  { key: "Bride Click Datas", label: "User Click Bride Data", section: "Lead Menu" },
  // No Property Users
  { key: "Without Property User", label: "Per Day Data", section: "No Property Users" },
  { key: "Without 30 Days User", label: "Get 30 Days Data", section: "No Property Users" },
  { key: "Without All Statics", label: "Fetch All Statics", section: "No Property Users" },
  // Business Statics
  { key: "Property Statics", label: "Property Statics", section: "Business Statics" },
  { key: "BuyerStatics", label: "Tenant Statics", section: "Business Statics" },
  { key: "RentId Statics", label: "Rent ID Statics", section: "Business Statics" },
  { key: "Usage Statics", label: "Usage Statics", section: "Business Statics" },
  { key: "User Log", label: "User Log", section: "Business Statics" },
  // Place To Stay
  { key: "Exclusive Location", label: "Place To Stay (Add, Edit, Delete)", section: "Place To Stay" },
  // Follow Ups
  { key: "Property FllowUp", label: "Property Follow Ups", section: "Follow Ups" },
  { key: "All Property FollowUp", label: "All Property Followups Data", section: "Follow Ups" },
  { key: "Buyer FllowUp", label: "All Tenant Followups Data", section: "Follow Ups" },
  { key: "Transfer FllowUps", label: "Transfer FollowUps", section: "Follow Ups" },
  { key: "Transfer Assistant", label: "Transfer Assistant", section: "Follow Ups" },
  // Settings
  { key: "User Roles", label: "Roles & Access", section: "Settings" },
  { key: "Contact Usage", label: "Contact Usage", section: "Settings" },
  { key: "Daily Usage", label: "Daily Usage", section: "Settings" },
  { key: "Limits", label: "Limits", section: "Settings" },
  { key: "Admin Views Table", label: "Admin Views Table", section: "Settings" },
  { key: "Profile", label: "Profile", section: "Settings" },
];

const SECTION_COLORS = {
  "Dashboard": "#3B82F6", "Login User Report": "#8B5CF6", "Login Direct": "#EC4899",
  "Notification": "#F59E0B", "Whatsapp Send": "#25D366", "Office Setup": "#10B981",
  "Marketing Team": "#F97316", "Tenant Assistant": "#06B6D4", "RENT Property": "#F97316",
  "RP Property Accounts": "#84CC16", "Mobile view Leads - Ads": "#A855F7",
  "Customer Care": "#EF4444", "Property List": "#6366F1", "Tenant Account": "#14B8A6",
  "Business Support": "#F43F5E", "Lead Menu": "#A855F7", "No Property Users": "#64748B",
  "Business Statics": "#0EA5E9", "Place To Stay": "#059669", "Follow Ups": "#D97706",
  "Settings": "#DC2626",
};

const groupBySection = (files) => files.reduce((acc, f) => { if (!acc[f.section]) acc[f.section] = []; acc[f.section].push(f); return acc; }, {});

// ── Saves to localStorage AND fires real-time event to Sidebar ────────────────
const notifyPermissionChange = (updatedPermissions) => {
  localStorage.setItem("rolePermissions", JSON.stringify(updatedPermissions));
  window.dispatchEvent(new CustomEvent("permissionsUpdated", { detail: updatedPermissions }));
};

const UserRolls = () => {
  const [rolls, setRolls] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [activeTab, setActiveTab] = useState("roles");
  const [selectedRole, setSelectedRole] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [rollType, setRollType] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [editingRoll, setEditingRoll] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allowedRoles, setAllowedRoles] = useState([]);
  const fileName = "User Roles";
  const printRef = useRef();

  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");

  const grouped = groupBySection(ALL_FILES);
  const sections = Object.keys(grouped);

  useEffect(() => {
    if (reduxAdminName) localStorage.setItem("adminName", reduxAdminName);
    if (reduxAdminRole) localStorage.setItem("adminRole", reduxAdminRole);
  }, [reduxAdminName, reduxAdminRole]);

  useEffect(() => {
    Promise.all([fetchRolls(), fetchPermissions()]).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (adminName && adminRole) {
      axios.post(`${process.env.REACT_APP_API_URL}/record-view`, { userName: adminName, role: adminRole, viewedFile: fileName, viewTime: moment().format("YYYY-MM-DD HH:mm:ss") }).catch(() => {});
      axios.get(`${process.env.REACT_APP_API_URL}/get-role-permissions`).then(res => {
        const rp = res.data.find(p => p.role === adminRole);
        setAllowedRoles(rp?.viewedFiles?.map(f => f.trim()) || []);
      }).catch(() => {});
    }
  }, [adminName, adminRole]);

  const fetchRolls = async () => {
    try { const r = await axios.get(`${process.env.REACT_APP_API_URL}/roll-all-rent`); setRolls(r.data); }
    catch (_) { toast.error("Failed to fetch roles"); }
  };

  const fetchPermissions = async () => {
    try {
      const r = await axios.get(`${process.env.REACT_APP_API_URL}/get-role-permissions`);
      setRolePermissions(r.data); notifyPermissionChange(r.data);
    } catch (_) { const s = localStorage.getItem("rolePermissions"); if (s) setRolePermissions(JSON.parse(s)); }
  };

  const createRoll = async () => {
    if (!rollType.trim()) return toast.error("Role name is required");
    try { const r = await axios.post(`${process.env.REACT_APP_API_URL}/roll-create-rent`, { rollType, createdDate: createDate }); setRolls([...rolls, r.data]); setRollType(""); setCreateDate(""); toast.success("Role created"); }
    catch (_) { toast.error("Failed to create role"); }
  };

  const updateRoll = async () => {
    try {
      const r = await axios.put(`${process.env.REACT_APP_API_URL}/roll-update-rent/${editingRoll._id}`, { rollType, createdDate: createDate });
      setRolls(rolls.map(x => x._id === editingRoll._id ? r.data : x)); setRollType(""); setCreateDate(""); setEditingRoll(null); toast.success("Role updated");
    } catch (_) { toast.error("Failed to update role"); }
  };

  const deleteRoll = async (id) => {
    if (!window.confirm("Delete this role?")) return;
    try { await axios.delete(`${process.env.REACT_APP_API_URL}/roll-delete-rent/${id}`); setRolls(rolls.filter(r => r._id !== id)); toast.success("Role deleted"); }
    catch (_) { toast.error("Failed to delete role"); }
  };

  const editRoll = (roll) => { setEditingRoll(roll); setRollType(roll.rollType); setCreateDate(roll.createdDate); };
  const getFilesForRole = (role) => rolePermissions.find(r => r.role === role)?.viewedFiles || [];
  const isChecked = (role, key) => getFilesForRole(role).includes(key.trim());
  const getGrantedCount = (role) => getFilesForRole(role).length;

  const savePermission = async (role, viewedFiles) => {
    try { await axios.post(`${process.env.REACT_APP_API_URL}/update-role-permissions`, { role, viewedFiles }); }
    catch (_) { toast.error("Failed to save permission"); }
  };

  const handleCheckbox = (role, fileKey) => {
    const k = fileKey.trim();
    const updated = rolePermissions.map(rp => ({ ...rp, viewedFiles: [...(rp.viewedFiles || [])] }));
    const idx = updated.findIndex(r => r.role === role);
    if (idx === -1) { updated.push({ role, viewedFiles: [k] }); }
    else { const has = updated[idx].viewedFiles.includes(k); updated[idx].viewedFiles = has ? updated[idx].viewedFiles.filter(f => f !== k) : [...updated[idx].viewedFiles, k]; }
    setRolePermissions(updated); notifyPermissionChange(updated);
    savePermission(role, updated.find(r => r.role === role)?.viewedFiles || []);
  };

  const handleSelectAllSection = (role, sectionFiles, checked) => {
    const keys = sectionFiles.map(f => f.key.trim());
    const updated = rolePermissions.map(rp => ({ ...rp, viewedFiles: [...(rp.viewedFiles || [])] }));
    const idx = updated.findIndex(r => r.role === role);
    if (idx === -1) { updated.push({ role, viewedFiles: checked ? keys : [] }); }
    else { updated[idx].viewedFiles = checked ? [...new Set([...updated[idx].viewedFiles, ...keys])] : updated[idx].viewedFiles.filter(f => !keys.includes(f)); }
    setRolePermissions(updated); notifyPermissionChange(updated);
    savePermission(role, updated.find(r => r.role === role)?.viewedFiles || []).then(() => toast.success("Section updated"));
  };

  const handleSelectAll = async (role, checked) => {
    const allKeys = ALL_FILES.map(f => f.key.trim());
    const updated = rolePermissions.map(rp => ({ ...rp, viewedFiles: [...(rp.viewedFiles || [])] }));
    const idx = updated.findIndex(r => r.role === role);
    if (idx === -1) { updated.push({ role, viewedFiles: checked ? allKeys : [] }); }
    else { updated[idx].viewedFiles = checked ? allKeys : []; }
    setRolePermissions(updated); notifyPermissionChange(updated);
    setSaving(true);
    try { await axios.post(`${process.env.REACT_APP_API_URL}/update-role-permissions`, { role, viewedFiles: checked ? allKeys : [] }); toast.success(checked ? "All pages granted" : "All pages revoked"); }
    catch (_) { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const isSectionAllChecked = (role, sf) => sf.every(f => isChecked(role, f.key));
  const isSectionPartial = (role, sf) => { const c = sf.filter(f => isChecked(role, f.key)).length; return c > 0 && c < sf.length; };
  const toggleSection = (sec) => setExpandedSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  const filteredFiles = (sf) => !searchFilter.trim() ? sf : sf.filter(f => f.label.toLowerCase().includes(searchFilter.toLowerCase()));
  const filteredRolls = rolls.filter(r => r.rollType.toLowerCase().includes(searchTerm.toLowerCase()));

  const exportToExcel = () => {
    const data = rolls.map((r, i) => ({ SL: i + 1, "Roll Type": r.rollType, "Created Date": moment(r.createdDate).format("YYYY-MM-DD"), "Pages Granted": getGrantedCount(r.rollType) }));
    const ws = XLSX.utils.json_to_sheet(data); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Roles");
    saveAs(new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })], { type: "application/octet-stream" }), `Roles_${moment().format("YYYYMMDD")}.xlsx`);
  };

  if (loading) return <div style={s.center}><Spinner animation="border" variant="success" /></div>;
  if (allowedRoles.length > 0 && !allowedRoles.includes(fileName)) return <div style={s.center}><MdSecurity size={64} color="#ef4444" /><h3>Access Denied</h3></div>;

  return (
    <div style={s.page}>
      <ToastContainer position="top-right" autoClose={2500} />
      <div style={s.header}>
        <div>
          <h2 style={s.title}><FaShieldAlt style={{ marginRight: 10, color: "#1a7c3e" }} />Roles & Access Control</h2>
          <p style={s.subtitle}>Manage roles and control page-level permissions</p>
        </div>
        <div style={s.tabBar}>
          <button style={{ ...s.tabBtn, ...(activeTab === "roles" ? s.tabActive : {}) }} onClick={() => setActiveTab("roles")}>Manage Roles</button>
          <button style={{ ...s.tabBtn, ...(activeTab === "access" ? s.tabActive : {}) }} onClick={() => setActiveTab("access")}>Page Permissions</button>
        </div>
      </div>

      {activeTab === "roles" && (
        <div>
          <div style={s.card}>
            <h5 style={s.cardTitle}>{editingRoll ? "✏️ Edit Role" : "➕ Create New Role"}</h5>
            <div style={s.formRow}>
              <div style={s.formGroup}><label style={s.label}>Role Name</label><input style={s.input} type="text" placeholder="e.g. manager, accountant..." value={rollType} onChange={e => setRollType(e.target.value)} /></div>
              <div style={s.formGroup}><label style={s.label}>Created Date</label><input style={s.input} type="date" value={createDate} onChange={e => setCreateDate(e.target.value)} /></div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <button style={s.btnGreen} onClick={editingRoll ? updateRoll : createRoll}>{editingRoll ? <><FaSave /> Update</> : <><FaPlus /> Create</>}</button>
                {editingRoll && <button style={s.btnGray} onClick={() => { setEditingRoll(null); setRollType(""); setCreateDate(""); }}><FaTimes /> Cancel</button>}
              </div>
            </div>
          </div>
          <div style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h5 style={s.cardTitle}>All Roles ({filteredRolls.length})</h5>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ ...s.input, width: 200 }} placeholder="Search roles..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <button style={s.btnBlue} onClick={exportToExcel}>Export Excel</button>
              </div>
            </div>
            <div ref={printRef} style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead><tr style={{ background: "#f8fafc" }}>
                  <th style={s.th}>#</th><th style={s.th}>Role Name</th><th style={s.th}>Created Date</th>
                  <th style={s.th}>Pages Granted</th><th style={s.th}>Quick Access</th><th style={s.th}>Actions</th>
                </tr></thead>
                <tbody>
                  {filteredRolls.map((roll, idx) => (
                    <tr key={roll._id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafbfc" }}>
                      <td style={s.td}>{idx + 1}</td>
                      <td style={s.td}><span style={s.roleBadge}>{roll.rollType}</span></td>
                      <td style={s.td}>{new Date(roll.createdDate).toLocaleDateString()}</td>
                      <td style={s.td}><span style={s.countBadge}>{getGrantedCount(roll.rollType)} / {ALL_FILES.length}</span></td>
                      <td style={s.td}><button style={s.btnAccess} onClick={() => { setSelectedRole(roll.rollType); setActiveTab("access"); }}><MdSecurity /> Manage Access</button></td>
                      <td style={s.td}>
                        <span style={{ cursor: "pointer", color: "#3B82F6", marginRight: 12 }} onClick={() => editRoll(roll)}><FaEdit size={16} /></span>
                        <span style={{ cursor: "pointer", color: "#EF4444" }} onClick={() => deleteRoll(roll._id)}><MdDeleteForever size={20} /></span>
                      </td>
                    </tr>
                  ))}
                  {filteredRolls.length === 0 && <tr><td colSpan={6} style={{ ...s.td, textAlign: "center", color: "#aaa" }}>No roles found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "access" && (
        <div>
          <div style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h5 style={s.cardTitle}>Select Role to Configure</h5>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {rolls.map(roll => (
                    <button key={roll._id} style={{ ...s.rolePill, ...(selectedRole === roll.rollType ? s.rolePillActive : {}) }} onClick={() => setSelectedRole(roll.rollType)}>
                      {roll.rollType}<span style={s.pillCount}>{getGrantedCount(roll.rollType)}/{ALL_FILES.length}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input style={{ ...s.input, width: 220 }} placeholder="Filter pages..." value={searchFilter} onChange={e => setSearchFilter(e.target.value)} />
                <button style={s.btnBlue} onClick={() => { fetchPermissions(); localStorage.removeItem("rolePermissions"); }}><FaSync /> Refresh</button>
              </div>
            </div>
          </div>

          {!selectedRole ? (
            <div style={s.center}><FaShieldAlt size={48} color="#ccc" /><p style={{ color: "#aaa", marginTop: 12 }}>Select a role above to configure its page access</p></div>
          ) : (
            <div>
              <div style={s.globalBar}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <h5 style={{ margin: 0 }}>Configuring: <span style={{ color: "#1a7c3e" }}>{selectedRole}</span></h5>
                  <span style={s.grantedInfo}>{getGrantedCount(selectedRole)} of {ALL_FILES.length} pages granted</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={s.btnGreen} onClick={() => handleSelectAll(selectedRole, true)} disabled={saving}>✅ Grant All</button>
                  <button style={s.btnRed} onClick={() => handleSelectAll(selectedRole, false)} disabled={saving}>❌ Revoke All</button>
                </div>
              </div>
              {sections.map(section => {
                const sectionFiles = filteredFiles(grouped[section]);
                if (sectionFiles.length === 0) return null;
                const color = SECTION_COLORS[section] || "#6B7280";
                const allChecked = isSectionAllChecked(selectedRole, grouped[section]);
                const partial = isSectionPartial(selectedRole, grouped[section]);
                const isExpanded = expandedSections[section] !== false;
                return (
                  <div key={section} style={s.sectionCard}>
                    <div style={{ ...s.sectionHeader, borderLeftColor: color, cursor: "pointer" }} onClick={() => toggleSection(section)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <input type="checkbox" checked={allChecked} ref={el => { if (el) el.indeterminate = partial; }}
                          onChange={e => { e.stopPropagation(); handleSelectAllSection(selectedRole, grouped[section], !allChecked); }}
                          onClick={e => e.stopPropagation()} style={{ width: 16, height: 16, cursor: "pointer" }} />
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{section}</span>
                        <span style={{ ...s.sectionBadge, background: color }}>{grouped[section].filter(f => isChecked(selectedRole, f.key)).length}/{grouped[section].length}</span>
                      </div>
                      <span style={{ color: "#888", fontSize: 13 }}>{isExpanded ? "▲ Collapse" : "▼ Expand"}</span>
                    </div>
                    {isExpanded && (
                      <div style={s.sectionBody}>
                        {sectionFiles.map(file => (
                          <div key={file.key} style={{ ...s.fileRow, background: isChecked(selectedRole, file.key) ? "#f0fdf4" : "#fff", borderLeft: isChecked(selectedRole, file.key) ? `3px solid ${color}` : "3px solid transparent" }}>
                            <label style={s.fileLabel}>
                              <input type="checkbox" checked={isChecked(selectedRole, file.key)} onChange={() => handleCheckbox(selectedRole, file.key)} style={{ width: 15, height: 15, cursor: "pointer", marginRight: 10 }} />
                              <span style={{ fontSize: 14 }}>{file.label}</span>
                            </label>
                            <span style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>{file.key}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const s = {
  page: { padding: "20px", background: "#F0F2F5", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" },
  center: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 },
  title: { margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a2e" },
  subtitle: { margin: "4px 0 0", color: "#888", fontSize: 14 },
  tabBar: { display: "flex", gap: 4, background: "#fff", borderRadius: 10, padding: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  tabBtn: { border: "none", background: "transparent", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14, color: "#666" },
  tabActive: { background: "#1a7c3e", color: "#fff" },
  card: { background: "#fff", borderRadius: 12, padding: "20px 24px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" },
  cardTitle: { margin: "0 0 16px", fontWeight: 700, fontSize: 16, color: "#333" },
  formRow: { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" },
  formGroup: { display: "flex", flexDirection: "column", flex: 1, minWidth: 200 },
  label: { fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 },
  input: { border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "9px 14px", fontSize: 14, outline: "none" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151", borderBottom: "2px solid #e5e7eb", whiteSpace: "nowrap" },
  td: { padding: "11px 16px", borderBottom: "1px solid #f1f5f9", color: "#374151" },
  roleBadge: { background: "#f0fdf4", color: "#1a7c3e", padding: "3px 10px", borderRadius: 20, fontSize: 13, fontWeight: 600 },
  countBadge: { background: "#eff6ff", color: "#3B82F6", padding: "3px 10px", borderRadius: 20, fontSize: 13, fontWeight: 600 },
  btnGreen: { display: "inline-flex", alignItems: "center", gap: 6, background: "#1a7c3e", color: "#fff", border: "none", padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 },
  btnRed: { display: "inline-flex", alignItems: "center", gap: 6, background: "#ef4444", color: "#fff", border: "none", padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 },
  btnBlue: { display: "inline-flex", alignItems: "center", gap: 6, background: "#3B82F6", color: "#fff", border: "none", padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 },
  btnGray: { display: "inline-flex", alignItems: "center", gap: 6, background: "#6B7280", color: "#fff", border: "none", padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 },
  btnAccess: { display: "inline-flex", alignItems: "center", gap: 6, background: "#f0fdf4", color: "#1a7c3e", border: "1.5px solid #86efac", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 },
  rolePill: { display: "inline-flex", alignItems: "center", gap: 8, background: "#f1f5f9", color: "#374151", border: "2px solid #e2e8f0", padding: "7px 16px", borderRadius: 24, cursor: "pointer", fontWeight: 600, fontSize: 14 },
  rolePillActive: { background: "#1a7c3e", color: "#fff", borderColor: "#1a7c3e" },
  pillCount: { background: "rgba(0,0,0,0.12)", padding: "1px 7px", borderRadius: 12, fontSize: 11 },
  globalBar: { background: "#fff", borderRadius: 10, padding: "14px 20px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  grantedInfo: { background: "#f0fdf4", color: "#1a7c3e", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 },
  sectionCard: { background: "#fff", borderRadius: 10, marginBottom: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", overflow: "hidden" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderLeft: "4px solid #1a7c3e", background: "#fafafa" },
  sectionBadge: { color: "#fff", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700 },
  sectionBody: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 1, padding: "8px 12px 12px" },
  fileRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 6, margin: "2px 0" },
  fileLabel: { display: "flex", alignItems: "center", cursor: "pointer", flex: 1, margin: 0 },
};

export default UserRolls;