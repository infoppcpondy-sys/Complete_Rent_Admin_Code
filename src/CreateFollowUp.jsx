
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation , useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";

function CreateFollowUp() {
  const [formData, setFormData] = useState({
    followupStatus: "",
    followupType: "",
    followupDate: "",
  });

  const location = useLocation();
  const { rentId, phoneNumber } = location.state || {};

  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");

  const fileName = "CreateFollowUp"; // for dashboard view

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
        console.error("Error recording dashboard view:", err);
      }
    };

    if (adminName && adminRole) {
      recordDashboardView();
    }
  }, [adminName, adminRole]);


  useEffect(() => {
      if (adminName) {
        setFormData((prev) => ({
          ...prev,
          adminName,
        }));
      }
    }, [adminName]);
    
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        rentId,
        phoneNumber,
        ...formData,
        adminName,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/followup-create`,
        payload
      );

      if (response.status === 201) {
        alert("Follow-up created successfully!");
        setTimeout(() => {
          navigate(-1); // Go back one page
        }, 3000);
      } else {
        throw new Error("Non-200 response");
      }
    } catch (err) {
      alert("Failed to create follow-up!");
      console.error("Error during follow-up creation:", err);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Rent Id:</label>
        <input type="text" value={rentId || "N/A"} disabled />
      </div>

      <div>
        <label>Phone Number:</label>
        <input type="text" value={phoneNumber || "N/A"} disabled />
      </div>

      <div>
        <label>Follow-up Status:</label>
        <select name="followupStatus" onChange={handleInputChange} required>
          <option value="">Select Reason</option>
          <option value="Ring">Ring</option>
          <option value="Ready To Pay">Ready To Pay</option>
          <option value="Not Decided">Not Decided</option>
          <option value="Not Interested-Closed">Not Interested-Closed</option>
          <option value="Paid Closed">Paid Closed</option>
        </select>
      </div>

      <div>
        <label>Follow-up Type:</label>
        <select name="followupType" onChange={handleInputChange} required>
          <option value="">Select</option>
          <option value="Payment Followup">Payment Followup</option>
          <option value="Data Followup">Data Followup</option>
          <option value="Enquiry Followup">Enquiry Followup</option>
        </select>
      </div>

      <div>
        <label>Follow-up Date:</label>
        <input
          type="date"
          name="followupDate"
          onChange={handleInputChange}
          required
        />
      </div>

      <button type="submit">Create Follow-up</button>
    </form>
  );
}

export default CreateFollowUp;




