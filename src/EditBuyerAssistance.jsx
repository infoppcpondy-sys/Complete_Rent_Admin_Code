




import React, { useState, useEffect ,useRef} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { useSelector } from 'react-redux';
// import moment from 'moment';
// import {
//   FaPhone, FaBuilding, FaHome, FaBed, FaCompass,
//   FaCheckCircle, FaUniversity, FaClock, FaCity,
//   FaMapMarkerAlt, FaLandmark, FaRuler, FaCreditCard,
//   FaChevronDown, FaTimes,
//   FaArrowLeft,FaCar
// } from 'react-icons/fa';
// import { MdLocationOn, MdOutlineMeetingRoom, MdOutlineOtherHouses, MdSchedule , MdStraighten , MdApproval, MdLocationCity , MdAddPhotoAlternate, MdKeyboardDoubleArrowDown, MdOutlineClose} from "react-icons/md";
// import { BsBank, BsBuildingsFill, BsFillHouseCheckFill , BsTextareaT} from "react-icons/bs";

import imge from "./Assets/ppbuyer.png";
import { RiCloseCircleFill, RiLayoutLine } from 'react-icons/ri';
import { TbArrowLeftRight, TbMapPinCode, TbWorldLongitude } from 'react-icons/tb';
import {FaPhoneAlt, FaRulerCombined, FaBuilding, FaBath,FaRuler,FaCompass, FaChartArea, FaPhone ,FaEdit,FaRoad,FaCreditCard,FaLandmark, FaHome, FaUserAlt, FaEnvelope,  FaRupeeSign , FaFileVideo , FaToilet,FaCar,FaBed,  FaCity , FaTimes, FaArrowRight, FaStreetView, FaSearch, FaHandHoldingUsd, FaUsers, FaUtensils, FaBriefcase, FaDog,FaArrowLeft, FaChevronLeft} from 'react-icons/fa';
import {  FaRegAddressCard, FaChevronDown } from 'react-icons/fa6';
import { MdLocationOn, MdOutlineMeetingRoom, MdOutlineOtherHouses, MdSchedule , MdStraighten , MdApproval, MdLocationCity , MdAddPhotoAlternate, MdKeyboardDoubleArrowDown, MdOutlineClose} from "react-icons/md";
import { BsBank, BsBuildingsFill, BsFillHouseCheckFill , BsTextareaT} from "react-icons/bs";
import { GiKitchenScale, GiMoneyStack , GiResize , GiGears} from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi";
import { BiBuildingHouse , BiMap, BiWorld} from "react-icons/bi";
import {   FaFileAlt, FaGlobeAmericas, FaMapMarkerAlt, FaMapSigns } from "react-icons/fa";
import {MdElevator ,MdOutlineChair ,MdPhone, MdOutlineAccessTime, MdTimer, MdHomeWork, MdHouseSiding, MdOutlineKitchen, MdEmail, } from "react-icons/md";
import {  BsBarChart, BsGraphUp } from "react-icons/bs";
import { BiBuilding, BiStreetView } from "react-icons/bi";
import { GiStairs, GiForkKnifeSpoon, GiWindow } from "react-icons/gi";
import { AiOutlineEye, AiOutlineColumnWidth, AiOutlineColumnHeight } from "react-icons/ai";
import { BiBed, BiBath, BiCar, BiCalendar, BiUser, BiCube } from "react-icons/bi";
import minprice from "./Assets/Price Mini-01.png";
import maxprice from "./Assets/Price maxi-01.png";
import { FcSearch } from "react-icons/fc";
import { toWords } from 'number-to-words';




// icon
import propertyMode from './Assets/prop_mode.PNG';
import propertyType from './Assets/prop_type.PNG';
import price from './Assets/amount.png';
import propertyAge from './Assets/age.PNG';
import bankLoan from './Assets/alt_mob.PNG';
import negotiation from './Assets/nego.PNG';
import length from './Assets/alt_mob.PNG';
import breadth from './Assets/alt_mob.PNG';
import totalArea from './Assets/total_area.png';
import ownership from './Assets/alt_mob.PNG';
import bedrooms from './Assets/bed.PNG';
import requirementType from './Assets/alt_mob.PNG';
import requirementTypeType from './Assets/alt_mob.PNG';
import balconies from './Assets/alt_mob.PNG';
import floorNo from './Assets/floor.PNG';
import areaUnit from './Assets/area_unit.png';
import propertyApproved from './Assets/alt_mob.PNG';
import postedBy from './Assets/posted_by.png';
import facing from './Assets/facing.png';
import salesMode from './Assets/alt_mob.PNG';
import salesType from './Assets/alt_mob.PNG';
import description from './Assets/alt_mob.PNG';
import furnished from './Assets/furnish.PNG';
import lift from './Assets/lift.PNG';
import attachedBathrooms from './Assets/attach.png';
import western from './Assets/western.PNG';
import carParking from './Assets/parking.png';
import rentalPropertyAddress from './Assets/alt_mob.PNG';
import country from './Assets/alt_mob.PNG';
import state from './Assets/state.png';
import city from './Assets/city.PNG';
import district from './Assets/alt_mob.PNG';
import area from './Assets/area.png';
import streetName from './Assets/street.PNG';
import doorNumber from './Assets/door.png';
import nagar from './Assets/nagar.PNG';
import ownerName from './Assets/name.PNG';
import email from './Assets/email.PNG';
import phone from './Assets/phone.PNG';
import altphone from './Assets/alt_mob.PNG';

import bestTimeToCall from './Assets/best_time.png';
import pinCode from './Assets/alt_mob.PNG';
import locationCoordinates from './Assets/alt_mob.PNG';
import rentType from './Assets/rent_type.PNG';
import pet from './Assets/pet.PNG';
import members from './Assets/member.PNG';
import jobType from './Assets/job.PNG';
import food from './Assets/food.png';
import dateavailable from './Assets/date.PNG';
import securityDeposit from './Assets/advance.PNG';
import { LiaCitySolid } from "react-icons/lia";
import { GoCheckCircleFill } from "react-icons/go";
import { motion } from 'framer-motion';

