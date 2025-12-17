




import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
 import imge from "./Assets/ppbuyer.png";
import { RiCloseCircleFill, RiLayoutLine } from 'react-icons/ri';
import { TbFileDescription , TbMapPinCode, TbWorldLongitude ,TbWheelchair , } from 'react-icons/tb';
import {FaPhoneAlt, FaRulerCombined,  FaBath, FaChartArea, FaPhone ,FaEdit,FaRoad,FaCreditCard,FaLandmark, FaHome, FaUserAlt, FaEnvelope,  FaRupeeSign , FaFileVideo , FaToilet,FaCar,FaBed,  FaCity , FaTimes, FaArrowRight, FaStreetView, FaSearch, FaHandHoldingUsd, FaUsers, FaUtensils, FaBriefcase, FaDog} from 'react-icons/fa';
import {  FaRegAddressCard, FaChevronDown } from 'react-icons/fa6';
import { MdBalcony , MdOutlineMeetingRoom, MdOutlineOtherHouses, MdSchedule , MdStraighten , MdApproval, MdLocationCity , MdAddPhotoAlternate, MdKeyboardDoubleArrowDown, MdOutlineClose} from "react-icons/md";
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
import { useNavigate } from "react-router-dom";
import minprice from "./Assets/Price Mini-01.png";
import maxprice from "./Assets/Price maxi-01.png";
import { FcSearch } from "react-icons/fc";
import { toWords } from 'number-to-words';

import { LiaCitySolid } from "react-icons/lia";
import { GoCheckCircleFill } from "react-icons/go";
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


