

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
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };
  return (
    <div className={`sidebar ${isOpen ? "sidebar-open" : ""} p-3 m-3`}>
      <div  className="d-flex align-items-center"><img src={logo} alt="" className="img-fluid logo-size"/>  
          <h1 className="gradient-text ms-3" style={{color:'linear-gradient(195deg, rgba(73, 241, 185, 1), rgba(16, 183, 100, 1))'}}>RENT</h1>
      </div>
      <hr></hr>
      <nav>
      
        <ul>
   
          <li className="p-3 text-white" style={{borderRadius:"5px", background:"#8BC34A"}}>
      
              <RiDashboardHorizontalFill size={20} style={{marginRight:'10px '}}/>
              Dashboard
          </li>
          <li className="p-0 mt-2" >
            <NavLink 
              to="/dashboard/statistics" 
               onClick={toggleSidebar} 
              className={({ isActive }) => (isActive ? "active-link rounded" : "")}
            >
              <FcStatistics size={20}/>
              Statistics
            </NavLink>
          </li>

  <li className="p-0 mt-2">
    <NavLink  
     to="/dashboard/daily-report-rent" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
     Rent Property Daily Report 
    </NavLink>
  </li>

   <li className="p-0 mt-2">
    <NavLink  
     to="/dashboard/detail-daily-report" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
     Rent Detail Daily Report 
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/assist-subscriber"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
    Tenant Assist Daily Report
    </NavLink>
  </li>

   <li className="p-0 mt-2">
    <NavLink  
     to="/dashboard/property-payment-daily-report" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
     Rent Property Payment Daily Report 
    </NavLink>
  </li>

          <li className="p-3 mt-2  text-white" 
            data-bs-toggle="collapse"
  data-bs-target="#reportMenu"
  aria-expanded="false"
  aria-controls="reportMenu"
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
      
              <MdReport size={20} style={{marginRight:'10px '}}/>
              Report
          </li>
          <ul className="collapse " id="reportMenu">

          <li className="p-0 mt-2" >
            <NavLink 
              to="/dashboard/loginreport" 
               onClick={toggleSidebar} 
              className={({ isActive }) => (isActive ? "active-link rounded" : "")}
            >
              <IoLogInSharp size={20}/>
              Login Report
            </NavLink>
          </li>

           <li className="p-0 mt-2" >
            <NavLink 
              to="/dashboard/login-user-datas" 
               onClick={toggleSidebar} 
              className={({ isActive }) => (isActive ? "active-link rounded" : "")}
            >
              <FaUser size={20}/>
              Login Users Datas
            </NavLink>
          </li> 

               <li className="p-0 mt-2">
        <NavLink to="/dashboard/user-log" 
        onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiFileListFill size={20} /> User Views Datas
        </NavLink>
      </li>

          
          <li className="p-0 mt-2" >
            <NavLink 
              to="/dashboard/separate-login-user" 
               onClick={toggleSidebar} 
              className={({ isActive }) => (isActive ? "active-link rounded" : "")}
            >
              <FaUser size={20}/>
              Login datas Separate Users 
            </NavLink>
          </li>


            <li className="p-0 mt-2" >
            <NavLink 
              to="/dashboard/adminreport" 
              className={({ isActive }) => (isActive ? "active-link rounded" : "")}
            >
              <FaSignInAlt size={20}/>
              Admin Report
            </NavLink>
          </li>
</ul> 
<li
  className="p-3 mt-2 text-white"
  style={{ borderRadius: "5px", background: "#8BC34A", cursor: "pointer" }}
  data-bs-toggle="collapse"
  data-bs-target="#LoginDirectMenu"
  aria-expanded="false"
  aria-controls="LoginDirectMenu"
>
  <MdReport size={20} style={{ marginRight: "10px" }} />
  Login Direct
</li>
     <ul className="collapse " id="LoginDirectMenu">
      
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
          <RiUserSettingsFill size={20} /> My Account
        </NavLink>
      </li>
  </ul>


<li className="p-3 mt-2  text-white" 
  data-bs-toggle="collapse"
  data-bs-target="#NotificationMenu"
  aria-expanded="false"
  aria-controls="NotificationMenu"
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
           
              <FaBell size={20} style={{marginRight:'10px '}}/>
              Notification
          </li>
<ul className="collapse " id="NotificationMenu">

          <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/admin-notification"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaBell size={20}/>
          Admin Notification
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
        data-bs-toggle="collapse"
  data-bs-target="#OfficeMenu"
  aria-expanded="false"
  aria-controls="OfficeMenu"
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
     
          <FaBuilding size={20} style={{marginRight:'10px '}}/>
          Office Setup
      </li>
<ul className="collapse " id="OfficeMenu">

      <li className="p-0 mt-2" >
       <NavLink
          to="/dashboard/office"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        > 
          <FaBuilding size={20}/>
          Office 
        </NavLink>
      </li>

      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/users"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaUsers size={20}/>
          Users
        </NavLink>
      </li>

  

      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/buyerplan"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaClipboardList size={20}/>
          Tentant Plan
        </NavLink>
      </li>
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/paymenttype"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaMoneyBill size={20}/>
          Payment Type
        </NavLink>
      </li>


      
  
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/state"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaMapMarkedAlt />
          State
        </NavLink>
      </li>
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/district"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaMapMarkedAlt />
          District
        </NavLink>
      </li>
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/city"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaMapMarkedAlt />
          City
        </NavLink>
      </li>
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/area"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaMapMarkedAlt />
          Area
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
          Admin Log
        </NavLink>
      </li>
     
      <li className="p-0 mt-2">
    <NavLink
        to="/dashboard/text-editor"
        className={({ isActive }) => (isActive ? "active-link rounded" : "")}
      >
        <FaPlusCircle />
     Text Editors
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
          Get User Profile
 </NavLink>
      </li>

</ul>




      <li className="p-3 mt-2  text-white" 
        data-bs-toggle="collapse"
  data-bs-target="#PPCMenu"
  aria-expanded="false"
  aria-controls="PPCMenu"
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
     
          <FaBuilding size={20} style={{marginRight:'10px '}}/>
          RENT Property
      </li>
<ul className="collapse " id="PPCMenu">

 <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/puc-car"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaFileInvoice />
          PUC Property
        </NavLink>
      </li>


      <li className="p-0 mt-2">
    <NavLink
        to="/dashboard/apply-on-demand"
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
          Approved Property
        </NavLink>
      </li>
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/preapproved-car"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaUserCheck />
          PreApproved Property
        </NavLink>
      </li>
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/pending-car"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaUserClock />
          Pending Property
        </NavLink>
      </li>

 <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/removed-car"
        onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaTrashAlt />
          Removed Property
        </NavLink>
      </li>
   

      <li className="p-0 mt-2">
        <NavLink
          to="/dashboard/expire-car"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaUserTimes />
          Expired Property
        </NavLink>
      </li>
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/deleted-properties"
        onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaTrashAlt />
        Permenent Deleted Property
        </NavLink>
      </li>

        <li className="p-0 mt-2">
    <NavLink to="/dashboard/feature-property"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaCar />
      Featured Property
    </NavLink>
  </li>

      <li className="p-0 mt-2">
    <NavLink to="/dashboard/paid-car"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaCar />
      Paid Property
    </NavLink>
  </li>

  
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/free-car" 
    onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaCar />
      Free Property
    </NavLink>
  </li>


<li className="p-0 mt-2">
    <NavLink to="/dashboard/set-property-message" 
    onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaCar />
      Set Property Message
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
      Get All Property Datas 
    </NavLink>
  </li>



</ul>




      <li className="p-3 mt-2  text-white" 
        data-bs-toggle="collapse"
  data-bs-target="#AccountsMenu"
  aria-expanded="false"
  aria-controls="AccountsMenu"
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
    
    <FaCar style={{marginRight:'10px '}}/>
    PPC prop Accounts
</li>
<ul className="collapse " id="AccountsMenu">

  
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
      All Bills Datas
    </NavLink>
  </li>
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
    data-bs-toggle="collapse"
  data-bs-target="#CustomerMenu"
  aria-expanded="false"
  aria-controls="CustomerMenu"
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
      <FaPhone style={{marginRight:'10px '}}/>
      Customer Care
  </li>

<ul className="collapse " id="CustomerMenu">

<li className="p-0 mt-2">
    <NavLink to="/dashboard/customer-car"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaCar />
Customer Care   
 </NavLink>
  </li>
      <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/plan"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaClipboardList size={20}/>
          Plan
        </NavLink>
      </li>
 <li className="p-0 mt-2" >
        <NavLink
          to="/dashboard/contact-form-datas"
           onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaMoneyBill size={20}/>
         All Contact FormDatas
        </NavLink>
      </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/needhelp-table"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Received Need Help
    </NavLink>
  </li><li className="p-0 mt-2">
    <NavLink to="/dashboard/report-property-table"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Received Report Property
    </NavLink>
  </li>
 <li className="p-0 mt-2">
    <NavLink to="/dashboard/soldout-table" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Received SoldOut Request
    </NavLink>
  </li>
</ul>


    


<li className="p-3 mt-2  text-white" 
  data-bs-toggle="collapse"
  data-bs-target="#PropertyMenu"
  aria-expanded="false"
  aria-controls="PropertyMenu"
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
     
          <FaCar style={{marginRight:'10px '}}/>
          Property List
      </li>

<ul className="collapse " id="PropertyMenu">

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
    data-bs-toggle="collapse"
  data-bs-target="#BuyerAssistantMenu"
  aria-expanded="false"
  aria-controls="BuyerAssistantMenu"
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
      <FaUser style={{marginRight:'10px '}}/>
      Tentant Assistant
  </li>
  <ul className="collapse " id="BuyerAssistantMenu">

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/add-buyer-assistance"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
     Add Tentant Assistantce
    </NavLink>
  </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/get-buyer-assistance"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
     Get Tentant Assistantce
    </NavLink>
  </li>
   <li className="p-0 mt-2">
    <NavLink to="/dashboard/active-buyer-assistant" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Tentant Active Assistant
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/pending-assistant"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Pending Assistant
    </NavLink>
  </li>

   <li className="p-0 mt-2">
    <NavLink to="/dashboard/get-all-buyerlist-viewed"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Tentant Assistant Viewed User
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
    data-bs-toggle="collapse"
  data-bs-target="#BuyerPayUMenu"
  aria-expanded="false"
  aria-controls="BuyerPayUMenu"
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
     
          <FaCar style={{marginRight:'10px '}}/>
         Tentant PayU 
      </li>
<ul className="collapse " id="BuyerPayUMenu">

       <li className="p-0 mt-2">
    <NavLink to="/dashboard/payment-success-buyer" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileInvoice />
      Tentant Assistant Paid Success
    </NavLink>
  </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/payment-failed-buyer" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileInvoice />
      Tentant Assistant Paid Failed
    </NavLink>
  </li>

   <li className="p-0 mt-2">
    <NavLink to="/dashboard/payment-paynow-buyer" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileInvoice />
      Tentant Assistant Pay Now
    </NavLink>
  </li>
  <li className="p-0 mt-2">
    <NavLink to="/dashboard/payment-paylater-buyer" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileInvoice />
Tentant Assistant Pay Later
</NavLink>
  </li>
<li className="p-0 mt-2">
    <NavLink to="/dashboard/all-buyer-bills" 
    className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaFileAlt />
     Get All RA Bills
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
    data-bs-toggle="collapse"
  data-bs-target="#BussinessSupporMenu"
  aria-expanded="false"
  aria-controls="BussinessSupporMenu"
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
      <FaUser style={{marginRight:'10px '}}/>
      Bussiness Support prop
  </li>

<ul className="collapse " id="BussinessSupporMenu">

    <li className="p-0 mt-2">
    <NavLink to="/dashboard/searched-data" 
     onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaClipboardList />
      Searched Data
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/buyerlist-interest"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaListAlt />
      Tentant List - Interest
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
      Received Contact Request Datas
    </NavLink>
  </li>
  
 <li className="p-0 mt-2">
    <NavLink to="/dashboard/called-list-datas"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
     Called List Datas
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/favorite-table"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Received Favorite Datas
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/favorite-removed"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Received Favorite Removed datas
    </NavLink>
  </li>

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/viewed-property"  onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUsers />
      Viewed Properties
    </NavLink>
  </li>
  

  <li className="p-0 mt-2">
    <NavLink to="/dashboard/get-matched-properties" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
      <FaUser />
      Matched Proprties
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
      Get Address Request Datas
    </NavLink>
  </li>
         <li className="p-0" >
         <NavLink
          to="/dashboard/all-views-datas"
          onClick={toggleSidebar}
          className={({ isActive }) => (isActive ? "active-link rounded" : "")}
        >
          <FaDownload />
All Views Datas        </NavLink>
      </li>




</ul>
 

      <li className="p-3 mt-2  text-white" 
        data-bs-toggle="collapse"
  data-bs-target="#LeadMenu"
  aria-expanded="false"
  aria-controls="LeadMenu"
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>

          <RiBankCard2Fill size={20} style={{marginRight:'10px '}}/> Lead Menu
      </li>
      <ul className="collapse " id="LeadMenu">

   
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
  </span>User Click Groom Datas
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
    User Click Bride Datas 
</NavLink>
      </li>
</ul>




 


<li className="p-3 mt-2  text-white" 
  data-bs-toggle="collapse"
  data-bs-target="#NoPropertyUsersMenu"
  aria-expanded="false"
  aria-controls="NoPropertyUsersMenu"
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
 
          <FaBuilding style={{marginRight:'10px '}}/>
          No Property Users
      </li>
<ul className="collapse " id="NoPropertyUsersMenu">

 <li className="p-0 mt-2">
        <NavLink to="/dashboard/without-property-user" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <FaUser size={20} />  Per Day Datas 
        </NavLink>
      </li>

       <li className="p-0 mt-2">
        <NavLink to="/dashboard/without-30-days-user" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <FaUser size={20} />  Get 30 Days Datas 
        </NavLink>
      </li>

        <li className="p-0 mt-2">
        <NavLink to="/dashboard/without-all-statics" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <FaUser size={20} />  Fetch All Statics
        </NavLink>
      </li>
</ul>

      
  <li className="p-3 mt-2  text-white" 
    data-bs-toggle="collapse"
  data-bs-target="#BusinessStaticsMenu"
  aria-expanded="false"
  aria-controls="BusinessStaticsMenu"
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
 
          <FaChartLine style={{marginRight:'10px '}}/>
          Business Statics
      </li>
<ul className="collapse " id="BusinessStaticsMenu">

<li className="p-0 mt-2">
        <NavLink to="/dashboard/carstatics"
          onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiCarFill size={20} /> Property Statics
        </NavLink>
      </li>
      <li className="p-0 mt-2">
        <NavLink to="/dashboard/buyers-statics"
         onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiGroupFill size={20} /> Tentant Statics
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
        data-bs-toggle="collapse"
  data-bs-target="#FollowUpsMenu"
  aria-expanded="false"
  aria-controls="FollowUpsMenu"
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
          <RiNewspaperFill size={20} style={{marginRight:'10px '}}/> Follow Ups
      </li>
      <ul className="collapse " id="FollowUpsMenu">

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
          All FollowUps Datas
        </NavLink>
      </li> 
      <li className="p-0 mt-2">
        <NavLink to="/dashboard/buyers-follow-ups"
         onClick={toggleSidebar} className={({ isActive }) => (isActive ? "active-link rounded" : "")}>
          <RiGroupFill size={20} /> Tentant Follow Ups
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
        data-bs-toggle="collapse"
  data-bs-target="#SettingsMenu"
  aria-expanded="false"
  aria-controls="SettingsMenu"
   style={{borderRadius:"5px",  background:"#8BC34A", cursor: "pointer"}}>
          <RiSettings5Fill size={20} style={{marginRight:'10px '}}/> Settings
      </li>
      <ul className="collapse " id="SettingsMenu">

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