const EditBuyerAssistance = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    altPhoneNumber: "",
    city: "",
    area: "",
    minPrice: "",
    maxPrice: "",
    facing:"",
  areaUnit: "",
    totalArea:"",    
    bedrooms: "",
    propertyMode: "",
    propertyType: "",
   rentType:"",
    numberOfFloors:"",
    requirementType:"",
     familyMembers:"",
  foodHabit:"",
  jobType:"",
  petAllowed:"",
    state: "",
    description: "",
    raName:"",
    alternatePhone:""
  });

   const cityTimeoutRef = useRef(null);
    const areaTimeoutRef = useRef(null);


     const baseStyle = {
      backgroundColor: "#4F4B7E",
      color: "#fff",
      border: "none",
      padding: "8px 16px",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    };
  
    const hoverStyle = {
      backgroundColor: "#CDC9F9",
    };
      const suggestionListStyle = {
  listStyle: "none",
  margin: 0,
  padding: "5px",
  border: "1px solid #ccc",
  borderTop: "none",
  maxHeight: "150px",
  overflowY: "auto",
  position: "absolute",
  width: "100%",
  background: "#ffffff",
  zIndex: 1000,
};

const suggestionItemStyle = {
  padding: "8px 10px",
  cursor: "pointer",
};

const suggestionItemHoverStyle = {
  backgroundColor: "#f0f0f0",
};

  const location = useLocation();
  const navigate = useNavigate();
