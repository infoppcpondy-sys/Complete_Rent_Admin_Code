






import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, Spinner } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RiLayoutLine } from 'react-icons/ri';
import { TbArrowLeftRight, TbFileDescription, TbMapPinCode, TbToolsKitchen, TbWheelchair, TbWorldLongitude } from 'react-icons/tb';
import {FaChevronLeft , FaMoneyBillWave,  FaBath, FaChartArea, FaPhone ,FaEdit,FaRoad,FaDoorClosed,FaMapPin, FaHome, FaUserAlt, FaEnvelope,  FaRupeeSign , FaFileVideo , FaToilet,FaCar,FaBed,  FaCity , FaTimes, FaClock, FaMapMarkedAlt, FaExchangeAlt, FaCompass, FaHandshake, FaTag, FaPhoneAlt, FaSpinner} from 'react-icons/fa';
import {  FaRegAddressCard, FaRegCircleCheck } from 'react-icons/fa6';
import { MdLocationOn, MdOutlineMeetingRoom, MdOutlineOtherHouses, MdSchedule , MdStraighten , MdApproval, MdLocationCity , MdAddPhotoAlternate, MdKeyboardDoubleArrowDown, MdOutlineBathroom, MdDoorFront, MdOutlineClose} from "react-icons/md";
import { BsBank, BsBuildingsFill, BsFillHouseCheckFill , BsTextareaT} from "react-icons/bs";
import { GiKitchenScale, GiMoneyStack , GiResize , GiGears} from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi";
import { BiBuildingHouse , BiMap, BiWorld} from "react-icons/bi";
import {   FaFileAlt, FaGlobeAmericas, FaMapMarkerAlt, FaMapSigns } from "react-icons/fa";
import {MdBalcony  , MdElevator ,MdOutlineChair ,MdPhone, MdOutlineAccessTime, MdTimer, MdHomeWork, MdHouseSiding, MdOutlineKitchen, MdEmail, } from "react-icons/md";
import {  BsBarChart, BsGraphUp } from "react-icons/bs";
import { BiBuilding, BiStreetView } from "react-icons/bi";
import { GiStairs, GiForkKnifeSpoon, GiWindow } from "react-icons/gi";
import { AiOutlineEye, AiOutlineColumnWidth, AiOutlineColumnHeight } from "react-icons/ai";
import { BiBed, BiBath, BiCar, BiCalendar, BiUser, BiCube } from "react-icons/bi";
import './AddProperty.css';
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import { IoCloseCircle } from "react-icons/io5";
import { GrSteps } from "react-icons/gr";
import moment from "moment";
import { toWords } from 'number-to-words';
import { FcSearch } from "react-icons/fc";

// icon

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
import kitchen from './Assets/alt_mob.PNG';
import kitchenType from './Assets/alt_mob.PNG';
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
import numberOfFloors from './Assets/floor.PNG';
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





function EditForm() {
  const location = useLocation();
  const { rentId, phoneNumber } = location.state || {};
    const previewRef = useRef(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [priceInWords, setPriceInWords] = useState("");
       const [priceInWordss, setPriceInWordss] = useState("");
 const [loading, setLoading] = useState(false);
    const [step, setStep] = useState("form");
    const [isPreview, setIsPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
      const [isSuccess, setIsSuccess] = useState(false);
      const [showCheckmark, setShowCheckmark] = useState(false);
    const [coordinateInput, setCoordinateInput] = useState('');
                  const [videos, setVideos] = useState([]);
    const [progress, setProgress] = useState(0);
const [photoProgress, setPhotoProgress] = useState(0);
const [photoloading, setPhotoUploading] = useState(false); // ⬅️ add this at top if not already
const [uploadSuccess, setUploadSuccess] = useState(false);
const [photoUploadSuccess, setPhotoUploadSuccess] = useState(false);
     const [videoloading, setvideoUploading] = useState(false);
    
  const [videoError, setVideoError] = useState(""); // ⬅️ new state

    const [currentStep, setCurrentStep] = useState(1);
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
    const swiperRef = useRef(null);

    const navigate = useNavigate();
      const inputRef = useRef(null);
      const latRef = useRef(null);
      const lngRef = useRef(null);
      const mapRef = useRef(null);
      const mapInstance = useRef(null);
      const markerRef = useRef(null);
        const coordRef = useRef(null);
    
      // const mapRef = useRef(null);
      // const inputRef = useRef(null);
      // const [mapLoaded, setMapLoaded] = useState(false);
      useEffect(() => {
        const recordDashboardView = async () => {
          try {
            await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
              phoneNumber: phoneNumber,
              viewedFile: "Edit Form",
              viewTime: new Date().toISOString(),
            });
          } catch (err) {
          }
        };
      
        if (phoneNumber) {
          recordDashboardView();
        }
      }, [phoneNumber]);
      // const [p
const [formData, setFormData] = useState({
  phoneNumber:"",
    // rentId: "",
    propertyMode: '',
    propertyType: '',
    // price: '',
    propertyAge: '',
    bankLoan: '',
    negotiation: '',
    length: '',
    breadth: '',
    totalArea: '',
    ownership: '',
    bedrooms: '',
    kitchen: '',
    kitchenType: '',
    balconies: '',
    floorNo: '',
    areaUnit: '',
    propertyApproved: '',
    postedBy: '',
    facing: '',
    salesMode: '',
    salesType: '',
    description: '',
    furnished: '',
    lift: '',
    attachedBathrooms: '',
    western: '',
    numberOfFloors: '',
    carParking: '',
    rentalPropertyAddress: '',
    country: '',
    state: '',
    city: '',
    district: '',
    area: '',
    streetName: '',
    doorNumber: '',
    nagar: '',
    ownerName: '',
    email: '',
    countryCode:"+91",
  phoneNumberCountryCode: "",
  alternatePhone: "",
  alternatePhoneCountryCode: "+91",
    bestTimeToCall: '',
    pinCode:"",
    locationCoordinates:'',
    rentalAmount:"",
    securityDeposit:"", // input
    availableDate:"",  //date
    familyMembers:"",
    foodHabit:"",
    jobType:"",
    petAllowed:"",
    rentType:"", 
    wheelChairAvailable:"",
    rentType:"",
    createdAt:"",
  });
  useEffect(() => {
    if (isPreview || !window.google) return;
  
    const interval = setInterval(() => {
      if (mapRef.current && inputRef.current) {
        clearInterval(interval);
  
        mapRef.current.innerHTML = "";
  
        const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 11.9416, lng: 79.8083 },
          zoom: 10,
        });
  
        mapInstance.current = map;
     const geocoder = new window.google.maps.Geocoder();
      map.addListener("click", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        updateMap(lat, lng); // optional: show marker

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results[0]) {
            const place = results[0];

            const getComponent = (type) => {
              const comp = place.address_components?.find(c => c.types.includes(type));
              return comp?.long_name || '';
            };

           setFormData(prev => ({
            ...prev,
            rentalPropertyAddress: place.formatted_address,
            latitude: lat,
            longitude: lng,
            pinCode: getComponent("postal_code"),
            city: getComponent("locality") || getComponent("administrative_area_level_3"),
            area: getComponent("sublocality") || getComponent("sublocality_level_1"),
            streetName: getComponent("route") || getComponent("premise"),
            district: getComponent("administrative_area_level_2"),
            state: getComponent("administrative_area_level_1"),
            country: getComponent("country"),
            doorNumber: getComponent("street_number"), // ✅ added here
          locationCoordinates: `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`, // ✅ Add this

          }));
          }
        });
      });

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['geocode'],
        });
  
        autocomplete.bindTo('bounds', map);
  
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) return;
  
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
  
          updateMap(lat, lng);
  
          const getComponent = (type) => {
            const comp = place.address_components?.find(c => c.types.includes(type));
            return comp?.long_name || '';
          };
  
          setFormData(prev => ({
            ...prev,
            rentalPropertyAddress: place.formatted_address || '',
            latitude: lat,
            longitude: lng,
            pinCode: getComponent("postal_code"),
          
            // City is usually in 'locality', fallback to district-level if missing
            city: getComponent("sublocality_level_1"),
          
            // Area is more granular, typically sublocality levels
            area: getComponent("sublocality_level_2"),          
            // Optional: Nagar name, generally from level 1
            nagar: getComponent("sublocality"),
          
            // Street name or building/premise
            streetName: getComponent("route") || getComponent("premise"),
          
            // District is administrative_area_level_2 in most cases
            district: getComponent("administrative_area_level_2") || getComponent("locality"),
                      locationCoordinates: `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`, // ✅ Add this

            state: getComponent("administrative_area_level_1"),
            country: getComponent("country"),
            doorNumber: getComponent("street_number"),    }));
            
        });
      }
    }, 100);
  
    return () => clearInterval(interval);
  }, [isPreview]); // 👈 Re-run effect when preview mode changes
  

 