const PropertyAssistance = ({  existingData }) => {
    const [hovered, setHovered] = useState(false);
      const [priceInWords, setPriceInWords] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  
      const [citySuggestions, setCitySuggestions] = useState([]);
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const cityTimeoutRef = useRef(null);
  const areaTimeoutRef = useRef(null);
  
    const baseStyle = {
      backgroundColor: "#019988",
      color: "#fff",
      border: "none",
      padding: "8px 16px",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    };
  
    const hoverStyle = {
      backgroundColor: "#017a6e",
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
  // Function to handle price selection
  const handlePriceSelect = (priceType, price) => {
    setFormData((prevState) => ({
      ...prevState,
      [priceType]: price,
    }));
    toggleDropdown(null); // Close the dropdown after selecting an option
  };

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
  const [paymentTypes, setPaymentTypes] = useState([]);
 const fieldIcons = {
  // Contact Details
  phoneNumber: <img src={phone} alt="" style={{ width: 20, height: 20 }} />,
  alternatePhone: <img src={altphone} alt="" style={{ width: 20, height: 20 }} />,
  email: <img src={email} alt="" style={{ width: 20, height: 20 }} />,
  requirementType: <img src={bestTimeToCall} alt="" style={{ width: 20, height: 20 }} />,
  
  // Property Location
  rentalPropertyAddress: <img src={price} alt="" style={{ width: 20, height: 20 }} />,
  country: <img src={country} alt="" style={{ width: 20, height: 20 }} />,
  state: <img src={state} alt="" style={{ width: 20, height: 20 }} />,
  city: <img src={city} alt="" style={{ width: 20, height: 20 }} />,
  district: <LiaCitySolid color="#4F4B7E" size={20}/>,
  area: <img src={area} alt="" style={{ width: 20, height: 20 }} />,
  streetName: <img src={streetName} alt="" style={{ width: 20, height: 20 }} />,
  doorNumber: <img src={doorNumber} alt="" style={{ width: 20, height: 20 }} />,
  nagar: <img src={nagar} alt="" style={{ width: 20, height: 20 }} />,

  // Ownership & Posting Info
  ownerName: <img src={ownerName} alt="" style={{ width: 20, height: 20 }} />,
  postedBy: <img src={postedBy} alt="" style={{ width: 20, height: 20 }} />,
  ownership: <img src={ownership} alt="" style={{ width: 20, height: 20 }} />,

  // Property Details
  propertyMode: <img src={propertyMode} alt="" style={{ width: 20, height: 20 }} />,
  propertyType: <img src={propertyType} alt="" style={{ width: 20, height: 20 }} />,
  propertyApproved: <img src={propertyApproved} alt="" style={{ width: 20, height: 20 }} />,
  propertyAge: <img src={propertyAge} alt="" style={{ width: 20, height: 20 }} />,
  description:<TbFileDescription color="#4F4B7E" size={20}/>,
  rentType: <img src={rentType} alt="" style={{ width: 20, height: 20 }} />,
  availableDate: <img src={dateavailable} alt="" style={{ width: 20, height: 20 }} />,
  familyMembers: <img src={members} alt="" style={{ width: 20, height: 20 }} />,
  foodHabit: <img src={food} alt="" style={{ width: 20, height: 20 }} />,
  jobType: <img src={jobType} alt="" style={{ width: 20, height: 20 }} />,
  petAllowed: <img src={pet} alt="" style={{ width: 20, height: 20 }} />,

  // Pricing & Financials
  rentalAmount: <img src={price} alt="" style={{ width: 20, height: 20 }} />,
  bankLoan: <img src={bankLoan} alt="" style={{ width: 20, height: 20 }} />,
  negotiation: <img src={negotiation} alt="" style={{ width: 20, height: 20 }} />,
  securityDeposit: <img src={securityDeposit} alt="" style={{ width: 20, height: 20 }} />,
  wheelChairAvailable: <TbWheelchair color="#4F4B7E" size={20}/>,

  // Measurements
  length: <img src={length} alt="" style={{ width: 20, height: 20 }} />,
  breadth: <img src={breadth} alt="" style={{ width: 20, height: 20 }} />,
  totalArea: <img src={totalArea} alt="" style={{ width: 20, height: 20 }} />,
  areaUnit: <img src={areaUnit} alt="" style={{ width: 20, height: 20 }} />,

  // Room & Floor Details
  bedrooms: <img src={bedrooms} alt="" style={{ width: 20, height: 20 }} />,
  balconies: <MdBalcony color="#4F4B7E" size={20}/>,
  floorNo: <img src={floorNo} alt="" style={{ width: 20, height: 20 }} />,
  attachedBathrooms: <img src={attachedBathrooms} alt="" style={{ width: 20, height: 20 }} />,
  western: <img src={western} alt="" style={{ width: 20, height: 20 }} />,
  locationCoordinates: <TbWorldLongitude color="#4F4B7E" size={20}/>,
  pinCode: <TbMapPinCode color="#4F4B7E" size={20}/>,
  // Features & Amenities
  facing: <img src={facing} alt="" style={{ width: 20, height: 20 }} />,
  // salesMode: <img src={salesMode} alt="" style={{ width: 20, height: 20 }} />,
  // salesType: <img src={salesType} alt="" style={{ width: 20, height: 20 }} />,
  furnished: <img src={furnished} alt="" style={{ width: 20, height: 20 }} />,
  lift: <img src={lift} alt="" style={{ width: 20, height: 20 }} />,
  carParking: <img src={carParking} alt="" style={{ width: 20, height: 20 }} />,
};
  const fieldLabels = {
  propertyMode: "Property Mode",
  propertyType: "Property Type",
  price: "Price",
    minPrice: "min Rental Amount",
  maxPrice: "max Rental Amount",

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
 rentType:"rentType",
    requirementType:"requirementType",
     familyMembers:"familyMembers",
  foodHabit:"foodHabit",
  jobType:"jobType",
  petAllowed:"petAllowed",
  securityDeposit:"securityDeposit",
  availableDate:"availableDate",
  description: "Description",
  furnished: "Furnished",
  lift: "Lift",
  attachedBathrooms: "Attached Bathrooms",
  western: "Western Toilet",
  numberOfFloors: "Number of Floors",
  state: "Car Parking",
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
    paymentType: "payment Type",

  email: "Email",
  phoneNumber: "Phone Number",
  phoneNumberCountryCode: "Phone Country Code",
  alternatePhone: "Alternate Phone",
  alternatePhoneCountryCode: "Alternate Phone Country Code",
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

  useEffect(() => {
    fetchPaymentTypes();
  }, []);
  
  const fetchPaymentTypes = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/payment-all`);
      setPaymentTypes(res.data); // Expected format: [{ paymentType: "Online" }, { paymentType: "Cash" }, ...]
    } catch (error) {
    }
  };
const navigate = useNavigate();
  
  const [dataList, setDataList] = useState({});
  const [dropdownState, setDropdownState] = useState({ activeDropdown: null, filterText: "" });

  const [message, setMessage] = useState("");
const [showPopup, setShowPopup] = useState(false);
const [showConfirmPopup, setShowConfirmPopup] = useState(false);


const handleSubmit = (e) => {
  e.preventDefault();

  const errors = [];

  if (!formData.state) errors.push("State is required");
  if (!formData.propertyType) errors.push("Property Type is required");
  if (!formData.propertyMode) errors.push("Property Mode is required");
  if (!formData.minPrice) errors.push("Min Price is required");
  if (!formData.maxPrice) errors.push("Max Price is required");

  if (errors.length > 0) {
    alert(errors.join("\n"));
    return;
  }

  setShowConfirmPopup(true); // all fields are valid
};




  useEffect(() => {
    fetchDropdownData();
    if (existingData) {
      setFormData(existingData);
    }
  }, [existingData]);

  const fetchDropdownData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-rent-excel`);
      const groupedData = response.data.data.reduce((acc, item) => {
        if (!acc[item.field]) acc[item.field] = [];
        acc[item.field].push(item.value);
        return acc;
      }, {});
      setDataList(groupedData);
    } catch (error) {
    }
  };

  const toggleDropdown = (field) => {
    setDropdownState((prevState) => ({ activeDropdown: prevState.activeDropdown === field ? null : field, filterText: "" }));
  };

  const handleDropdownSelect = (field, value) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
    setDropdownState({ activeDropdown: null, filterText: "" });
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
  