//   const ba_id = location.state?.ba_id;
const Ra_Id = Number(location.state?.Ra_Id); // 🔁 Convert to Number

  const [paymentTypes, setPaymentTypes] = useState([]);
  const [dropdownState, setDropdownState] = useState({ activeDropdown: null, filterText: "" });
  const [buyerRequests, setBuyerRequests] = useState([]);
  const [dataList, setDataList] = useState({});
  const [loading, setLoading] = useState(true);
  const [allowedRoles, setAllowedRoles] = useState([]);

      const [priceInWords, setPriceInWords] = useState("");
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
    
        const [citySuggestions, setCitySuggestions] = useState([]);
    const [areaSuggestions, setAreaSuggestions] = useState([]);

  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // Adjust the delay as needed
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // Fetch initial data
  useEffect(() => {
    fetchPaymentTypes();
    fetchDropdownData();
    if (Ra_Id) {
      fetchBuyerAssistanceData(Ra_Id);
    }
  }, [Ra_Id]);

  // Fetch payment types
  const fetchPaymentTypes = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/payment-all`);
      setPaymentTypes(res.data);
    } catch (error) {
    }
  };


   const fieldIcons = {
      // Contact Details
      phoneNumber: <FaPhone color="#4F4B7E" />,
      alternatePhone: <FaPhone color="#4F4B7E" />,
      email: <FaEnvelope color="#4F4B7E" />,
      propertyType: <MdSchedule color="#4F4B7E" />,
      
      // Property Location
      rentalPropertyAddress: <MdLocationCity color="#4F4B7E" />,
      country: <BiWorld color="#4F4B7E" />,
      state: <MdLocationCity color="#4F4B7E" />,
      city: <FaCity color="#4F4B7E" />,
      district: <FaRegAddressCard color="#4F4B7E" />,
      area: <MdLocationOn color="#4F4B7E" />,
      streetName: <RiLayoutLine color="#4F4B7E" />,
      doorNumber: <BiBuildingHouse color="#4F4B7E" />,
      nagar: <FaRegAddressCard color="#4F4B7E" />,
    
      // Ownership & Posting Info
      ownerName: <FaUserAlt color="#4F4B7E" />,
      postedBy: <FaUserAlt color="#4F4B7E" />,
      ownership: <HiUserGroup color="#4F4B7E" />,
    
      // Property Details
      propertyMode: <MdApproval color="#4F4B7E" />,
      propertyType: <MdOutlineOtherHouses color="#4F4B7E" />,
      propertyApproved: <BsFillHouseCheckFill color="#4F4B7E" />,
      propertyAge: <MdSchedule color="#4F4B7E" />,
      description: <BsTextareaT color="#4F4B7E" />,
    
      // Pricing & Financials
      rentalAmount: <FaRupeeSign color="#4F4B7E" />,
      bankLoan: <BsBank color="#4F4B7E" />,
      negotiation: <GiMoneyStack color="#4F4B7E" />,
    
      // Measurements
      length: <MdStraighten color="#4F4B7E" />,
      breadth: <MdStraighten color="#4F4B7E" />,
      totalArea: <GiResize color="#4F4B7E" />,
      areaUnit: <FaChartArea color="#4F4B7E" />,
  
       rentType: <FaHandHoldingUsd color="#4F4B7E" />,
    requirementType: <MdApproval color="#4F4B7E" />,
    familyMembers: <FaUsers color="#4F4B7E" />,
    foodHabit: <FaUtensils color="#4F4B7E" />,
    jobType: <FaBriefcase color="#4F4B7E" />,
    petAllowed: <FaDog color="#4F4B7E" />,
    
      // Room & Floor Details
      bedrooms: <FaBed color="#4F4B7E" />,
      kitchen: <GiKitchenScale color="#4F4B7E" />,
      kitchenType: <GiKitchenScale color="#4F4B7E" />,
      balconies: <MdOutlineMeetingRoom color="#4F4B7E" />,
      floorNo: <BsBuildingsFill color="#4F4B7E" />,
      numberOfFloors: <BsBuildingsFill color="#4F4B7E" />,
      attachedBathrooms: <FaBath color="#4F4B7E" />,
      western: <FaToilet  color="#4F4B7E" />,
    
      // Features & Amenities
      facing: <TbArrowLeftRight color="#4F4B7E" />,
      salesMode: <GiGears color="#4F4B7E" />,
      salesType: <MdOutlineOtherHouses color="#4F4B7E" />,
      furnished: <FaHome color="#4F4B7E" />,
      lift: <BsBuildingsFill color="#4F4B7E" />,
      carParking: <FaCar color="#4F4B7E" />,
    };
const fieldLabels = {
  propertyMode: "Property Mode",
  propertyType: "Property Type",
    rentType: "rent Type",
    minPrice:"Min Rental Amount",
    maxPrice:"Max Rental Amount",
  rentalAmount: "Rental Amount",
  propertyAge: "Property Age",
  bankLoan: "Bank Loan",
  negotiation: "Negotiation",
    securityDeposit: "security Deposit",
  length: "Length",
  breadth: "Breadth",
  totalArea: "Total Area",
  ownership: "Ownership",
  bedrooms: "Bedrooms",
  kitchen: "Kitchen",
  availableDate: "available From",
  familyMembers: "No. of family Members",
  foodHabit: "food Habit",
  jobType: "job Type",
  petAllowed: "pet",
    wheelChairAvailable:"wheel Chair",
requirementType:"Requirement Type",
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
  const handleFilterChange = (e) => {
      setDropdownState((prevState) => ({ ...prevState, filterText: e.target.value }));
    };
  
 const renderDropdown = (field) => {
   const options = dataList[field] || [];
   const filteredOptions = options.filter((option) =>
     option.toLowerCase().includes(dropdownState.filterText.toLowerCase())
   );
 
   return (
     <div data-field={field}>
       {dropdownState.activeDropdown === field && (
         <div
           className="popup-overlay"
           style={{
             position: 'fixed',
             top: 0,
             left: 0,
             width: '100vw',
             height: '100vh',
             backgroundColor: 'rgba(0, 0, 0, 0.5)',
             zIndex: 1509,
             animation: 'fadeIn 0.3s ease-in-out',
           }}
         >
           <div
             className="dropdown-popup"
             style={{
               position: 'fixed',
               top: '50%',
               left: '50%',
               transform: 'translate(-50%, -50%)',
               backgroundColor: 'white',
               width: '100%',
               maxWidth: '300px',
               padding: '10px',
               zIndex: 10,
               boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',
               borderRadius: '18px',
               animation: 'popupOpen 0.3s ease-in-out',
             }}
           >
             <div
               className="p-1"
               style={{
                 fontWeight: 500,
                 fontSize: '15px',
                 marginBottom: '10px',
                 textAlign: 'start',
                 color: 'grey',
               }}
             >
               Select or Search{' '}
               <span style={{ color: '#0B57CF', fontWeight: 500 }}>
                 {fieldLabels[field] || 'Property Field'}
               </span>
             </div>
             <div
               className="mb-1"
               style={{
                 position: 'relative',
                 width: '100%',
                 background: '#EEF4FA',
                 borderRadius: '25px',
               }}
             >
               <FcSearch
                 size={16}
                 style={{
                   position: 'absolute',
                   left: '10px',
                   top: '50%',
                   transform: 'translateY(-50%)',
                   pointerEvents: 'none',
                   color: 'black',
                 }}
               />
               <input
                 className="m-0 rounded-0 ms-1"
                 type="text"
                 placeholder="Filter options..."
                 value={dropdownState.filterText}
                 onChange={handleFilterChange}
                 style={{
                   width: '100%',
                   padding: '5px 5px 5px 30px', // left padding for the icon
                   background: 'transparent',
                   border: 'none',
                   outline: 'none',
                 }}
               />
             </div>
 
             <ul
               style={{
                 listStyleType: 'none',
                 padding: 0,
                 margin: 0,
                 overflowY: 'auto',
                 maxHeight: '350px',
               }}
             >
               {filteredOptions.map((option, index) => (
                 <li
                   key={index}
                 onClick={() => {
   setFormData((prevState) => ({
     ...prevState,
     [field]: option,
   }));
 
   toggleDropdown(field); // Close current dropdown
 
   const currentIndex = dropdownFieldOrder.indexOf(field);
   if (currentIndex !== -1 && currentIndex < dropdownFieldOrder.length - 1) {
     const nextField = dropdownFieldOrder[currentIndex + 1];
 
     if (nonDropdownFields.includes(nextField)) {
       // Focus the next input field and scroll to it
       setTimeout(() => {
         const nextInput = document.querySelector(`[name="${nextField}"]`);
         if (nextInput) {
           nextInput.focus();
           nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }
       }, 150);
     } else {
       // Open next dropdown and scroll it into view
       setTimeout(() => {
         toggleDropdown(nextField);
         setTimeout(() => {
           const el = document.querySelector(`[data-field="${nextField}"]`);
           if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }, 100);
       }, 0);
     }
   }
 }}
 
                   style={{
                     fontWeight: 300,
                     padding: '5px',
                     cursor: 'pointer',
                     color: 'grey',
                     marginBottom: '5px',
                     borderBottom: '1px solid #D0D7DE',
                   }}
                 >
                   {option}
                 </li>
               ))}
             </ul>
 
             <div className="d-flex justify-content-end">
               <button
                 className="me-1"
                 type="button"
                onClick={() => {
     toggleDropdown(field); // Close current dropdown
 
     const currentIndex = dropdownFieldOrder.indexOf(field);
 
     if (currentIndex > 0) {
       const prevField = dropdownFieldOrder[currentIndex - 1];
 
       if (nonDropdownFields.includes(prevField)) {
         setTimeout(() => {
           const prevInput = document.querySelector(`[name="${prevField}"]`);
           if (prevInput) {
             prevInput.focus();
             prevInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
           }
         }, 100);
       } else {
         setTimeout(() => {
           toggleDropdown(prevField); // Open prev dropdown
           setTimeout(() => {
             const el = document.querySelector(`[data-field="${prevField}"]`);
             if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
           }, 100);
         }, 0);
       }
     }
   }}
                 style={{
                   background: '#EAEAF6',
                   cursor: 'pointer',
                   border: 'none',
                   color: '#0B57CF',
                   borderRadius: '10px',
                   padding: '5px 10px',
                   fontWeight: 500,
                 }}
               >
                 Prev
               </button>
  <button
   type="button"
   onClick={() => {
     toggleDropdown(field); // Close current dropdown
 
     const currentIndex = dropdownFieldOrder.indexOf(field);
 
     if (currentIndex !== -1 && currentIndex < dropdownFieldOrder.length - 1) {
       const nextField = dropdownFieldOrder[currentIndex + 1];
 
       if (nonDropdownFields.includes(nextField)) {
         setTimeout(() => {
           const nextInput = document.querySelector(`[name="${nextField}"]`);
           if (nextInput) {
             nextInput.focus();
             nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
           }
         }, 100);
       } else {
         setTimeout(() => {
           toggleDropdown(nextField); // Open next dropdown
           setTimeout(() => {
             const el = document.querySelector(`[data-field="${nextField}"]`);
             if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
           }, 100);
         }, 0);
       }
     }
   }}
  style={{
                    background: '#EAEAF6',
                    cursor: 'pointer',
                    border: 'none',
                    color: '#0B57CF',
                    borderRadius: '10px',
                    padding: '5px 10px',
                    fontWeight: 500,
                    marginRight:"5px"
                  }}
 >
   skip
 </button>
               <button
                 type="button"
                 onClick={() => toggleDropdown(field)}
                 style={{
                   background: '#0B57CF',
                   cursor: 'pointer',
                   border: 'none',
                   color: '#fff',
                   borderRadius: '10px',
                 }}
               >
                 Close
               </button>
             </div>
 
             {/* {[
               'negotiation',
               'ownership',
               'floorNo',
               'postedBy',
               'carParking',
               'bestTimeToCall',
             ].includes(field) && (
               <div
                 style={{
                   marginTop: '10px',
                   paddingTop: '10px',
                   borderTop: '1px solid #ccc',
                   textAlign: 'center',
                 }}
               >
                 <div
                   style={{
                     fontSize: '14px',
                     fontWeight: 400,
                     color: '#555',
                     marginBottom: '8px',
                   }}
                 >
                   Swipe through options to continue
                 </div>
               </div>
             )} */}
           </div>
         </div>
       )}
     </div>
   );
 };
  const nonDropdownFields = ["alternatePhone", "totalArea", "baName", "city", "area", "description",];

const dropdownFieldOrder = [
    "minPrice",
  "maxPrice",
   "altPhoneNumber",
  "propertyMode",
  "propertyType",
  "rentType",
  "bedrooms",
  "facing",
   "totalArea",
   
    "areaUnit",

  "floorNo",
"requirementType",
  "state",
  "city",
  "area",
  "description",
"familyMembers",
"foodHabit",
"jobType",
"petAllowed",


    // "totalArea",
  "raName",
  "phoneNumber"
];

 const [countryCodes, setCountryCodes] = useState([
      { code: '+1', country: 'USA/Canada' },
      { code: '+44', country: 'UK' },
      { code: '+91', country: 'India' },
      { code: '+61', country: 'Australia' },
      { code: '+81', country: 'Japan' },
      { code: '+49', country: 'Germany' },
      { code: '+33', country: 'France' },
      { code: '+34', country: 'Spain' },
      { code: '+55', country: 'Brazil' },
      { code: '+52', country: 'Mexico' },
      { code: '+86', country: 'China' },
      { code: '+39', country: 'Italy' },
      { code: '+7', country: 'Russia/Kazakhstan' },
      // ... other countries
    ]);
    const fetchCitySuggestions = (input) => {
  clearTimeout(cityTimeoutRef.current);
  cityTimeoutRef.current = setTimeout(async () => {
    if (!input) return setCitySuggestions([]);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/cities?search=${input}`);
      setCitySuggestions(res.data.data);
    } catch (err) {
      setCitySuggestions([]);
    }
  }, 300);
};

