




import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";

function GetForm() {
  const [rentId, setrentId] = useState(null);
  const [formData, setFormData] = useState({
    rentId: "",
    phoneNumber: "",
    rentalPropertyAddress: "",
    state: "",
    city: "",
    district: "",
    area: "",
    streetName: "",
    doorNumber: "",
    nagar: "",
    ownerName: "",
    email: "",
    alternatePhone: "",
    video: "",
    photos: [],
    propertyMode: "",
    propertyType: "",
    bankLoan: "",
    negotiation: "",
    ownership: "",
    bedrooms: "",
    kitchen: "",
    kitchenType: "",
    balconies: "",
    floorNo: "",

    areaUnit: "",
    propertyApproved: "",
    propertyAge: "",
    postedBy: "",
    facing: "",
    rentType:"",
  foodHabit:"",
 familyMembers:"",
              requirementType:"",
                  availableDate:"",

  jobType:"",
  petAllowed:"",
  securityDeposit:"",
  wheelChairAvailable:"",
    furnished: "",
    lift: "",
    attachedBathrooms: "",
    western: "",
    numberOfFloors: "",
    carParking: "",
    bestTimeToCall: "",
     district: "",
    minPrice:"",
    maxPrice:"",
    paymentType:"",
    state:"",
  });

 
  
  useEffect(() => {
    const fetchrentId = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/latest-rentId`);
        const nextrentId = response.data.latestrentId ? response.data.latestrentId + 1 : 1001;
        setrentId(nextrentId);
      } catch (error) {
      }
    };

    fetchrentId();
  }, []);

  const [dataList, setDataList] = useState({}); // Object to store dropdown options for each field

  // Fetch dropdown options for all fields
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

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, photos: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/add-property`, formData);
      alert(response.data.message);
      if (response.data.message === "Property Added Successfully") {
        // Redirect or handle success
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchDropdownData(); // Fetch dropdown options when the component mounts
  }, []);


  
const reduxAdminName = useSelector((state) => state.admin.name);
const reduxAdminRole = useSelector((state) => state.admin.role);

const adminName = reduxAdminName || localStorage.getItem("adminName");
const adminRole = reduxAdminRole || localStorage.getItem("adminRole");


 

  return (
    <div>
      <h1>Property Management</h1>
      <form onSubmit={handleSubmit}>
      <p className='p-3' style={{color:"white",backgroundColor:"rgb(47,116,127)"}}>PPC-ID: {rentId}</p>
      {Object.keys(formData).map((field) => {
          if (field === "photos") {
            return (
              <div key={field} style={{ marginBottom: "15px" }}>
                <label>
                  Upload Photos:
                  <input
                    type="file"
                    name={field}
                    multiple
                    onChange={handlePhotoChange}
                    className="form-control"
                  />
                </label>
                <div>
                  {formData.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Property ${index + 1}`}
                      style={{ width: "100px", marginRight: "10px" }}
                    />
                  ))}
                </div>
              </div>
            );
          } else if (
            [
              "propertyMode",
              "propertyType",
              "bankLoan",
              "negotiation",
              "ownership",
              "bedrooms",
              "kitchen",
              "kitchenType",
              "balconies",
              "floorNo",
              "areaUnit",
              "propertyApproved",
              "propertyAge",
              "postedBy",
              "facing",
              "rentType",
  "foodHabit",
  "jobType",
  "petAllowed",
  "securityDeposit",
  "familyMembers",
  "availableDate",
              "requirementType",
              "wheelChairAvailable",
              "furnished",
              "lift",
              "attachedBathrooms",
              "western",
              "numberOfFloors",
              "carParking",
              "bestTimeToCall",
               "district",
              "minPrice",
              "maxPrice",
              "paymentType",
              "state",
              



            ].includes(field)
          ) {
            return (
              <div key={field} style={{ marginBottom: "15px" }}>
                <label>
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}:
                  <select
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleFieldChange}
                    className="form-control"
                  >
                    <option value="">Select {field}</option>
                    {dataList[field]?.map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            );
          } else {
            return (
              <div key={field} style={{ marginBottom: "15px" }}>
                <label>
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}:
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleFieldChange}
                    className="form-control"
                  />
                </label>
              </div>
            );
          }
        })}
        <button type="submit" className="btn btn-primary">
          Save Property
        </button>
      </form>
    </div>
  );
}

export default GetForm;
