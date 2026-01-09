

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaSignInAlt, 
  FaClipboardList, 
  FaBell,
  FaUsers,
  FaBuilding,
  FaCar,
  FaMoneyBill,
  FaMapMarkedAlt,
  FaFileInvoice,
  FaAssistiveListeningSystems,
  FaPhoneAlt,
  FaCogs,
  FaChartBar,
  FaRegUserCircle,
  FaTools,
  FaListAlt,
  FaTrashAlt,
  FaSearch,
  FaPlusCircle,
  FaUserShield,
  FaFileAlt,
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
  FaDownload,
  FaChartLine,
  FaUser,
  FaMoneyBillAlt,
  FaPhone,
  FaRegQuestionCircle,
  FaEye,FaCity,FaUserCog
} from "react-icons/fa";
import { RiAccountCircleFill, RiBankCard2Fill, RiBarChart2Fill, RiCaravanFill, RiCellphoneFill, RiDashboardHorizontalFill, RiExchangeFill, RiFileListFill, RiGroupFill, RiHandCoinFill, RiLayoutFill, RiNewspaperFill, RiQuestionAnswerFill, RiRoadMapFill, RiSettings5Fill, RiShieldUserFill, RiTicket2Fill, RiUserFill, RiUserSettingsFill } from "react-icons/ri";
import { FcStatistics } from "react-icons/fc";
import { IoLogInSharp } from "react-icons/io5";
import { MdReport, MdHelp, MdContactMail , MdBusiness , MdNotifications} from "react-icons/md";
import { BsBuildingGear } from "react-icons/bs";
import { RiCarFill } from 'react-icons/ri';
import logo from "./Assets/rentpondylogo.png"
import "./App.css";
import axios from "axios";
import { FaImages, FaPhotoFilm } from "react-icons/fa6";