const fetchAreaSuggestions = (input) => {
  clearTimeout(areaTimeoutRef.current);
  areaTimeoutRef.current = setTimeout(async () => {
    if (!input) return setAreaSuggestions([]);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/areas?search=${input}`);
      setAreaSuggestions(res.data.data);
    } catch (err) {
      setAreaSuggestions([]);
    }
  }, 300);
};


   const convertToIndianRupees = (num) => {
        const number = parseInt(num, 10);
        if (isNaN(number)) return "";
      
        if (number >= 10000000) {
          return (number / 10000000).toFixed(2).replace(/\.00$/, '') + " crores";
        } else if (number >= 100000) {
          return (number / 100000).toFixed(2).replace(/\.00$/, '') + " lakhs";
        } else {
          return toWords(number).replace(/\b\w/g, l => l.toUpperCase()) + " rupees";
        }
      };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

 const handleInputChanges = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));

  if (name === 'city') {
    fetchCitySuggestions(value);
  } else if (name === 'area') {
    fetchAreaSuggestions(value);
  }
};

    const handleFieldChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        
        ...prev,
        [name]: name === "description" && value.length > 0 
          ? value.charAt(0).toUpperCase() + value.slice(1)  // Capitalize only "description"
          : value,
          
      }));
        // Handle price conversion
    if (name === "rentalAmount") {
      if (value !== "" && !isNaN(value)) {
        setPriceInWords(convertToIndianRupees(value));
      } else {
        setPriceInWords("");
      }
    }
  };

  // Fetch dropdown options
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

  // Fetch buyer assistance data for editing
  const fetchBuyerAssistanceData = async (Ra_Id) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-buyerAssistance-rent/${Ra_Id}`);
      if (res.data && res.data.data) {
        setFormData(prev => ({ ...prev, ...res.data.data }));
      } else {
      }
    } catch (error) {
    }
  };

  // Handle dropdown toggle
  const toggleDropdown = (field) => {
    setDropdownState((prevState) => ({
      activeDropdown: prevState.activeDropdown === field ? null : field,
      filterText: ""
    }));
  };

  // Handle dropdown selection
  const handleDropdownSelect = (field, value) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
    setDropdownState({ activeDropdown: null, filterText: "" });
  };

  // Handle form input change
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevState) => ({ ...prevState, [name]: value }));
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (Ra_Id) {
        // ✅ Update existing request
await axios.put(`${process.env.REACT_APP_API_URL}/update-buyer-Assistance/${Ra_Id}`, formData);
        alert("Request updated successfully!");
      } else {
        // ✅ Create new request
        await axios.post(`${process.env.REACT_APP_API_URL}/add-buyerAssistance-rent`, formData);
        alert("Request added successfully!");
      }

      setFormData({
        phoneNumber: "",
        altPhoneNumber: "",
        city: "",
    area: "",
    minPrice: "",
    maxPrice: "",
    facing:"",
    areaUnit: "",
        totalArea:"",
    
    bedrooms: "",
    propertyMode: "",
    propertyType: "",
   rentType:"",
    numberOfFloors:"",
    requirementType:"",
     familyMembers:"",
  foodHabit:"",
  jobType:"",
  petAllowed:"",
    state: "",
    description: "",
    raName:"",
    alternatePhone:""
      });

      // navigate("/dashboard/buyer-assistance-list");
    } catch (error) {
      alert("Failed to process the request.");
    }
  };

const formatIndianNumber = (x) => {
  x = x.toString();
  const lastThree = x.slice(-3);
  const otherNumbers = x.slice(0, -3);
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherNumbers ? "," : "") + lastThree;
};

