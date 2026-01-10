

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation , useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import moment from 'moment';


const CreateBill = () => {
  const [billData, setBillData] = useState({
    adminOffice: '',
    adminName: '',
    billNo: '',
    billDate: '',
    rentId: '',
    ownerPhone: '',
    paymentType: '',
    planName: '',
    billAmount: '',
    validity: '',
    noOfAds: '',
    featuredAmount: '',
    featuredValidity: '',
    featuredMaxAds: '',
    discount: 0,
    netAmount: '',
  });

  // ✅ Track existing follow-up and bill from backend
  const [existingFollowUp, setExistingFollowUp] = useState(null);
  const [existingBill, setExistingBill] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(true);

  const [paymentTypes, setPaymentTypes] = useState([]);
  const [plans, setPlans] = useState([]);



  useEffect(() => {
    const fetchDefaultBillData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-default-bill-data`);
        if (res.data.success) {
          setBillData(prev => ({
            ...prev,
            ...res.data.data
          }));
        }
      } catch (error) {
        console.error('Error fetching default bill data:', error);
      }
    };
  
    fetchDefaultBillData();
  }, []);

  useEffect(() => {
    fetchPaymentTypes();
    fetchPlans();
  }, []);



  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");

  const fileName = "CreateBill"; // for dashboard view

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
  
  // Inside CreateBill component
  
  const location = useLocation();
  const { rentId ,phoneNumber} = location.state || {};
  
  // ✅ CRITICAL: Check if follow-up and bill already exist for this rentId on mount
  // Wait for backend response before rendering anything
  useEffect(() => {
    const checkExistingData = async () => {
      try {
        if (!rentId) {
          console.warn("[CreateBill] No rentId provided, skipping checks");
          setLoadingCheck(false);
          return;
        }

        console.log("[CreateBill] Checking for existing follow-up and bill for rentId:", rentId);

        // Fetch all follow-ups from backend
        const followUpResponse = await axios.get(`${process.env.REACT_APP_API_URL}/followup-list`);
        const followUps = followUpResponse.data.data || [];
        console.log("[CreateBill] Follow-ups fetched from backend:", followUps.length, "items");

        // Find follow-up for THIS specific rentId
        const existingFU = followUps.find(fu => {
          const match = String(fu.rentId).trim() === String(rentId).trim();
          if (match) {
            console.log("[CreateBill] ✅ Found matching follow-up:", fu);
          }
          return match;
        });

        if (existingFU) {
          console.log("[CreateBill] Setting existingFollowUp to:", existingFU);
          setExistingFollowUp(existingFU);
        } else {
          console.warn("[CreateBill] No follow-up found for rentId:", rentId);
          // Explicitly set to false to distinguish from loading state
          setExistingFollowUp(null);
        }

        // Fetch all bills from backend
        const billResponse = await axios.get(`${process.env.REACT_APP_API_URL}/bills`);
        const bills = billResponse.data.data || [];
        console.log("[CreateBill] Bills fetched from backend:", bills.length, "items");

        // Find bill for THIS specific rentId
        const existingB = bills.find(b => String(b.rentId).trim() === String(rentId).trim());
        if (existingB) {
          console.log("[CreateBill] Setting existingBill to:", existingB);
          setExistingBill(existingB);
        } else {
          console.log("[CreateBill] No bill found for rentId:", rentId);
          setExistingBill(null);
        }
      } catch (err) {
        console.error("[CreateBill] Error checking existing data:", err);
        // Don't set existingFollowUp on error - wait for retry
      } finally {
        console.log("[CreateBill] Data check complete, setting loadingCheck to false");
        setLoadingCheck(false);
      }
    };

    checkExistingData();
  }, [rentId]);

  useEffect(() => {
    if (adminName) {
      setBillData((prev) => ({
        ...prev,
        adminName,
      }));
    }
  }, [adminName]);
  

  useEffect(() => {
    setBillData(prev => ({
      ...prev,
      rentId: rentId,
      ownerPhone: phoneNumber
    }));
  }, [rentId, phoneNumber]);
  

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch default bill values, payment types, and plans
  useEffect(() => {
    fetchDefaultBillData();
    fetchPaymentTypes();
    fetchPlans();
  }, []);

  const fetchDefaultBillData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-default-bill-data`);
      if (res.data.success) {
        setBillData(prev => ({
          ...prev,
          ...res.data.data
        }));
      }
    } catch (error) {
      console.error('Error fetching default bill data:', error);
    }
  };

  const fetchPaymentTypes = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/payment-all-rent`);
      setPaymentTypes(res.data);
    } catch (error) {
      console.error('Error fetching payment types:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/plans-rent`);
      setPlans(res.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Manual retry to refresh follow-up and bill data from backend
  const handleRetryCheck = async () => {
    console.log("[CreateBill] Manual retry triggered for rentId:", rentId);
    setLoadingCheck(true);
    
    try {
      if (!rentId) {
        setLoadingCheck(false);
        return;
      }

      // Fetch all follow-ups
      const followUpResponse = await axios.get(`${process.env.REACT_APP_API_URL}/followup-list`);
      const followUps = followUpResponse.data.data || [];
      console.log("[CreateBill] Retry: Follow-ups fetched:", followUps.length, "items");

      const existingFU = followUps.find(fu => String(fu.rentId).trim() === String(rentId).trim());
      if (existingFU) {
        console.log("[CreateBill] Retry: Found follow-up:", existingFU);
        setExistingFollowUp(existingFU);
        alert("✅ Follow-up found! You can now create a bill.");
      } else {
        console.warn("[CreateBill] Retry: No follow-up found");
        setExistingFollowUp(null);
        alert("❌ Still no follow-up found. Please create a follow-up first.");
      }

      // Fetch all bills
      const billResponse = await axios.get(`${process.env.REACT_APP_API_URL}/bills`);
      const bills = billResponse.data.data || [];
      const existingB = bills.find(b => String(b.rentId).trim() === String(rentId).trim());
      if (existingB) {
        setExistingBill(existingB);
      } else {
        setExistingBill(null);
      }
    } catch (err) {
      console.error("[CreateBill] Retry error:", err);
      alert("Error checking data. Please try again.");
    } finally {
      setLoadingCheck(false);
    }
  };



  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ FIXED: Trust the already-loaded state from component mount
    // The initial check (in useEffect) already verified follow-up using proper string comparison
    // No need to re-check - just validate the states that are already loaded
    
    if (!existingFollowUp) {
      alert("❌ Follow-up not loaded!\n\nPlease go back and create a follow-up first.");
      navigate(-1);
      return; // ✅ BLOCK API CALL
    }

    if (existingBill) {
      alert(`❌ Bill already exists!\n\nCreated by: ${existingBill.adminName}\nBill No: ${existingBill.billNo}\nDate: ${new Date(existingBill.createdAt).toLocaleString()}`);
      navigate(-1);
      return; // ✅ BLOCK API CALL
    }

    // Only proceed if validation passed
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/create-bill`, billData);
      if (res.data.success) {
        setMessage('✅ Bill created successfully!');
        // After creating bill from PreApproved flow, redirect to Approved Properties
        setTimeout(() => {
          if (location.state?.from === 'preapproved') {
            navigate('/dashboard/approved-car');
          } else {
            navigate(-1);
          }
        }, 1500);
        // Trigger download after successful creation
        downloadBill(billData);
  
        // Reset form
        setBillData({
          adminOffice: '',
          adminName: '',
          billNo: '',
          billDate: '',
          rentId: '',
          ownerPhone: '',
          paymentType: '',
          planName: '',
          billAmount: '',
          validity: '',
          noOfAds: '',
          featuredAmount: '',
          featuredValidity: '',
          featuredMaxAds: '',
          discount: 0,
          netAmount: '',
        });
        fetchDefaultBillData();
      } else {
        setMessage('❌ Failed to create bill.');
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      setMessage('❌ Server Error while creating bill.');
    }
  
    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);

    setLoading(false);
  };


  


  const downloadBill = (bill) => {
  const billContent = `
  PROPERTY PAYMENT BILL
  -------------------------------
  Bill No: ${bill.billNo || ''}          Bill Date: ${bill.billDate || ''}
  
  Field                Details
  ---------------------------------------
  Admin Office         ${bill.adminOffice || ''}
  Admin Name           ${bill.adminName || ''}
  Rent Id               ${bill.rentId || ''}
  Owner Phone          ${bill.ownerPhone || ''}
  Payment Type         ${bill.paymentType || ''}
  Plan Name            ${bill.planName || ''}
  Bill Amount          ₹${bill.billAmount || '0'}
  Validity             ${bill.validity || '0'} days
  No of Ads            ${bill.noOfAds || '0'}
  Featured Amount      ₹${bill.featuredAmount || '0'}
  Featured Validity    ${bill.featuredValidity || '0'} days
  Featured Max Ads     ${bill.featuredMaxAds || '0'}
  Discount             ${bill.discount || '0'}%
  Net Amount           ₹${bill.netAmount || '0'}
  
  Thank you for your payment!
  `.trim(); // Clean extra top space
  
    const blob = new Blob([billContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bill.billNo || 'bill'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Create Bill</h2>

      {loadingCheck && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '4px',
          color: '#004085'
        }}>
          ⏳ Loading bill information from server... Please wait.
        </div>
      )}

      {!existingFollowUp && !loadingCheck && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24'
        }}>
          <h5 style={{ marginTop: 0 }}>❌ Follow-up Required</h5>
          <p style={{ marginBottom: '10px' }}>
            A follow-up must be created before you can create a bill.
          </p>
          <p style={{ marginBottom: '10px', fontSize: '0.9em' }}>
            <strong>Note:</strong> If you just created a follow-up, there may be a delay. Click "Refresh" below to reload the data.
          </p>
          <button
            type="button"
            className="btn btn-warning btn-sm"
            onClick={handleRetryCheck}
            disabled={loadingCheck}
          >
            🔄 Refresh Follow-up Status
          </button>
        </div>
      )}

      {existingFollowUp && !loadingCheck && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '4px',
          color: '#0c5460'
        }}>
          <h5 style={{ marginTop: 0 }}>✅ Follow-up Verified</h5>
          <p style={{ marginBottom: '5px' }}>
            <strong>Created by:</strong> {existingFollowUp.adminName}
          </p>
          <p style={{ marginBottom: 0, fontSize: '0.9em' }}>
            <strong>Date:</strong> {new Date(existingFollowUp.createdAt).toLocaleString()}
          </p>
        </div>
      )}

      {existingBill && !loadingCheck && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724'
        }}>
          <h5 style={{ marginTop: 0 }}>✅ Bill Already Exists</h5>
          <p style={{ marginBottom: '5px' }}>
            <strong>Bill No:</strong> {existingBill.billNo}
          </p>
          <p style={{ marginBottom: '5px' }}>
            <strong>Created by:</strong> {existingBill.adminName}
          </p>
          <p style={{ marginBottom: '5px' }}>
            <strong>Date:</strong> {new Date(existingBill.createdAt).toLocaleString()}
          </p>
          <p style={{ marginBottom: 0, fontSize: '0.9em', color: '#1a4620' }}>
            Only one bill per property is allowed.
          </p>
        </div>
      )}

      {message && <div style={{ marginBottom: '10px', color: message.includes('successfully') ? 'green' : 'red' }}>{message}</div>}

      <form onSubmit={handleSubmit} style={{ opacity: (existingBill || !existingFollowUp) ? 0.5 : 1, pointerEvents: (existingBill || !existingFollowUp) ? 'none' : 'auto' }}>

        <div className="form-group">
          <label>Admin Office</label>
          <input type="text" name="adminOffice" value={billData.adminOffice} onChange={handleChange} className="form-control" readOnly disabled={existingBill || !existingFollowUp} />
        </div>

  

<div className="form-group">
  <label>Admin Name</label>
  <input
    type="text"
    name="adminName"
    value={billData.adminName}
    onChange={handleChange}
    className="form-control"
    readOnly
    disabled={existingBill || !existingFollowUp}
  />
</div>


        <div className="form-group">
          <label>Bill No</label>
          <input type="text" name="billNo" value={billData.billNo} onChange={handleChange} className="form-control" readOnly disabled={existingBill || !existingFollowUp} />
        </div>

        <div className="form-group">
          <label>Bill Date</label>
        
       <input
  type="date"
  name="billDate"
  className="form-control"
  value={billData.billDate}
  onChange={handleChange}
  min={new Date().toISOString().split('T')[0]} // disables past dates
  required
  disabled={existingBill || !existingFollowUp}
/>

        </div>

        <div className="form-group">
          <label>Rent Id</label>
          <input type="text" name="ppId" value={billData.rentId} onChange={handleChange} className="form-control" required disabled={existingBill || !existingFollowUp} />
        </div>

        <div className="form-group">
          <label>Owner Phone</label>
          <input type="text" name="ownerPhone" value={billData.ownerPhone} onChange={handleChange} className="form-control" required disabled={existingBill || !existingFollowUp} />
        </div>

        <div className="form-group">
          <label>Payment Type</label>
          <select
            name="paymentType"
            value={billData.paymentType}
            onChange={handleChange}
            className="form-control"
            required
            disabled={existingBill || !existingFollowUp}
          >
            <option value="">Select Payment Type</option>
            {paymentTypes.map((payment, index) => (
              <option key={index} value={payment.paymentType}>
                {payment.paymentType}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Plan Name</label>
          <select
            name="planName"
            value={billData.planName}
            onChange={handleChange}
            className="form-control"
            required
            disabled={existingBill || !existingFollowUp}
          >
            <option value="">Select Plan</option>
            {plans.map((plan, index) => (
              <option key={index} value={plan.name.trim()}>
                {plan.name.trim()}
              </option>
            ))}
          </select>
        </div>


        <div className="form-group">
          <label>Bill Amount</label>
          <input type="number" name="billAmount" value={billData.billAmount} onChange={handleChange} className="form-control" required disabled={existingBill || !existingFollowUp} />
        </div>

        <div className="form-group">
          <label>Validity (Days)</label>
          <input type="number" name="validity" value={billData.validity} onChange={handleChange} className="form-control" required disabled={existingBill || !existingFollowUp} />
        </div>

        <div className="form-group">
          <label>No of Ads</label>
          <input type="number" name="noOfAds" value={billData.noOfAds} onChange={handleChange} className="form-control" required disabled={existingBill || !existingFollowUp} />
        </div>

        <div className="form-group">
          <label>Featured Amount</label>
          <input type="number" name="featuredAmount" value={billData.featuredAmount} onChange={handleChange} className="form-control" required disabled={existingBill || !existingFollowUp} />
        </div>

        <div className="form-group">
          <label>Featured Validity (Days)</label>
          <input type="number" name="featuredValidity" value={billData.featuredValidity} onChange={handleChange} className="form-control" required disabled={existingBill || !existingFollowUp} />
        </div>

        <div className="form-group">
          <label>Featured Max Ads</label>
          <input type="number" name="featuredMaxAds" value={billData.featuredMaxAds} onChange={handleChange} className="form-control" required disabled={existingBill || !existingFollowUp} />
        </div>

        <div className="form-group">
          <label>Discount (%)</label>
          <input type="number" name="discount" value={billData.discount} onChange={handleChange} className="form-control" disabled={existingBill || !existingFollowUp} />
        </div>

        <div className="form-group">
          <label>Net Amount</label>
          <input type="number" name="netAmount" value={billData.netAmount} onChange={handleChange} className="form-control" required disabled={existingBill || !existingFollowUp} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading || existingBill || !existingFollowUp || loadingCheck}>
          {loading ? 'Creating Bill...' : 'Create Bill'}
        </button>
      </form>
    </div>
  );
};

export default CreateBill;