const Sidebar = ({ isOpen, toggleSidebar }) => {
const menuItems = [
    {
    title: 'Dashboard',
    icon: <RiDashboardHorizontalFill size={20} style={{ marginRight: '10px' }} />,
    subItems: [
      { label: 'Statistics', path: '/dashboard/statistics', icon: <FcStatistics size={16} /> },
    ],
  },
  {
    title: 'Report',
    icon: <MdReport size={20} style={{ marginRight: '10px' }} />,
    subItems: [
      { label: 'Login Report', path: '/dashboard/loginreport', icon: <IoLogInSharp size={16} /> },
      { label: 'Login Users Datas', path: '/dashboard/login-user-datas', icon: <FaUser size={16} /> },
      { label: ' Login datas Separate Users', path: '/dashboard/separate-login-user', icon: <FaUser size={16} /> },
    ],
  },
  {
    title: 'Notification',
    icon: <FaBell size={20} style={{ marginRight: '10px' }} />,
    subItems: [
      { label: 'Admin Notification', path: '/dashboard/adminnotification' },
    ],
  },
  {
    title: 'Office Setup',
    icon: <FaBuilding  size={20} style={{ marginRight: '10px' }} />,
    subItems: [
      { label: 'Add Office', path: '/dashboard/add-office' },
    ],
  },
  // Add more sections as needed
];
  const [activeMenu, setActiveMenu] = useState(null); // Only one menu can be open at a time

  const toggleMenu = (menuId) => {
    // If clicking the already open menu, close it; otherwise open the new one
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };
  return (
    <div className={`sidebar ${isOpen ? "sidebar-open" : ""} p-3 m-3`}>
      <div  className="d-flex align-items-center"><img src={logo} alt="" className="img-fluid logo-size"/>  
          <h1 className="gradient-text ms-3" style={{color:'linear-gradient(195deg, rgba(73, 241, 185, 1), rgba(16, 183, 100, 1))'}}>RENT</h1>
      </div>
      <hr></hr>
      <nav>
      
        <ul>
   
          <li className="p-3 text-white" 
            onClick={() => toggleMenu('dashboard')}
            style={{borderRadius:"5px", background:"#8BC34A", cursor: "pointer"}}>
      
              <RiDashboardHorizontalFill size={20} style={{marginRight:'10px '}}/>
              Dashboard
          </li>
          <ul className={`collapse ${activeMenu === 'dashboard' ? 'show' : ''}`} id="dashboardMenu">
          <li className="p-0 mt-2" >
            <NavLink 
              to="/dashboard/statistics" 
               onClick={toggleSidebar} 
              className={({ isActive }) => (isActive ? "active-link rounded" : "")}
            >
              <FcStatistics size={20}/>
              Daily Report(Staff)
            </NavLink>
          </li>

  <li className="p-0 mt-2">
    <NavLink  
     to="/dashboard/daily-report-rent" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
     RP Daily Report - Status - Customer care
    </NavLink>
  </li>

   <li className="p-0 mt-2">
    <NavLink  
     to="/dashboard/detail-daily-report" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
     RP  Daily Request - photo - offer - Address - Login 
    </NavLink>
  </li>

   <li className="p-0 mt-2">
    <NavLink  
     to="/dashboard/property-payment-daily-report" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
     RP Payment(PayU) Daily Report 
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/assist-subscriber"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
    Tenant Assist - Payment Daily
    </NavLink>
  </li>

   {/* <li className="p-0 mt-2">
    <NavLink  
     to="/dashboard/property-payment-daily-report" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
     Rent Property Payment Daily Report 
    </NavLink>
  </li> */}
          </ul>

          <li className="p-3 mt-2  text-white" 
            onClick={() => toggleMenu('report')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
      
              <MdReport size={20} style={{marginRight:'10px '}}/>
              Login User Report
          </li>
          <ul className={`collapse ${activeMenu === 'report' ? 'show' : ''}`} id="reportMenu">

          <li className="p-0 mt-2" >
            <NavLink 
              to="/dashboard/loginreport" 
               onClick={toggleSidebar} 
              className={({ isActive }) => (isActive ? "active-link rounded" : "")}
            >
              <IoLogInSharp size={20}/>
              Login(OTP) Report
            </NavLink>
          </li>

           <li className="p-0 mt-2" >
            <NavLink 
              to="/dashboard/login-user-datas" 
               onClick={toggleSidebar} 
              className={({ isActive }) => (isActive ? "active-link rounded" : "")}
            >
              <FaUser size={20}/>
              Login Users Report
            </NavLink>
          </li> 

               <li className="p-0 mt-2">
        <NavLink to="/dashboard/user-log" 
        onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiFileListFill size={20} /> Login user Activity
        </NavLink>
      </li>

          
          <li className="p-0 mt-2" >
            <NavLink 
              to="/dashboard/separate-login-user" 
               onClick={toggleSidebar} 
              className={({ isActive }) => (isActive ? "active-link rounded" : "")}
            >
              <FaUser size={20}/>
              User Login History
            </NavLink>
          </li>


            <li className="p-0 mt-2" >
            <NavLink 
              to="/dashboard/adminreport" 
              className={({ isActive }) => (isActive ? "active-link rounded" : "")}
            >
              <FaSignInAlt size={20}/>
              RP General Report (Admin)
            </NavLink>
          </li>
</ul> 
<li
  className="p-3 mt-2 text-white"
  style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}
  onClick={() => toggleMenu('loginDirect')}
>
  <MdReport size={20} style={{ marginRight: "10px" }} />
  Login Direct
</li>
     <ul className={`collapse ${activeMenu === 'loginDirect' ? 'show' : ''}`} id="LoginDirectMenu">
      
 <li className="p-0 mt-2" >
            <NavLink 
              to="/dashboard/login-direct-user" 
               onClick={toggleSidebar} 
              className={({ isActive }) => (isActive ? "active-link rounded" : "")}
            >
              <IoLogInSharp size={20}/>
              Direct Login User
            </NavLink>
          </li>
          <li className="p-0 mt-2">
        <NavLink to="/dashboard/my-account" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiUserSettingsFill size={20} /> My Account - User
        </NavLink>
      </li>

      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/puc-car"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaFileInvoice />
          RP All Property
        </NavLink>
      </li>

      <li className="p-0 mt-2">
        <NavLink
          to="/dashboard/apply-on-demand"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaPlusCircle />
          Set As On Demand Property
        </NavLink>
      </li>

      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/set-rentId"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaFileInvoice />
          Set RentId Property
        </NavLink>
      </li>
  </ul>


<li className="p-3 mt-2  text-white" 
  onClick={() => toggleMenu('notification')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
           
              <FaBell size={20} style={{marginRight:'10px '}}/>
              Notification
          </li>
<ul className={`collapse ${activeMenu === 'notification' ? 'show' : ''}`} id="NotificationMenu">

          <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/admin-notification"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaBell size={20}/>
          User Notification Record
        </NavLink>
      </li>
     <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/notification-send"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaFileAlt />
        Notification Send Form      
 </NavLink>
      </li>
</ul>
      <li className="p-3 mt-2  text-white" 
        onClick={() => toggleMenu('office')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
     
          <FaBuilding size={20} style={{marginRight:'10px '}}/>
          Office Setup
      </li>
<ul className={`collapse ${activeMenu === 'office' ? 'show' : ''}`} id="OfficeMenu">

      <li className="p-0 mt-2" >
       <NavLink
          to="/dashboard/office"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        > 
          <FaBuilding size={20}/>
          Create Office - List
        </NavLink>
      </li>

      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/users"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaUsers size={20}/>
          Create Staff - List
        </NavLink>
      </li>

  

      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/buyerplan"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaClipboardList size={20}/>
          Create Tenant Plan - List
        </NavLink>
      </li>

      <li className="p-0 mt-2" > 
        <NavLink
          to="/dashboard/plan"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaClipboardList size={20}/>
          Create Owners Plan - List
        </NavLink>
      </li>

      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/paymenttype"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaMoneyBill size={20}/>
          Add Payment Type - List
        </NavLink>
      </li>


      
  
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/state"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaMapMarkedAlt />
          Add State - List
        </NavLink>
      </li>
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/district"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaMapMarkedAlt />
          Add District - List
        </NavLink>
      </li>
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/city"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaMapMarkedAlt />
          Add City - List
        </NavLink>
      </li>
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/area"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaMapMarkedAlt />
          Add Area - List
        </NavLink>
      </li>
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/rolls"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaUserShield />
          Rolls
        </NavLink>
      </li>

      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/adminlog"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaFileAlt />
          Admin Log Record
        </NavLink>
      </li>
     
      <li className="p-0 mt-2">
    <NavLink
        to="/dashboard/text-editor"
        className={({ isActive }) => (isActive ? "active-link rounded" : "")}
      >
        <FaPlusCircle />
     Text Editors T&C - Policy
      </NavLink>
    </li>
            <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/set-property"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaFileAlt />
          Admin Set Property
        </NavLink>
      </li>

 
     
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/profile-table"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaFileAlt />
          RP User Profile
 </NavLink>
      </li>

</ul>




      <li className="p-3 mt-2  text-white" 
        onClick={() => toggleMenu('ppc')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
     
          <FaBuilding size={20} style={{marginRight:'10px '}}/>
          RENT Property
      </li>
<ul className={`collapse ${activeMenu === 'ppc' ? 'show' : ''}`} id="PPCMenu">


     <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/searchcar"
 onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaSearch />
          Search Property
        </NavLink>
      </li>

       <li className="p-0 mt-2">
      <NavLink
        to="/dashboard/add-car"
     
        className={({ isActive }) => (isActive ? "active-link rounded" : "")}
      >
        <FaPlusCircle />
        Add Property
      </NavLink>
    </li> 

    <li className="p-0 mt-2">
    <NavLink
        to="/dashboard/property-list"
        className={({ isActive }) => (isActive ? "active-link rounded" : "")}
      >
        <FaPlusCircle />
        Manage Properties
      </NavLink>
    </li>
 

      


      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/approved-car"
         onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaUserCheck />
          Approved Properties
        </NavLink>
      </li>
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/preapproved-car"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaUserCheck />
          PreApproved Properties
        </NavLink>
      </li>
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/pending-car"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaUserClock />
          Pending Properties
        </NavLink>
      </li>

 <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/removed-car"
        onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaTrashAlt />
          Removed Properties
        </NavLink>
      </li>
   

      <li className="p-0 mt-2">
        <NavLink
          to="/dashboard/expire-car"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaUserTimes />
          Expired Properties
        </NavLink>
      </li>
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/deleted-properties"
        onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaTrashAlt />
        Permenent Deleted Properties
        </NavLink>
      </li>

        <li className="p-0 mt-2">
    <NavLink to="/dashboard/feature-property"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaCar />
      Featured Properties
    </NavLink>
  </li>

      <li className="p-0 mt-2">
    <NavLink to="/dashboard/paid-car"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaCar />
      Paid Properties
    </NavLink>
  </li>

  
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/free-car" 
    onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaCar />
      Free Properties
    </NavLink>
  </li>


<li className="p-0 mt-2">
    <NavLink to="/dashboard/set-property-message" 
    onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaCar />
      Send Property Message
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/fetch-all-address"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUser />
      Get All Properties Address
    </NavLink>
  </li>

 

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/get-all-property-datas"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUser />
      Get All Property Data 
    </NavLink>
  </li>



</ul>




      <li className="p-3 mt-2  text-white" 
        onClick={() => toggleMenu('accounts')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
    
    <FaCar style={{marginRight:'10px '}}/>
    RP property Accounts
</li>
<ul className={`collapse ${activeMenu === 'accounts' ? 'show' : ''}`} id="AccountsMenu">

  
         <li className="p-0 mt-2">
    <NavLink to="/dashboard/free-bills" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileInvoice />
      Free Bills
    </NavLink>
  </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/paid-bills" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileInvoice />
      Paid Bills
    </NavLink>
  </li>

       <li className="p-0 mt-2">
    <NavLink to="/dashboard/payment-success" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileInvoice />
      Payment Paid Success
    </NavLink>
  </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/payment-failed" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileInvoice />
      Payment Paid Failed
    </NavLink>
  </li>

   <li className="p-0 mt-2">
    <NavLink to="/dashboard/payment-paynow" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileInvoice />
      Payment Pay Now
    </NavLink>
  </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/payment-paylater" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileInvoice />
Payment Pay Later
</NavLink>
  </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/all-bills" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileInvoice />
      All Bills Data
    </NavLink>
  </li>
  </ul>

  <li className="p-3 mt-2  text-white" 
        onClick={() => toggleMenu('mobileAds')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
    
    <FaCar style={{marginRight:'10px '}}/>
    Mobile view Leads - Ads
</li>
< ul className={`collapse ${activeMenu === 'mobileAds' ? 'show' : ''}`} id="MobileMenuAds">

      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/upload-images-groom"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaImages />
Upload Groom
 </NavLink>
      </li>


        <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/upload-images-bride"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaImages />
Upload Bride
 </NavLink>
      </li>

        <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/upload-images-ads"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaImages />
Upload Ads Images
 </NavLink>
      </li>

       <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/upload-images-ads-detail"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaImages />
Upload Detail Ads Images
 </NavLink>
      </li>

</ul>

  <li className="p-3 mt-2  text-white" 
    onClick={() => toggleMenu('customer')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
      <FaPhone style={{marginRight:'10px '}}/>
      Customer Care
  </li>

<ul className={`collapse ${activeMenu === 'customer' ? 'show' : ''}`} id="CustomerMenu">

<li className="p-0 mt-2">
    <NavLink to="/dashboard/customer-car"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaCar />
Customer Care   
 </NavLink>
  </li>
      {/* <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/plan"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaClipboardList size={20}/>
          Owners Plan
        </NavLink>
      </li> */}
      
 <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/contact-form-datas"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaMoneyBill size={20}/>
         Contact us Report
        </NavLink>
      </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/needhelp-table"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      User - Need Help
    </NavLink>
  </li><li className="p-0 mt-2">
    <NavLink to="/dashboard/report-property-table"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Property Reported (User)
    </NavLink>
  </li>
 <li className="p-0 mt-2">
    <NavLink to="/dashboard/soldout-table" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Property Reported - Rent out
    </NavLink>
  </li>
</ul>


    


<li className="p-3 mt-2  text-white" 
  onClick={() => toggleMenu('property')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
     
          <FaCar style={{marginRight:'10px '}}/>
          Property List
      </li>

<ul className={`collapse ${activeMenu === 'property' ? 'show' : ''}`} id="PropertyMenu">

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/developer-property"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaCar />
      Developer Property
    </NavLink>
  </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/dealer-car"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaCar />
      Owner Property
    </NavLink>
  </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/promotor-property"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaCar />
      Promotor Property
    </NavLink>
  </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/agent-car"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaCar />
      Agent Property
    </NavLink>
  </li>
    <li className="p-0 mt-2">
    <NavLink to="/dashboard/postby-property"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUser />
      PostedBy Properties
    </NavLink>
  </li> 
     <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/py-properties"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaListAlt />
          Py Properties
        </NavLink>
      </li>
</ul>

  <li className="p-3 mt-2  text-white" 
    onClick={() => toggleMenu('buyerAssistant')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
      <FaUser style={{marginRight:'10px '}}/>
      Tenant Assistant
  </li>
  <ul className={`collapse ${activeMenu === 'buyerAssistant' ? 'show' : ''}`} id="BuyerAssistantMenu">

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/add-buyer-assistance"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
     Add Tenant Assistantce
    </NavLink>
  </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/get-buyer-assistance"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
     Manage All Tenant Assistantce
    </NavLink>
  </li>
   <li className="p-0 mt-2">
    <NavLink to="/dashboard/active-buyer-assistant" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Active - Tenant Assistant
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/pending-assistant"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Pending - Tenant Assistant
    </NavLink>
  </li>

   <li className="p-0 mt-2">
    <NavLink to="/dashboard/get-all-buyerlist-viewed"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Tenant Assistant Viewed User
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/expired-assistant" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Expired Assistant
    </NavLink>
  </li>

</ul>

  <li className="p-3 mt-2  text-white" 
    onClick={() => toggleMenu('buyerPayU')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
     
          <FaCar style={{marginRight:'10px '}}/>
         Tenant Account
      </li>
<ul className={`collapse ${activeMenu === 'buyerPayU' ? 'show' : ''}`} id="BuyerPayUMenu">

       <li className="p-0 mt-2">
    <NavLink to="/dashboard/payment-success-buyer" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileInvoice />
      Tenant Assistant Paid Success
    </NavLink>
  </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/payment-failed-buyer" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileInvoice />
      Tenant Assistant Paid Failed
    </NavLink>
  </li>

   <li className="p-0 mt-2">
    <NavLink to="/dashboard/payment-paynow-buyer" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileInvoice />
      Tenant Assistant Pay Now
    </NavLink>
  </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/payment-paylater-buyer" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileInvoice />
Tenant Assistant Pay Later
</NavLink>
  </li>
<li className="p-0 mt-2">
    <NavLink to="/dashboard/all-buyer-bills" 
    className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileAlt />
     Manage All RA Bills
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/ba-free-bills" 
    className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileAlt />
      RA Free Bills
    </NavLink>
  </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/ba-paid-bills" 
    className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileAlt />
      RA Paid Bills
    </NavLink>
  </li>
</ul>

  <li className="p-3 mt-2  text-white" 
    onClick={() => toggleMenu('bussinessSupport')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
      <FaUser style={{marginRight:'10px '}}/>
      Bussiness Support Menu
  </li>

<ul className={`collapse ${activeMenu === 'bussinessSupport' ? 'show' : ''}`} id="BussinessSupporMenu">

    <li className="p-0 mt-2">
    <NavLink to="/dashboard/searched-data" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaClipboardList />
      User Searched History
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/buyerlist-interest"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaListAlt />
      Tenant List - Interested Owner
    </NavLink>
  </li>


  
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/interest-table"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Received Interest
    </NavLink>
  </li>

 <li className="p-0 mt-2">
    <NavLink to="/dashboard/contact-table"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Contact Viewed
    </NavLink>
  </li>
  
 <li className="p-0 mt-2">
    <NavLink to="/dashboard/called-list-datas"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
     Called Owner List
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/favorite-table"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Favorite List
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/favorite-removed"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Favorite List - Removed 
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/viewed-property"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      All Property Viewed History
    </NavLink>
  </li>
  

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/get-matched-properties" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUser />
      Matched Properties
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/last-viewed-property"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaCar />
      Last Viewed Property
    </NavLink>
  </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/offers-raised"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileAlt />
      Offers Raised
    </NavLink>
  </li>
  
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/photo-request"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaRegQuestionCircle />
      Photo Request
    </NavLink>
  </li>

   <li className="p-0 mt-2">
    <NavLink to="/dashboard/get-all-address-request"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUser />
      Get Address Request Data
    </NavLink>
  </li>
         <li className="p-0" >
         <NavLink
          to="/dashboard/all-views-datas"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaDownload />
All Views Data        </NavLink>
      </li>




</ul>
 

      <li className="p-3 mt-2  text-white" 
        onClick={() => toggleMenu('lead')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>

          <RiBankCard2Fill size={20} style={{marginRight:'10px '}}/> Lead Menu
      </li>
      <ul className={`collapse ${activeMenu === 'lead' ? 'show' : ''}`} id="LeadMenu">

   
      <li className="p-0 mt-2">
        <NavLink to="/dashboard/help-loan-lead"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiQuestionAnswerFill size={20} /> Help Loan Lead
        </NavLink>
      </li>
    
      <li className="p-0 mt-2">
        <NavLink to="/dashboard/new-car-lead" 
         onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiCarFill size={20} /> New Property Lead
        </NavLink>
      </li>
      <li className="p-0 mt-2">
        <NavLink to="/dashboard/free-user-lead"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiUserFill size={20} /> Free User Lead
        </NavLink>
      </li>
 
      
              <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/groom-click-datas"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
  <span style={{ position: 'relative', display: 'inline-block', width: '20px', height: '20px' }}>
    <FaUser style={{ position: 'absolute', top: 0, left: 0, fontSize: '18px', color: 'white' }} />
    <FaPhotoFilm style={{ position: 'absolute', bottom: -2, right: -2, fontSize: '13px', color: 'white' }} />
  </span>User Click Groom Data
 </NavLink>
      </li>


        <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/bride-click-datas"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
   <span style={{ position: 'relative', display: 'inline-block', width: '20px', height: '20px' }}>
    <FaUser style={{ position: 'absolute', top: 0, left: 0, fontSize: '18px', color: 'white' }} />
    <FaPhotoFilm style={{ position: 'absolute', bottom: -2, right: -2, fontSize: '13px', color: 'white' }} />
  </span>
    User Click Bride Data 
</NavLink>
      </li>
</ul>




 


<li className="p-3 mt-2  text-white" 
  onClick={() => toggleMenu('noPropertyUsers')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
 
          <FaBuilding style={{marginRight:'10px '}}/>
          No Property Users
      </li>
<ul className={`collapse ${activeMenu === 'noPropertyUsers' ? 'show' : ''}`} id="NoPropertyUsersMenu">

 <li className="p-0 mt-2">
        <NavLink to="/dashboard/without-property-user" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <FaUser size={20} />  Per Day Data 
        </NavLink>
      </li>

       <li className="p-0 mt-2">
        <NavLink to="/dashboard/without-30-days-user" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <FaUser size={20} />  Get 30 Days Data 
        </NavLink>
      </li>

        <li className="p-0 mt-2">
        <NavLink to="/dashboard/without-all-statics" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <FaUser size={20} />  Fetch All Statics
        </NavLink>
      </li>
</ul>

      
  <li className="p-3 mt-2  text-white" 
    onClick={() => toggleMenu('businessStatics')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
 
          <FaChartLine style={{marginRight:'10px '}}/>
          Business Statics
      </li>
<ul className={`collapse ${activeMenu === 'businessStatics' ? 'show' : ''}`} id="BusinessStaticsMenu">

<li className="p-0 mt-2">
        <NavLink to="/dashboard/carstatics"
          onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiCarFill size={20} /> Property Statics
        </NavLink>
      </li>
      <li className="p-0 mt-2">
        <NavLink to="/dashboard/buyers-statics"
         onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiGroupFill size={20} /> Tenant Statics
        </NavLink>
      </li>
      <li className="p-0 mt-2">
        <NavLink to="/dashboard/rentid-statics"
         onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiGroupFill size={20} /> Rent ID Statics
        </NavLink>
      </li>
      <li className="p-0 mt-2">
        <NavLink to="/dashboard/usage-statics" 
        onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiBarChart2Fill size={20} /> Usage Statics
        </NavLink>
      </li>
      <li className="p-0 mt-2">
        <NavLink to="/dashboard/user-log" 
        onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiFileListFill size={20} /> User Log
        </NavLink>
      </li>

  <li className="p-0 mt-2">
        <NavLink to="/dashboard/contact-usage" 
         onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiBarChart2Fill size={20} /> Contact Usage
        </NavLink>
      </li>
      
      
      <li className="p-0 mt-2">
        <NavLink to="/dashboard/daily-usage" 
         onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiBarChart2Fill size={20} /> Daily Usage
        </NavLink>
      </li>
      
</ul>




    
      
      <li className="p-3 mt-2  text-white" 
        onClick={() => toggleMenu('followUps')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
          <RiNewspaperFill size={20} style={{marginRight:'10px '}}/> Follow Ups
      </li>
      <ul className={`collapse ${activeMenu === 'followUps' ? 'show' : ''}`} id="FollowUpsMenu">

      <li className="p-0 mt-2">
        <NavLink to="/dashboard/car-follow-ups" 
        onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiCaravanFill size={20} /> Property Follow Ups
        </NavLink>
      </li>

<li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/followup-list"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaFileInvoice />
          All FollowUps Data
        </NavLink>
      </li> 
      <li className="p-0 mt-2">
        <NavLink to="/dashboard/buyers-follow-ups"
         onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiGroupFill size={20} /> Tenant Follow Ups
        </NavLink>
      </li>
      <li className="p-0 mt-2">
        <NavLink to="/dashboard/transfer-follow-ups"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiExchangeFill  size={20} /> Transfer FollowUps
        </NavLink>
      </li>

      <li className="p-0 mt-2">
        <NavLink to="/dashboard/transfer-assistant" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiHandCoinFill size={20} /> Transfer Assistant
        </NavLink>
      </li>

</ul>

      <li className="p-3 mt-2  text-white" 
        onClick={() => toggleMenu('settings')}
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
          <RiSettings5Fill size={20} style={{marginRight:'10px '}}/> Settings
      </li>
      <ul className={`collapse ${activeMenu === 'settings' ? 'show' : ''}`} id="SettingsMenu">

      <li className="p-0 mt-2">
        <NavLink to="/dashboard/user-rolls"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiShieldUserFill size={20} /> User Rolls
        </NavLink>
      </li>
      <li className="p-0 mt-2">
        <NavLink to="/dashboard/limits" 
        onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiLayoutFill size={20} /> Limits
        </NavLink>
      </li>


      <li className="p-0 mt-2">
        <NavLink to="/dashboard/admin-views"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <FaEye size={20} /> Admin Views Table
        </NavLink>
      </li>
      <li className="p-0 mt-2">
        <NavLink to="/dashboard/profile"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiAccountCircleFill size={20} /> Profile
        </NavLink>
      </li>

        </ul> 
         </ul> 

      </nav>
    </div>
  );
};

export default Sidebar;