const formatPrice = (price) => {
  price = Number(price);
  if (isNaN(price)) return 'N/A';

  if (price >= 10000000) {
    return (price / 10000000).toFixed(2) + ' Cr';
  } else if (price >= 100000) {
    return (price / 100000).toFixed(2) + ' Lakhs';
  } else {
    return formatIndianNumber(price);
  }
};
  // if (loading) return <p>Loading...</p>;



  return (
  <div className="d-flex flex-column mx-auto custom-scrollbar"
    style={{
      maxWidth: '450px',
      height: '100vh',
      overflow: 'auto',
      scrollbarWidth: 'none', 
      msOverflowStyle: 'none', 
      fontFamily: 'Inter, sans-serif'
    }}>

                <div className="d-flex align-items-center justify-content-start w-100 p-2"      style={{
          background: "#EFEFEF",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          opacity: isScrolling ? 0 : 1,
          pointerEvents: isScrolling ? "none" : "auto",
          transition: "opacity 0.3s ease-in-out",
        }}>
                <button    
                 className="d-flex align-items-center justify-content-center ps-3 pe-2"
  
        onClick={() => navigate(-1)}
        style={{
            background: "transparent",
        border: "none",
        height: "100%",color:"#CDC9F9",
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
    
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#f0f4f5'; // Change background
          e.currentTarget.querySelector('svg').style.color = '#4F4B7E'; // Change icon color
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#CDC9F9';
          e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
        }}
      >
        <FaChevronLeft style={{ color: '#4F4B7E', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
         </button> <h3 className="m-0 " style={{fontSize:"18px"}}>Edit Tenant Assistance</h3> </div>      {/* Property Assistance Form */}
      <div className="p-0" style={{ fontFamily: "Inter, sans-serif" }}>
        <img src={imge} alt="" className="header-image" style={{ width: '100%' }} />

        <h4 className="mt-3" style={{ color: "#4F4B7E" , fontSize:"15px", fontWeight:"bold" }}>
          {Ra_Id ? "Edit Property Assistance" : "Add Property Assistance"}
        </h4>

         <form onSubmit={handleSubmit} className="p-3">
  
    

 <div className="row mb-3 justify-content-around">
 
 
{/* <div className="form-group col-5 p-0 m-0" >
    <label style={{width:'100%'}}>
    <label>minPrice <span style={{ color: 'red' }}>* </span></label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
          <select
            name="minPrice"
            value={formData.minPrice || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select minPrice</option>
            {dataList.minPrice?.map((option, index) => (
              <option key={index} value={option}>
                 {formatPrice(option)}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("minPrice")}
            style={{
              cursor: "pointer",
              border: "1px solid #4F4B7E",
              padding: "10px",
              background: "#fff",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "#4F4B7E",
            }}
          >
            <span style={{ marginRight: "10px" }}>
              <img src={minprice} alt=""  width={20}/>
            </span>
            {formData.minPrice ? formatPrice(formData.minPrice) : "Select minPrice"}
          </button>

          {renderDropdown("minPrice")}
        </div>
      </div>
    </label>
  </div> */}
<div div className="form-group col-5 p-0 m-0" >
    <label style={{ width: '100%'}}>
    {/* <label>Property Mode <span style={{ color: 'red' }}>* </span></label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>
  <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
<img src={minprice} alt="" width={20}/>
 <sup style={{ color: 'red' }}>*</sup>  </span>

  <div style={{ flex: "1" }}>
    <select
      name="minPrice"
      value={formData.minPrice || ""}
      onChange={handleFieldChange}
      className="form-control"
      style={{ display: "none" }}
      required
    >
      <option value="">Select minPrice</option>
      {dataList.minPrice?.map((option, index) => (
        <option key={index} value={option}>
         {formatPrice(option)}
        </option>
      ))}
    </select>

    <button
      className="m-0"
      type="button"
      onClick={() => toggleDropdown("minPrice")}
      style={{
        border:"none",
        cursor: "pointer",
        padding: "12px",
        background: "#fff",
        borderRadius: "5px",
        width: "100%",
        textAlign: "left",
        color: "grey",
        position: "relative",
        boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
        fontSize:"13px"
      }}
    >
{formData.minPrice ? formatPrice(formData.minPrice) : "Select Min Rental Amount"}
      {formData.minPrice && (
        <GoCheckCircleFill
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "green",
          }}
        />
      )}
    </button>

    {renderDropdown("minPrice")}
  </div>
</div>

    </label>
  </div>
    {/* <div className="form-group col-5 p-0 m-0" >
        <label style={{width:'100%'}}>
        <label>maxPrice <span style={{ color: 'red' }}>* </span></label>
    
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: "1" }}>
              <select
                name="maxPrice"
                value={formData.maxPrice || ""}
                onChange={handleFieldChange}
                className="form-control"
                style={{ display: "none" }} // Hide the default <select> dropdown
              >
                <option value="">Select maxPrice</option>
                {dataList.maxPrice?.map((option, index) => (
                  <option key={index} value={option}>
                     {formatPrice(option)}
                  </option>
                ))}
              </select>
    
              <button
                className="m-0"
                type="button"
                onClick={() => toggleDropdown("maxPrice")}
                style={{
                  cursor: "pointer",
                  border: "1px solid #4F4B7E",
                  padding: "10px",
                  background: "#fff",
                  borderRadius: "5px",
                  width: "100%",
                  textAlign: "left",
                  color: "#4F4B7E",
                }}
              >
                <span style={{ marginRight: "10px" }}>
                  <img src={maxprice} alt="" width={20}/>
                </span>
{formData.maxPrice ? formatPrice(formData.maxPrice) : "Select maxPrice"}
              </button>
    
              {renderDropdown("maxPrice")}
            </div>
          </div>
        </label>
      </div> */}
 <div className="form-group col-5 p-0 m-0" >
    <label style={{ width: '100%'}}>
    {/* <label>Property Mode <span style={{ color: 'red' }}>* </span></label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>
  <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
 <img src={maxprice} alt="" width={20}/>
 <sup style={{ color: 'red' }}>*</sup>  </span>

  <div style={{ flex: "1" }}>
    <select
      name="maxPrice"
      value={formData.maxPrice || ""}
      onChange={handleFieldChange}
      className="form-control"
      style={{ display: "none" }}
    >
      <option value="">Select maxPrice</option>
      {dataList.maxPrice?.map((option, index) => (
        <option key={index} value={option}>
          {formatPrice(option)}
        </option>
      ))}
    </select>

    <button
      className="m-0"
      type="button"
      onClick={() => toggleDropdown("maxPrice")}
      style={{
        border:"none",
        cursor: "pointer",
        padding: "12px",
        background: "#fff",
        borderRadius: "5px",
        width: "100%",
        textAlign: "left",
        color: "grey",
        position: "relative",
        boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
        fontSize:"13px"

      }}
    >
{formData.maxPrice ? formatPrice(formData.maxPrice) : "Select Max Rental Amount"}
      {formData.maxPrice && (
        <GoCheckCircleFill
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "green",
          }}
        />
      )}
    </button>

    {renderDropdown("maxPrice")}
  </div>
</div>

    </label>
  </div>

    </div>

      {/* <div className="col-12 mb-3">
        <label  style={{fontWeight:600}}>PhoneNumber</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background: "#fff" }}>
    <FaPhoneAlt className="input-icon" style={{ color: '#4F4B7E', marginLeft: "10px" }} />
    <input
      type="tel"
      name="phoneNumber"
      value={formData.phoneNumber}
      onChange={handleInputChange}
      className="form-input m-0"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
      />
  </div>
</div> */}
<div className="form-group">
{/* <label>Phone Number:</label> */}

  <div className="input-card p-0 rounded-2 mb-2" style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%',  
    boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
    background: "#fff",
    paddingRight: "10px"
  }}>
    
  
  <img src={phone} alt="" style={{ width: 20, height: 20 ,marginLeft:"10px"}} />
     {/* <FaPhone className="input-icon" style={{ color: '#4F4B7E', marginLeft:"10px"}} /> */}
    
    <div style={{ flex: '0 0 10%' }}>
  <label className="m-0">
    <select
      name="countryCode"
      value={"+91"}
      readOnly
      onChange={handleFieldChange}
      className="form-control m-0 pt-2"
      style={{ width: '100%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    >
      {countryCodes.map((item, index) => (
        <option key={index} value={item.code}>
          {item.code} {item.country}
        </option>
      ))}
    </select>
  </label>
</div>


    <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
  <input
      type="text"
      name="phoneNumber"
      value={formData.phoneNumber}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Phone Number"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    </div>
</div>

{/* <div className="col-12 mb-3">
  <label  style={{fontWeight:600}}>AlternatePhone</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background: "#fff" }}>
    <FaPhoneAlt className="input-icon" style={{ color: '#4F4B7E', marginLeft: "10px" }} />
    <input
      type="number"
      name="alternatePhone"
      value={formData.alternatePhone}
      onChange={handleInputChange}
      className="form-input m-0"
      placeholder="Enter Your alternatePhone"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
      />
  </div>
</div> */}
<div className="form-group">
{/* <label>Alternate number:</label> */}

  <div className="input-card p-0 rounded-2 mb-2" style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%',  
    boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
    background: "#fff",
    paddingRight: "10px"
  }}>
    
  <img src={altphone} alt="" style={{ width: 20, height: 20 ,marginLeft:"10px"}} />
     {/* <FaPhone className="input-icon" style={{ color: '#4F4B7E',marginLeft:"10px" }} /> */}
    
    <div style={{ flex: '0 1 10%' }}>
      <label className="m-0">
        <select
          name="countryCode"
          value={"+91"}
          onChange={handleFieldChange}
          className="form-control m-0"
          style={{ width: '100%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
        >
          <option value="">Select Country Code</option>
          {countryCodes.map((item, index) => (
            <option key={index} value={item.code}>
              {item.code} {item.country}
            </option>
          ))}
        </select>
      </label>
    </div>
    <div style={{ display: "flex", alignItems: "center", flex: 1 }}>


  <input
      type="number"
      name="alternatePhone"
      value={formData.alternatePhone}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Alternate Phone Number"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.alternatePhone && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
    </div>
</div>

  <div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>Property Mode <span style={{ color: 'red' }}>* </span></label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>
  <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
 {fieldIcons.propertyMode} <sup style={{ color: 'red' }}>*</sup>  </span>

  <div style={{ flex: "1" }}>
    <select
      name="propertyMode"
      value={formData.propertyMode || ""}
      onChange={handleFieldChange}
      className="form-control"
      style={{ display: "none" }}
      
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
        border:"none",
        cursor: "pointer",
        padding: "12px",
        background: "#fff",
        borderRadius: "5px",
        width: "100%",
        textAlign: "left",
        color: "grey",
        position: "relative",
        boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
      }}
    >
      {formData.propertyMode || "Select Property Mode"}
      {formData.propertyMode && (
        <GoCheckCircleFill
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "green",
          }}
        />
      )}
    </button>

    {renderDropdown("propertyMode")}
  </div>
