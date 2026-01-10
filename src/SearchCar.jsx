

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import { getFirstPhotoUrl } from './utils/mediaHelper';
import { useSelector } from "react-redux";
import {FaKitchenSet ,FaChartArea, FaMapPin, FaDoorClosed , FaRoad ,FaRegAddressCard } from 'react-icons/fa6';
import { MdLocationOn, MdOutlineMeetingRoom, MdOutlineOtherHouses, MdSchedule , MdApproval, MdLocationCity } from "react-icons/md";
import { BsBuildingsFill, BsFillHouseCheckFill } from "react-icons/bs";
import { GiKitchenScale,  GiResize , GiGears} from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi";
import { BiSearchAlt,  BiWorld} from "react-icons/bi";
import {  MdElevator   } from "react-icons/md";
import { FaEye, FaEdit, FaIdCardAlt, FaPhoneAlt } from 'react-icons/fa';
import { RiRadioButtonFill } from 'react-icons/ri';
import { 
  FaFilter, FaHome, FaCity, FaRupeeSign, FaBed, FaCheck, FaTimes, 
  FaTools, FaIdCard, FaCalendarAlt, FaUserAlt, FaRulerCombined, FaBath, 
   FaCar, FaHandshake, FaToilet, 
  FaCamera,
  
} from "react-icons/fa";
import { TbArrowLeftRight, TbChecklist, TbMapPinCode } from "react-icons/tb";
import { AiOutlineColumnWidth, AiOutlineColumnHeight } from "react-icons/ai";
import { BsBank } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import pic from "./Assets/Mask Group 3.png";

const SearchProperty = () => {
  const [properties, setProperties] = useState([]);
    const [hoverAdvance, setHoverAdvance] = useState(false);
    const [hoverSearch, setHoverSearch] = useState(false);
    const navigate = useNavigate(); // Initialize navigate

  
  const [advancedFilters, setAdvancedFilters] = useState({
   rentId:'', phoneNumber:'' , propertyMode: '', propertyType: '', minrentalAmount: '', maxrentalAmount: '', propertyAge: '', bankLoan: '',
    negotiation: '', length: '', breadth: '', totalArea: '', ownership: '', bedrooms: '',
    kitchen: '', kitchenType: '', balconies: '', floorNo: '', areaUnit: '', propertyApproved: '',
    facing: '', salesMode: '', salesType: '', furnished: '', lift: '', attachedBathrooms: '',
    western: '', numberOfFloors: '', carParking: '', city: '' , status:'', pinCode: '', area: '', propertyStatus: ''
  });

  const [statusFilteredProperties, setStatusFilteredProperties] = useState(null);

  // Area to Pincode mapping for Pondicherry
  const areaPincodeMap = {
    "Abishegapakkam": "605007",
    "Ariyankuppam": "605007",
    "Arumbarthapuram": "605110",
    "Bahoor": "607402",
    "Bommayarpalayam": "605104",
    "Botanical Garden": "605001",
    "Calapet": "605014",
    "Courivinatham": "607402",
    "Dhanvantry Nagar": "605006",
    "Embalam": "605106",
    "Irumbai": "605111",
    "Karayamputhur": "605106",
    "Karikalambakkam": "605007",
    "Kariyamanikam": "605106",
    "Kijour": "605106",
    "Kilpudupattu": "605014",
    "Kilsirivi": "604301",
    "Kirumambakkam": "607402",
    "Korkadu": "605110",
    "Kottakuppam": "605104",
    "Kuilapalayam": "605101",
    "Lawspet": "605008",
    "Maducore": "605105",
    "Manamedu": "607402",
    "Manapeth": "607402",
    "Mandagapet": "605106",
    "Mangalam": "605110",
    "Mannadipattu": "605501",
    "Morattandi": "605101",
    "Mottoupalayam": "605009",
    "Mouroungapakkam": "605004",
    "Moutrepaleam": "605009",
    "Mudaliarpet": "605004",
    "Muthialpet": "605003",
    "Mutrampattu": "605501",
    "Nallavadu": "605007",
    "Nellithoppe": "605005",
    "Nettapakkam": "605106",
    "Odiensalai": "605001",
    "Ozhugarai": "605010",
    "Padmin nagar": "605012",
    "Pakkam": "605106",
    "Pandakkal": "673310",
    "Pillaichavady": "605014",
    "Pillayarkuppam": "607402",
    "Pondicherry": "605001",
    "Pondicherry Bazaar": "605001",
    "Pondicherry Courts": "605001",
    "Pondicherry North": "605001",
    "Pondicherry University": "605014",
    "Pooranankuppam": "605007",
    "Poothurai": "605111",
    "Rayapudupakkam": "605111",
    "Reddiyarpalayam": "605010",
    "Saram(py)": "605013",
    "Sedarapet": "605111",
    "Seliamedu": "607402",
    "Sellipet": "605501",
    "Sri Aurobindo ashram": "605002",
    "Sulthanpet": "605110",
    "Thattanchavady": "605009",
    "Thengaithittu": "605004",
    "Thimmanaickenpalayam": "605007",
    "Tirukkanur": "605501",
    "Vadhanur": "605501",
    "Veerampattinam": "605007",
    "Venkata Nagar": "605011",
    "Villiyanur": "605110",
    "Vimacoundinpaleam": "605009",
    "Viranam": "605106",
    "Yanam": "533464",
  };

  // Area dropdown states
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);

  // Handle area input change with smart sorting (starting letters first)
  const handleAreaInputChange = (e) => {
    const value = e.target.value;
    setAdvancedFilters(prev => ({ ...prev, area: value }));

    if (value.trim().length > 0) {
      const allAreas = Object.keys(areaPincodeMap);
      const lowerValue = value.toLowerCase();
      
      // Areas that START with the typed letter (priority)
      const startsWithFilter = allAreas.filter(a => 
        a.toLowerCase().startsWith(lowerValue)
      );
      
      // Areas that CONTAIN but don't start with the typed letter
      const containsFilter = allAreas.filter(a => 
        !a.toLowerCase().startsWith(lowerValue) && 
        a.toLowerCase().includes(lowerValue)
      );
      
      // Combine: starting first, then containing
      const sortedSuggestions = [...startsWithFilter, ...containsFilter];
      
      setAreaSuggestions(sortedSuggestions);
      setShowAreaSuggestions(sortedSuggestions.length > 0);
    } else {
      // Show all areas when input is empty but focused
      setAreaSuggestions(Object.keys(areaPincodeMap));
      setShowAreaSuggestions(true);
    }
  };

  // Handle area selection from dropdown
  const handleAreaSelect = (selectedArea) => {
    setAdvancedFilters(prev => ({
      ...prev,
      area: selectedArea,
      pinCode: areaPincodeMap[selectedArea] || prev.pinCode
    }));
    setShowAreaSuggestions(false);
    setAreaSuggestions([]);
  };

  // Handle area input focus
  const handleAreaFocus = () => {
    if (advancedFilters.area?.trim().length === 0 || !advancedFilters.area) {
      setAreaSuggestions(Object.keys(areaPincodeMap));
      setShowAreaSuggestions(true);
    } else {
      handleAreaInputChange({ target: { value: advancedFilters.area } });
    }
  };

  // Handle area input blur
  const handleAreaBlur = () => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      setShowAreaSuggestions(false);
    }, 200);
  };
 