const handleConfirmSubmit = async () => {
  setShowConfirmPopup(false); // hide the confirm popup

  try {
    let response;

    if (formData._id) {
      // Update existing request
      response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-buyerAssistance-rent/${formData._id}`,
        formData
      );
      setMessage("Buyer Assistance request updated successfully!");
    } else {
      // Create new request
      response = await axios.post(
        `${process.env.REACT_APP_API_URL}/add-buyerAssistance-rent`,
        formData
      );
      setFormData(response.data.data); // Save returned formData with IDs etc.
      setMessage("Buyer Assistance request added successfully!");
    }

    setShowPopup(true);
     
  } catch (error) {
    setMessage({ text: "Please fill all required fields correctly.", type: "error" });
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setMessage("");
    }, 3000);
  }
};



  return (
    <div className="property-form-container p-1" style={{  overflowY: "auto",  position: "relative", scrollbarWidth: "none" ,  fontFamily: "Inter, sans-serif",}}>
        <div className="d-flex flex-column mx-auto custom-scrollbar"
    style={{
      maxWidth: '450px',
      scrollbarWidth: 'none', 
      msOverflowStyle: 'none', 
      fontFamily: 'Inter, sans-serif'
    }}>
         <img src={imge} alt="" className="header-image"  style={{width:'100%'}}/>

      <div className="w-100 d-flex justify-content-around align-items-center mt-3">
 

      </div>
      <h4 className="form-title mt-3" style={{color: '#4F4B7E', fontSize:"15px", fontWeight:"bold"}}>Buyer Assistance</h4>
      <div>
      {message && <div className="alert text-success text-bold">{message}</div>}
      {/* Your existing component structure goes here */}
    </div>

      {showConfirmPopup && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
    }}
  >
    <div
      style={{
        background: 'white',
        padding: '24px',
        borderRadius: '8px',
        width: '320px',
        textAlign: 'center',
      }}
    >
      <h5>Do you want to create this Buyer Assistance request?</h5>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around' }}>
        <button
          onClick={handleConfirmSubmit}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4F4B7E',
            border: 'none',
            color: '#fff',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Yes
        </button>
        <button
          onClick={() => setShowConfirmPopup(false)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ccc',
            border: 'none',
            color: '#333',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          No
        </button>
      </div>
    </div>
  </div>
)} 
         <form onSubmit={handleSubmit} className="p-3">
        
          
      
       <div className="row mb-3 justify-content-around">
       
     
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
      
     
      <div className="form-group mb-1">
      {/* <label>Phone Number:</label> */}
      
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
        <img src={phone} alt="" style={{ width: 20, height: 20 ,marginLeft:"10px"}} />
       </span>    {/* <FaPhone className="input-icon" style={{ color: '#4F4B7E', marginLeft:"10px"}} /> */}
          
 
        <input
            type="number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleFieldChange}
            className="form-input m-0"
            placeholder="Phone Number"
              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
          />
        </div>
 {formData.phoneNumber && (
            <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
          )}          </div>
      </div>
      <div className="form-group mb-1" >
      {/* <label>Alternate number:</label> */}
      
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
        <img src={altphone} alt="" style={{ width: 20, height: 20 ,marginLeft:"10px"}} />
      </span>     {/* <FaPhone className="input-icon" style={{ color: '#4F4B7E',marginLeft:"10px" }} /> */}
          
    
       
      
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
   <div className="form-group mb-1">
    {/* <label>Total Area: <span style={{ color: 'red' }}>* </span> </label> */}
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
 
      
      <div className="form-group mb-1"  style={{ position: 'relative' }}>
        {/* <label>City:</label> */}
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
      
      
      
      
        <div className="form-group mb-1" style={{ position: 'relative' }}>
        {/* <label>Area:</label> */}
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
                {formData._id ? "UPDATE PROPERTY ASSISTANCE" : "ADD PROPERTY ASSISTANCE"}
              </button>
  <button
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          cursor: "pointer",
          background: "#888",
          border: "none",
          color: "#fff",
        }}
        onClick={() => navigate(-1)} // 👈 Go back one step in history
      >
        Go Back
      </button>
            </form>
    </div>
    </div>
  );
};





export default PropertyAssistance;


























































































