const updateMap = (lat, lng) => {
  const map = mapInstance.current;
  if (!map) return;

  map.setCenter({ lat, lng });
  map.setZoom(12);

  const position = { lat, lng };

  const geocoder = new window.google.maps.Geocoder();

  if (markerRef.current) {
    markerRef.current.setPosition(position);
  } else {
    markerRef.current = new window.google.maps.Marker({
      position,
      map,
      draggable: true,
    });

    // ✅ Listen to dragend event only once when marker is created
    markerRef.current.addListener('dragend', (e) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();

      // Update map and form on drag end
      geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          const place = results[0];
          const getComponent = (type) => {
            const comp = place.address_components?.find(c => c.types.includes(type));
            return comp?.long_name || '';
          };

          setFormData(prev => ({
            ...prev,
            rentalPropertyAddress: place.formatted_address || '',
            latitude: newLat,
            longitude: newLng,
            pinCode: getComponent("postal_code"),
            city: getComponent("sublocality_level_1"),
            area: getComponent("sublocality_level_2"),
            nagar: getComponent("sublocality"),
            streetName: getComponent("route") || getComponent("premise"),
            district: getComponent("administrative_area_level_2") || getComponent("locality"),
            state: getComponent("administrative_area_level_1"),
            country: getComponent("country"),
            doorNumber: getComponent("street_number"),
            locationCoordinates: `${newLat.toFixed(6)}° N, ${newLng.toFixed(6)}° E`,
          }));
        }
      });
    });
  }
};
const [coordValue, setCoordValue] = useState('');


const handleLatLngAuto = (input) => {
  input = input.trim();

  // 1. Match decimal with N/S, E/W (e.g., 11.778068° N, 79.735691° E)
  const matchDecimalDir = input.match(/([-\d.]+)[^\dNS]*([NS]),?\s*([-\d.]+)[^\dEW]*([EW])/i);

  let lat, lng;

  if (matchDecimalDir) {
    lat = parseFloat(matchDecimalDir[1]);
    const latDir = matchDecimalDir[2].toUpperCase();
    lng = parseFloat(matchDecimalDir[3]);
    const lngDir = matchDecimalDir[4].toUpperCase();

    if (latDir === "S") lat = -lat;
    if (lngDir === "W") lng = -lng;
  } else {
    // 2. Match DMS (e.g., 11°55'13.3"N 79°47'24.2"E)
    const dmsRegex = /(\d+)[°:\s](\d+)[\'′:\s](\d+(?:\.\d+)?)[\"\″]?\s*([NS])[^0-9]*(\d+)[°:\s](\d+)[\'′:\s](\d+(?:\.\d+)?)[\"\″]?\s*([EW])/i;
    const dmsMatch = input.match(dmsRegex);

    if (dmsMatch) {
      const [
        _full,
        latDeg, latMin, latSec, latDir,
        lngDeg, lngMin, lngSec, lngDir
      ] = dmsMatch;

      lat = dmsToDecimal(+latDeg, +latMin, +latSec, latDir.toUpperCase());
      lng = dmsToDecimal(+lngDeg, +lngMin, +lngSec, lngDir.toUpperCase());
    } else {
      // 3. Match plain decimal format: "11.778068, 79.735691"
      const plainDecimal = input.match(/([-\d.]+)[,\s]+([-\d.]+)/);
      if (plainDecimal) {
        lat = parseFloat(plainDecimal[1]);
        lng = parseFloat(plainDecimal[2]);
      } else {
        return; // No valid format matched
      }
    }
  }


  function dmsToDecimal(degrees, minutes, seconds, direction) {
  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (direction === 'S' || direction === 'W') {
    decimal *= -1;
  }
  return decimal;
}


  if (!isNaN(lat) && !isNaN(lng)) {
    updateMap(lat, lng);

    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results[0]) {
        const place = results[0];

        const getComponent = (type) => {
          const comp = place.address_components.find(c => c.types.includes(type));
          return comp?.long_name || '';
        };

        setFormData(prev => ({
          ...prev,
          rentalPropertyAddress: place.formatted_address,
          latitude: lat,
          longitude: lng,
          pinCode: getComponent("postal_code"),
          city: getComponent("locality") || getComponent("administrative_area_level_3"),
          area: getComponent("sublocality") || getComponent("sublocality_level_1"),
          streetName: getComponent("route") || getComponent("premise"),
          district: getComponent("administrative_area_level_2"),
          state: getComponent("administrative_area_level_1"),
          country: getComponent("country"),
          doorNumber: getComponent("street_number"),
          locationCoordinates: `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`
        }));
      }
    });
  }
};