</div>

    </label>
  </div>

 
 <div className="form-group"> 
  <label style={{ width: '100%' }}>
    {/* <label>Property Type <span style={{ color: 'red' }}>* </span> </label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>           <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
            {fieldIcons.propertyType} <sup style={{ color: 'red' }}>*</sup>
          </span>
      <div style={{ flex: "1" }}>
        <select
          name="propertyType"
          value={formData.propertyType || ""}
          onChange={handleFieldChange}
          className="form-control"
          style={{ display: "none" }} 
          
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
            border:"none",
            cursor: "pointer",
            // border: "1px solid #4F4B7E",
            padding: "12px",
            background: "#fff",
            borderRadius: "5px",
            width: "100%",
            textAlign: "left",
            color: "grey",
            position: "relative",
            boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
          }}
        >
    
          {formData.propertyType || "Select Property Type"}

          {formData.propertyType && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}
        </button>

        {renderDropdown("propertyType")}
      </div>
    </div>
  </label>
</div>

 
<div className="form-group"> 
  <label style={{ width: '100%' }}>
    {/* <label>renty Type <span style={{ color: 'red' }}>* </span> </label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>           <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
            {fieldIcons.rentType} 
          </span>
      <div style={{ flex: "1" }}>
        <select
          name="rentType"
          value={formData.rentType || ""}
          onChange={handleFieldChange}
          className="form-control"
          style={{ display: "none" }} 
          
        >
          <option value="">Select renty Type</option>
          {dataList.rentType?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          className="m-0"
          type="button"
          onClick={() => toggleDropdown("rentType")}
          style={{
            cursor: "pointer",
            border:"none",
            // border: "1px solid #4F4B7E",
            padding: "12px",
            background: "#fff",
            borderRadius: "5px",
            width: "100%",
            textAlign: "left",
            color: "grey",
            position: "relative",
            boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
          }}
        >
    
          {formData.rentType || "Select Rent Type"}

          {formData.rentType && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}
        </button>

        {renderDropdown("rentType")}
      </div>
    </div>
  </label>
</div>


 <div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>Bedrooms </label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>       <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
              {fieldIcons.bedrooms || <FaHome />}
            </span> <div style={{ flex: "1" }}>
          <select
          
            name="bedrooms"
            value={formData.bedrooms || ""}
            onChange={handleFieldChange}
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
              border:"none",
              // border: "1px solid #4F4B7E",
              padding: "12px",
              background: "#fff",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
             
            {formData.bedrooms || "Select Bedrooms"}
 {formData.bedrooms && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("bedrooms")}
        </div>
      </div>
    </label>
  </div>


  {/* <div className="form-group">

    <label style={{ width: '100%'}}>
    <label>Facing</label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
          <select
            name="facing"
            value={formData.facing || ""}
            onChange={handleFieldChange}
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
              border: "1px solid #4F4B7E",
              padding: "10px",
              background: "#fff",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "#4F4B7E",
            }}
          >
            <span style={{ marginRight: "10px" }}>
              {fieldIcons.facing || <FaHome />}
            </span>
            {formData.facing || "Select facing"}
          </button>

          {renderDropdown("facing")}
        </div>
      </div>
    </label>
  </div> */}