useEffect(() => {
  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/properties`);
      console.log("Raw API Response:", response.data);

      // Try to locate the actual array
      const dataArray = Array.isArray(response.data) 
        ? response.data 
        : response.data.properties || response.data.data || [];

      setProperties(dataArray);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      setProperties([]);
    }
  };

  fetchProperties();
}, []);

        const tableRef = useRef();
      
      const handlePrint = () => {
        const printContent = tableRef.current.innerHTML;
        const printWindow = window.open("", "", "width=1200,height=800");
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Table</title>
              <style>
                table { border-collapse: collapse; width: 100%; font-size: 12px; }
                th, td { border: 1px solid #000; padding: 6px; text-align: left; }
                th { background: #f0f0f0; }
              </style>
            </head>
            <body>
              <table>${printContent}</table>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      };
  const filteredProperties = (() => {
    // If propertyStatus filter is applied, use the status-filtered data
    if (advancedFilters.propertyStatus && statusFilteredProperties !== null) {
      return statusFilteredProperties;
    }
    
    // Otherwise, use the original filtering logic for all other filters
    return properties.filter((property) => {
      const advancedFilterMatch = Object.keys(advancedFilters).every((key) => {
        if (!advancedFilters[key]) return true;
    
        if (key === "minrentalAmount") {
          return property.rentalAmount >= Number(advancedFilters[key]);
        }
        if (key === "maxrentalAmount") {
          return property.rentalAmount <= Number(advancedFilters[key]);
        }
        
        // Skip propertyStatus since we handle it above
        if (key === "propertyStatus") {
          return true;
        }
    
        return property[key]?.toString()?.toLowerCase()?.includes(advancedFilters[key]?.toLowerCase());
      });
    
      return advancedFilterMatch;
    });
  })();
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [showPropertyStatusOptions, setShowPropertyStatusOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyStatusCounts, setPropertyStatusCounts] = useState({});
  const statusOptions = ["active", "pending", "delete", "incomplete", "complete", "contact"];
  const propertyStatusOptions = ["Property Approved", "Property Preapproved", "Pending Property", "Removed Property", "Featured Property", "Paid Property", "Free Property"];

  // Fetch actual counts from respective API endpoints
  useEffect(() => {
    const fetchPropertyStatusCounts = async () => {
      try {
        const counts = {};
        
        // Property Approved - fetch-active-users-datas-all-rent returns only complete/approved properties
        try {
          const approvedRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users-datas-all-rent`);
          counts["Property Approved"] = (approvedRes.data.users || []).length;
        } catch (e) {
          counts["Property Approved"] = 0;
        }
        
        // Property Preapproved - properties/pre-approved-all-rent
        try {
          const preapprovedRes = await axios.get(`${process.env.REACT_APP_API_URL}/properties/pre-approved-all-rent`);
          counts["Property Preapproved"] = (preapprovedRes.data.users || []).length;
        } catch (e) {
          counts["Property Preapproved"] = 0;
        }
        
        // Pending Property - properties/pending-rent
        try {
          const pendingRes = await axios.get(`${process.env.REACT_APP_API_URL}/properties/pending-rent`);
          counts["Pending Property"] = (pendingRes.data.users || []).length;
        } catch (e) {
          counts["Pending Property"] = 0;
        }
        
        // Removed Property - properties/deleted-rent (already filtered to deleted status on backend)
        try {
          const removedRes = await axios.get(`${process.env.REACT_APP_API_URL}/properties/deleted-rent`);
          counts["Removed Property"] = (removedRes.data.data || []).length;
        } catch (e) {
          counts["Removed Property"] = 0;
        }
        
        // Featured Property - fetch-all-featured-properties
        try {
          const featuredRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-featured-properties`);
          const featuredData = featuredRes.data.data || [];
          counts["Featured Property"] = featuredData.reduce((total, item) => {
            return total + (item.properties || []).length;
          }, 0);
        } catch (e) {
          counts["Featured Property"] = 0;
        }
        
        // Paid Property - fetch-all-paid-plans
        try {
          const paidRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-paid-plans`);
          const paidData = paidRes.data.data || [];
          counts["Paid Property"] = paidData.reduce((total, item) => {
            return total + (item.properties || []).length;
          }, 0);
        } catch (e) {
          counts["Paid Property"] = 0;
        }
        
        // Free Property - fetch-all-free-plans
        try {
          const freeRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-free-plans`);
          const freeData = freeRes.data.data || [];
          counts["Free Property"] = freeData.reduce((total, item) => {
            return total + (item.properties || []).length;
          }, 0);
        } catch (e) {
          counts["Free Property"] = 0;
        }
        
        setPropertyStatusCounts(counts);
      } catch (error) {
        console.error("Error fetching property status counts:", error);
      }
    };

    fetchPropertyStatusCounts();
  }, []);

  // Function to get property status count from state
  const getPropertyStatusCount = (status) => {
    return propertyStatusCounts[status] || 0;
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const closeStatusOptions = () => {
    setShowStatusOptions(false);
    setSearchQuery('');
  };

  const closePropertyStatusOptions = () => {
    setShowPropertyStatusOptions(false);
    setSearchQuery('');
  };

  const handleStatusSelect = (value) => {
    setAdvancedFilters((prev) => ({ ...prev, status: value }));
    closeStatusOptions();
  };

  const handlePropertyStatusSelect = (value) => {
    setAdvancedFilters((prev) => ({ ...prev, propertyStatus: value }));
    closePropertyStatusOptions();
    
    // Fetch data from the appropriate endpoint based on selection
    const fetchStatusData = async () => {
      try {
        let data = [];
        
        if (value === "Property Approved") {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users-datas-all-rent`);
          data = res.data.users || [];
        } else if (value === "Property Preapproved") {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/properties/pre-approved-all-rent`);
          data = res.data.users || [];
        } else if (value === "Pending Property") {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/properties/pending-rent`);
          data = res.data.users || [];
        } else if (value === "Removed Property") {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/properties/deleted-rent`);
          data = res.data.data || [];
        } else if (value === "Featured Property") {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-featured-properties`);
          const rawData = res.data.data || [];
          data = rawData.flatMap(item => item.properties || []);
        } else if (value === "Paid Property") {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-paid-plans`);
          const rawData = res.data.data || [];
          data = rawData.flatMap(item => item.properties || []);
        } else if (value === "Free Property") {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-free-plans`);
          const rawData = res.data.data || [];
          data = rawData.flatMap(item => item.properties || []);
        }
        
        setStatusFilteredProperties(data);
      } catch (error) {
        console.error("Error fetching status filtered data:", error);
        setStatusFilteredProperties([]);
      }
    };
    
    fetchStatusData();
  };

  const filterOptions = (options) =>
    options.filter((option) => option.toLowerCase().includes(searchQuery.toLowerCase()));

    const [dataList, setDataList] = useState({});
      const fetchDropdownData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch`);
          const groupedData = response.data.data.reduce((acc, item) => {
            if (!acc[item.field]) acc[item.field] = [];
            acc[item.field].push(item.value);
            return acc;
          }, {});
          setDataList(groupedData);
        } catch (error) {
        }
      };

         useEffect(() => {
            fetchDropdownData();
          }, []);
        
          const [dropdownState, setDropdownState] = useState({
            activeDropdown: null,
            filterText: "",
            position: { top: 0, left: 0 },
          });
          const toggleDropdown = (field) => {
            setDropdownState((prevState) => ({
              activeDropdown: prevState.activeDropdown === field ? null : field,
              filterText: "",
            }));
          };
          const fieldLabels = {
            propertyMode: "Property Mode",
            propertyType: "Property Type",
            rentalAmount: "rentalAmount",
            minrentalAmount: "minrentalAmount",maxrentalAmount: "maxrentalAmount",
            propertyAge: "Property Age",
            bankLoan: "Bank Loan",
            negotiation: "Negotiation",
            length: "Length",
            breadth: "Breadth",
            totalArea: "Total Area",
            ownership: "Ownership",
            bedrooms: "Bedrooms",
            kitchen: "Kitchen",
            kitchenType: "Kitchen Type",
            balconies: "Balconies",
            floorNo: "Floor No.",
            areaUnit: "Area Unit",
            propertyApproved: "Property Approved",
            postedBy: "Posted By",
            facing: "Facing",
            salesMode: "Sales Mode",
            salesType: "Sales Type",
            description: "Description",
            furnished: "Furnished",
            lift: "Lift",
            attachedBathrooms: "Attached Bathrooms",
            western: "Western Toilet",
            numberOfFloors: "Number of Floors",
            carParking: "Car Parking",
            rentalPropertyAddress: "Property Address",
            country: "Country",
            state: "State",
            city: "City",
            district: "District",
            area: "Area",
            streetName: "Street Name",
            doorNumber: "Door Number",
            nagar: "Nagar",
            ownerName: "Owner Name",
            email: "Email",
            phoneNumber: "Phone Number",
            phoneNumberCountryCode: "Phone Country Code",
            alternatePhone: "Alternate Phone",
            alternatePhoneCountryCode: "Alternate Phone Country Code",
            bestTimeToCall: "Best Time to Call",
          };
  const handleAdvancedFilterChange = (e) => {
    const { name, value } = e.target;
    // Only update advancedFilters when the input has a valid `name` attribute.
    if (name) {
      setAdvancedFilters((prevState) => ({ ...prevState, [name]: value }));
    }
    // Always update dropdown filter text (used by the dropdown option filter UI)
    setDropdownState((prevState) => ({ ...prevState, filterText: value }));
  };
  const renderDropdown = (field) => {
    const options = dataList[field] || [];
    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(dropdownState.filterText.toLowerCase())
    );

    return (
      dropdownState.activeDropdown === field && (
        <div
          className="dropdown-popup"
          style={{
        
            backgroundColor: '#fff',
            width: '100%',
            maxWidth: '400px',
            padding: '10px',
            zIndex: 10,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            overflowY: 'auto',
            maxHeight: '50vh',
            animation: 'popupOpen 0.3s ease-in-out',
          }}
        >
                    <div
        style={{
          fontWeight: "bold",
          fontSize: "16px",
          marginBottom: "10px",
          textAlign: "start",
          color: "#019988",
        }}
      >
         {fieldLabels[field] || "Property Field"}
      </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Filter options..."
              value={dropdownState.filterText}
              onChange={handleAdvancedFilterChange}
              style={{
                width: '80%',
                padding: '5px',
                marginBottom: '10px',
              }}
            />
            <button
              type="button"
              onClick={() => toggleDropdown(field)}
              style={{
                cursor: 'pointer',
                border: 'none',
                background: 'none',
              }}
            >
              <FaTimes size={18} color="red" />
            </button>
          </div>
          <ul
            style={{
              listStyleType: 'none',
              padding: 0,
              margin: 0,
            }}
          >
          
{filteredOptions.map((option, index) => (
<li
  key={index}
  onClick={() => {
    // Update advanced filters
    setAdvancedFilters((prevState) => ({
      ...prevState,
      [field]: option,
    }));
    
 
    
    // Toggle dropdown visibility
    toggleDropdown(field);
  }}
  style={{
    padding: '5px',
    cursor: 'pointer',
    backgroundColor: '#f9f9f9',
    marginBottom: '5px',
  }}
>
  {option}
</li>
))}

          </ul>
        </div>
      )
    );
  };



  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
  
  
   const [allowedRoles, setAllowedRoles] = useState([]);
       const [loading, setLoading] = useState(true);
   
   const fileName = "Search Property"; // current file
   
   // Sync Redux to localStorage
   useEffect(() => {
     if (reduxAdminName) localStorage.setItem("adminName", reduxAdminName);
     if (reduxAdminRole) localStorage.setItem("adminRole", reduxAdminRole);
   }, [reduxAdminName, reduxAdminRole]);
   
   // Record dashboard view
   useEffect(() => {
     const recordDashboardView = async () => {
       try {
         await axios.post(`${process.env.REACT_APP_API_URL}/record-view`, {
           userName: adminName,
           role: adminRole,
           viewedFile: fileName,
           viewTime: moment().format("YYYY-MM-DD HH:mm:ss"),
         });
       } catch (err) {
       }
     };
   
     if (adminName && adminRole) {
       recordDashboardView();
     }
   }, [adminName, adminRole]);
   
   // Fetch role-based permissions
   useEffect(() => {
     const fetchPermissions = async () => {
       try {
         const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-role-permissions`);
         const rolePermissions = res.data.find((perm) => perm.role === adminRole);
         const viewed = rolePermissions?.viewedFiles?.map(f => f.trim()) || [];
         setAllowedRoles(viewed);
       } catch (err) {
       } finally {
         setLoading(false);
       }
     };
   
     if (adminRole) {
       fetchPermissions();
     }
   }, [adminRole]);
   
  
   if (loading) return <p>Loading...</p>;
  
   if (!allowedRoles.includes(fileName)) {
     return (
       <div className="text-center text-red-500 font-semibold text-lg mt-10">
         Only admin is allowed to view this file.
       </div>
     );
   }

  return (
    <div className="container">
<h3>All Properties</h3>
<button
  type="button"
  className="btn btn-primary mb-3"
  data-bs-toggle="modal"
  data-bs-target="#filterPopup"
>
  Search List
</button>
              <button className="btn btn-secondary ms-3 mb-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
<div
  className="modal fade"
  id="filterPopup"
  tabIndex="-1"
  aria-labelledby="filterPopupLabel"
  aria-hidden="true"
>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content rounded-4 shadow">
      <div className="modal-header">
        <h5 className="modal-title" id="filterPopupLabel">
          Search Property
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body">
         <div className="mb-4 three-column-grid"
 >

       
          <div className="form-group ">
        <label>RentId:  </label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #2F747F', background:"#fff" }}>
          <FaIdCardAlt className="input-icon" style={{color: '#2F747F', marginLeft:"10px"}} />
          <input
            type="number"
            name="rentId"
            value={advancedFilters.rentId}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="RentId"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>
                <div className="form-group ">
        <label>PhoneNumber:  </label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #2F747F', background:"#fff" }}>
          <FaPhoneAlt className="input-icon" style={{color: '#2F747F', marginLeft:"10px"}} />
          <input
            type="number"
            name="phoneNumber"
            value={advancedFilters.phoneNumber}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="PhoneNumber"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>

         <div className="form-group ">
        <label>Total Area:  </label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #2F747F', background:"#fff" }}>
          <GiResize className="input-icon" style={{color: '#2F747F', marginLeft:"10px"}} />
          <input
            type="text"
            name="totalArea"
            value={advancedFilters.totalArea}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Total Area"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>
        <div className="form-group">
      <label style={{ width: '100%' }}>
        <label>Status</label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: "1", position: "relative" }}>
            <select
              name="status"
              value={advancedFilters.status || ""}
              onChange={() => {}}
              className="form-control"
              style={{ display: "none" }}
            >
              <option value="">Select status</option>
              {statusOptions.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              className="m-0"
              type="button"
              onClick={() => setShowStatusOptions(!showStatusOptions)}
              style={{
                cursor: "pointer",
                border: "1px solid #2F747F",
                padding: "10px",
                background: "#fff",
                borderRadius: "5px",
                width: "100%",
                textAlign: "left",
                color: "#2F747F",
              }}
            >
              <span style={{ marginRight: "10px" }}>
                <TbChecklist />
              </span>
              {advancedFilters.status || "Select status"}
            </button>

            {showStatusOptions && (
              <div
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#E9F7F2',
                  width: '100%',
                  maxWidth: '350px',
                  padding: '10px',
                  zIndex: 10,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  overflowY: 'auto',
                  maxHeight: '50vh',
                  animation: 'popupOpen 0.3s ease-in-out',
                }}
              >
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginBottom: "10px",
                    textAlign: "start",
                    color: "#019988",
                  }}
                >
                  Status
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search Options"
                  style={{
                    width: '80%',
                    padding: '5px',
                    background: "#C0DFDA",
                    border: "none",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={closeStatusOptions}
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    background: 'none',
                    float: 'right',
                  }}
                >
                  <FaTimes size={18} color="red" />
                </button>

                {filterOptions(statusOptions).map((value, index) => (
                  <div
                    key={index}
                    style={{ padding: "10px", cursor: "pointer" }}
                    onClick={() => handleStatusSelect(value)}
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </label>
    </div>
        {/* Property Mode */}
        <div className="form-group ">
          <label style={{ width: '100%'}}>
          <label>Property Mode  </label>
      
            <div style={{ display: "flex", alignItems: "center", width:"100%" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="propertyMode"
                  value={advancedFilters.propertyMode || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select Property Mode</option>
                  {dataList.propertyMode?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("propertyMode")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
            <MdApproval />
                  </span>
                  {advancedFilters.propertyMode || "Select Property Mode"}
                </button>
      
                {renderDropdown("propertyMode")}
              </div>
            </div>
          </label>
        </div>
      
      
        <div className="form-group ">
          <label style={{ width: '100%'}}>
      <label>Property Type  </label>
            <div style={{ display: "flex", alignItems: "center"}}>
              <div style={{ flex: "1" }}>
                <select
                  name="propertyType"
                  value={advancedFilters.propertyType || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select property Type</option>
                  {dataList.propertyType?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("propertyType")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
         <MdOutlineOtherHouses />
                  </span>
                  {advancedFilters.propertyType || "Select Property Type"}
                </button>
      
                {renderDropdown("propertyType")}
              </div>
            </div>
          </label>
        </div>
        {/* rentalAmount */}
       
        <div className="form-group ">
        <label>Rental Amount  </label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #2F747F', background:"#fff" }}>
          <FaRupeeSign className="input-icon" style={{color: '#2F747F', marginLeft:"10px"}} />
          <input
            type="tel"
            name="rentalAmount"
            value={advancedFilters.rentalAmount}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Rental Amount"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>
        {/* Property Age */}
        <div className="form-group ">
          <label style={{ width: '100%'}}>
          <label>Property Age </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="propertyAge"
                  value={advancedFilters.propertyAge || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select Property Age</option>
                  {dataList.propertyAge?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("propertyAge")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
            <MdSchedule />
                  </span>
                  {advancedFilters.propertyAge || "Select Property Age"}
                </button>
      
                {renderDropdown("propertyAge")}
              </div>
            </div>
          </label>
        </div>
      
        {/* Bank Loan */}
 
      
       
      
         {/* Negotiation */}
      
        <div className="form-group ">
          <label style={{ width: '100%'}}>
          <label>Negotiation </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="negotiation"
                  value={advancedFilters.negotiation || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select Negotiation</option>
                  {dataList.negotiation?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("negotiation")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
           <FaHandshake />
                  </span>
                  {advancedFilters.negotiation || "Select Negotiation"}
                </button>
      
                {renderDropdown("negotiation")}
              </div>
            </div>
          </label>
        </div>
      
  
  
        {/* Total Area */}
        <div className="form-group ">
        <label>Total Area:  </label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #2F747F', background:"#fff" }}>
          <GiResize className="input-icon" style={{color: '#2F747F', marginLeft:"10px"}} />
          <input
            type="text"
            name="totalArea"
            value={advancedFilters.totalArea}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Total Area"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>
      
          {/* areaUnit */}
          <div className="form-group ">
          <label style={{ width: '100%'}}>
          <label>Area Unit  </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="areaUnit"
                  value={advancedFilters.areaUnit || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select areaUnit</option>
                  {dataList.areaUnit?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("areaUnit")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                   <FaChartArea />
                  </span>
                  {advancedFilters.areaUnit || "Select Area Unit"}
                </button>
      
                {renderDropdown("areaUnit")}
              </div>
            </div>
          </label>
        </div>
      
        {/* Ownership */}
        <div className="form-group ">
          <label style={{ width: '100%'}}>
          <label>Ownership </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="ownership"
                  value={advancedFilters.ownership || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select ownership</option>
                  {dataList.ownership?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("ownership")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
             <HiUserGroup />
                  </span>
                  {advancedFilters.ownership || "Select Ownership"}
                </button>
      
                {renderDropdown("ownership")}
              </div>
            </div>
          </label>
        </div>
      
      
      
        {/* Bedrooms */}
      
      <div className="form-group ">
          <label style={{ width: '100%'}}>
          <label>bedrooms </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="bedrooms"
                  value={advancedFilters.bedrooms || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select bedrooms</option>
                  {dataList.bedrooms?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("bedrooms")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
          <FaBed />
                  </span>
                  {advancedFilters.bedrooms || "Select Bedrooms"}
                </button>
      
                {renderDropdown("bedrooms")}
              </div>
            </div>
          </label>
        </div>
        {/* kitchen */}
        <div className="form-group ">
          <label style={{ width: '100%'}}>
          <label>kitchen </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="kitchen"
                  value={advancedFilters.kitchen || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select kitchen</option>
                  {dataList.kitchen?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("kitchen")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
               <GiKitchenScale />
                  </span>
                  {advancedFilters.kitchen || "Select kitchen"}
                </button>
      
                {renderDropdown("kitchen")}
              </div>
            </div>
          </label>
        </div>
     
          {/* balconies */}
          <div className="form-group ">
          <label style={{ width: '100%'}}>
          <label>Balconies </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="balconies"
                  value={advancedFilters.balconies || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select balconies</option>
                  {dataList.balconies?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("balconies")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
              <MdOutlineMeetingRoom />
                  </span>
                  {advancedFilters.balconies || "Select Balconies"}
                </button>
      
                {renderDropdown("balconies")}
              </div>
            </div>
          </label>
        </div>
          {/* floorNo */}
          <div className="form-group ">
          <label style={{ width: '100%'}}>
          <label>FloorNo </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="floorNo"
                  value={advancedFilters.floorNo || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select floorNo</option>
                  {dataList.floorNo?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("floorNo")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
              <BsBuildingsFill />
                  </span>
                  {advancedFilters.floorNo || "Select floorNo"}
                </button>
      
                {renderDropdown("floorNo")}
              </div>
            </div>
          </label>
        </div>
        
      
          {/* propertyApproved */}
      
          {/* <div className="form-group ">
          <label style={{ width: '100%'}}>
          <label>Property Approved</label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="propertyApproved"
                  value={advancedFilters.propertyApproved || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select propertyApproved</option>
                  {dataList.propertyApproved?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("propertyApproved")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                    <BsFillHouseCheckFill />
                  </span>
                  {advancedFilters.propertyApproved || "Select propertyApproved"}
                </button>
      
                {renderDropdown("propertyApproved")}
              </div>
            </div>
          </label>
        </div> */}
  
        {/* Property Status Filter */}
        <div className="form-group">
          <label style={{ width: '100%' }}>
            <label>Property Status</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1", position: "relative" }}>
                <select
                  name="propertyStatus"
                  value={advancedFilters.propertyStatus || ""}
                  onChange={() => {}}
                  className="form-control"
                  style={{ display: "none" }}
                >
                  <option value="">Select property status</option>
                  {propertyStatusOptions.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  className="m-0"
                  type="button"
                  onClick={() => setShowPropertyStatusOptions(!showPropertyStatusOptions)}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                    <MdApproval />
                  </span>
                  {advancedFilters.propertyStatus || "Select property status"}
                </button>

                {showPropertyStatusOptions && (
                  <div
                    style={{
                      position: 'fixed',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: '#E9F7F2',
                      width: '100%',
                      maxWidth: '350px',
                      padding: '10px',
                      zIndex: 10,
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      overflowY: 'auto',
                      maxHeight: '50vh',
                      animation: 'popupOpen 0.3s ease-in-out',
                    }}
                  >
                    <label
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginBottom: "10px",
                        textAlign: "start",
                        color: "#019988",
                      }}
                    >
                      Property Status
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search Options"
                      style={{
                        width: '80%',
                        padding: '5px',
                        background: "#C0DFDA",
                        border: "none",
                        outline: "none",
                      }}
                    />
                    <button
                      type="button"
                      onClick={closePropertyStatusOptions}
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        float: 'right',
                      }}
                    >
                      <FaTimes size={18} color="red" />
                    </button>

                    {filterOptions(propertyStatusOptions).map((value, index) => (
                      <div
                        key={index}
                        style={{ 
                          padding: "10px", 
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "1px solid #ddd",
                          transition: "background-color 0.2s"
                        }}
                        onClick={() => handlePropertyStatusSelect(value)}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#D5EDE9"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                      >
                        <span>{value}</span>
                        <span style={{ 
                          backgroundColor: "#019988", 
                          color: "#fff", 
                          borderRadius: "50%",
                          padding: "2px 8px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          minWidth: "30px",
                          textAlign: "center"
                        }}>
                          {getPropertyStatusCount(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </label>
        </div>
      
          {/* postedBy */}
          <div className="form-group ">
          <label style={{ width: '100%'}}>
          <label>PostedBy  </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="postedBy"
                  value={advancedFilters.postedBy || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select postedBy</option>
                  {dataList.postedBy?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("postedBy")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
              <FaUserAlt />
                  </span>
                  {advancedFilters.postedBy || "Select postedBy"}
                </button>
      
                {renderDropdown("postedBy")}
              </div>
            </div>
          </label>
        </div>
          {/* facing */}
          <div className="form-group ">
      
          <label style={{ width: '100%'}}>
          <label>Facing</label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="facing"
                  value={advancedFilters.facing || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select facing</option>
                  {dataList.facing?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("facing")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
               <TbArrowLeftRight />
                  </span>
                  {advancedFilters.facing || "Select facing"}
                </button>
      
                {renderDropdown("facing")}
              </div>
            </div>
          </label>
        </div>
   
  
     
      
        {/* furnished */}
        <div className="form-group ">
          <label style={{width:"100%"}}>
          <label>Furnished</label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="furnished"
                  value={advancedFilters.furnished || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select furnished</option>
                  {dataList.furnished?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("furnished")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                     <FaHome />
                  </span>
                  {advancedFilters.furnished || "Select furnished"}
                </button>
      
                {renderDropdown("furnished")}
              </div>
            </div>
          </label>
        </div>
          {/*lift */}
          <div className="form-group ">
          <label style={{ width: '100%'}}>
            <label>Lift</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="lift"
                  value={advancedFilters.lift || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select lift</option>
                  {dataList.lift?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("lift")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                    <MdElevator />
                  </span>
                  {advancedFilters.lift || "Select lift"}
                </button>
      
                {renderDropdown("lift")}
              </div>
            </div>
          </label>
        </div>
      
            {/*attachedBathrooms */}
            <div className="form-group ">
          <label style={{ width: '100%'}}>
          <label>Attached Bathrooms</label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="attachedBathrooms"
                  value={advancedFilters.attachedBathrooms || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select attachedBathrooms</option>
                  {dataList.attachedBathrooms?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("attachedBathrooms")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                   <FaBath />
                  </span>
                  {advancedFilters.attachedBathrooms || "Select attachedBathrooms"}
                </button>
      
                {renderDropdown("attachedBathrooms")}
              </div>
            </div>
          </label>
        </div>
          {/* western */}
          <div className="form-group ">
      
          <label style={{ width: '100%'}}>
          <label>Western</label>
      
            <div style={{ display: "flex", alignItems: "center"}}>
              <div style={{ flex: "1" }}>
                <select
                  name="western"
                  value={advancedFilters.western || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select western</option>
                  {dataList.western?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("western")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                     <FaToilet />
                  </span>
                  {advancedFilters.western || "Select western"}
                </button>
      
                {renderDropdown("western")}
              </div>
            </div>
          </label>
        </div>
 
          {/* carParking */}
      
          <div className="form-group ">
          <label style={{ width: '100%'}}>
          <label>Car Parking</label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="carParking"
                  value={advancedFilters.carParking || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select carParking</option>
                  {dataList.carParking?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("carParking")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                    <FaCar />
                  </span>
                  {advancedFilters.carParking || "Select carParking"}
                </button>
      
                {renderDropdown("carParking")}
              </div>
            </div>
          </label>
        </div>
      
      
 
      
      
        {/* country */}
      
        <div className="form-group ">
        <label>Country:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #2F747F', background:"#fff" }}>
          <BiWorld className="input-icon" style={{color: '#2F747F', marginLeft:"10px"}} />
          <input
            type="text"
            name="country"
            value={advancedFilters.country}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Country"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>
        
        {/* State */}
      
      <div className="form-group ">
        <label>State:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #2F747F', background:"#fff" }}>
          <MdLocationCity className="input-icon" style={{color: '#2F747F', marginLeft:"10px"}} />
          <input
            type="text"
            name="state"
            value={advancedFilters.state}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="State"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
        {/* City */}
      
      <div className="form-group ">
        <label>City:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #2F747F', background:"#fff" }}>
          <FaCity className="input-icon" style={{color: '#2F747F', marginLeft:"10px"}} />
          <input
            type="text"
            name="city"
            value={advancedFilters.city}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="City"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
      
        {/* district */}
        <div className="form-group ">
        <label>District:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #2F747F', background:"#fff" }}>
          <FaRegAddressCard className="input-icon" style={{color: '#2F747F', marginLeft:"10px"}} />
          <input
            type="text"
            name="district"
            value={advancedFilters.district}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="District"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
        {/* area */}
        <div className="form-group " style={{ position: 'relative' }}>
        <label>Area:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #2F747F', background:"#fff" }}>
          <MdLocationOn className="input-icon" style={{color: '#2F747F', marginLeft:"10px"}} />
          <input
            type="text"
            name="area"
            value={advancedFilters.area}
            onChange={handleAreaInputChange}
            onFocus={handleAreaFocus}
            onBlur={handleAreaBlur}
            autoComplete="off"
            className="form-input m-0"
            placeholder="Area"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        {/* Area Suggestions Dropdown */}
        {showAreaSuggestions && areaSuggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            zIndex: 1000
          }}>
            {areaSuggestions.map((areaItem, index) => (
              <div
                key={index}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleAreaSelect(areaItem);
                }}
                style={{
                  padding: '10px 15px',
                  cursor: 'pointer',
                  borderBottom: index < areaSuggestions.length - 1 ? '1px solid #eee' : 'none',
                  fontSize: '14px',
                  color: '#333',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
              >
                {areaItem} - {areaPincodeMap[areaItem]}
              </div>
            ))}
          </div>
        )}
      </div>
        {/* pinCode */}
        <div className="form-group ">
        <label>Pincode:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #2F747F', background:"#fff" }}>
          <TbMapPinCode className="input-icon" style={{color: '#2F747F', marginLeft:"10px"}} />
          <input
            type="text"
            name="pinCode"
            value={advancedFilters.pinCode}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Pincode"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
        {/* streetName */}
        <div className="form-group ">
        <label>Street Name:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #2F747F', background:"#fff" }}>
          <FaRoad className="input-icon" style={{color: '#2F747F', marginLeft:"10px"}} />
          <input
            type="text"
            name="streetName"
            value={advancedFilters.streetName}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Street Name"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
        {/* doorNumber */}
        <div className="form-group ">
        <label>Door Number:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #2F747F', background:"#fff" }}>
          <FaDoorClosed className="input-icon" style={{color: '#2F747F', marginLeft:"10px"}} />
          <input
            type="text"
            name="doorNumber"
            value={advancedFilters.doorNumber}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Door Number"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>
      
        {/* Nagar */}
        <div className="form-group ">
        <label>Nagar:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #2F747F', background:"#fff" }}>
          <FaMapPin className="input-icon" style={{color: '#2F747F', marginLeft:"10px"}} />
          <input
            type="text"
            name="nagar"
            value={advancedFilters.nagar}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Nagar"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
      
        
    

        {/* Best Time to Call */}
        <div className="form-group " >
          <label style={{width:'100%'}}>
          <label>Best Time To Call</label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="bestTimeToCall"
                  value={advancedFilters.bestTimeToCall || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select bestTimeToCall</option>
                  {dataList.bestTimeToCall?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0"
                  type="button"
                  onClick={() => toggleDropdown("bestTimeToCall")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #2F747F",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#2F747F",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                    <FaHome />
                  </span>
                  {advancedFilters.bestTimeToCall || "Select bestTimeToCall"}
                </button>
      
                {renderDropdown("bestTimeToCall")}
              </div>
            </div>
          </label>
        </div>

     

      </div>
        {/* Your search content goes here */}
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</div>

 
      {filteredProperties.length > 0 ? (
      <div className="row">
 
  <div ref={tableRef}>        
          <Table striped bordered hover responsive className="table-sm align-middle">
  <thead className="sticky-top">
    <tr>
      <th>#</th>
      <th>Photo</th>
                    <th className="sticky-col sticky-col-1">RENT ID</th>
              <th className="sticky-col sticky-col-2">Phone Number</th>

      <th>Status</th>
      <th>Property Type</th>
      <th>Mode</th>
      <th>CreateAt</th>
      <th>Rental Amount</th>
      <th>Ownership</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredProperties.map((property, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>
          <img
            src={getFirstPhotoUrl(property.photos, pic)}
            alt="Property"
            style={{ width: "100px", height: "70px", objectFit: "cover", borderRadius: "5px" }}
          />
        </td>
               <td className="sticky-col sticky-col-1"                     style={{
        cursor: "pointer",
      }}  
 
                      
                      >{property.rentId}</td>
                                       <td
  className="sticky-col sticky-col-2" 
>
  {property.phoneNumber}
</td>
        <td>{property.status || 'N/A'}</td>
        <td>{property.propertyType || 'N/A'}</td>
        <td>{property.propertyMode || 'N/A'}</td>
                <td>{property.createdAt ? new Date(property.createdAt).toLocaleString() : 'N/A'}</td>

        <td>{property.rentalAmount || 'N/A'}</td>
        <td>{property.ownership || 'N/A'}</td>
        <td>
          <FaEye
            size={18}
            style={{ marginRight: '10px', cursor: 'pointer' }}
            onClick={() =>
              navigate(`/dashboard/detail`, {
                state: {
                  rentId: property.rentId,
                  phoneNumber: property.phoneNumber,
                },
              })
            }
          />
          <FaEdit
            size={18}
            style={{ cursor: 'pointer' }}
            onClick={() =>
              navigate(`/dashboard/edit-property`, {
                state: {
                  rentId: property.rentId,
                  phoneNumber: property.phoneNumber,
                },
              })
            }
          />
        </td>
      </tr>
    ))}
  </tbody>
</Table>
   </div>
        </div>
      ) : (
        <p>No properties found.</p>
      )}
    </div>
  );
};

export default SearchProperty;