const handleClear = () => {
  if (coordRef.current) {
    coordRef.current.value = ''; // Clear the actual input field
  }
  setCoordValue(''); // Reset state if needed

  // Reset formData fields
  setFormData(prev => ({
    ...prev,
    rentalPropertyAddress: '',
    latitude: '',
    longitude: '',
    pinCode: '',
    city: '',
    area: '',
    nagar: '',
    streetName: '',
    district: '',
    state: '',
    country: '',
    doorNumber: '',
        locationCoordinates:'',
  }));
};
  const handleLatLngSearch = (e) => {
    e.preventDefault();

    const lat = parseFloat(latRef.current.value);
    const lng = parseFloat(lngRef.current.value);
  
    if (!isNaN(lat) && !isNaN(lng)) {
      updateMap(lat, lng);
  
      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat, lng };
  
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const place = results[0];
  
          const getComponent = (type) => {
            const comp = place.address_components.find(c => c.types.includes(type));
            return comp?.long_name || '';
          };
  
          setFormData(prev => ({
            ...prev,
            rentalPropertyAddress: place.formatted_address,
            latitude: lat,
            longitude: lng,
            pinCode: getComponent("postal_code"),
          
            // City is usually in 'locality', fallback to district-level if missing
            city: getComponent("sublocality_level_1"),
          
            // Area is more granular, typically sublocality levels
            area: getComponent("sublocality_level_2"),          
            // Optional: Nagar name, generally from level 1
            nagar: getComponent("sublocality"),
          
            // Street name or building/premise
            streetName: getComponent("route") || getComponent("premise"),
          
            // District is administrative_area_level_2 in most cases
            district: getComponent("administrative_area_level_2") || getComponent("locality"),
          
            state: getComponent("administrative_area_level_1"),
            country: getComponent("country"),
            doorNumber: getComponent("street_number"),  }));
        } else {
          alert('Reverse geocoding failed: ' + status);
        }
      });
    } else {
      alert("Enter valid coordinates");
    }
  };
  

  const [photos, setPhotos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [video, setVideo] = useState(null);

  // const handlePreview = () => {
  //   setIsPreview(!isPreview);
  // };
  const handlePreview = () => {
    setIsPreview(!isPreview);
    setIsPreviewOpen(true); // Open the preview
  
    // Scroll to the preview section
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };
  


      const [message, setMessage] = useState({ text: "", type: "" });
  
  
       // Auto-clear message after 3 seconds
        useEffect(() => {
          if (message.text) {
            const timer = setTimeout(() => {
              setMessage({ text: "", type: "" });
            }, 3000);
            return () => clearTimeout(timer);
          }
        }, [message]);
      

  
const formattedCreatedAt = Date.now
? moment(formData.createdAt).format("DD-MM-YYYY") 
: "N/A";


const formattedUpdatedAt = formData.updatedAt
  ? moment(formData.updatedAt).format("DD-MM-YYYY")
  : "N/A";


  
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-data?rentId=${rentId}`);
        const data = response.data.user;
        setPhotos(
          Array.isArray(data.photos) 
            // ? data.photos.map(photo => (typeof photo === "string" ? photo : photo.photo)) 
            ? data.photos.map(photo => (typeof photo === "string" ? photo : photo.photoUrl)) 

            : []
        ); 
        setVideo(typeof data.video === "string" ? data.video : data.video?.url);

        // setVideo(data.video || null);
        setFormData({
          phoneNumber: data.phoneNumber || "",
          propertyMode: data.propertyMode || '',
          propertyType: data.propertyType || '',
          rentalAmount: data.rentalAmount || '',
          propertyAge: data.propertyAge || '',
          bankLoan: data.bankLoan || '',
          negotiation: data.negotiation || '',
          length: data.length || '',
          breadth: data.breadth || '',
          totalArea: data.totalArea || '',
          ownership: data.ownership || '',
          bedrooms: data.bedrooms || '',
          kitchen: data.kitchen || '',
          kitchenType: data.kitchenType || '',
          balconies: data.balconies || '',
          floorNo: data.floorNo || '',
          areaUnit: data.areaUnit || '',
          propertyApproved: data.propertyApproved || '',
          postedBy: data.postedBy || '',
          facing: data.facing || '',
          salesMode: data.salesMode || '',
          salesType: data.salesType || '',
          description: data.description || '',
          furnished: data.furnished || '',
          lift: data.lift || '',
          attachedBathrooms: data.attachedBathrooms || '',
          western: data.western || '',
          numberOfFloors: data.numberOfFloors || '',
          carParking: data.carParking || '',
          rentalPropertyAddress: data.rentalPropertyAddress || '',
          country: data.country || '',
          state: data.state || '',
          city: data.city || '',
          district: data.district || '',
          area: data.area || '',
          streetName: data.streetName || '',
          doorNumber: data.doorNumber || '',
          nagar: data.nagar || '',
          pinCode:data.pinCode || '',
          ownerName: data.ownerName || '',
          alternatePhone: data.alternatePhone || '',
          email: data.email || '',
                    availableDate: data.availableDate || '',

          bestTimeToCall: data.bestTimeToCall || '',
          locationCoordinates: data.locationCoordinates || ''

        });
        
        setPhotos(data.photos || []);
        setVideo(data.video || null);
      } catch (error) {
      }
    };
    if (rentId) {
      fetchPropertyData();

    }
  }, [rentId]);


 const fieldIcons = {
  // Contact Details
  phoneNumber: <img src={phone} alt="" style={{ width: 20, height: 20 }} />,
  alternatePhone: <img src={altphone} alt="" style={{ width: 20, height: 20 }} />,
  email: <img src={email} alt="" style={{ width: 20, height: 20 }} />,
  bestTimeToCall: <img src={bestTimeToCall} alt="" style={{ width: 20, height: 20 }} />,
  
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
  kitchen: <TbToolsKitchen color="#4F4B7E" size={20}/>,
  kitchenType: <img src={kitchenType} alt="" style={{ width: 20, height: 20 }} />,
  balconies: <MdBalcony color="#4F4B7E" size={20}/>,
  floorNo: <img src={floorNo} alt="" style={{ width: 20, height: 20 }} />,
  numberOfFloors: <img src={numberOfFloors} alt="" style={{ width: 20, height: 20 }} />,
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

  const propertyDetailsList = [
    { heading: true, label: "Basic Property Info" }, // Heading 1
    { icon: fieldIcons.propertyMode, label: "Property Mode", value:  formData.propertyMode},
    { icon: fieldIcons.propertyType, label: "Property Type", value: formData.propertyType },
    // { icon: <MdOutlineCurrencyRupee />, label: "Price", value: formData.price },
    // { icon: fieldIcons.email, label: "Length", value: formData.length },
    // { icon: fieldIcons.email, label: "Breadth", value: formData.breadth  },
    // // { icon: <RiLayoutLine />, label: "Total Area", value: formData.totalArea},
    { icon: fieldIcons.rentType, label: "rentType", value: formData.rentType },
           {
      icon: fieldIcons.totalArea,
      label: "Total Area",
      value: `${formData.totalArea} ${formData.areaUnit}`, // Combined value
    },
        { icon: fieldIcons.negotiation, label: "Negotiation", value: formData.negotiation },

    { icon: fieldIcons.securityDeposit, label: "Security Deposit ₹", value: formData.securityDeposit },


  
    { heading: true, label: "Property Features" }, // Heading 1

  
    { icon: fieldIcons.bedrooms, label: "Bedrooms", value: formData.bedrooms },

    { icon: fieldIcons.floorNo, label: "Floor No", value:formData.floorNo },
    { icon: fieldIcons.kitchen, label: "Kitchen", value: formData.kitchen},
     { icon: fieldIcons.balconies, label: "Balconies", value: formData.balconies},
 { label: "Western", value: formData.western, icon: fieldIcons.western},
{ label: "Attached", value: formData.attachedBathrooms, icon:fieldIcons.attachedBathrooms },
    { icon: fieldIcons.wheelChairAvailable, label: "Wheel Chair", value: formData.wheelChairAvailable },

    { icon: fieldIcons.carParking, label: "Car Park", value: formData.carParking },
    { icon: fieldIcons.lift, label: "Lift", value: formData.lift },
 
    { icon: fieldIcons.furnished, label: "Furnished", value: formData.furnished },
    { icon: fieldIcons.facing, label: "Facing", value: formData.facing },
    { icon: fieldIcons.propertyAge, label: "Property Age", value: formData.propertyAge },

    // { icon: fieldIcons.email, label: "Sale Mode", value: formData.salesMode },
    // { icon: fieldIcons.email, label: "Sales Type", value: formData.salesType },
    { icon: fieldIcons.postedBy, label: "Posted By", value:formData.postedBy},
    // { icon: <AiOutlineEye />, label: "No.Of.Views", value: "1200" },
    { icon: fieldIcons.availableDate, label: "Posted On", value:formattedCreatedAt },
          { icon: fieldIcons.availableDate, label: "Available From", value: formData.availableDate },

    { heading: true, label: "Property Description" }, // Heading 3
    { icon: fieldIcons.description, label: "Description" ,  value: formData.description },
      { heading: true, label: "Tenant Prefrences" }, // Heading 4

    { icon: fieldIcons.familyMembers, label: "No. of family Members", value: formData.familyMembers },
    { icon: fieldIcons.foodHabit, label: "Food Habit", value: formData.foodHabit },
    { icon: fieldIcons.jobType, label: "Job Type", value: formData.jobType },
    { icon: fieldIcons.petAllowed, label: "pet", value: formData.petAllowed },
    { heading: true, label: "Rental Property Address " }, // Heading 3

    // { icon: <BiMap />, label: "Location", value: "New York, USA" },
    { icon: fieldIcons.country, label: "Country", value: formData.country },
    { icon: fieldIcons.state, label: "State", value: formData.state },
    { icon: fieldIcons.city, label: "City", value: formData.city },
    { icon: fieldIcons.district, label: "District", value:  formData.district},
    { icon: fieldIcons.area, label: "Area", value: formData.area },
    
    { icon: fieldIcons.nagar, label: "Nagar", value: formData.nagar },
       { icon: fieldIcons.streetName, label: "Street Name", value: formData.streetName },
   
    { icon: fieldIcons.doorNumber, label: "Door Number", value: formData.doorNumber },
    { icon: fieldIcons.pinCode, label: "Pincode", value: formData.pinCode },
    { icon: fieldIcons.locationCoordinates, label: "lat. & lng.", value: formData.locationCoordinates },

    { heading: true, label: "Contact Info" }, // Heading 5
   
    { icon: fieldIcons.ownerName, label: "Owner Name", value: formData.ownerName },
    { icon: fieldIcons.email, label: "Email", value: formData.email },

    { icon: fieldIcons.phoneNumber, label: "Phone Number", value: phoneNumber },
    { icon: fieldIcons.alternatePhone, label: "Alternate Phone", value: formData.alternatePhone },

    { icon: fieldIcons.bestTimeToCall, label: "Best Time To Call", value: formData.bestTimeToCall },
 
  ];

    const excludedPropertyTypes = ["Plot", "Land", "Agricultural Land"].map(type => type.toLowerCase());

const filteredDetailsList = propertyDetailsList.filter((item) => {
  const isPropertyFeatureSection =
    item.label === "Tenant Prefrences" ||
    [
      "Bedrooms", "Floor No", "Kitchen", "Balconies",
      "Wheel Chair", "Western", "Attached", "Car Park", "Lift", "Furnished",
      "No. of family Members", "Food Habit", "Job Type", "Pet", "Door Number"
    ].includes(item.label);

  const propertyType = (formData?.propertyType || "").toLowerCase();

  // If current propertyType is in the excluded list, hide feature-related fields
  if (excludedPropertyTypes.includes(propertyType)) {
    return !isPropertyFeatureSection;
  }

  return true;
});
  const [dropdownState, setDropdownState] = useState({
    activeDropdown: null,
    filterText: "",
  });

  // Toggle dropdown visibility
  const toggleDropdown = (field) => {
    setDropdownState((prevState) => ({
      activeDropdown: prevState.activeDropdown === field ? null : field,
      filterText: "",
    }));
  };

  // Handle dropdown selection
  const handleDropdownSelect = (field, value) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
    setDropdownState({ activeDropdown: null, filterText: "" });
  };

  // Handle filter input change for dropdown
  const handleFilterChange = (e) => {
    setDropdownState((prevState) => ({ ...prevState, filterText: e.target.value }));
  };
  // const [rentId, setrentId] = useState(null);

 


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
    { code: '+82', country: 'South Korea' },
    { code: '+46', country: 'Sweden' },
    { code: '+31', country: 'Netherlands' },
    { code: '+41', country: 'Switzerland' },
    { code: '+32', country: 'Belgium' },
    { code: '+47', country: 'Norway' },
    { code: '+358', country: 'Finland' },
    { code: '+420', country: 'Czech Republic' },
    { code: '+48', country: 'Poland' },
    { code: '+30', country: 'Greece' },
    { code: '+351', country: 'Portugal' },
    { code: '+20', country: 'Egypt' },
    { code: '+27', country: 'South Africa' },
    { code: '+966', country: 'Saudi Arabia' },
    { code: '+971', country: 'UAE' },
    { code: '+90', country: 'Turkey' },
    { code: '+62', country: 'Indonesia' },
    { code: '+63', country: 'Philippines' },
    { code: '+64', country: 'New Zealand' },
    { code: '+856', country: 'Laos' },
    { code: '+66', country: 'Thailand' },
    { code: '+84', country: 'Vietnam' },
    { code: '+92', country: 'Pakistan' },
    { code: '+94', country: 'Sri Lanka' },
    { code: '+880', country: 'Bangladesh' },
    { code: '+972', country: 'Israel' },
    { code: '+56', country: 'Chile' },
    { code: '+54', country: 'Argentina' },
    { code: '+595', country: 'Paraguay' },
    { code: '+57', country: 'Colombia' },
    { code: '+505', country: 'Nicaragua' },
    { code: '+503', country: 'El Salvador' },
    { code: '+509', country: 'Haiti' },
    { code: '+213', country: 'Algeria' },
    { code: '+216', country: 'Tunisia' },
    { code: '+225', country: 'Ivory Coast' },
    { code: '+234', country: 'Nigeria' },
    { code: '+254', country: 'Kenya' },
    { code: '+255', country: 'Tanzania' },
    { code: '+256', country: 'Uganda' },
    { code: '+591', country: 'Bolivia' },
    { code: '+593', country: 'Ecuador' },
    { code: '+375', country: 'Belarus' },
    { code: '+373', country: 'Moldova' },
    { code: '+380', country: 'Ukraine' }
  ]);
 
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

 
const handlePhotoUpload = async (e) => {
  const files = Array.from(e.target.files);
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!files.length) return;

  // Check size
  for (let file of files) {
    if (file.size > maxSize) {
      alert("File size exceeds the 10MB limit");
      return;
    }
  }

  // Check total photo count
  if (photos.length + files.length > 15) {
    alert("Maximum 15 photos can be uploaded.");
    return;
  }

  setPhotoUploading(true);
  setPhotoProgress(0);
  setPhotoUploadSuccess(false); // reset

  try {
    // Simulate upload progress (replace with API later)
    let percent = 0;
    const interval = setInterval(() => {
      percent += 10;
      setPhotoProgress(percent);

      if (percent >= 100) {
        clearInterval(interval);
      }
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate delay

    // Watermarking
    const watermarkedImages = await Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();

          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");

              canvas.width = img.width;
              canvas.height = img.height;

              ctx.drawImage(img, 0, 0);

              // Watermark settings
              const watermarkText = "Rent Pondy";
              const fontSize = Math.max(24, Math.floor(canvas.width / 15));
              ctx.font = `bold ${fontSize}px Arial`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";

              const centerX = canvas.width / 2;
              const centerY = canvas.height / 2;

              // White outline
              ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
              ctx.lineWidth = 4;
              ctx.strokeText(watermarkText, centerX, centerY);

              // Black fill
              ctx.fillStyle = "rgba(224, 223, 223, 0.9)";
              ctx.fillText(watermarkText, centerX, centerY);

              canvas.toBlob((blob) => {
                const watermarkedFile = new File([blob], file.name, {
                  type: file.type,
                });
                resolve(watermarkedFile);
              }, file.type);
            };

            img.src = event.target.result;
          };

          reader.readAsDataURL(file);
        });
      })
    );

    setPhotos([...photos, ...watermarkedImages]);
    setSelectedFiles(watermarkedImages);
    setSelectedPhotoIndex(0);

    // Success message
    setPhotoUploadSuccess(true);
    setTimeout(() => setPhotoUploadSuccess(false), 2000);
  } catch (error) {
    console.error("Photo upload failed:", error);
  } finally {
    setPhotoUploading(false);
  }
};

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
    if (index === selectedPhotoIndex) {
      setSelectedPhotoIndex(0);
    }
  };
  const fileInputRef = useRef(null);



 
  
const handleVideoChange = async (e) => {
  const selectedFiles = Array.from(e.target.files);
  const maxSize = 50 * 1024 * 1024; // 50MB
  const intimationSize = 10 * 1024 * 1024; // 10MB
  const validFiles = [];

  setVideoError(""); // reset previous error

  for (let file of selectedFiles) {
    // ⚡ Intimation if >10MB
    if (file.size > intimationSize && file.size <= maxSize) {
      alert(`${file.name} is above 10MB. Large files may take longer to upload.`);
    }

    // ❌ Reject if >50MB
    if (file.size > maxSize) {
      setVideoError(`${file.name} exceeds the 50MB size limit.`);
      continue;
    }

    // ✅ Compress before pushing
    let compressedFile = file;
    try {
      compressedFile = await compressVideo(file);
    } catch (err) {
      console.warn("Compression failed, using original file", err);
    }

    validFiles.push(compressedFile);
  }

  if (!validFiles.length) return;

  // normal upload flow...
  setvideoUploading(true);
  setProgress(0);
  setUploadSuccess(false);

  // fake progress simulation
  let percent = 0;
  const interval = setInterval(() => {
    percent += 10;
    setProgress(percent);

    if (percent >= 100) {
      clearInterval(interval);

      setVideos((prev) => [...prev, ...validFiles].slice(0, 3));
      setvideoUploading(false);
      setUploadSuccess(true);

      setTimeout(() => setUploadSuccess(false), 2000);
    }
  }, 300);
};

// ⚡ Compress video using ffmpeg.wasm
const compressVideo = async (file) => {
  const { createFFmpeg, fetchFile } = await import("@ffmpeg/ffmpeg");
  const ffmpeg = createFFmpeg({ log: false });
  if (!ffmpeg.isLoaded()) await ffmpeg.load();

  const inputName = "input.mp4";
  const outputName = "output.mp4";

  ffmpeg.FS("writeFile", inputName, await fetchFile(file));
  // Adjust bitrate/resolution for compression
  await ffmpeg.run(
    "-i", inputName,
    "-vcodec", "libx264",
    "-crf", "28",
    "-preset", "veryfast",
    "-vf", "scale=640:-1",
    outputName
  );

  const data = ffmpeg.FS("readFile", outputName);
  return new File([data.buffer], file.name.replace(/\.[^/.]+$/, "") + "_compressed.mp4", { type: "video/mp4" });
};
  const removeVideo = (indexToRemove) => {
  setVideos(prev => prev.filter((_, index) => index !== indexToRemove));
    fileInputRef.current.value = ''; // Reset the file input
  };

  const getMimeType = (filename) => {
  if (!filename || typeof filename !== "string" || !filename.includes(".")) {
    return "video/mp4"; // fallback
  }

  const ext = filename.split('.').pop().toLowerCase();

  switch (ext) {
    case 'mp4': return 'video/mp4';
    case 'webm': return 'video/webm';
    case 'ogg': return 'video/ogg';
    case 'mov': return 'video/quicktime';
    case 'avi': return 'video/x-msvideo';
    case 'mkv': return 'video/x-matroska';
    default: return 'video/mp4';
  }
};

const fileName = typeof video === 'string' ? video : video?.video;
const mimeType = getMimeType(fileName);


  const handlePhotoSelect = (index) => {
    setSelectedPhotoIndex(index);
  };
   const nonDropdownFields = ["rentalAmount", "securityDeposit", "totalArea",  "description","Your Property", "city",  "area", "alternatePhone"];

const dropdownFieldOrder = [
  "propertyMode",
  "propertyType",
  "rentType",
  "rentalAmount",
   "securityDeposit",
  "negotiation",
  "securityDeposit",
  "totalArea",
   "areaUnit",

"bedrooms",
"floorNo",
 "kitchen",
 "balconies",
 "attachedBathrooms",
  "western",
  "carParking",
 "lift",
  "furnished",
 "facing",
  "wheelChairAvailable",
"propertyAge",
"postedBy",
"availableDate",
"description",
"familyMembers",
"foodHabit",
"jobType",
"petAllowed",
"Your Property",
  "city",

  "district",
    "area",

    "alternatePhone",

  "bestTimeToCall"

 

  // Add only the fields that use toggleDropdown
];

 

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

     if (name === "securityDeposit" && value !== "" && !isNaN(value)) {
    setPriceInWordss(convertToIndianRupees(value));
  } else if (name === "securityDeposit" && value === "") {
    setPriceInWordss("");
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

const handleCombinedClick = async (e) => {
  e.preventDefault(); // prevent default once here
  await handleAnim(); // Wait for the animation to complete
  handleSubmit(e);    // call submit function, passing the event
};
 const handleAnim = () => {
  return new Promise((resolve) => {
    setIsProcessing(true);
    setIsSuccess(false);
    setShowCheckmark(false);

    // Simulate processing animation
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Small delay before showing the checkmark
      setTimeout(() => {
        setShowCheckmark(true); // Show checkmark and text

        // Wait 2s to let user see the checkmark and text
        setTimeout(() => {
          resolve(); // Now allow submission
        }, 2000);
      }, 100); // Delay before showing checkmark
    }, 2000); // Processing animation duration
  });
};
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!rentId) {
      setMessage("PPC-ID is required. Please refresh or try again.");
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("rentId", rentId);
  
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
  
    photos.forEach((photo) => {
      formDataToSend.append("photos", photo);
    });
  
    if (video) {
      formDataToSend.append("video", video);
    }
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/update-rent-property`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      setMessage(response.data.message);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
  
    } catch (error) {
      setMessage("Error saving property data.");
    }
  };
  
  
 
  useEffect(() => {
  if (formData.length && formData.breadth) {
    const total = Number(formData.length) * Number(formData.breadth);
    setFormData(prev => ({
      ...prev,
      totalArea: total
    }));
  }
}, [formData.length, formData.breadth]);


