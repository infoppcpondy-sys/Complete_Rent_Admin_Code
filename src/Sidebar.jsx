import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  FaSignInAlt, FaClipboardList, FaBell, FaUsers, FaBuilding, FaCar,
  FaMoneyBill, FaMapMarkedAlt, FaFileInvoice, FaTools, FaListAlt,
  FaTrashAlt, FaSearch, FaPlusCircle, FaUserShield, FaFileAlt,
  FaUserCheck, FaUserClock, FaUserTimes, FaDownload, FaChartLine,
  FaUser, FaPhone, FaRegQuestionCircle, FaEye, FaHome, FaWhatsapp, FaPaperPlane,
} from "react-icons/fa";
import {
  RiAccountCircleFill, RiBankCard2Fill, RiBarChart2Fill, RiCaravanFill,
  RiDashboardHorizontalFill, RiExchangeFill, RiFileListFill, RiGroupFill,
  RiHandCoinFill, RiLayoutFill, RiNewspaperFill, RiQuestionAnswerFill,
  RiSettings5Fill, RiShieldUserFill, RiTicket2Fill, RiUserFill,
  RiUserSettingsFill, RiCarFill,
} from "react-icons/ri";
import { FcStatistics } from "react-icons/fc";
import { IoLogInSharp } from "react-icons/io5";
import { MdReport, MdSecurity } from "react-icons/md";
import { FaImages, FaPhotoFilm } from "react-icons/fa6";
import logo from "./Assets/rentpondylogo.png";
import "./App.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [allowedFiles, setAllowedFiles] = useState(null); // null = loading → show all

  const reduxAdminRole = useSelector((state) => state.admin.role);
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");

  // ── Fetch permissions on mount ─────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      // Instant render from cache
      const cached = localStorage.getItem("rolePermissions");
      if (cached) {
        try {
          const perms = JSON.parse(cached);
          const rp = perms.find(p => p.role === adminRole);
          setAllowedFiles(rp?.viewedFiles?.map(f => f.trim()) || []);
        } catch (_) {}
      }
      // Refresh from server
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-role-permissions`);
        localStorage.setItem("rolePermissions", JSON.stringify(res.data));
        const rp = res.data.find(p => p.role === adminRole);
        setAllowedFiles(rp?.viewedFiles?.map(f => f.trim()) || []);
      } catch (_) {}
    };

    // ── Real-time: fires instantly when UserRolls changes a permission ──
    const handlePermissionUpdate = (e) => {
      const perms = e.detail;
      const rp = perms.find(p => p.role === adminRole);
      setAllowedFiles(rp?.viewedFiles?.map(f => f.trim()) || []);
    };

    window.addEventListener("permissionsUpdated", handlePermissionUpdate);

    if (adminRole) load();
    else setAllowedFiles([]);

    return () => {
      window.removeEventListener("permissionsUpdated", handlePermissionUpdate);
    };
  }, [adminRole]);

  const toggleMenu = (id) => setActiveMenu(activeMenu === id ? null : id);

  // can("key") — true while loading (show all), then checks permission
  const can = (key) => allowedFiles === null || allowedFiles.includes(key.trim());

  // Section visible if at least one child is allowed
  const sv = (keys) => keys.some(k => can(k));

  const show = (id) => `collapse ${activeMenu === id ? "show" : ""}`;

  return (
    <div className={`sidebar ${isOpen ? "sidebar-open" : ""} p-3 m-3`}>
      <div className="d-flex align-items-center" style={{ gap: "12px", marginBottom: "20px" }}>
        <img src={logo} alt="Rent Pondy" className="img-fluid" style={{ width: "50px", height: "50px" }} />
        <h1 className="gradient-text" style={{ margin: 0, whiteSpace: "nowrap", fontSize: "24px", fontWeight: "700", letterSpacing: "1px" }}>RENT PONDY</h1>
      </div>
      <hr />
      <nav><ul>

        {/* ── DASHBOARD ── */}
        {sv(["Statistics", "Rent Property Daily Report", "Rent Detail DailyReport", "Rent Property Payment DailyReport", "Tenant Assist Payment Daily"]) && (
          <>
            <li className="p-3 text-white" onClick={() => toggleMenu("dashboard")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <RiDashboardHorizontalFill size={20} style={{ marginRight: "10px" }} />Dashboard
            </li>
            <ul className={show("dashboard")}>
              {can("Statistics") && <li className="p-0 mt-2"><NavLink to="/dashboard/statistics" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FcStatistics size={20} />Daily Report(Staff)</NavLink></li>}
              {can("Rent Property Daily Report") && <li className="p-0 mt-2"><NavLink to="/dashboard/daily-report-rent" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />RP Daily Report - Status - Customer care</NavLink></li>}
              {can("Rent Detail DailyReport") && <li className="p-0 mt-2"><NavLink to="/dashboard/detail-daily-report" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />RP Daily Request - photo - offer - Address - Login</NavLink></li>}
              {can("Rent Property Payment DailyReport") && <li className="p-0 mt-2"><NavLink to="/dashboard/property-payment-daily-report" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />RP Payment(PayU) Daily Report</NavLink></li>}
              {can("Tenant Assist Payment Daily") && <li className="p-0 mt-2"><NavLink to="/dashboard/assist-subscriber" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Tenant Assist - Payment Daily</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── LOGIN USER REPORT ── */}
        {sv(["Login Report", "Login Users Datas", "Users Log", "Login Separate User", "Admin Report"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("report")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <MdReport size={20} style={{ marginRight: "10px" }} />Login User Report
            </li>
            <ul className={show("report")}>
              {can("Login Report") && <li className="p-0 mt-2"><NavLink to="/dashboard/loginreport" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><IoLogInSharp size={20} />Login(OTP) Report</NavLink></li>}
              {can("Login Users Datas") && <li className="p-0 mt-2"><NavLink to="/dashboard/login-user-datas" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUser size={20} />Login Users Report</NavLink></li>}
              {can("Users Log") && <li className="p-0 mt-2"><NavLink to="/dashboard/user-log" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiFileListFill size={20} />Login User Activity</NavLink></li>}
              {can("Login Separate User") && <li className="p-0 mt-2"><NavLink to="/dashboard/separate-login-user" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUser size={20} />User Login History</NavLink></li>}
              {can("Admin Report") && <li className="p-0 mt-2"><NavLink to="/dashboard/adminreport" className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaSignInAlt size={20} />RP General Report (Admin)</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── LOGIN DIRECT ── */}
        {sv(["Login Verify Directly", "MyAccount", "RP All Property", "Apply OnDemad Property", "Set RentId"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("loginDirect")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <MdReport size={20} style={{ marginRight: "10px" }} />Login Direct
            </li>
            <ul className={show("loginDirect")}>
              {can("Login Verify Directly") && <li className="p-0 mt-2"><NavLink to="/dashboard/login-direct-user" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><IoLogInSharp size={20} />Direct Login User</NavLink></li>}
              {can("MyAccount") && <li className="p-0 mt-2"><NavLink to="/dashboard/my-account" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiUserSettingsFill size={20} />User - My Account</NavLink></li>}
              {can("RP All Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/puc-car" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileInvoice />RP All Property</NavLink></li>}
              {can("Apply OnDemad Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/apply-on-demand" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaPlusCircle />Set As On Demand Property</NavLink></li>}
              {can("Set RentId") && <li className="p-0 mt-2"><NavLink to="/dashboard/set-rentId" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileInvoice />Set RentId Property</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── NOTIFICATION ── */}
        {sv(["Admin Notification", "Notification Send"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("notification")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <FaBell size={20} style={{ marginRight: "10px" }} />Notification
            </li>
            <ul className={show("notification")}>
              {can("Admin Notification") && <li className="p-0 mt-2"><NavLink to="/dashboard/admin-notification" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaBell size={20} />User Notification Record</NavLink></li>}
              {can("Notification Send") && <li className="p-0 mt-2"><NavLink to="/dashboard/notification-send" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileAlt />Notification Send Form</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── WHATSAPP SEND ── */}
        {sv(["Bulk Whatsapp", "Single Whatsapp"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("bulk-whatsapp")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <FaWhatsapp style={{ marginRight: "10px" }} />Whatsapp Send
            </li>
            <ul className={show("bulk-whatsapp")}>
              {can("Bulk Whatsapp") && <li className="p-0 mt-2"><NavLink to="/dashboard/bulk-whatsapp" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaPaperPlane />Bulk Message</NavLink></li>}
              {can("Single Whatsapp") && <li className="p-0 mt-2"><NavLink to="/dashboard/single-send-whatsapp" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaWhatsapp />Single Message</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── OFFICE SETUP ── */}
        {sv(["Office", "Users", "BuyerPlan", "AddPlan", "Payment Type", "State", "District", "City", "Area", "Roll", "AdminLog", "Text Editer", "AdminSetForm", "Get User Profile"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("office")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <FaBuilding size={20} style={{ marginRight: "10px" }} />Office Setup
            </li>
            <ul className={show("office")}>
              {can("Office") && <li className="p-0 mt-2"><NavLink to="/dashboard/office" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaBuilding size={20} />Create Office - List</NavLink></li>}
              {can("Users") && <li className="p-0 mt-2"><NavLink to="/dashboard/users" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers size={20} />Create Staff - List</NavLink></li>}
              {can("BuyerPlan") && <li className="p-0 mt-2"><NavLink to="/dashboard/buyerplan" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaClipboardList size={20} />Create Tenant Plan - List</NavLink></li>}
              {can("AddPlan") && <li className="p-0 mt-2"><NavLink to="/dashboard/plan" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaClipboardList size={20} />Create Owners Plan - List</NavLink></li>}
              {can("Payment Type") && <li className="p-0 mt-2"><NavLink to="/dashboard/paymenttype" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaMoneyBill size={20} />Add Payment Type - List</NavLink></li>}
              {can("State") && <li className="p-0 mt-2"><NavLink to="/dashboard/state" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaMapMarkedAlt />Add State - List</NavLink></li>}
              {can("District") && <li className="p-0 mt-2"><NavLink to="/dashboard/district" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaMapMarkedAlt />Add District - List</NavLink></li>}
              {can("City") && <li className="p-0 mt-2"><NavLink to="/dashboard/city" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaMapMarkedAlt />Add City - List</NavLink></li>}
              {can("Area") && <li className="p-0 mt-2"><NavLink to="/dashboard/area" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaMapMarkedAlt />Add Area - List</NavLink></li>}
              {can("Roll") && <li className="p-0 mt-2"><NavLink to="/dashboard/rolls" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUserShield />Rolls</NavLink></li>}
              {can("AdminLog") && <li className="p-0 mt-2"><NavLink to="/dashboard/adminlog" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileAlt />Admin Log Record</NavLink></li>}
              {can("Text Editer") && <li className="p-0 mt-2"><NavLink to="/dashboard/text-editor" className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaPlusCircle />Text Editors T&C - Policy</NavLink></li>}
              {can("AdminSetForm") && <li className="p-0 mt-2"><NavLink to="/dashboard/set-property" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileAlt />Admin Set Property</NavLink></li>}
              {can("Get User Profile") && <li className="p-0 mt-2"><NavLink to="/dashboard/profile-table" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileAlt />RP User Profile</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── MARKETING TEAM ── */}
        {sv(["Add Property Marketing"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("marketingTeam")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <FaUser style={{ marginRight: "10px" }} />Marketing Team
            </li>
            <ul className={show("marketingTeam")}>
              {can("Add Property Marketing") && <li className="p-0 mt-2"><NavLink to="/dashboard/add-property-marketing" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Add Property (Marketing)</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── TENANT ASSISTANT ── */}
        {sv(["Matched Property Table", "Add Buyer Assistance", "Get Buyer Assistances", "Buyer Active Assistant", "Pending Assistant", "Buyer Assistant Viewed", "Expired Assistant", "Removed Tenant", "BaFree Bills", "BaPaid Bill"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("buyerAssistant")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <FaUser style={{ marginRight: "10px" }} />Tenant Assistant
            </li>
            <ul className={show("buyerAssistant")}>
              {can("Matched Property Table") && <li className="p-0 mt-2"><NavLink to="/dashboard/get-matched-properties" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUser />Matched Properties</NavLink></li>}
              {can("Add Buyer Assistance") && <li className="p-0 mt-2"><NavLink to="/dashboard/add-buyer-assistance" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Add Tenant Assistance</NavLink></li>}
              {can("Get Buyer Assistances") && <li className="p-0 mt-2"><NavLink to="/dashboard/get-buyer-assistance" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Manage All Tenant Assistance</NavLink></li>}
              {can("Buyer Active Assistant") && <li className="p-0 mt-2"><NavLink to="/dashboard/active-buyer-assistant" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Approved - Tenant Assistant</NavLink></li>}
              {can("Pending Assistant") && <li className="p-0 mt-2"><NavLink to="/dashboard/pending-assistant" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Pending - Tenant Assistant</NavLink></li>}
              {can("Buyer Assistant Viewed") && <li className="p-0 mt-2"><NavLink to="/dashboard/get-all-buyerlist-viewed" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Tenant Assistant Viewed User</NavLink></li>}
              {can("Expired Assistant") && <li className="p-0 mt-2"><NavLink to="/dashboard/expired-assistant" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Expired Assistant</NavLink></li>}
              {can("Removed Tenant") && <li className="p-0 mt-2"><NavLink to="/dashboard/removed-tenant" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Removed Tenant Assistant</NavLink></li>}
              {can("BaFree Bills") && <li className="p-0 mt-2"><NavLink to="/dashboard/ba-free-bills" className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileAlt />RA Free Bills</NavLink></li>}
              {can("BaPaid Bill") && <li className="p-0 mt-2"><NavLink to="/dashboard/ba-paid-bills" className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileAlt />RA Paid Bills</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── RENT PROPERTY ── */}
        {sv(["Search Property", "Search Pincode", "Add Property", "Manage Property", "Approved Property", "PreApproved Property", "Pending Property", "Removed Property", "Expire Property", "Delete Properties", "Feature Property", "Paid Property", "Free Property", "Set Property Message", "Fetch All Address", "Get All Property Datas"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("ppc")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <FaBuilding size={20} style={{ marginRight: "10px" }} />RENT Property
            </li>
            <ul className={show("ppc")}>
              {can("Search Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/searchcar" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaSearch />Search Property</NavLink></li>}
              {can("Search Pincode") && <li className="p-0 mt-2"><NavLink to="/dashboard/search-pincode" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaSearch />Search Pincode</NavLink></li>}
              {can("Add Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/add-car" className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaPlusCircle />Add Property</NavLink></li>}
              {can("Manage Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/property-list" className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaPlusCircle />Manage Properties</NavLink></li>}
              {can("Approved Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/approved-car" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUserCheck />Approved Properties</NavLink></li>}
              {can("PreApproved Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/preapproved-car" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUserCheck />PreApproved Properties</NavLink></li>}
              {can("Pending Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/pending-car" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUserClock />Pending Properties</NavLink></li>}
              {can("Removed Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/removed-car" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaTrashAlt />Removed Properties</NavLink></li>}
              {can("Expire Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/expire-car" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUserTimes />Expired Properties</NavLink></li>}
              {can("Delete Properties") && <li className="p-0 mt-2"><NavLink to="/dashboard/deleted-properties" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaTrashAlt />Permanent Deleted Properties</NavLink></li>}
              {can("Feature Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/feature-property" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaCar />Featured Properties</NavLink></li>}
              {can("Paid Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/paid-car" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaCar />Paid Properties</NavLink></li>}
              {can("Free Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/free-car" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaCar />Free Properties</NavLink></li>}
              {can("Set Property Message") && <li className="p-0 mt-2"><NavLink to="/dashboard/set-property-message" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaCar />Send Property Message</NavLink></li>}
              {can("Fetch All Address") && <li className="p-0 mt-2"><NavLink to="/dashboard/fetch-all-address" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUser />Get All Properties Address</NavLink></li>}
              {can("Get All Property Datas") && <li className="p-0 mt-2"><NavLink to="/dashboard/get-all-property-datas" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUser />Get All Property Data</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── RP PROPERTY ACCOUNTS ── */}
        {sv(["Free Bills", "Paid Bills", "Payment Success", "Payment Failed", "Payment PayNow", "Payment PayLater", "All Bills"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("accounts")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <FaCar style={{ marginRight: "10px" }} />RP property Accounts
            </li>
            <ul className={show("accounts")}>
              {can("Free Bills") && <li className="p-0 mt-2"><NavLink to="/dashboard/free-bills" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileInvoice />Free Bills</NavLink></li>}
              {can("Paid Bills") && <li className="p-0 mt-2"><NavLink to="/dashboard/paid-bills" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileInvoice />Paid Bills</NavLink></li>}
              {can("Payment Success") && <li className="p-0 mt-2"><NavLink to="/dashboard/payment-success" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileInvoice />Payment Paid Success</NavLink></li>}
              {can("Payment Failed") && <li className="p-0 mt-2"><NavLink to="/dashboard/payment-failed" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileInvoice />Payment Paid Failed</NavLink></li>}
              {can("Payment PayNow") && <li className="p-0 mt-2"><NavLink to="/dashboard/payment-paynow" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileInvoice />Payment Pay Now</NavLink></li>}
              {can("Payment PayLater") && <li className="p-0 mt-2"><NavLink to="/dashboard/payment-paylater" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileInvoice />Payment Pay Later</NavLink></li>}
              {can("All Bills") && <li className="p-0 mt-2"><NavLink to="/dashboard/all-bills" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileInvoice />All Bills Data</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── MOBILE VIEW LEADS - ADS ── */}
        {sv(["Upload Groom", "Upload Bride", "Upload Ads Images", "Upload Detail Ads Images"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("mobileAds")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <FaCar style={{ marginRight: "10px" }} />Mobile view Leads - Ads
            </li>
            <ul className={show("mobileAds")}>
              {can("Upload Groom") && <li className="p-0 mt-2"><NavLink to="/dashboard/upload-images-groom" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaImages />Upload Groom</NavLink></li>}
              {can("Upload Bride") && <li className="p-0 mt-2"><NavLink to="/dashboard/upload-images-bride" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaImages />Upload Bride</NavLink></li>}
              {can("Upload Ads Images") && <li className="p-0 mt-2"><NavLink to="/dashboard/upload-images-ads" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaImages />Upload Ads Images</NavLink></li>}
              {can("Upload Detail Ads Images") && <li className="p-0 mt-2"><NavLink to="/dashboard/upload-images-ads-detail" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaImages />Upload Detail Ads Images</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── CUSTOMER CARE ── */}
        {sv(["Customer Care", "Contact Form Datas", "Help Request Table", "Report Property Table", "SoldOut Table"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("customer")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <FaPhone style={{ marginRight: "10px" }} />Customer Care
            </li>
            <ul className={show("customer")}>
              {can("Customer Care") && <li className="p-0 mt-2"><NavLink to="/dashboard/customer-car" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaCar />Customer Care</NavLink></li>}
              {can("Contact Form Datas") && <li className="p-0 mt-2"><NavLink to="/dashboard/contact-form-datas" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaMoneyBill size={20} />Contact us Report</NavLink></li>}
              {can("Help Request Table") && <li className="p-0 mt-2"><NavLink to="/dashboard/needhelp-table" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />User - Need Help</NavLink></li>}
              {can("Report Property Table") && <li className="p-0 mt-2"><NavLink to="/dashboard/report-property-table" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Property Reported (User)</NavLink></li>}
              {can("SoldOut Table") && <li className="p-0 mt-2"><NavLink to="/dashboard/soldout-table" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Property Reported - Rent out</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── PROPERTY LIST ── */}
        {sv(["Developer Property", "Owner Property", "Promotor Property", "Agent Property", "PostBy Property", "Py Property"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("property")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <FaCar style={{ marginRight: "10px" }} />Property List
            </li>
            <ul className={show("property")}>
              {can("Developer Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/developer-property" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaCar />Developer Property</NavLink></li>}
              {can("Owner Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/dealer-car" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaCar />Owner Property</NavLink></li>}
              {can("Promotor Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/promotor-property" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaCar />Promotor Property</NavLink></li>}
              {can("Agent Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/agent-car" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaCar />Agent Property</NavLink></li>}
              {can("PostBy Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/postby-property" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUser />PostedBy Properties</NavLink></li>}
              {can("Py Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/py-properties" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaListAlt />Py Properties</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── TENANT ACCOUNT ── */}
        {sv(["Buyer Payment Success", "Buyer Payment Failed", "Buyer Payment PayNow", "Buyer Payment PayLater", "All Buyer Bills"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("buyerPayU")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <FaCar style={{ marginRight: "10px" }} />Tenant Account
            </li>
            <ul className={show("buyerPayU")}>
              {can("Buyer Payment Success") && <li className="p-0 mt-2"><NavLink to="/dashboard/payment-success-buyer" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileInvoice />Tenant Assistant Paid Success</NavLink></li>}
              {can("Buyer Payment Failed") && <li className="p-0 mt-2"><NavLink to="/dashboard/payment-failed-buyer" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileInvoice />Tenant Assistant Paid Failed</NavLink></li>}
              {can("Buyer Payment PayNow") && <li className="p-0 mt-2"><NavLink to="/dashboard/payment-paynow-buyer" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileInvoice />Tenant Assistant Pay Now</NavLink></li>}
              {can("Buyer Payment PayLater") && <li className="p-0 mt-2"><NavLink to="/dashboard/payment-paylater-buyer" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileInvoice />Tenant Assistant Pay Later</NavLink></li>}
              {can("All Buyer Bills") && <li className="p-0 mt-2"><NavLink to="/dashboard/all-buyer-bills" className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileAlt />Manage All RA Bills</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── BUSINESS SUPPORT ── */}
        {sv(["Search Data", "BuyerList Interest", "Interest Table", "Contact Table", "Called List", "ShortList Favorite Table", "ShortList FavoriteRemoved Table", "Viewed Property Table", "LastViewed Property", "Offers Raised Table", "PhotoRequest Table", "Address Request", "All Views Datas"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("bussinessSupport")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <FaUser style={{ marginRight: "10px" }} />Bussiness Support Menu
            </li>
            <ul className={show("bussinessSupport")}>
              {can("Search Data") && <li className="p-0 mt-2"><NavLink to="/dashboard/searched-data" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaClipboardList />User Searched History</NavLink></li>}
              {can("BuyerList Interest") && <li className="p-0 mt-2"><NavLink to="/dashboard/buyerlist-interest" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaListAlt />Tenant List - Interested Owner</NavLink></li>}
              {can("Interest Table") && <li className="p-0 mt-2"><NavLink to="/dashboard/interest-table" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Received Interest</NavLink></li>}
              {can("Contact Table") && <li className="p-0 mt-2"><NavLink to="/dashboard/contact-table" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Contact Viewed</NavLink></li>}
              {can("Called List") && <li className="p-0 mt-2"><NavLink to="/dashboard/called-list-datas" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Called Owner List</NavLink></li>}
              {can("ShortList Favorite Table") && <li className="p-0 mt-2"><NavLink to="/dashboard/favorite-table" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Favorite List</NavLink></li>}
              {can("ShortList FavoriteRemoved Table") && <li className="p-0 mt-2"><NavLink to="/dashboard/favorite-removed" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />Favorite List - Removed</NavLink></li>}
              {can("Viewed Property Table") && <li className="p-0 mt-2"><NavLink to="/dashboard/viewed-property" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUsers />All Property Viewed History</NavLink></li>}
              {can("LastViewed Property") && <li className="p-0 mt-2"><NavLink to="/dashboard/last-viewed-property" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaCar />Last Viewed Property</NavLink></li>}
              {can("Offers Raised Table") && <li className="p-0 mt-2"><NavLink to="/dashboard/offers-raised" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileAlt />Offers Raised</NavLink></li>}
              {can("PhotoRequest Table") && <li className="p-0 mt-2"><NavLink to="/dashboard/photo-request" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaRegQuestionCircle />Photo Request</NavLink></li>}
              {can("Address Request") && <li className="p-0 mt-2"><NavLink to="/dashboard/get-all-address-request" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUser />Get Address Request Data</NavLink></li>}
              {can("All Views Datas") && <li className="p-0"><NavLink to="/dashboard/all-views-datas" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaDownload />All Views Data</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── LEAD MENU ── */}
        {sv(["Help LoanLead", "New Property Lead", "FreeUser Lead", "Groom Click Datas", "Bride Click Datas"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("lead")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <RiBankCard2Fill size={20} style={{ marginRight: "10px" }} />Lead Menu
            </li>
            <ul className={show("lead")}>
              {can("Help LoanLead") && <li className="p-0 mt-2"><NavLink to="/dashboard/help-loan-lead" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiQuestionAnswerFill size={20} />Help Loan Lead</NavLink></li>}
              {can("New Property Lead") && <li className="p-0 mt-2"><NavLink to="/dashboard/new-car-lead" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiCarFill size={20} />New Property Lead</NavLink></li>}
              {can("FreeUser Lead") && <li className="p-0 mt-2"><NavLink to="/dashboard/free-user-lead" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiUserFill size={20} />Free User Lead</NavLink></li>}
              {can("Groom Click Datas") && (
                <li className="p-0 mt-2">
                  <NavLink to="/dashboard/groom-click-datas" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}>
                    <span style={{ position: "relative", display: "inline-block", width: "20px", height: "20px" }}>
                      <FaUser style={{ position: "absolute", top: 0, left: 0, fontSize: "18px", color: "white" }} />
                      <FaPhotoFilm style={{ position: "absolute", bottom: -2, right: -2, fontSize: "13px", color: "white" }} />
                    </span>User Click Groom Data
                  </NavLink>
                </li>
              )}
              {can("Bride Click Datas") && (
                <li className="p-0 mt-2">
                  <NavLink to="/dashboard/bride-click-datas" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}>
                    <span style={{ position: "relative", display: "inline-block", width: "20px", height: "20px" }}>
                      <FaUser style={{ position: "absolute", top: 0, left: 0, fontSize: "18px", color: "white" }} />
                      <FaPhotoFilm style={{ position: "absolute", bottom: -2, right: -2, fontSize: "13px", color: "white" }} />
                    </span>User Click Bride Data
                  </NavLink>
                </li>
              )}
            </ul>
          </>
        )}

        {/* ── NO PROPERTY USERS ── */}
        {sv(["Without Property User", "Without 30 Days User", "Without All Statics"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("noPropertyUsers")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <FaBuilding style={{ marginRight: "10px" }} />No Property Users
            </li>
            <ul className={show("noPropertyUsers")}>
              {can("Without Property User") && <li className="p-0 mt-2"><NavLink to="/dashboard/without-property-user" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUser size={20} />Per Day Data</NavLink></li>}
              {can("Without 30 Days User") && <li className="p-0 mt-2"><NavLink to="/dashboard/without-30-days-user" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUser size={20} />Get 30 Days Data</NavLink></li>}
              {can("Without All Statics") && <li className="p-0 mt-2"><NavLink to="/dashboard/without-all-statics" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaUser size={20} />Fetch All Statics</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── BUSINESS STATICS ── */}
        {sv(["Property Statics", "BuyerStatics", "RentId Statics", "Usage Statics", "User Log"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("businessStatics")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <FaChartLine style={{ marginRight: "10px" }} />Business Statics
            </li>
            <ul className={show("businessStatics")}>
              {can("Property Statics") && <li className="p-0 mt-2"><NavLink to="/dashboard/carstatics" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiCarFill size={20} />Property Statics</NavLink></li>}
              {can("BuyerStatics") && <li className="p-0 mt-2"><NavLink to="/dashboard/buyers-statics" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiGroupFill size={20} />Tenant Statics</NavLink></li>}
              {can("RentId Statics") && <li className="p-0 mt-2"><NavLink to="/dashboard/rentid-statics" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiGroupFill size={20} />Rent ID Statics</NavLink></li>}
              {can("Usage Statics") && <li className="p-0 mt-2"><NavLink to="/dashboard/usage-statics" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiBarChart2Fill size={20} />Usage Statics</NavLink></li>}
              {can("User Log") && <li className="p-0 mt-2"><NavLink to="/dashboard/user-log" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiFileListFill size={20} />User Log</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── PLACE TO STAY ── */}
        {sv(["Exclusive Location"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("exclusive-location")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <FaMapMarkedAlt style={{ marginRight: "10px" }} />Place To Stay
            </li>
            <ul className={show("exclusive-location")}>
              {can("Exclusive Location") && <li className="p-0 mt-2"><NavLink to="/dashboard/exclusive-location" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaMapMarkedAlt />Place To Stay (Add, Edit, Delete)</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── FOLLOW UPS ── */}
        {sv(["Property FllowUp", "All Property FollowUp", "Buyer FllowUp", "Transfer FllowUps", "Transfer Assistant"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("followUps")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <RiNewspaperFill size={20} style={{ marginRight: "10px" }} />Follow Ups
            </li>
            <ul className={show("followUps")}>
              {can("Property FllowUp") && <li className="p-0 mt-2"><NavLink to="/dashboard/car-follow-ups" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiCaravanFill size={20} />Property Follow Ups</NavLink></li>}
              {can("All Property FollowUp") && <li className="p-0 mt-2"><NavLink to="/dashboard/followup-list" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaFileInvoice />All Property Followups Data</NavLink></li>}
              {can("Buyer FllowUp") && <li className="p-0 mt-2"><NavLink to="/dashboard/buyers-follow-ups" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiGroupFill size={20} />All Tenant Followups Data</NavLink></li>}
              {can("Transfer FllowUps") && <li className="p-0 mt-2"><NavLink to="/dashboard/transfer-follow-ups" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiExchangeFill size={20} />Transfer FollowUps</NavLink></li>}
              {can("Transfer Assistant") && <li className="p-0 mt-2"><NavLink to="/dashboard/transfer-assistant" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiHandCoinFill size={20} />Transfer Assistant</NavLink></li>}
            </ul>
          </>
        )}

        {/* ── SETTINGS ── */}
        {sv(["User Roles", "Contact Usage", "Daily Usage", "Limits", "Admin Views Table", "Profile"]) && (
          <>
            <li className="p-3 mt-2 text-white" onClick={() => toggleMenu("settings")} style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}>
              <RiSettings5Fill size={20} style={{ marginRight: "10px" }} />Settings
            </li>
            <ul className={show("settings")}>
              {can("User Roles") && <li className="p-0 mt-2"><NavLink to="/dashboard/user-rolls" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><MdSecurity size={20} />Roles & Access</NavLink></li>}
              {can("Contact Usage") && <li className="p-0 mt-2"><NavLink to="/dashboard/contact-usage" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiBarChart2Fill size={20} />Contact Usage</NavLink></li>}
              {can("Daily Usage") && <li className="p-0 mt-2"><NavLink to="/dashboard/daily-usage" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiBarChart2Fill size={20} />Daily Usage</NavLink></li>}
              {can("Limits") && <li className="p-0 mt-2"><NavLink to="/dashboard/limits" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiLayoutFill size={20} />Limits</NavLink></li>}
              {can("Admin Views Table") && <li className="p-0 mt-2"><NavLink to="/dashboard/admin-views" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><FaEye size={20} />Admin Views Table</NavLink></li>}
              {can("Profile") && <li className="p-0 mt-2"><NavLink to="/dashboard/profile" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link rounded" : ""}><RiAccountCircleFill size={20} />Profile</NavLink></li>}
            </ul>
          </>
        )}

      </ul></nav>
    </div>
  );
};

export default Sidebar;