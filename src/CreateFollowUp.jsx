
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

  // ✅ Track existing follow-up from backend
  const [existingFollowUp, setExistingFollowUp] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(true);

  // ✅ Admin names checkbox module (referenced from FollowUpGetTable.jsx)
  const predefinedAdminNames = ['Bala', 'Madhan', 'Prabavathi', 'ThilagavatiMayavan', 'Arund', 'Gayathri', 'Nandhishwari'];
  const [showCreateAdminDropdown, setShowCreateAdminDropdown] = useState(false);
  const [selectedAdminNames, setSelectedAdminNames] = useState([]);
  const [customAdminName, setCustomAdminName] = useState('');

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

  // ✅ CRITICAL: Check if follow-up already exists for this rentId on mount
  useEffect(() => {
    const checkFollowUpExists = async () => {
      try {
        if (!rentId) {
          setLoadingCheck(false);
          return;
        }
        
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/followup-list`);
        const followUps = response.data.data || [];
        
        // Find if any follow-up exists for this rentId
        const existing = followUps.find(fu => fu.rentId === rentId);
        if (existing) {
          setExistingFollowUp(existing);
        }
      } catch (err) {
        console.error("Error checking existing follow-up:", err);
      } finally {
        setLoadingCheck(false);
      }
    };

    checkFollowUpExists();
  }, [rentId]);

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

  // Handle checkbox change for admin names
  const handleCreateAdminNameChange = (name) => {
    setSelectedAdminNames((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    );
  };

  // Get final admin names for submit
  const getFinalCreateAdminNames = () => {
    const finalNames = [...selectedAdminNames];
    if (customAdminName.trim()) {
      finalNames.push(customAdminName.trim());
    }
    return finalNames.length > 0 ? finalNames : [adminName];
  };

  // Handle adding custom admin name
  const handleAddCustomCreateAdminName = () => {
    if (customAdminName.trim() && !selectedAdminNames.includes(customAdminName.trim())) {
      setSelectedAdminNames((prev) => [...prev, customAdminName.trim()]);
      setCustomAdminName('');
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ CRITICAL: Before calling API, check backend one more time
    // This prevents race conditions if user tries to submit while another admin creates it
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/followup-list`);
      const followUps = response.data.data || [];
      const existing = followUps.find(fu => fu.rentId === rentId);
      
      if (existing) {
        alert(`❌ Follow-up already exists!\n\nCreated by: ${existing.adminName}\nDate: ${new Date(existing.createdAt).toLocaleString()}`);
        navigate(-1);
        return; // ✅ BLOCK API CALL
      }
    } catch (err) {
      console.error("Error re-checking follow-up:", err);
      alert("Error verifying follow-up status. Please try again.");
      return; // ✅ BLOCK API CALL on error
    }

    // Only proceed if validation passed
    try {
      const finalAdminNames = getFinalCreateAdminNames();
      const selectedAdminNamesStr = finalAdminNames.join(', ');
      
      const payload = {
        rentId,
        phoneNumber,
        ...formData,
        adminName: selectedAdminNamesStr,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/followup-create`,
        payload
      );

      if (response.status === 201) {
        alert("✅ Follow-up created successfully!");
        // Wait 3 seconds before navigating to allow backend to fully process and sync
        // This ensures the follow-up is available when CreateBill checks for it
        setTimeout(() => {
          navigate(-1); // Go back one page
        }, 3000);
      } else {
        throw new Error("Non-200 response");
      }
    } catch (err) {
      alert("❌ Failed to create follow-up!\n" + (err.response?.data?.message || err.message));
      console.error("Error during follow-up creation:", err);
    }
  };
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Create Follow-up</h2>

      {loadingCheck && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '4px',
          color: '#004085'
        }}>
          Loading follow-up information...
        </div>
      )}

      {existingFollowUp && !loadingCheck && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724'
        }}>
          <h5 style={{ marginTop: 0 }}>✅ Follow-up Already Exists</h5>
          <p style={{ marginBottom: '5px' }}>
            <strong>Created by:</strong> {existingFollowUp.adminName}
          </p>
          <p style={{ marginBottom: '5px' }}>
            <strong>Date:</strong> {new Date(existingFollowUp.createdAt).toLocaleString()}
          </p>
          <p style={{ marginBottom: 0, fontSize: '0.9em', color: '#1a4620' }}>
            Only one follow-up per property is allowed.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ opacity: existingFollowUp ? 0.5 : 1, pointerEvents: existingFollowUp ? 'none' : 'auto' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Rent ID:</label>
          <input 
            type="text" 
            value={rentId || "N/A"} 
            disabled 
            style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Phone Number:</label>
          <input 
            type="text" 
            value={phoneNumber || "N/A"} 
            disabled 
            style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Follow-up Status:</label>
          <select 
            name="followupStatus" 
            onChange={handleInputChange}
            disabled={!!existingFollowUp}
            style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          >
            <option value="">Select Reason</option>
            <option value="Ring">Ring</option>
            <option value="Ready To Pay">Ready To Pay</option>
            <option value="Not Decided">Not Decided</option>
            <option value="Not Interested-Closed">Not Interested-Closed</option>
            <option value="Paid Closed">Paid Closed</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Follow-up Type:</label>
          <select 
            name="followupType" 
            onChange={handleInputChange}
            disabled={!!existingFollowUp}
            style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          >
            <option value="">Select</option>
            <option value="Payment Followup">Payment Followup</option>
            <option value="Data Followup">Data Followup</option>
            <option value="Enquiry Followup">Enquiry Followup</option>
            <option value="Enquiry Followup">Payment Closed</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Follow-up Date:</label>
          <input
            type="date"
            name="followupDate"
            onChange={handleInputChange}
            disabled={!!existingFollowUp}
            style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          />
        </div>

        {/* Admin Names Checkbox Module */}
        <div style={{ marginBottom: '15px', border: '1px solid #e0e0e0', padding: '12px', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>👤 Select Admin Name(s):</label>
          
          <div style={{ marginBottom: '10px' }}>
            <button
              type="button"
              onClick={() => setShowCreateAdminDropdown(!showCreateAdminDropdown)}
              style={{
                padding: '8px 12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left'
              }}
              disabled={!!existingFollowUp}
            >
              {showCreateAdminDropdown ? '▼ Hide Admin List' : '▶ Show Admin List'}
            </button>
          </div>

          {showCreateAdminDropdown && !existingFollowUp && (
            <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto' }}>
              {predefinedAdminNames.map((name) => (
                <div key={name} style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedAdminNames.includes(name)}
                      onChange={() => handleCreateAdminNameChange(name)}
                      style={{ marginRight: '8px', cursor: 'pointer', width: '18px', height: '18px' }}
                    />
                    <span>{name}</span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Custom Admin Name Input */}
          {!existingFollowUp && (
            <div style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={customAdminName}
                onChange={(e) => setCustomAdminName(e.target.value)}
                placeholder="Enter custom admin name"
                style={{ padding: '8px', flex: 1, border: '1px solid #ccc', borderRadius: '4px' }}
                disabled={!!existingFollowUp}
              />
              <button
                type="button"
                onClick={handleAddCustomCreateAdminName}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                disabled={!!existingFollowUp}
              >
                Add
              </button>
            </div>
          )}

          {/* Display selected admin names */}
          {selectedAdminNames.length > 0 && (
            <div style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '4px' }}>
              <strong style={{ fontSize: '0.9em' }}>✓ Selected:</strong>
              <div style={{ fontSize: '0.9em', marginTop: '5px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {selectedAdminNames.map((name) => (
                  <span
                    key={name}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          type="submit"
          disabled={existingFollowUp || loadingCheck}
          style={{
            padding: '10px 20px',
            backgroundColor: existingFollowUp ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: existingFollowUp ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loadingCheck ? 'Checking...' : 'Create Follow-up'}
        </button>
      </form>
    </div>
  );
}

export default CreateFollowUp;