const fieldLabels = {
  propertyMode: "Property Mode",
  propertyType: "Property Type",
    rentType: "rent Type",
  rentalAmount: "rental Amount",
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
 
 
   const currentIndex = filteredDropdownFieldOrder.indexOf(field);
 if (currentIndex !== -1 && currentIndex < filteredDropdownFieldOrder.length - 1) {
   const nextField = filteredDropdownFieldOrder[currentIndex + 1];
 
   if (nonDropdownFields.includes(nextField)) {
     // Focus input field
     setTimeout(() => {
       const nextInput = document.querySelector(`[name="${nextField}"]`);
       if (nextInput) {
         nextInput.focus();
         nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
       }
     }, 150);
   } else {
     // Open next dropdown
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
 
 
     const currentIndex = filteredDropdownFieldOrder.indexOf(field);
 if (currentIndex > 0) {
   const prevField = filteredDropdownFieldOrder[currentIndex - 1];
 
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
       toggleDropdown(prevField);
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
 
 
     const currentIndex = filteredDropdownFieldOrder.indexOf(field);
 
 if (currentIndex !== -1 && currentIndex < filteredDropdownFieldOrder.length - 1) {
   const nextField = filteredDropdownFieldOrder[currentIndex + 1];
 
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
           </div>
         </div>
       )}
     </div>
   );
 };

 const hiddenPropertyTypes = ['Plot', 'Land', 'Agricultural land'].map(type => type.toLowerCase());
 
 const fieldsToHideForPlot = [
   'bedrooms',
   'floorNo',
   'kitchen',
   'balconies',
   'attachedBathrooms',
   'western',
   'carParking',
   'lift',
   'furnished',
   'wheelChairAvailable',
   'familyMembers',
   'foodHabit',
   'jobType',
   'petAllowed',
 'doorNumber'
 ];
 
 const shouldHideField = (fieldName) =>
   hiddenPropertyTypes.includes(formData.propertyType) &&
   fieldsToHideForPlot.includes(fieldName);
 
   const filteredDropdownFieldOrder = dropdownFieldOrder.filter(
   (field) => !shouldHideField(field)
 );
const handleEdit = () => {
  setIsPreview(false);
};

const isReadOnly = true; // set true to make it readonly

  return (
         <motion.div
       initial={{ x: '100%', opacity: 0 }}
       animate={{ x: 0, opacity: 1 }}
       exit={{ x: '-100%', opacity: 0 }}
       transition={{ duration: 0.5 }}
     >
     <div className="container-fluid d-flex align-items-center justify-content-center pb-5 p-0" >
            <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%',  fontFamily: "Inter, sans-serif" , }}>
 
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
         e.currentTarget.querySelector('svg').style.color = '#CDC9F9';
       }}
     >
       <FaChevronLeft style={{ color: '#CDC9F9', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
     </button><h3 className="m-0" style={{fontSize:"18px"}}>EDIT PROPERTY</h3> </div>
 <div className="row w-100 mt-2">
<h4 style={{ color: "rgb(10, 10, 10)", fontWeight: "bold", marginBottom: "10px" }}> Property Management</h4>     

{message.text && (
  <div style={{ 
    padding: "10px", 
    backgroundColor: message.type === "success" ? "lightgreen" : "lightcoral", 
    color: "black", 
    margin: "10px 0",
    borderRadius: "5px"
  }}>
    {message.text}
  </div>
)}


 {!isPreview ? (

     <form onSubmit={handleSubmit} style={{ fontFamily: "Inter, sans-serif"}} >
        <p className="p-3" style={{ color: "white", backgroundColor: "#4F4B7E" }}>RENT-ID: {rentId}</p>
                        <h3 style={{ color: "#4F4B7E", fontSize: "24px", marginBottom: "10px" }}> Property Images  </h3>
 

                <div className="form-group photo-upload-container mt-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    name="photos"
                    id="photo-upload"
                    className="photo-upload-input"
                    style={{ display: 'none' }} // Hide the input field
                  />
                  <label htmlFor="photo-upload" className="photo-upload-label fw-normal m-0">
                                 <MdAddPhotoAlternate
      style={{
        color: 'white',
        backgroundColor: '#2e86e4',
        padding: '5px',
        fontSize: '30px',
        borderRadius: '50%',
        marginRight: '5px',
      }}
    />  
            {photoloading ? (
  <>
    <Spinner
      animation="border"
      size="sm"
      style={{ color: "#2e86e4", marginRight: "5px" }}
    />
    Uploading... {photoProgress}%
  </>
) : photoUploadSuccess ? (
  <span style={{ color: "green" }}>✅ Successfully uploaded</span>
) : (
  "Upload Your Property Images"
)}     
                  </label>
                </div>

       {photos.length > 0 && (
  <div className="uploaded-photos">
    <h4>Uploaded Photos</h4>
    <div className="uploaded-photos-grid"
       style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        marginTop: '10px',
      }}>
      {photos.map((photo, index) => {
        let photoUrl = "";

        if (photo instanceof File || photo instanceof Blob) {
          photoUrl = URL.createObjectURL(photo);
        } else if (typeof photo === "string") {
          // photoUrl = photo; // Direct URL from the backend
          photoUrl = `https://rentpondy.com/PPC/${photo}`;

        } else {
          return null;
        }

        return (
          <div key={index} className="uploaded-photo-item  position-relative">
            <input
              type="radio"
              name="selectedPhoto"
              className="position-absolute"
              style={{ top: '-10px' }}
        checked={selectedPhotoIndex === index}
              onChange={() => handlePhotoSelect(index)}
            />
            <img
              src={photoUrl}
              alt="Uploaded"
              className="uploaded-photo m-2"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <button    style={{border:"none"}}
            className="position-absolute top-0 end-0 btn m-0 p-1"
onClick={() => removePhoto(index)}>
                    <IoCloseCircle size={20} color="#F22952"/>
            </button>
          </div>
        );
      })}
    </div>
  </div>
)}

        <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>Property Video</h4>
             <div className="form-group ">
          <input
            type="file"
            name="video"
            accept="video/*"
            id="videoUpload"
            onChange={handleVideoChange}
            className="d-none"
            ref={fileInputRef} // Assign the ref to the input element

          />
          <label htmlFor="videoUpload" className="file-upload-label fw-normal">
            <span className=" pt-5">
              <FaFileVideo
                style={{
                  color: 'white',
                  backgroundColor: '#2e86e4',
                  padding: '5px',
                  fontSize: '30px',
                  marginRight: '5px',
                }}
              />
{videoloading ? (
  <>
    <Spinner
      animation="border"
      size="sm"
      style={{ color: "#2e86e4", marginRight: "5px" }}
    />
    Uploading... {progress}%
  </>
) : uploadSuccess ? (
  <span style={{ color: "green" }}>✅ Successfully uploaded</span>
) : videoError ? (
  <span style={{ color: "red", fontSize:"11px" }}>{videoError}</span>   
) : (
  "Upload Property Videos"
)}                </span>
          </label>

          {/* Display the selected video */}
 {videos.length > 0 && (
         <div className="selected-video-container mt-3">
           <h4 className="text-start">Selected Videos:</h4>
           <div className="d-flex flex-wrap gap-3">
             {videos.map((video, index) => (
               <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                 <video width="200" height="200" controls>
                   <source  src={video instanceof File ? URL.createObjectURL(video) : video}
               type={video instanceof File ? video.type : "video/mp4"} />
                   Your browser does not support the video tag.
                 </video>
                 <Button
                   onClick={() => removeVideo(index)}
                   style={{ border: 'none', background: 'transparent' }}
                   className="position-absolute top-0 end-0 m-1 p-1"
                 >
                   <IoCloseCircle size={20} color="#F22952" />
                 </Button>
               </div>
             ))}
           </div>
         </div>
       )}
</div>

{/* {currentStep >= 1 && ( */}
        <div>
  <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>  Property OverView  </h4>             

  {/* Property Mode */}
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
 onClick={() => {
              toggleDropdown("propertyMode");
            }}                  
            style={{
        cursor: "pointer",
        padding: "12px",
        border:"none",
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
           onClick={() => {
               toggleDropdown("propertyType");
            }}                     
             style={{
            cursor: "pointer",
            // border: "1px solid #4F4B7E",
            border:"none",
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

{/* rentType */}
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
            {fieldIcons.rentType} <sup style={{ color: 'red' }}>*</sup>
          </span>
      <div style={{ flex: "1" }}>
        <select
          name="rentType"
          value={formData.rentType || ""}
          onChange={handleFieldChange}
          className="form-control"
          style={{ display: "none" }} 
        >
          <option value="">Select rent Type</option>
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
            // border: "1px solid #4F4B7E",
            border:"none",
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
    
          {formData.rentType || "Select rent Type"}

          {formData.rentType && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}
        </button>

        {renderDropdown("rentType")}
      </div>
    </div>
  </label>
</div>

{/* negotiation */}

  <div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>Negotiation  </label> */}

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
              {fieldIcons.negotiation || <FaHome />}
            </span>
              <div style={{ flex: "1" }}>
          <select
            name="negotiation"
            value={formData.negotiation || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select negotiation</option>
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
              border:"none",
               padding: "12px",
              background: "#fff",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",border:"none",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
            
            {formData.negotiation || "Selectnegotiation"}
 {formData.negotiation && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("negotiation")}
        </div>
      </div>
    </label>
  </div>
  {/* rentalAmount */}
 
<div className="form-group">
  {/* <label>rental Amount <span style={{ color: 'red' }}>* </span> </label> */}
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
    // boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
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
<img src={price} alt="" style={{ width: 20, height: 20 }} /> <sup style={{ color: 'red' }}>*</sup> </span>
      <input
        type="number"
        name="rentalAmount"
        value={formData.rentalAmount}
        onChange={handleFieldChange}
        className="form-input m-0"
        placeholder="rental Amount"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
      />
    </div>
    {formData.rentalAmount && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
  </div>

  {priceInWords && (
    <p style={{ fontSize: "14px", color: "#4F4B7E", marginTop: "5px" }}>
      {priceInWords}
    </p>
  )}
</div>


  {/* securityDeposit */}
  <div className="form-group">
  {/* <label>securityDeposit</label> */}
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
{fieldIcons.securityDeposit}  </span>
  <input
      type="number"
      name="securityDeposit"
      value={formData.securityDeposit}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="security Deposit"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.securityDeposit && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div>
  {priceInWordss && (
    <p style={{ fontSize: "14px", color: "#4F4B7E", marginTop: "5px" }}>
      {priceInWordss}
    </p>
  )}</div>

{/* Total Area: */}
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
{fieldIcons.totalArea} <sup style={{ color: 'red' }}>*</sup> </span>
  <input
      type="number"
      name="totalArea"
      value={formData.totalArea}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="totalArea"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.totalArea && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
  </div>  </div>

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
              {fieldIcons.areaUnit || <FaHome />}<sup style={{ color: 'red' }}>*</sup>
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
              border:"none",
               padding: "12px",
              background: "#fff",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",border:"none",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >

            {formData.areaUnit || "Select area Unit"}
 {formData.areaUnit && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("areaUnit")}
        </div>
      </div>
    </label>
  </div>
  </div>
{/* //  )} */}


{/* {currentStep >= 2 && ( */}
        <div className="fieldcontent p-0">
  <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}> Basic Property Info  </h4>             

  {!shouldHideField("bedrooms") && (

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
              {fieldIcons.bedrooms || <FaHome />}<sup style={{ color: 'red' }}>*</sup>
            </span> <div style={{ flex: "1" }}>
          <select
          required
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
  )}

    {/* floorNo */}
   {!shouldHideField("floorNo") && (
 
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
               {fieldIcons.floorNo}<sup style={{ color: 'red' }}>*</sup>
             </span>  <div style={{ flex: "1" }}>
           <select required
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
   )}

    {/* kitchen */}
  {!shouldHideField("kitchen") && (

  <div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>kitchen </label> */}

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
              {fieldIcons.kitchen || <FaHome />}
            </span>  <div style={{ flex: "1" }}>
          <select
            name="kitchen"
            value={formData.kitchen || ""}
            onChange={handleFieldChange}
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
             
            {formData.kitchen || "Select kitchen"}
 {formData.kitchen && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("kitchen")}
        </div>
      </div>
    </label>
  </div>
    )}
    {/* balconies */}
      {!shouldHideField("balconies") && (

    <div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>Balconies </label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>          <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
              {fieldIcons.balconies || <FaHome />}
            </span>  <div style={{ flex: "1" }}>
          <select
            name="balconies"
            value={formData.balconies || ""}
            onChange={handleFieldChange}
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
         
            {formData.balconies || "Select Balconies"}
 {formData.balconies && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("balconies")}
        </div>
      </div>
    </label>
  </div>
  )}
    {/*attachedBathrooms */}
          {!shouldHideField("attachedBathrooms") && (
 
       <div className="form-group">
     <label style={{ width: '100%'}}>
     {/* <label>Attached Bathrooms</label> */}
 
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
               {fieldIcons.attachedBathrooms || <FaHome />}
             </span>   <div style={{ flex: "1" }}>
           <select
             name="attachedBathrooms"
             value={formData.attachedBathrooms || ""}
             onChange={handleFieldChange}
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
                 padding: "12px",
               background: "#fff",
               borderRadius: "5px",
               border:"none",
               width: "100%",
               textAlign: "left",
               color: "grey",
             position: "relative",
                         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
 }}
           >
            
             {formData.attachedBathrooms || "Select Attached Bathrooms"}
  {formData.attachedBathrooms && (
             <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
           )}          </button>
 
           {renderDropdown("attachedBathrooms")}
         </div>
       </div>
     </label>
   </div>
  )}

      {/* western */}
        {!shouldHideField("western") && (

    <div className="form-group">

    <label style={{ width: '100%'}}>
    {/* <label>Western</label> */}

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
              {fieldIcons.western || <FaHome />}
            </span>    <div style={{ flex: "1" }}>
          <select
            name="western"
            value={formData.western || ""}
            onChange={handleFieldChange}
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
               padding: "12px",
              background: "#fff",
              borderRadius: "5px",
              border:"none",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
         
            {formData.western || "Select Western"}
 {formData.western && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("western")}
        </div>
      </div>
    </label>
  </div>
   )}
    {/* carParking */}

{!shouldHideField("carParking") && (

    <div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>Car Parking</label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>        <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
              {fieldIcons.carParking || <FaHome />}
            </span>    <div style={{ flex: "1" }}>
          <select
            name="carParking"
            value={formData.carParking || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select car Park</option>
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
               padding: "12px",
              background: "#fff",
              borderRadius: "5px",
              border:"none",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
         
            {formData.carParking || "Select car Park"}
 {formData.carParking && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("carParking")}
        </div>
      </div>
    </label>
  </div>
   )}
    {/*lift */}
        {!shouldHideField("lift") && (

    <div className="form-group">
    <label style={{ width: '100%'}}>
      {/* <label>Lift</label> */}
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
              {fieldIcons.lift || <FaHome />}
            </span>    <div style={{ flex: "1" }}>
          <select
            name="lift"
            value={formData.lift || ""}
            onChange={handleFieldChange}
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
               padding: "12px",
              background: "#fff",
              borderRadius: "5px",
              border:"none",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
           
            {formData.lift || "Select lift"}
 {formData.lift && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("lift")}
        </div>
      </div>
    </label>
  </div>
  )}
  {/* furnished */}
   {!shouldHideField("furnished") && (

  <div className="form-group">
    <label style={{width:"100%"}}>
    {/* <label>Furnished</label> */}

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
              {fieldIcons.furnished || <FaHome />}
            </span>    <div style={{ flex: "1" }}>
          <select
            name="furnished"
            value={formData.furnished || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select Furnished</option>
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
          
            {formData.furnished || "Select furnished"}
 {formData.furnished && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("furnished")}
        </div>
      </div>
    </label>
  </div>
   )}
    {/* facing */}
    <div className="form-group">

    <label style={{ width: '100%'}}>
    {/* <label>Facing</label> */}

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
              {fieldIcons.facing || <FaHome />}
            </span>  <div style={{ flex: "1" }}>
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
               padding: "12px",
              background: "#fff",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",border:"none",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
            
            {formData.facing || "Select facing"}
 {formData.facing && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("facing")}
        </div>
      </div>
    </label>
  </div>
{/* wheelChairAvailable */}
    {!shouldHideField("wheelChairAvailable") && (

  <div className="form-group">
    <label style={{width:"100%"}}>
    {/* <label>wheel Chair Available</label> */}

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
              {fieldIcons.wheelChairAvailable || <FaHome />}
            </span>    <div style={{ flex: "1" }}>
          <select
            name="wheelChairAvailable"
            value={formData.wheelChairAvailable || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select wheelChairAvailable</option>
            {dataList.wheelChairAvailable?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("wheelChairAvailable")}
            style={{
              cursor: "pointer",
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
          
            {formData.wheelChairAvailable || "Select Wheel Chair"}
 {formData.wheelChairAvailable && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("wheelChairAvailable")}
        </div>
      </div>
    </label>
  </div>
 )}

      {/* Property Age */}
    <div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>Property Age </label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>        <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
              {fieldIcons.propertyAge || <FaHome />}
            </span>  <div style={{ flex: "1" }}>
          <select
            name="propertyAge"
            value={formData.propertyAge || ""}
            onChange={handleFieldChange}
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
               padding: "12px",
              background: "#fff",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",border:"none",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
           
            {formData.propertyAge || "Select Property Age"}
 {formData.propertyAge && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("propertyAge")}
        </div>
      </div>
    </label>
  </div>

   {/* postedBy */}
   <div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>PostedBy <span style={{ color: 'red' }}>* </span> </label> */}

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
              {fieldIcons.postedBy} <sup style={{ color: 'red' }}>*</sup>
            </span>   <div style={{ flex: "1" }}>
          <select
            name="postedBy"

            value={formData.postedBy || ""}
            onChange={handleFieldChange}
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
               padding: "12px",
              background: "#fff",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",border:"none",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
           
            {formData.postedBy || "Select posted By"}
 {formData.postedBy && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("postedBy")}
        </div>
      </div>
    </label>
  </div>

  {/* availableDate */}
   
<div className="form-group"> 
  <label style={{ width: '100%' }}>
    {/* <label>availableDate <span style={{ color: 'red' }}>* </span> </label> */}

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
            {fieldIcons.availableDate} <sup style={{ color: 'red' }}>*</sup>
          </span>
      <div style={{ flex: "1" }}>
        <select
          name="availableDate"
          value={formData.availableDate || ""}
          onChange={handleFieldChange}
          className="form-control"
          style={{ display: "none" }} 
          required
        >
          <option value="">Select available From</option>
          {dataList.availableDate?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          className="m-0"
          type="button"
          onClick={() => toggleDropdown("availableDate")}
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
    
          {formData.availableDate || "Select available From"}

          {formData.availableDate && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}
        </button>

        {renderDropdown("availableDate")}
      </div>
    </div>
  </label>
</div>

  </div>
 {/* )} */}


 {/* {currentStep >= 3 && (  */}
        <div className="fieldcontent p-0" >
<h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>  Property Description   </h4>             

<div className="form-group">
    <div className="input-card p-0 rounded-2 mb-2" style={{ 
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
    placeholder="what makes you ad unquie(maximum 250 characters)"
    maxLength={250} // Limits input to 250 characters
    style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}

  ></textarea>
</div>
</div>
{/* familyMembers */}
    {!shouldHideField("familyMembers") && (
      <>
<h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>  Tenant Preferences   </h4>             

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
          
            {formData.familyMembers || "Select No. of Family Members"}
 {formData.familyMembers && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("familyMembers")}
        </div>
      </div>
    </label>
  </div>
  </>
)}
{/* foodHabit */}
    {!shouldHideField("foodHabit") && (

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
  )}
{/* jobType */}
    {!shouldHideField("jobType") && (

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
  )}
{/* petAllowed */}
    {!shouldHideField("petAllowed") && (

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
)}

  </div>
 {/* )} */}
  

{/* {currentStep >= 4 && ( */}
        <div className="fieldcontent p-0">


<h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>  Property Address   </h4>             


<div className="form-group">
{/* <label>Quick Address:</label> */}

<div className="input-card p-0 rounded-2 mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)", background:"#fff" ,}}>
    <FcSearch  className="input-icon" 
    style={{color: '#4F4B7E',marginLeft:"10px"}} />
    <input
      ref={inputRef}
  name="Your Property"

      id="pac-input"
      className="form-input m-0"
      placeholder="Search Enter Your Property"
        style={{ flex: '1', padding: '12px',fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>

</div>
<div
  ref={mapRef}
  id="map"
  style={{ height: "200px", width: "100%" }}
></div>
<div className="mt-3 w-100 d-flex gap-2 mb-2">
  <input 
  ref={coordRef}
  placeholder="Enter lat & lng eg.(11.9416° N, 79.8083° E)"
  className="form-control m-0"
    onChange={(e) => setCoordinateInput(e.target.value)}

    // onChange={handleLatLngAuto} // 👈 Automatically triggers on input
/>
<button className="btn btn-primary m-0 border-0" type="button"
     style={{ whiteSpace: 'nowrap', background:"#4F4B7E" ,  }}
 onClick={() => handleLatLngAuto(coordinateInput)}>
  Go
</button>

  <button
    onClick={handleClear}
    type="button"
    className="btn btn-primary m-0 border-0"
    style={{ whiteSpace: 'nowrap', background:"#CDC9F9" ,  }}
  >
    <MdOutlineClose color="white"/>
  </button>

</div>

<p className="mt-1" style={{color:"#0597FF" , fontSize:"13px"}}>IF YOU CAN'T FIND THE ADDRESS PLEASE ENTER MANUALLY</p>


  {/* country */}

  <div className="form-group">
  {/* <label>country:</label> */}
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
     <BiWorld className="input-icon" style={{color: '#4F4B7E',}} />
  </span>
  <input
      type="text"
      name="country"
      value={formData.country}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="country"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.country && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
  </div>  </div>
  
  {/* State */}

 
 <div className="form-group">
    <label style={{ width: '100%'}}>

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
 {fieldIcons.state} <sup style={{ color: 'red' }}>*</sup>  </span>

  <div style={{ flex: "1" }}>
    <select
      name="state"
      value={formData.state || ""}
      onChange={handleFieldChange}
      className="form-control"
      style={{ display: "none" }}
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
      {formData.state || "Select state"}
      {formData.state && (
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

    {renderDropdown("state")}
  </div>
</div>

    </label>
  </div>
  {/* City */}

<div className="form-group">
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
     {fieldIcons.city || <FaHome />} <sup style={{ color: 'red' }}>*</sup>
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
</div></div>

  {/* district */}
   <div className="form-group" >
      <label style={{width:'100%'}}>
      {/* <label>District</label> */}
  
        <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>        <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
                {fieldIcons.district || <FaHome />}
              </span>     <div style={{ flex: "1" }}>
            <select
              name="district"
              value={formData.district || ""}
              onChange={handleFieldChange}
              className="form-control"
              style={{ display: "none" }} // Hide the default <select> dropdown
            >
              <option value="">Select District</option>
              {dataList.district?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
  
            <button
              className="m-0"
              type="button"
              onClick={() => toggleDropdown("district")}
              style={{
                cursor: "pointer",
                border:"none",
                padding: "12px",
                background: "#fff",
                borderRadius: "5px",
                width: "100%",
                textAlign: "left",
                color: "grey",
                 position: "relative",
                boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}            >
            
              {formData.district || "Select District"}
               {formData.district && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )} 
            </button>
  
            {renderDropdown("district")}
          </div>
        </div>
      </label>
    </div>

  {/* area */}
  <div className="form-group">
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
 {fieldIcons.area}  <sup style={{ color: 'red' }}>*</sup></span>
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
</div></div>
  {/* Nagar */}
  <div className="form-group">
  {/* <label>Nagar:</label> */}
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
 {fieldIcons.nagar}    </span>
  <input
      type="text"
      name="nagar"
      value={formData.nagar}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Nagar"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.nagar && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div></div>
  {/* streetName */}
  <div className="form-group">
  {/* <label>Street Name:</label> */}
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
 {fieldIcons.streetName}      </span>
  <input
      type="text"
      name="streetName"
      value={formData.streetName}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Street Name"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.streetName && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div></div>
  {/* doorNumber */}
    {!shouldHideField("doorNumber") && (
  <div className="form-group">
  {/* <label>Door Number:</label> */}
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
 {fieldIcons.doorNumber}    </span>
  <input
      type="number"
      name="doorNumber"
      value={formData.doorNumber}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Door Number"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.doorNumber && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
  </div></div>

  )}


<div className="form-group">
  {/* <label>pinCode:</label> */}
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
     <TbMapPinCode  className="input-icon" style={{color: '#4F4B7E',}} />
  </span>
  <input
      type="text"
      name="pinCode"
      value={formData.pinCode}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="pinCode"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.pinCode && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div>
</div>

<div className="form-group">
  {/* <label>location Coordinates:</label> */}
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
     <TbWorldLongitude  className="input-icon" style={{color: '#4F4B7E',}} />
  </span>
  <input
      type="text"
      name="locationCoordinates"
      value={formData.locationCoordinates}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="latitude and longitude"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.locationCoordinates && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div></div>

  </div>
{/* )}  */}



{/* {currentStep >= 5 && ( */}
        <div className="fieldcontent p-0" >


<h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>  Owner Details   </h4>             
  {/* Owner Name */}

<div className="form-group">
  {/* <label>Owner Name:</label> */}
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
 {fieldIcons.ownerName}    </span>
  <input
      type="text"
      name="ownerName"
      value={formData.ownerName}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Owner Name"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    /></div>
 
   {formData.ownerName && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div> </div>

  {/* Email */}
  <div className="form-group">
  {/* <label>Email:</label> */}
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
{fieldIcons.email}   </span>
  <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Email"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.email && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div> </div>
  {/* Phone Number */}

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
   // readOnly
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Phone Number"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
 {formData.phoneNumber && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}    </div>
</div>
  {/* Alternate Number */}

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
          value={formData.countryCode || ""}
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



  {/* Best Time to Call */}
  <div className="form-group" >
    <label style={{width:'100%'}}>
    {/* <label>Best Time To Call</label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>        <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
              {fieldIcons.bestTimeToCall || <FaHome />}
            </span>   <div style={{ flex: "1" }}>
          <select
            name="bestTimeToCall"
            value={formData.bestTimeToCall || ""}
            onChange={handleFieldChange}
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
               padding: "12px",
              background: "#fff",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",border:"none",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
          
            {formData.bestTimeToCall || "Select best Time To Call"}
 {formData.bestTimeToCall && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("bestTimeToCall")}
        </div>
      </div>
    </label>
  </div>
  </div>
 {/* )}  */}

      <Button
                  type="button"
                  style={{ marginTop: '15px', backgroundColor: "#4F4B7E", width:"100%" }}
              onMouseOver={(e) => {
                    e.target.style.background = "#CDC9F9"; // Brighter neon on hover
                    e.target.style.fontWeight = 500; // Brighter neon on hover
                    e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
                    e.target.style.color = "#4F4B7E"; // Brighter neon on hover

                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#4F4B7E"; // Original orange
                    e.target.style.fontWeight = 400; // Brighter neon on hover
                    e.target.style.color = "#fff"; // Brighter neon on hover

                  }}
                  onClick={handlePreview}
                >
                  PreView
                </Button>


      </form>

    ) : (
      
        <div ref={previewRef} className="preview-section w-100 d-flex flex-column align-items-center justify-content-center">
         <div className="mb-4">
              <div style={{width:"400px"}}>
  
              
             {(photos.length > 0 || video) ? (
    <Swiper navigation={{
      prevEl: ".swiper-button-prev-custom",
      nextEl: ".swiper-button-next-custom",
    }} 
    ref={swiperRef}
    modules={[Navigation]} className="swiper-container">
      {photos.map((photo, index) => {
        let photoUrl = "";
  
        // Check if the photo is a valid File or Blob
        if (photo instanceof File || photo instanceof Blob) {
          photoUrl = URL.createObjectURL(photo);
        } else if (typeof photo === "string") {
          // photoUrl = photo; // Direct URL from the backend
          photoUrl = `https://rentpondy.com/PPC/${photo}`;
  
        } else {
          return null; // Skip rendering if the format is invalid
        }
  
        return (
          <SwiperSlide key={index} className="d-flex justify-content-center align-items-center"
            style={{
              height: "200px",
              width: "100%",
              overflow: "hidden",
              borderRadius: "8px",
              margin: "auto",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
            }}
          >
            <img
              src={photoUrl}
              alt={`Preview ${index + 1}`}
              className="preview-image"
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
          </SwiperSlide>
        );
      })}
  
  {Array.isArray(videos) && videos.length > 0 && (
       <>
         <h4 className="text-start mt-3">Selected Videos:</h4>
         <Swiper slidesPerView={1} spaceBetween={20}>
           {videos.map((videoItem, index) => {
             let src = "";
             let type = "video/mp4";
     
             if (videoItem instanceof File) {
               src = URL.createObjectURL(videoItem);
               type = videoItem.type || "video/mp4";
             } else if (typeof videoItem === "string") {
               src = `https://rentpondy.com/PPC/${videoItem}`;
               type = getMimeType(videoItem);
             }
     
             if (!src) return null;


             

     
             return (
               <SwiperSlide key={index}>
                 <div style={{ position: "relative" }}>
                   <video
                     controls
                     style={{
                       width: "100%",
                       height: "200px",
                       objectFit: "cover",
                       borderRadius: "8px",
                       boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                     }}
                   >
                     <source src={src} type={type} />
                     Your browser does not support the video tag.
                   </video>
                 </div>
               </SwiperSlide>
             );
           })}
         </Swiper>
       </>
     )}
    </Swiper>
  ) : (
    <p>No media uploaded.</p>
  )}
  
    <style>
      {`
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
          font-size: 24px !important;
        }
          
      `}
    </style>
    <div className="row d-flex align-items-center w-100">
    <div className="d-flex col-12 justify-content-end">  
      <button className="swiper-button-prev-custom m-1 w-30" style={{background:"#4F4B7E", color:"#fff", border:"none"}}>❮</button>
      <button className="swiper-button-next-custom m-1 w-30"style={{background:"#4F4B7E", color:"#fff", border:"none"}}>❯</button>
    </div>
  </div>
  
  
  
    
  </div>
  </div>
<div className="row w-100">

<p className="m-0" style={{
        color: "#4F4B7E",
        fontWeight: 'bold',
        fontSize: "26px"
      }}>
        <FaRupeeSign size={26} /> {formData.rentalAmount ? Number(formData.rentalAmount).toLocaleString('en-IN') : 'N/A'}
    
        <span style={{ fontSize: '14px', color: "#CDC9F9", marginLeft: "10px" }}>
           Negotiation: {formData.negotiation || "N/A"}
        </span>
      </p>
      {priceInWords && (
            <p style={{ fontSize: "14px", color: "#2F747F", marginTop: "5px" }}>
              {priceInWords}
            </p>
)}
  
  {filteredDetailsList.map((detail, index) => {
// Check if it's a heading, which should always be full-width (col-12)
if (detail.heading) {
  return (
    <div key={index} className="col-12">
      <h4
        className="m-0 fw-bold"
        style={{ color: "#000000", fontFamily: "Inter, sans-serif", fontSize: "16px" }}
      >
        {detail.label}
      </h4>
    </div>
  );
}

const isDescription = detail.label === "Description";

 const columnClass = isDescription ? "col-12" : "col-6";

return (
  <div key={index} className={columnClass}>
    <div
      className="d-flex align-items-center border-0 rounded p-1 mb-1"
      style={{
         width: "100%",
        height: isDescription ? "auto" : "55px",
        wordBreak: "break-word",
       }}
    >
      <span className="me-3 fs-3" style={{ color: "#30747F" }}>
        {detail.icon} 
      </span>
      <div>
      {!isDescription && <span className="mb-1" style={{fontSize:"12px", color:"grey"}}>{detail.label || "N/A"}</span>}  {/* ✅ Hide label for description */}

         <p
          className="mb-0 p-0"
          style={{
            fontSize:"14px",
            color:"grey",
            fontWeight:"600",
            padding: "10px",
            borderRadius: "5px",
            width: "100%", // Ensure the value takes full width
          }}
        >
{detail.value
  ? ["Country", "State", "City", "District", "Nagar", "Area", "Street Name", "Door Number", "pinCode", "location Coordinates"].includes(detail.label)
    ? typeof detail.value === "string"
        ? `${detail.value.slice(0, 8)}...`
        : JSON.stringify(detail.value)
      : detail.value
    : "N/A"}       </p>
      </div>
    </div>
  </div>
);
})}
</div>

<div className="col-12"
        style={{paddingLeft:"10px" }}
>
        <div style={{ textAlign: "start", marginTop: "50px", position: "relative" }}>
 
  
            <style>
              {`
                @keyframes moveBar {
                  0% { background-position: 0 0; }
                  100% { background-position: 40px 0; }
                }
      
                @keyframes slideUp {
                  0% {
                    transform: translateY(20px);
                    opacity: 0;
                  }
                  100% {
                    transform: translateY(0);
                    opacity: 1;
                  }
                }
              `}
            </style>
          </div>
               <div style={{ display: 'flex', gap: '20px' }}>
            <button
   onClick={handleEdit}
  style={{
    fontWeight:500,
    border:"2px solid #1882F6",
    padding: "12px 20px",
    fontSize: "16px",
    borderRadius: "25px",
    color: "#1882F6",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    width: "80px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 6px rgba(0, 0, 0, 0.1)",
  }}
>
  EDIT
 
</button>

        <button className="submit-button"
        onClick={handleCombinedClick}
              disabled={isProcessing}
                        style={{
                padding: "12px 20px",
                fontSize: "16px",
                borderRadius: "25px",
                 border: "none",
  background: 'linear-gradient(145deg, #4a90e2, #007bff)',
          color: "#ffffff",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                width: "150px",
                height: "40px",
                  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 6px rgba(0, 0, 0, 0.1)',
              }}>
                   {isProcessing ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: "25px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `repeating-linear-gradient(
                90deg,
                rgba(0, 224, 198, 0.1) 0px,
                rgba(0, 224, 198, 0.1) 6px,
                rgba(0, 224, 198, 0.5) 6px,
                rgba(0, 224, 198, 0.5) 12px
              )`,
              animation: "moveBar 1s linear infinite",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {showCheckmark ? (
      <div style={{
        display: 'flex',
        justifyContent: 'center',  // centers horizontally
        alignItems: 'center',      // centers vertically
        height: '100px'            // or any height you want to center within
      }}>
        <span style={{ animation: "slideUp 0.5s ease", fontSize: "20px" }}>
          <FaRegCircleCheck className="me-1"/> SUBMIT
        </span>
      </div>
          ) : (
            "SUBMIT"
          )}
        </div>
      )}
          <div className="shine-overlay"></div>
        </button>

        
      </div>

      <style>
        {`
          .submit-button,
          .edit-button {
            position: relative;
            border: none;
            border-radius: 12px;
            padding: 12px 24px;
            color: white;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            overflow: hidden;
          }

          .submit-button {
            background: linear-gradient(145deg, #4a90e2, #007bff);
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3), 0 4px 6px rgba(0,0,0,0.1);
          }

          .edit-button {
            background: linear-gradient(145deg, #ffa94d, #ff7f0e);
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3), 0 4px 6px rgba(0,0,0,0.1);
          }

          .shine-overlay {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              120deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.5) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            transform: skewX(-20deg);
            animation: shine 2s infinite;
            pointer-events: none;
          }

          @keyframes shine {
            from { left: -100%; }
            to { left: 100%; }
          }
        `}
      </style>
      </div>
         
        </div>
      )}

    </div>
    </div>
  </div>
  </motion.div>
  );
}

export default EditForm;





