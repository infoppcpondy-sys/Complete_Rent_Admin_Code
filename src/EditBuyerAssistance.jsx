import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { RiLayoutLine } from 'react-icons/ri';
import { TbArrowLeftRight, TbMapPinCode } from 'react-icons/tb';
import {
  FaPhone, FaRulerCombined, FaBuilding, FaBath, FaRuler, FaCompass,
  FaChartArea, FaEdit, FaRoad, FaCreditCard, FaLandmark, FaHome,
  FaUserAlt, FaEnvelope, FaRupeeSign, FaFileVideo, FaToilet, FaCar,
  FaBed, FaCity, FaTimes, FaArrowRight, FaStreetView, FaSearch,
  FaHandHoldingUsd, FaUsers, FaUtensils, FaBriefcase, FaDog,
  FaArrowLeft, FaChevronLeft
} from 'react-icons/fa';
import { FaRegAddressCard, FaChevronDown } from 'react-icons/fa6';
import {
  MdLocationOn, MdOutlineMeetingRoom, MdOutlineOtherHouses, MdSchedule,
  MdStraighten, MdApproval, MdLocationCity, MdAddPhotoAlternate,
  MdKeyboardDoubleArrowDown, MdOutlineClose
} from "react-icons/md";
import { BsBank, BsBuildingsFill, BsFillHouseCheckFill, BsTextareaT } from "react-icons/bs";
import { GiKitchenScale, GiMoneyStack, GiResize, GiGears } from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi";
import { BiBuildingHouse, BiMap, BiWorld } from "react-icons/bi";
import { FaFileAlt, FaGlobeAmericas, FaMapMarkerAlt, FaMapSigns } from "react-icons/fa";
import {
  MdElevator, MdOutlineChair, MdPhone, MdOutlineAccessTime, MdTimer,
  MdHomeWork, MdHouseSiding, MdOutlineKitchen, MdEmail
} from "react-icons/md";
import { BsBarChart, BsGraphUp } from "react-icons/bs";
import { BiBuilding, BiStreetView } from "react-icons/bi";
import { GiStairs, GiForkKnifeSpoon, GiWindow } from "react-icons/gi";
import { AiOutlineEye, AiOutlineColumnWidth, AiOutlineColumnHeight } from "react-icons/ai";
import { BiBed, BiBath, BiCar, BiCalendar, BiUser, BiCube } from "react-icons/bi";
import minprice from "./Assets/Price Mini-01.png";
import maxprice from "./Assets/Price maxi-01.png";
import { FcSearch } from "react-icons/fc";
import { toWords } from 'number-to-words';

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

/* ─────────────────────────────────────────────────────────────
   FIX: single CSS injection for submit-button hover
   (replaces the brittle onMouseOver/onMouseOut handlers)
───────────────────────────────────────────────────────────── */
const submitButtonStyle = `
  .submit-btn-fixed {
    padding: 10px 20px;
    cursor: pointer;
    background: #4F4B7E;
    border: none;
    color: #ffffff;
    width: 100%;
    transition: background 0.3s ease, font-weight 0.3s ease;
    border-radius: 4px;
    font-size: 14px;
  }
  .submit-btn-fixed:hover {
    background: #CDC9F9;
    font-weight: 500;
    color: #4F4B7E;
  }
`;