<div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>FloorNo </label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>       <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
              {fieldIcons.facing}
            </span>  <div style={{ flex: "1" }}>
          <select
            name="facing"
            value={formData.facing || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select Facing</option>
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
              // border: "1px solid #4F4B7E",
              padding: "12px",
              background: "#fff",
              border:"none",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
            
            {formData.facing || "Select Facing"}
 {formData.facing && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("facing")}
        </div>
      </div>
    </label>
  </div>
   <div className="form-group">
    {/* <label>Total Area: <span style={{ color: 'red' }}>* </span> </label> */}
    <div className="input-card p-0 rounded-2 mb-2" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      width: '100%',  
      boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
      background: "#fff",
      paddingRight: "10px"
    }}>
      
      
      <div
    style={{
      display: "flex",
      alignItems: "stretch", // <- Stretch children vertically
      width: "100%",
    }}
  > 
       <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 14px",
        borderRight: "1px solid #4F4B7E",
        background: "#fff", // optional
      }}
    >
  {fieldIcons.totalArea} 
  </span>
    <input
        type="number"
        name="totalArea"
        value={formData.totalArea}
        onChange={handleFieldChange}
        className="form-input m-0"
        placeholder="Total Area"
        
          style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
      />
    </div>
     {formData.totalArea && (
        <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
      )}
    </div> 
    
    </div>
  
      {/* areaUnit */}
      <div className="form-group">
      <label style={{ width: '100%'}}>
      {/* <label>Area Unit <span style={{ color: 'red' }}>* </span> </label> */}
  
        <div
    style={{
      display: "flex",
      alignItems: "stretch", // <- Stretch children vertically
      width: "100%",
      boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
    }} className="rounded-2"
  >   
       <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 14px",
        borderRight: "1px solid #4F4B7E",
        background: "#fff", // optional
      }}
    >
                {fieldIcons.areaUnit || <FaHome />}
              </span>
                   <div style={{ flex: "1" }}>
            <select
              name="areaUnit"
              value={formData.areaUnit || ""}
              onChange={handleFieldChange}
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
                // border: "1px solid #4F4B7E",
                padding: "12px",
                border:"none",
                background: "#fff",
                borderRadius: "5px",
                width: "100%",
                textAlign: "left",
                color: "grey",
              position: "relative",
                          boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
  }}
            >
  
              {formData.areaUnit || "Select Area Unit"}
   {formData.areaUnit && (
              <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
            )}          </button>
  
            {renderDropdown("areaUnit")}
          </div>
        </div>
      </label>
    </div>
    <div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>FloorNo </label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>       <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
              {fieldIcons.floorNo}
            </span>  <div style={{ flex: "1" }}>
          <select
            name="floorNo"
            value={formData.floorNo || ""}
            onChange={handleFieldChange}
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
              // border: "1px solid #4F4B7E",
              padding: "12px",
              background: "#fff",
              border:"none",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
            
            {formData.floorNo || "Select Floor No"}
 {formData.floorNo && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("floorNo")}
        </div>
      </div>
    </label>
  </div>



  <div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>requirementType </label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>      <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
              {fieldIcons.requirementType || <FaHome />}
            </span>  <div style={{ flex: "1" }}>
          <select
            name="requirementType"
            value={formData.requirementType || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select requirementType</option>
            {dataList.requirementType?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("requirementType")}
            style={{
              cursor: "pointer",
              // border: "1px solid #4F4B7E",
              padding: "12px",
              border:"none",
              background: "#fff",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
             
            {formData.requirementType || "Select Requirement Type"}
 {formData.requirementType && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("requirementType")}
        </div>
      </div>
    </label>
  </div>


{/* 
<div className="form-group">
  <div className="input-card p-0 rounded-2" style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%',  
    boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
    background: "#fff",
    paddingRight: "10px"
  }}>
    
   <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
  }}
> 
     
     <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
     <MdLocationCity className="input-icon" style={{color: '#4F4B7E',}} /><sup style={{ color: 'red' }}>*</sup>
  </span>
  <input
      type="text"
      name="state"
      value={formData.state}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="State"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.state && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div></div> */}

 <div className="form-group">
    <label style={{width:"100%"}}>
    {/* <label>state</label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>       <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
              {fieldIcons.state || <FaHome />}
            </span>    <div style={{ flex: "1" }}>
          <select
            name="state"
            value={formData.state || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
            required
            >
            <option value="">Select state</option>
            {dataList.state?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("state")}
            style={{
              cursor: "pointer",
              // border: "1px solid #4F4B7E",
              padding: "12px",
              background: "#fff",
              border:"none",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
          
            {formData.state || "Select State"}
 {formData.state && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("state")}
        </div>
      </div>
    </label>
  </div>
{/* <div className="col-12 mb-3" style={{ position: 'relative' }}>
  <label style={{ fontWeight: 600 }}>City</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', border: '1px solid #4F4B7E', background: "#fff" }}>
    <FaCity style={{ color: '#4F4B7E', marginLeft: "10px" }} />
    <input className="m-0"
      type="text"
      name="city"
      value={formData.city}
      onChange={handleInputChanges}
      placeholder="Enter City"
      style={{ flex: '1', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
  
  {citySuggestions.length > 0 && (
  <ul style={suggestionListStyle}>
    {citySuggestions.map((city, index) => (
      <li
        key={index}
        style={{
          ...suggestionItemStyle,
          ...(hoveredIndex === index ? suggestionItemHoverStyle : {}),
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={() => {
          setFormData({ ...formData, city: city });
          setCitySuggestions([]);
        }}
      >
        {city}
      </li>
    ))}
  </ul>
)}

</div> */}

<div className="form-group"  style={{ position: 'relative' }}>
  {/* <label>City:</label> */}
  <div className="input-card p-0 rounded-2 mb-2" style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%',  
    boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
    background: "#fff",
    paddingRight: "10px"
  }}>
    
  
    <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
  }}
> 
     <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
     {fieldIcons.city || <FaHome />}
  </span>
  <input
      type="text"
      name="city"
      value={formData.city}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="City"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.city && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div>
 
  {citySuggestions.length > 0 && (
  <ul style={suggestionListStyle}>
    {citySuggestions.map((city, index) => (
      <li
        key={index}
        style={{
          ...suggestionItemStyle,
          ...(hoveredIndex === index ? suggestionItemHoverStyle : {}),
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={() => {
          setFormData({ ...formData, city: city });
          setCitySuggestions([]);
        }}
      >
        {city}
      </li>
    ))}
  </ul>
)}</div>


{/* <div className="col-12 mb-3" style={{ position: 'relative' }}>
  <label style={{ fontWeight: 600 }}>Area</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', border: '1px solid #4F4B7E', background: "#fff" }}>
    <FaCity style={{ color: '#4F4B7E', marginLeft: "10px" }} />
    <input  className="m-0"
      type="text"
      name="area"
      value={formData.area}
      onChange={handleInputChanges}
      placeholder="Enter Area"
      style={{ flex: '1', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
 {areaSuggestions.length > 0 && (
  <ul style={suggestionListStyle}>
    {areaSuggestions.map((area, index) => (
      <li
        key={index}
        style={{
          ...suggestionItemStyle,
          ...(hoveredAreaIndex === index ? suggestionItemHoverStyle : {}),
        }}
        onMouseEnter={() => setHoveredAreaIndex(index)}
        onMouseLeave={() => setHoveredAreaIndex(null)}
        onClick={() => {
          setFormData({ ...formData, area });
          setAreaSuggestions([]);
        }}
      >
        {area}
      </li>
    ))}
  </ul>
)}

</div> */}

  <div className="form-group" style={{ position: 'relative' }}>
  {/* <label>Area:</label> */}
  <div className="input-card p-0 rounded-2 mb-2" style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%',  
    boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
    background: "#fff",
    paddingRight: "10px"
  }}>
    
  
    <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
  }}
> 
     <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
 {fieldIcons.area}</span>
  <input
      type="text"
      name="area"
      value={formData.area}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Area"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.area && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div>

 {areaSuggestions.length > 0 && (
  <ul style={suggestionListStyle}>
    {areaSuggestions.map((area, index) => (
      <li
        key={index}
        style={{
          ...suggestionItemStyle,
          ...(hoveredAreaIndex === index ? suggestionItemHoverStyle : {}),
        }}
        onMouseEnter={() => setHoveredAreaIndex(index)}
        onMouseLeave={() => setHoveredAreaIndex(null)}
        onClick={() => {
          setFormData({ ...formData, area });
          setAreaSuggestions([]);
        }}
      >
        {area}
      </li>
    ))}
  </ul>
)}</div>


<h6 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}> Description   </h6>             





   <div className="form-group">
       <div className="input-card p-0 rounded-2" style={{ 
       display: 'flex', 
       alignItems: 'center', 
       justifyContent: 'space-between', 
       width: '100%',  
       boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
       background: "#fff",
       paddingRight: "10px"
     }}>
     <textarea
       name="description"
       value={formData.description}
       onChange={handleFieldChange}
       className="form-control"
      placeholder="Enter your Short Requirement"
       style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
   
     ></textarea>
   </div>
   </div>  



<h6 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}> My Family Info   </h6>             



{/* familyMembers */}
  <div className="form-group">
    <label style={{width:"100%"}}>
    {/* <label>familyMembers</label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>       <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
              {fieldIcons.familyMembers || <FaHome />}
            </span>    <div style={{ flex: "1" }}>
          <select
            name="familyMembers"
            value={formData.familyMembers || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select familyMembers</option>
            {dataList.familyMembers?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("familyMembers")}
            style={{
              cursor: "pointer",
              // border: "1px solid #4F4B7E",
              padding: "12px",
              background: "#fff",
              border:"none",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
          
            {formData.familyMembers || "Select No of Family Members"}
 {formData.familyMembers && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("familyMembers")}
        </div>
      </div>
    </label>
  </div>

{/* foodHabit */}
  <div className="form-group">
    <label style={{width:"100%"}}>
    {/* <label>foodHabit</label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>       <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
              {fieldIcons.foodHabit || <FaHome />}
            </span>    <div style={{ flex: "1" }}>
          <select
            name="foodHabit"
            value={formData.foodHabit || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select foodHabit</option>
            {dataList.foodHabit?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("foodHabit")}
            style={{
              cursor: "pointer",
              // border: "1px solid #4F4B7E",
              padding: "12px",
              background: "#fff",
              borderRadius: "5px",
              width: "100%",
              border:"none",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
          
            {formData.foodHabit || "Select Food Habit"}
 {formData.foodHabit && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("foodHabit")}
        </div>
      </div>
    </label>
  </div>
{/* jobType */}
    <div className="form-group">
    <label style={{width:"100%"}}>
    {/* <label>jobType</label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>       <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
              {fieldIcons.jobType || <FaHome />}
            </span>    <div style={{ flex: "1" }}>
          <select
            name="jobType"
            value={formData.jobType || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select jobType</option>
            {dataList.jobType?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("jobType")}
            style={{
              cursor: "pointer",
              // border: "1px solid #4F4B7E",
              padding: "12px",
              background: "#fff",
              border:"none",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
          
            {formData.jobType || "Select Job Type"}
 {formData.jobType && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("jobType")}
        </div>
      </div>
    </label>
  </div>
{/* petAllowed */}
  <div className="form-group">
    <label style={{width:"100%"}}>
    {/* <label>petAllowed</label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>       <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
              {fieldIcons.petAllowed || <FaHome />}
            </span>    <div style={{ flex: "1" }}>
          <select
            name="petAllowed"
            value={formData.petAllowed || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select petAllowed</option>
            {dataList.petAllowed?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("petAllowed")}
            style={{
              cursor: "pointer",
              // border: "1px solid #4F4B7E",
              padding: "12px",
              background: "#fff",
              border:"none",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
          
            {formData.petAllowed || "Select Pet"}
 {formData.petAllowed && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("petAllowed")}
        </div>
      </div>
    </label>
  </div>
  


  

        <button type="submit" className="submit-button" style={{ padding: "10px 20px", cursor: "pointer", background:"#4F4B7E", border:'none', color:'#ffffff', width:"100%"}}
        
        onMouseOver={(e) => {
          e.target.style.background = "#CDC9F9"; // Brighter neon on hover
          e.target.style.fontWeight = 500; // Brighter neon on hover
          e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover

        }}
        onMouseOut={(e) => {
          e.target.style.background = "#4F4B7E"; // Original orange
          e.target.style.fontWeight = 400; // Brighter neon on hover

        }}>
          {Ra_Id ? "UPDATE PROPERTY ASSISTANCE" : "ADD PROPERTY ASSISTANCE"}
        </button>
      </form>
      </div>
    </div>
  );
};

export default EditBuyerAssistance;

















