const EditBuyerAssistance = () => {
  const [formData, setFormData] = useState({
    tenantName: "",
    phoneNumber: "",
    altPhoneNumber: "",
    city: "",
    area: "",
    pinCode: "",
    minPrice: "",
    maxPrice: "",
    facing: "",
    areaUnit: "",
    totalArea: "",
    bedrooms: "",
    propertyMode: "",
    propertyType: "",
    rentType: "",
    numberOfFloors: "",
    requirementType: "",
    familyMembers: "",
    foodHabit: "",
    jobType: "",
    petAllowed: "",
    state: "",
    description: "",
    raName: "",
    alternatePhone: ""
  });

  const cityTimeoutRef = useRef(null);
  const areaTimeoutRef = useRef(null);

  const suggestionListStyle = {
    listStyle: "none",
    margin: 0,
    padding: "5px",
    border: "1px solid #ccc",
    borderTop: "none",
    maxHeight: "200px",
    overflowY: "auto",
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    background: "#ffffff",
    zIndex: 9999,
    marginTop: "5px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  };

  const suggestionItemStyle = {
    padding: "8px 10px",
    cursor: "pointer",
  };

  const suggestionItemHoverStyle = {
    backgroundColor: "#f0f0f0",
  };

  const areaPincodeMap = {
    "Abishegapakkam": "605007",
    "Ariyankuppam": "605007",
    "Arumbarthapuram": "605110",
    "Bahour": "605101",
    "Bommaiyarpalayam": "605106",
    "Cathedral": "605001",
    "Chinna Kalapet": "605014",
    "Chinna Veerampatinam": "605007",
    "Dharmapuri": "605003",
    "Dupleix Nagar": "605001",
    "Embalam": "605106",
    "Heritage Town": "605001",
    "Iyyanar Koil": "605013",
    "Jipmer Campus": "605006",
    "Kadirkamam": "605009",
    "Kalapet": "605014",
    "Kanniakoil": "605010",
    "Karayamputhur": "605106",
    "Karuvadikuppam": "605008",
    "Katterikuppam": "605009",
    "Kirumampakkam": "605502",
    "Koodapakkam": "605502",
    "Korkadu": "605501",
    "Kottakuppam": "605104",
    "Kottakuppam Puduthurai": "605007",
    "Kunichempet": "605006",
    "Kuruvinatham": "605007",
    "Kurusukuppam": "605012",
    "Lawspet": "605008",
    "Madukarai": "605107",
    "Madagadipet": "605107",
    "Manalipet": "605010",
    "Manapattu": "605105",
    "Mangalam": "605004",
    "Mannadipet": "605501",
    "Mettupalayam": "605009",
    "MG Road": "605001",
    "Mission Street": "605001",
    "Moolakulam": "605010",
    "Mudaliarpet": "605004",
    "Murungapakkam": "605004",
    "Nallambal": "605006",
    "Natesan Nagar": "605005",
    "Nellithope": "605005",
    "Olandai Keerapalayam": "605010",
    "Orleanpet": "605001",
    "Osudu": "605110",
    "Ousteri": "605009",
    "Pillaiyarkuppam (Ariyankuppam)": "605007",
    "Pillaiyarkuppam (Bahour)": "605101",
    "Pondicherry University": "605014",
    "Pudhu Nagar": "605010",
    "Rainbow Nagar": "605011",
    "Reddiarpalayam": "605010",
    "Sanjay Gandhi Nagar": "605005",
    "Saram": "605013",
    "Seedhankuppam": "605005",
    "Seliamedu": "605106",
    "Sita Nagar": "605013",
    "Solai Nagar": "605010",
    "Sri Aurobindo Ashram": "605002",
    "Subbaiah Salai": "605001",
    "Sultanpet": "605003",
    "Thavalakuppam": "605009",
    "Thengaithittu": "605004",
    "Thondamanatham": "605502",
    "Thirubuvanai": "605107",
    "Thirukanchi": "605009",
    "Thiruthani": "605006",
    "Vaithikuppam": "605012",
    "Vadhanur": "605111",
    "Veerampattinam": "605007",
    "Velrampet": "605004",
    "Villianur": "605110",
    "White Town": "605001"
  };

  const location = useLocation();
  const navigate = useNavigate();
  const Ra_Id = Number(location.state?.Ra_Id);

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
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  /* ─────────────────────────────────────────────────────────────
     FIX: popup state — declared at top level so they always
     render outside the overflow container (see JSX return below)
  ───────────────────────────────────────────────────────────── */
  const [showPopup, setShowPopup] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [message, setMessage] = useState("");

  const [countryCodes] = useState([
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
  ]);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchPaymentTypes();
    fetchDropdownData();
    if (Ra_Id) fetchBuyerAssistanceData(Ra_Id);
  }, [Ra_Id]);

  const fetchPaymentTypes = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/payment-all`);
      setPaymentTypes(res.data);
    } catch (error) {}
  };

  const fieldIcons = {
    tenantName: <FaUserAlt color="#4F4B7E" />,
    phoneNumber: <FaPhone color="#4F4B7E" />,
    alternatePhone: <FaPhone color="#4F4B7E" />,
    email: <FaEnvelope color="#4F4B7E" />,
    pinCode: <TbMapPinCode color="#4F4B7E" />,
    rentalPropertyAddress: <MdLocationCity color="#4F4B7E" />,
    country: <BiWorld color="#4F4B7E" />,
    state: <MdLocationCity color="#4F4B7E" />,
    city: <FaCity color="#4F4B7E" />,
    district: <FaRegAddressCard color="#4F4B7E" />,
    area: <MdLocationOn color="#4F4B7E" />,
    streetName: <RiLayoutLine color="#4F4B7E" />,
    doorNumber: <BiBuildingHouse color="#4F4B7E" />,
    nagar: <FaRegAddressCard color="#4F4B7E" />,
    ownerName: <FaUserAlt color="#4F4B7E" />,
    postedBy: <FaUserAlt color="#4F4B7E" />,
    ownership: <HiUserGroup color="#4F4B7E" />,
    propertyMode: <MdApproval color="#4F4B7E" />,
    propertyType: <MdOutlineOtherHouses color="#4F4B7E" />,
    propertyApproved: <BsFillHouseCheckFill color="#4F4B7E" />,
    propertyAge: <MdSchedule color="#4F4B7E" />,
    description: <BsTextareaT color="#4F4B7E" />,
    rentalAmount: <FaRupeeSign color="#4F4B7E" />,
    bankLoan: <BsBank color="#4F4B7E" />,
    negotiation: <GiMoneyStack color="#4F4B7E" />,
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
    bedrooms: <FaBed color="#4F4B7E" />,
    kitchen: <GiKitchenScale color="#4F4B7E" />,
    balconies: <MdOutlineMeetingRoom color="#4F4B7E" />,
    floorNo: <BsBuildingsFill color="#4F4B7E" />,
    numberOfFloors: <BsBuildingsFill color="#4F4B7E" />,
    attachedBathrooms: <FaBath color="#4F4B7E" />,
    western: <FaToilet color="#4F4B7E" />,
    facing: <TbArrowLeftRight color="#4F4B7E" />,
    salesMode: <GiGears color="#4F4B7E" />,
    salesType: <MdOutlineOtherHouses color="#4F4B7E" />,
    furnished: <FaHome color="#4F4B7E" />,
    lift: <BsBuildingsFill color="#4F4B7E" />,
    carParking: <FaCar color="#4F4B7E" />,
  };

  const fieldLabels = {
    tenantName: "Tenant Name",
    pinCode: "Pin Code",
    propertyMode: "Property Mode",
    propertyType: "Property Type",
    rentType: "Rent Type",
    minPrice: "Min Rental Amount",
    maxPrice: "Max Rental Amount",
    rentalAmount: "Rental Amount",
    propertyAge: "Property Age",
    bankLoan: "Bank Loan",
    negotiation: "Negotiation",
    securityDeposit: "Security Deposit",
    length: "Length",
    breadth: "Breadth",
    totalArea: "Total Area",
    ownership: "Ownership",
    bedrooms: "Bedrooms",
    kitchen: "Kitchen",
    availableDate: "Available From",
    familyMembers: "No. of Family Members",
    foodHabit: "Food Habit",
    jobType: "Job Type",
    petAllowed: "Pet",
    wheelChairAvailable: "Wheel Chair",
    requirementType: "Requirement Type",
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
    alternatePhone: "Alternate Phone",
    bestTimeToCall: "Best Time to Call",
  };

  const handleFilterChange = (e) => {
    setDropdownState((prev) => ({ ...prev, filterText: e.target.value }));
  };

  const nonDropdownFields = ["tenantName", "alternatePhone", "totalArea", "pinCode", "baName", "city", "area", "description"];

  const dropdownFieldOrder = [
    "minPrice", "maxPrice", "tenantName", "altPhoneNumber",
    "propertyMode", "propertyType", "rentType", "bedrooms",
    "facing", "totalArea", "areaUnit", "floorNo", "requirementType",
    "state", "city", "area", "description",
    "familyMembers", "foodHabit", "jobType", "petAllowed",
    "raName", "phoneNumber"
  ];

  const renderDropdown = (field) => {
    const options = dataList[field] || [];
    let filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(dropdownState.filterText.toLowerCase())
    );
    if (field === 'maxPrice' && formData.minPrice) {
      const minPriceValue = parseInt(formData.minPrice.replace(/[^0-9]/g, '')) || 0;
      filteredOptions = filteredOptions.filter((option) => {
        const optionValue = parseInt(option.replace(/[^0-9]/g, '')) || 0;
        return optionValue > minPriceValue;
      });
    }

    return (
      <div data-field={field}>
        {dropdownState.activeDropdown === field && (
          <div
            className="popup-overlay"
            style={{
              position: 'fixed',
              top: 0, left: 0,
              width: '100vw', height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1509,
            }}
          >
            <div
              className="dropdown-popup"
              style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                width: '100%', maxWidth: '300px',
                padding: '10px', zIndex: 10,
                boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',
                borderRadius: '18px',
              }}
            >
              <div className="p-1" style={{ fontWeight: 500, fontSize: '15px', marginBottom: '10px', textAlign: 'start', color: 'grey' }}>
                Select or Search{' '}
                <span style={{ color: '#0B57CF', fontWeight: 500 }}>
                  {fieldLabels[field] || 'Property Field'}
                </span>
              </div>
              <div className="mb-1" style={{ position: 'relative', width: '100%', background: '#EEF4FA', borderRadius: '25px' }}>
                <FcSearch size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  className="m-0 rounded-0 ms-1"
                  type="text"
                  placeholder="Filter options..."
                  value={dropdownState.filterText}
                  onChange={handleFilterChange}
                  style={{ width: '100%', padding: '5px 5px 5px 30px', background: 'transparent', border: 'none', outline: 'none' }}
                />
              </div>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, overflowY: 'auto', maxHeight: '350px' }}>
                {filteredOptions.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, [field]: option }));
                      toggleDropdown(field);
                      const currentIndex = dropdownFieldOrder.indexOf(field);
                      if (currentIndex !== -1 && currentIndex < dropdownFieldOrder.length - 1) {
                        const nextField = dropdownFieldOrder[currentIndex + 1];
                        if (nonDropdownFields.includes(nextField)) {
                          setTimeout(() => {
                            const nextInput = document.querySelector(`[name="${nextField}"]`);
                            if (nextInput) { nextInput.focus(); nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
                          }, 150);
                        } else {
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
                    style={{ fontWeight: 300, padding: '5px', cursor: 'pointer', color: 'grey', marginBottom: '5px', borderBottom: '1px solid #D0D7DE' }}
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
                    toggleDropdown(field);
                    const currentIndex = dropdownFieldOrder.indexOf(field);
                    if (currentIndex > 0) {
                      const prevField = dropdownFieldOrder[currentIndex - 1];
                      if (nonDropdownFields.includes(prevField)) {
                        setTimeout(() => {
                          const prevInput = document.querySelector(`[name="${prevField}"]`);
                          if (prevInput) { prevInput.focus(); prevInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
                        }, 100);
                      } else {
                        setTimeout(() => {
                          toggleDropdown(prevField);
                          setTimeout(() => {
                            const el = document.querySelector(`[data-field="${prevField}"]`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 100);
                        }, 0);
                      }
                    }
                  }}
                  style={{ background: '#EAEAF6', cursor: 'pointer', border: 'none', color: '#0B57CF', borderRadius: '10px', padding: '5px 10px', fontWeight: 500 }}
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleDropdown(field);
                    const currentIndex = dropdownFieldOrder.indexOf(field);
                    if (currentIndex !== -1 && currentIndex < dropdownFieldOrder.length - 1) {
                      const nextField = dropdownFieldOrder[currentIndex + 1];
                      if (nonDropdownFields.includes(nextField)) {
                        setTimeout(() => {
                          const nextInput = document.querySelector(`[name="${nextField}"]`);
                          if (nextInput) { nextInput.focus(); nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
                        }, 100);
                      } else {
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
                  style={{ background: '#EAEAF6', cursor: 'pointer', border: 'none', color: '#0B57CF', borderRadius: '10px', padding: '5px 10px', fontWeight: 500, marginRight: '5px' }}
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={() => toggleDropdown(field)}
                  style={{ background: '#0B57CF', cursor: 'pointer', border: 'none', color: '#fff', borderRadius: '10px', padding: '5px 10px' }}
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

  const fetchCitySuggestions = (input) => {
    clearTimeout(cityTimeoutRef.current);
    cityTimeoutRef.current = setTimeout(async () => {
      if (!input) return setCitySuggestions([]);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/cities?search=${input}`);
        setCitySuggestions(res.data.data);
      } catch (err) { setCitySuggestions([]); }
    }, 300);
  };

  const handleAreaInputChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, area: value }));
    if (value.trim().length > 0) {
      const allAreas = Object.keys(areaPincodeMap);
      const lowerValue = value.toLowerCase();
      const startsWithFilter = allAreas.filter(a => a.toLowerCase().startsWith(lowerValue));
      const containsFilter = allAreas.filter(a => !a.toLowerCase().startsWith(lowerValue) && a.toLowerCase().includes(lowerValue));
      const sortedSuggestions = [...startsWithFilter, ...containsFilter];
      setAreaSuggestions(sortedSuggestions);
      setShowAreaSuggestions(sortedSuggestions.length > 0);
    } else {
      setAreaSuggestions(Object.keys(areaPincodeMap));
      setShowAreaSuggestions(true);
    }
  };

  const handleAreaFocus = () => {
    if (formData.area.trim().length === 0) {
      setAreaSuggestions(Object.keys(areaPincodeMap));
      setShowAreaSuggestions(true);
    } else {
      handleAreaInputChange({ target: { value: formData.area } });
    }
  };

  const handleAreaBlur = () => {
    setTimeout(() => { setShowAreaSuggestions(false); setAreaSuggestions([]); }, 200);
  };

  const handleAreaSelect = (selectedArea) => {
    setFormData(prev => ({
      ...prev,
      area: selectedArea,
      pinCode: areaPincodeMap[selectedArea] || prev.pinCode
    }));
    setShowAreaSuggestions(false);
    setAreaSuggestions([]);
  };

  const convertToIndianRupees = (num) => {
    const number = parseInt(num, 10);
    if (isNaN(number)) return "";
    if (number >= 10000000) return (number / 10000000).toFixed(2).replace(/\.00$/, '') + " crores";
    if (number >= 100000) return (number / 100000).toFixed(2).replace(/\.00$/, '') + " lakhs";
    return toWords(number).replace(/\b\w/g, l => l.toUpperCase()) + " rupees";
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "description" && value.length > 0
        ? value.charAt(0).toUpperCase() + value.slice(1)
        : value,
    }));
    if (name === "rentalAmount") {
      setPriceInWords(value !== "" && !isNaN(value) ? convertToIndianRupees(value) : "");
    }
  };

  const fetchDropdownData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch`);
      const groupedData = response.data.data.reduce((acc, item) => {
        if (!acc[item.field]) acc[item.field] = [];
        acc[item.field].push(item.value);
        return acc;
      }, {});
      setDataList(groupedData);
    } catch (error) {}
  };

  const fetchBuyerAssistanceData = async (Ra_Id) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-buyerAssistance-rent/${Ra_Id}`);
      if (res.data && res.data.data) setFormData(prev => ({ ...prev, ...res.data.data }));
    } catch (error) {}
  };

  const toggleDropdown = (field) => {
    setDropdownState((prev) => ({
      activeDropdown: prev.activeDropdown === field ? null : field,
      filterText: ""
    }));
  };

  /* ─────────────────────────────────────────────────────────────
     FIX: handleSubmit — added console.log debug lines so you
     can confirm it fires and see exactly which fields are empty.
     Remove the console.log lines once confirmed working.
  ───────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // DEBUG: confirm submit fires
    console.log("handleSubmit fired", formData);

    const mandatoryFieldsList = [
      'state', 'propertyType', 'propertyMode', 'minPrice', 'maxPrice',
      'phoneNumber', 'area', 'pinCode', 'rentType', 'bedrooms', 'floorNo'
    ];

    const missing = [];
    mandatoryFieldsList.forEach((field) => {
      if (isFieldEmpty(formData[field])) {
        console.log("Missing field:", field, "→ value:", formData[field]); // DEBUG
        missing.push(field);
      }
    });

    console.log("Missing fields array:", missing); // DEBUG

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowValidationError(true);
      return;
    }

    setMissingFields([]);
    try {
      if (Ra_Id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/update-buyer-Assistance/${Ra_Id}`, formData);
        setMessage("Buyer Assistant Updated successfully");
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/add-buyerAssistance-rent`, formData);
        setMessage("Buyer Assistant Updated successfully");
      }
      setShowPopup(true);
      setTimeout(() => { setShowPopup(false); navigate('/dashboard/Pending-assistant'); }, 2000);
      setFormData({
        tenantName: "", phoneNumber: "", altPhoneNumber: "", city: "", area: "",
        pinCode: "", minPrice: "", maxPrice: "", facing: "", areaUnit: "",
        totalArea: "", bedrooms: "", propertyMode: "", propertyType: "",
        rentType: "", numberOfFloors: "", requirementType: "", familyMembers: "",
        foodHabit: "", jobType: "", petAllowed: "", state: "", description: "",
        raName: "", alternatePhone: ""
      });
    } catch (error) {
      setMessage("Error updating Buyer Assistant. Please try again.");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  const isFieldEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return false;
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
    if (price >= 10000000) return (price / 10000000).toFixed(2) + ' Cr';
    if (price >= 100000) return (price / 100000).toFixed(2) + ' Lakhs';
    return formatIndianNumber(price);
  };

  /* shared card style for all field rows */
  const cardStyle = {
    display: "flex", alignItems: "stretch", width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  };

  const iconSpanStyle = {
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "0 14px", borderRight: "1px solid #4F4B7E", background: "#fff",
  };

  const dropdownBtnStyle = {
    border: "none", cursor: "pointer", padding: "12px",
    background: "#fff", borderRadius: "5px", width: "100%",
    textAlign: "left", color: "grey", position: "relative",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)", fontSize: "13px",
  };

  /* ─────────────────────────────────────────────────────────────
     RENDER
     FIX: popups are rendered FIRST, completely outside the
     overflow:auto container, so position:fixed works correctly
     and they are never clipped by the scroll container's
     stacking context.
  ───────────────────────────────────────────────────────────── */
  return (
    <>
      {/* ── inject hover CSS for submit button (no onMouseOver needed) ── */}
      <style>{submitButtonStyle}</style>

      {/* ── VALIDATION ERROR POPUP ── rendered outside scroll container ── */}
      {showValidationError && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0, 0, 0, 0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 99999,
        }}>
          <div style={{
            background: 'white', padding: '30px', borderRadius: '8px',
            width: '340px', textAlign: 'center',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          }}>
            <h5 style={{ color: '#4F4B7E', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
              Please fill mandatory fields
            </h5>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }}>
              The following required fields are empty:
            </p>
            <ul style={{ textAlign: 'left', color: '#d32f2f', fontSize: '13px', marginBottom: '20px', paddingLeft: '20px', listStyleType: 'disc' }}>
              {missingFields.map((field) => (
                <li key={field} style={{ marginBottom: '6px' }}>
                  {fieldLabels[field] || field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                </li>
              ))}
            </ul>
            <button
              onClick={() => { setShowValidationError(false); setMissingFields([]); }}
              style={{
                marginTop: '20px', padding: '10px 24px', backgroundColor: '#4F4B7E',
                border: 'none', color: '#fff', borderRadius: '4px',
                cursor: 'pointer', fontSize: '14px', fontWeight: '500',
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ── SUCCESS POPUP ── rendered outside scroll container ── */}
      {showPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0, 0, 0, 0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 99999,
        }}>
          <div style={{
            background: 'white', padding: '40px 30px', borderRadius: '12px',
            width: '320px', textAlign: 'center',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
            <h5 style={{ color: '#4F4B7E', fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
              {message}
            </h5>
            <button
              onClick={() => { setShowPopup(false); navigate('/dashboard/Pending-assistant'); }}
              style={{
                marginTop: '20px', padding: '10px 24px', backgroundColor: '#4F4B7E',
                border: 'none', color: '#fff', borderRadius: '4px',
                cursor: 'pointer', fontSize: '14px', fontWeight: '500',
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ── MAIN SCROLLABLE CONTAINER ── popups live above this in the tree ── */}
      <div
        className="d-flex flex-column mx-auto custom-scrollbar"
        style={{
          maxWidth: '450px', height: '100vh', overflow: 'auto',
          scrollbarWidth: 'none', msOverflowStyle: 'none',
          fontFamily: 'Inter, sans-serif',
          /* FIX: explicitly set position so this container does NOT create
             a stacking context that would trap position:fixed children.
             The popups are siblings above this div, so they are unaffected. */
          position: 'relative',
        }}
      >
        {/* Sticky header */}
        <div
          className="d-flex align-items-center justify-content-start w-100 p-2"
          style={{
            background: "#EFEFEF", position: "sticky", top: 0, zIndex: 1000,
            opacity: isScrolling ? 0 : 1, pointerEvents: isScrolling ? "none" : "auto",
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          <button
            className="d-flex align-items-center justify-content-center ps-3 pe-2"
            onClick={() => navigate(-1)}
            style={{ background: "transparent", border: "none", height: "100%", color: "#CDC9F9", cursor: 'pointer', transition: 'all 0.3s ease-in-out' }}
          >
            <FaChevronLeft style={{ color: '#4F4B7E', transition: 'color 0.3s ease-in-out', background: "transparent" }} />
          </button>
          <h3 className="m-0" style={{ fontSize: "18px" }}>Edit Tenant Assistance</h3>
        </div>

        {/* Form body */}
        <div className="p-0" style={{ fontFamily: "Inter, sans-serif" }}>

          <h4 className="mt-3" style={{ color: "#4F4B7E", fontSize: "15px", fontWeight: "bold" }}>
            {Ra_Id ? "Edit Property Assistance" : "Add Property Assistance"}
          </h4>

          <form onSubmit={handleSubmit} className="p-3">

            {/* ── Min / Max Price row ── */}
            <div className="row mb-3 justify-content-around">

              {/* Min Price */}
              <div className="form-group col-5 p-0 m-0">
                <label style={{ width: '100%' }}>
                  <div style={cardStyle} className="rounded-2">
                    <span style={iconSpanStyle}>
                      <img src={minprice} alt="" width={20} />
                      <sup style={{ color: 'red' }}>*</sup>
                    </span>
                    <div style={{ flex: "1" }}>
                      <button className="m-0" type="button" onClick={() => toggleDropdown("minPrice")} style={dropdownBtnStyle}>
                        {formData.minPrice ? formatPrice(formData.minPrice) : "Select Min Rental Amount"}
                        {formData.minPrice && <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />}
                      </button>
                      {renderDropdown("minPrice")}
                    </div>
                  </div>
                </label>
              </div>

              {/* Max Price */}
              <div className="form-group col-5 p-0 m-0">
                <label style={{ width: '100%' }}>
                  <div style={cardStyle} className="rounded-2">
                    <span style={iconSpanStyle}>
                      <img src={maxprice} alt="" width={20} />
                      <sup style={{ color: 'red' }}>*</sup>
                    </span>
                    <div style={{ flex: "1" }}>
                      <button className="m-0" type="button" onClick={() => toggleDropdown("maxPrice")} style={dropdownBtnStyle}>
                        {formData.maxPrice ? formatPrice(formData.maxPrice) : "Select Max Rental Amount"}
                        {formData.maxPrice && <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />}
                      </button>
                      {renderDropdown("maxPrice")}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* ── Tenant Name ── */}
            <div className="form-group mb-1">
              <div className="input-card p-0 rounded-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', background: "#fff", paddingRight: "10px" }}>
                <div style={{ display: "flex", alignItems: "stretch", width: "100%" }}>
                  <span style={iconSpanStyle}>{fieldIcons.tenantName}</span>
                  <input type="text" name="tenantName" value={formData.tenantName} onChange={handleFieldChange} className="form-input m-0" placeholder="Tenant Name" style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none', color: "grey" }} />
                </div>
                {formData.tenantName && <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />}
              </div>
            </div>

            {/* ── Phone Number ── */}
            <div className="form-group">
              <div className="input-card p-0 rounded-2 mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', background: "#fff", paddingRight: "10px" }}>
                <img src={phone} alt="" style={{ width: 20, height: 20, marginLeft: "10px" }} />
                <sup style={{ color: 'red' }}>*</sup>
                <div style={{ flex: '0 0 10%' }}>
                  <label className="m-0">
                    <select name="countryCode" value="+91" readOnly onChange={handleFieldChange} className="form-control m-0 pt-2" style={{ width: '100%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}>
                      {countryCodes.map((item, index) => <option key={index} value={item.code}>{item.code} {item.country}</option>)}
                    </select>
                  </label>
                </div>
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleFieldChange} className="form-input m-0" placeholder="Phone Number" style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none', color: "grey" }} />
                </div>
                {formData.phoneNumber && <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />}
              </div>
            </div>

            {/* ── Alternate Phone ── */}
            <div className="form-group">
              <div className="input-card p-0 rounded-2 mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', background: "#fff", paddingRight: "10px" }}>
                <img src={altphone} alt="" style={{ width: 20, height: 20, marginLeft: "10px" }} />
                <div style={{ flex: '0 1 10%' }}>
                  <label className="m-0">
                    <select name="countryCode" value="+91" onChange={handleFieldChange} className="form-control m-0" style={{ width: '100%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}>
                      {countryCodes.map((item, index) => <option key={index} value={item.code}>{item.code} {item.country}</option>)}
                    </select>
                  </label>
                </div>
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <input type="number" name="alternatePhone" value={formData.alternatePhone} onChange={handleFieldChange} className="form-input m-0" placeholder="Alternate Phone Number" style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none', color: "grey" }} />
                </div>
                {formData.alternatePhone && <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />}
              </div>
            </div>

            {/* ── Property Mode ── */}
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <div style={cardStyle} className="rounded-2">
                  <span style={iconSpanStyle}>{fieldIcons.propertyMode}<sup style={{ color: 'red' }}>*</sup></span>
                  <div style={{ flex: "1" }}>
                    <button className="m-0" type="button" onClick={() => toggleDropdown("propertyMode")} style={dropdownBtnStyle}>
                      {formData.propertyMode || "Select Property Mode"}
                      {formData.propertyMode && <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />}
                    </button>
                    {renderDropdown("propertyMode")}
                  </div>
                </div>
              </label>
            </div>

            {/* ── Property Type ── */}
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <div style={cardStyle} className="rounded-2">
                  <span style={iconSpanStyle}>{fieldIcons.propertyType}<sup style={{ color: 'red' }}>*</sup></span>
                  <div style={{ flex: "1" }}>
                    <button className="m-0" type="button" onClick={() => toggleDropdown("propertyType")} style={dropdownBtnStyle}>
                      {formData.propertyType || "Select Property Type"}
                      {formData.propertyType && <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />}
                    </button>
                    {renderDropdown("propertyType")}
                  </div>
                </div>
              </label>
            </div>

            {/* ── Rent Type ── */}
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <div style={cardStyle} className="rounded-2">
                  <span style={iconSpanStyle}>{fieldIcons.rentType}<sup style={{ color: 'red' }}>*</sup></span>
                  <div style={{ flex: "1" }}>
                    <button className="m-0" type="button" onClick={() => toggleDropdown("rentType")} style={dropdownBtnStyle}>
                      {formData.rentType || "Select Rent Type"}
                      {formData.rentType && <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />}
                    </button>
                    {renderDropdown("rentType")}
                  </div>
                </div>
              </label>
            </div>

            {/* ── Bedrooms ── */}
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <div style={cardStyle} className="rounded-2">
                  <span style={iconSpanStyle}>{fieldIcons.bedrooms}<sup style={{ color: 'red' }}>*</sup></span>
                  <div style={{ flex: "1" }}>
                    <button className="m-0" type="button" onClick={() => toggleDropdown("bedrooms")} style={dropdownBtnStyle}>
                      {formData.bedrooms || "Select Bedrooms"}
                      {formData.bedrooms && <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />}
                    </button>
                    {renderDropdown("bedrooms")}
                  </div>
                </div>
              </label>
            </div>

            {/* ── Facing ── */}
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <div style={cardStyle} className="rounded-2">
                  <span style={iconSpanStyle}>{fieldIcons.facing}</span>
                  <div style={{ flex: "1" }}>
                    <button className="m-0" type="button" onClick={() => toggleDropdown("facing")} style={dropdownBtnStyle}>
                      {formData.facing || "Select Facing"}
                      {formData.facing && <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />}
                    </button>
                    {renderDropdown("facing")}
                  </div>
                </div>
              </label>
            </div>

            {/* ── Total Area ── */}
            <div className="form-group">
              <div className="input-card p-0 rounded-2 mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', background: "#fff", paddingRight: "10px" }}>
                <div style={{ display: "flex", alignItems: "stretch", width: "100%" }}>
                  <span style={iconSpanStyle}>{fieldIcons.totalArea}</span>
                  <input type="number" name="totalArea" value={formData.totalArea} onChange={handleFieldChange} className="form-input m-0" placeholder="Total Area" style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none', color: "grey" }} />
                </div>
                {formData.totalArea && <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />}
              </div>
            </div>

            {/* ── Area Unit ── */}
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <div style={cardStyle} className="rounded-2">
                  <span style={iconSpanStyle}>{fieldIcons.areaUnit || <FaHome />}</span>
                  <div style={{ flex: "1" }}>
                    <button className="m-0" type="button" onClick={() => toggleDropdown("areaUnit")} style={dropdownBtnStyle}>
                      {formData.areaUnit || "Select Area Unit"}
                      {formData.areaUnit && <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />}
                    </button>
                    {renderDropdown("areaUnit")}
                  </div>
                </div>
              </label>
            </div>

            {/* ── Floor No ── */}
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <div style={cardStyle} className="rounded-2">
                  <span style={iconSpanStyle}>{fieldIcons.floorNo}<sup style={{ color: 'red' }}>*</sup></span>
                  <div style={{ flex: "1" }}>
                    <button className="m-0" type="button" onClick={() => toggleDropdown("floorNo")} style={dropdownBtnStyle}>
                      {formData.floorNo || "Select Floor No"}
                      {formData.floorNo && <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />}
                    </button>
                    {renderDropdown("floorNo")}
                  </div>
                </div>
              </label>
            </div>

            {/* ── Requirement Type ── */}
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <div style={cardStyle} className="rounded-2">
                  <span style={iconSpanStyle}>{fieldIcons.requirementType || <FaHome />}</span>
                  <div style={{ flex: "1" }}>
                    <button className="m-0" type="button" onClick={() => toggleDropdown("requirementType")} style={dropdownBtnStyle}>
                      {formData.requirementType || "Select Requirement Type"}
                      {formData.requirementType && <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />}
                    </button>
                    {renderDropdown("requirementType")}
                  </div>
                </div>
              </label>
            </div>

            {/* ── State ── */}
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <div style={cardStyle} className="rounded-2">
                  <span style={iconSpanStyle}>{fieldIcons.state || <FaHome />}<sup style={{ color: 'red' }}>*</sup></span>
                  <div style={{ flex: "1" }}>
                    <button className="m-0" type="button" onClick={() => toggleDropdown("state")} style={dropdownBtnStyle}>
                      {formData.state || "Select State"}
                      {formData.state && <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />}
                    </button>
                    {renderDropdown("state")}
                  </div>
                </div>
              </label>
            </div>

            {/* ── City ── */}
            <div className="form-group" style={{ position: 'relative' }}>
              <div className="input-card p-0 rounded-2 mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', background: "#fff", paddingRight: "10px" }}>
                <div style={{ display: "flex", alignItems: "stretch", width: "100%" }}>
                  <span style={iconSpanStyle}>{fieldIcons.city || <FaHome />}</span>
                  <input type="text" name="city" value={formData.city} onChange={handleFieldChange} className="form-input m-0" placeholder="City" style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none', color: "grey" }} />
                </div>
                {formData.city && <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />}
              </div>
              {citySuggestions.length > 0 && (
                <ul style={suggestionListStyle}>
                  {citySuggestions.map((c, index) => (
                    <li
                      key={index}
                      style={{ ...suggestionItemStyle, ...(hoveredIndex === index ? suggestionItemHoverStyle : {}) }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => { setFormData({ ...formData, city: c }); setCitySuggestions([]); }}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ── Area ── */}
            <div className="form-group" style={{ position: 'relative' }}>
              <div className="input-card p-0 rounded-2 mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', background: "#fff", paddingRight: "10px" }}>
                <div style={{ display: "flex", alignItems: "stretch", width: "100%" }}>
                  <span style={iconSpanStyle}>{fieldIcons.area}<sup style={{ color: 'red' }}>*</sup></span>
                  <input
                    type="text" name="area" value={formData.area}
                    onChange={handleAreaInputChange} onFocus={handleAreaFocus} onBlur={handleAreaBlur}
                    className="form-input m-0" placeholder="Area"
                    style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none', color: "grey" }}
                  />
                </div>
                {formData.area && <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />}
              </div>
              {showAreaSuggestions && areaSuggestions.length > 0 && (
                <ul style={suggestionListStyle}>
                  {areaSuggestions.map((a, index) => (
                    <li
                      key={index}
                      style={{ ...suggestionItemStyle, ...(hoveredAreaIndex === index ? suggestionItemHoverStyle : {}) }}
                      onMouseEnter={() => setHoveredAreaIndex(index)}
                      onMouseLeave={() => setHoveredAreaIndex(null)}
                      onMouseDown={(e) => { e.preventDefault(); handleAreaSelect(a); }}
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ── Pin Code ── */}
            <div className="form-group">
              <div className="input-card p-0 rounded-2 mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', background: "#fff", paddingRight: "10px" }}>
                <div style={{ display: "flex", alignItems: "stretch", width: "100%" }}>
                  <span style={iconSpanStyle}>{fieldIcons.pinCode}<sup style={{ color: 'red' }}>*</sup></span>
                  <input type="text" name="pinCode" value={formData.pinCode} onChange={handleFieldChange} className="form-input m-0" placeholder="Pin Code" style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none', color: "grey" }} />
                </div>
                {formData.pinCode && <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />}
              </div>
            </div>

            <h6 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>Description</h6>

            {/* ── Description ── */}
            <div className="form-group">
              <div className="input-card p-0 rounded-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', background: "#fff", paddingRight: "10px" }}>
                <textarea
                  name="description" value={formData.description} onChange={handleFieldChange}
                  className="form-control" placeholder="Enter your Short Requirement"
                  style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none', color: "grey" }}
                />
              </div>
            </div>

            <h6 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px", marginTop: "10px" }}>My Family Info</h6>

            {/* ── Family Members ── */}
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <div style={cardStyle} className="rounded-2">
                  <span style={iconSpanStyle}>{fieldIcons.familyMembers || <FaHome />}</span>
                  <div style={{ flex: "1" }}>
                    <button className="m-0" type="button" onClick={() => toggleDropdown("familyMembers")} style={dropdownBtnStyle}>
                      {formData.familyMembers || "Select No of Family Members"}
                      {formData.familyMembers && <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />}
                    </button>
                    {renderDropdown("familyMembers")}
                  </div>
                </div>
              </label>
            </div>

            {/* ── Food Habit ── */}
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <div style={cardStyle} className="rounded-2">
                  <span style={iconSpanStyle}>{fieldIcons.foodHabit || <FaHome />}</span>
                  <div style={{ flex: "1" }}>
                    <button className="m-0" type="button" onClick={() => toggleDropdown("foodHabit")} style={dropdownBtnStyle}>
                      {formData.foodHabit || "Select Food Habit"}
                      {formData.foodHabit && <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />}
                    </button>
                    {renderDropdown("foodHabit")}
                  </div>
                </div>
              </label>
            </div>

            {/* ── Job Type ── */}
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <div style={cardStyle} className="rounded-2">
                  <span style={iconSpanStyle}>{fieldIcons.jobType || <FaHome />}</span>
                  <div style={{ flex: "1" }}>
                    <button className="m-0" type="button" onClick={() => toggleDropdown("jobType")} style={dropdownBtnStyle}>
                      {formData.jobType || "Select Job Type"}
                      {formData.jobType && <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />}
                    </button>
                    {renderDropdown("jobType")}
                  </div>
                </div>
              </label>
            </div>

            {/* ── Pet Allowed ── */}
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <div style={cardStyle} className="rounded-2">
                  <span style={iconSpanStyle}>{fieldIcons.petAllowed || <FaHome />}</span>
                  <div style={{ flex: "1" }}>
                    <button className="m-0" type="button" onClick={() => toggleDropdown("petAllowed")} style={dropdownBtnStyle}>
                      {formData.petAllowed || "Select Pet"}
                      {formData.petAllowed && <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />}
                    </button>
                    {renderDropdown("petAllowed")}
                  </div>
                </div>
              </label>
            </div>

            {/* ─────────────────────────────────────────────────────────
                FIX: submit button — uses CSS class for hover instead of
                brittle onMouseOver/onMouseOut handlers that targeted
                child elements (svg icons, text nodes) instead of the
                button itself, which interfered with click handling.
            ───────────────────────────────────────────────────────── */}
            <button type="submit" className="submit-btn-fixed">
              {Ra_Id ? "UPDATE PROPERTY ASSISTANCE" : "ADD PROPERTY ASSISTANCE"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default EditBuyerAssistance;