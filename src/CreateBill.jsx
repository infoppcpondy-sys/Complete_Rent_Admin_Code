

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
  const [loadingCheck, setLoadingCheck] = useState(false); // Changed to false - no automatic check

  const [paymentTypes, setPaymentTypes] = useState([]);
  const [plans, setPlans] = useState([]);



  // useEffect(() => {
  //   const fetchDefaultBillData = async () => {
  //     try {
  //       const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-default-bill-data`);
  //       if (res.data.success) {
  //         setBillData(prev => ({
  //           ...prev,
  //           ...res.data.data
  //         }));
  //       }
  //     } catch (error) {
  //       console.error('Error fetching default bill data:', error);
  //     }
  //   };
  
  //   fetchDefaultBillData();
  // }, []);

  // useEffect(() => {
  //   fetchPaymentTypes();
  //   fetchPlans();
  // }, []);



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
  
  // ✅ REMOVED: Automatic follow-up and bill check on mount
  // Users must now manually verify and create followup/bill via buttons
  // Previously this was running checkExistingData() automatically
  // Now it's only called when user clicks the button

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

  // ✅ FIX: Reset followup/bill state when rentId changes to avoid stale data
  // When user navigates to a new property, clear old followup/bill details
  useEffect(() => {
    setExistingFollowUp(null);
    setExistingBill(null);
  }, [rentId]);

  // ✅ NEW: Automatically check for existing followup/bill when rentId is available
  // Show status directly instead of requiring user to click "Check Status" button
  useEffect(() => {
    if (rentId) {
      console.log("[CreateBill] Auto-checking for existing followup/bill for rentId:", rentId);
      handleRetryCheck();
    }
  }, [rentId]);
  

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

  // Auto-calculate Net Amount when bill amount, featured amount, or discount changes
  useEffect(() => {
    const billAmount = Number(billData.billAmount || 0);
    const featuredAmount = Number(billData.featuredAmount || 0);
    const discount = Number(billData.discount || 0);

    const totalAmount = billAmount + featuredAmount;
    const discountAmount = totalAmount * (discount / 100);
    const netAmount = totalAmount - discountAmount;

    setBillData(prev => ({
      ...prev,
      netAmount: netAmount.toFixed(2)
    }));
  }, [billData.billAmount, billData.featuredAmount, billData.discount]);

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
        // alert("✅ Follow-up found! You can now create a bill.");
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

  // ✅ NEW: Handle manual followup creation
  const handleCreateFollowup = async () => {
    if (!rentId) {
      alert("❌ Rent ID is missing. Please provide a valid rent ID.");
      return;
    }

    setLoadingCheck(true);
    try {
      const followupData = {
        rentId: rentId,
        ownerPhone: phoneNumber || billData.ownerPhone,
        adminName: adminName,
        createdAt: new Date().toISOString(),
      };

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/create-followup`, followupData);
      
      if (res.data.success) {
        setExistingFollowUp(res.data.data);
        alert("✅ Follow-up created successfully! You can now create a bill.");
        setMessage('✅ Follow-up created successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert(`❌ Failed to create follow-up: ${res.data.message || 'Unknown error'}`);
        setMessage(`❌ Failed to create follow-up: ${res.data.message || 'Unknown error'}`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error("[CreateBill] Error creating followup:", error);
      alert(`❌ Error creating follow-up: ${error.response?.data?.message || error.message}`);
      setMessage(`❌ Error creating follow-up: ${error.response?.data?.message || error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoadingCheck(false);
    }
  };



  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if bill already exists (optional - user can override if needed)
    // if (existingBill) {
    //   const proceed = window.confirm(`⚠️ Bill already exists!\n\nBill No: ${existingBill.billNo}\nCreated by: ${existingBill.adminName}\nDate: ${new Date(existingBill.createdAt).toLocaleString()}\n\nProceed to create another bill?`);
    //   if (!proceed) {
    //     return;
    //   }
    // }

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


  // Styles object for consistent theming
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      padding: '30px 20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '30px'
    },
    headerTitle: {
      fontSize: '32px',
      fontWeight: '600',
      color: '#1a202c',
      margin: 0,
      marginBottom: '8px'
    },
    headerSubtitle: {
      fontSize: '14px',
      color: '#718096',
      margin: 0
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    },
    formSection: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      padding: '30px'
    },
    statusBanner: (type) => {
      const typeStyles = {
        loading: {
          backgroundColor: '#e0f2fe',
          borderLeft: '4px solid #0284c7',
          color: '#0c4a6e'
        },
        error: {
          backgroundColor: '#fee2e2',
          borderLeft: '4px solid #dc2626',
          color: '#7f1d1d'
        },
        success: {
          backgroundColor: '#dcfce7',
          borderLeft: '4px solid #22c55e',
          color: '#15803d'
        },
        warning: {
          backgroundColor: '#fef08a',
          borderLeft: '4px solid #eab308',
          color: '#78350f'
        }
      };
      return typeStyles[type] || typeStyles.loading;
    },
    banner: {
      padding: '16px',
      marginBottom: '20px',
      borderRadius: '8px',
      fontSize: '14px',
      lineHeight: '1.5'
    },
    bannerTitle: {
      fontSize: '15px',
      fontWeight: '600',
      marginTop: 0,
      marginBottom: '8px'
    },
    bannerText: {
      marginBottom: '10px'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    input: {
      padding: '12px 14px',
      fontSize: '14px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      backgroundColor: '#ffffff',
      fontFamily: 'inherit'
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#3182ce',
      boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.1)'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: '2px solid #e2e8f0'
    },
    billSummary: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      padding: '30px',
      position: 'sticky',
      top: '30px',
      height: 'fit-content'
    },
    summaryTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: '2px solid #e2e8f0'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '12px',
      marginBottom: '12px',
      borderBottom: '1px solid #edf2f7',
      fontSize: '14px'
    },
    summaryLabel: {
      color: '#718096',
      fontWeight: '500'
    },
    summaryValue: {
      color: '#2d3748',
      fontWeight: '600'
    },
    summaryTotal: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1a202c',
      backgroundColor: '#f7fafc',
      padding: '12px',
      borderRadius: '6px',
      marginTop: '12px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '30px',
      justifyContent: 'flex-end'
    },
    button: (variant) => {
      const buttonStyles = {
        primary: {
          backgroundColor: '#3182ce',
          color: '#ffffff',
          border: 'none'
        },
        secondary: {
          backgroundColor: '#e2e8f0',
          color: '#2d3748',
          border: 'none'
        }
      };
      return {
        ...buttonStyles[variant],
        padding: '12px 28px',
        fontSize: '14px',
        fontWeight: '600',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: 'none'
      };
    },
    buttonHover: (variant) => {
      const hoverStyles = {
        primary: {
          backgroundColor: '#2c5aa0',
          boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)'
        },
        secondary: {
          backgroundColor: '#cbd5e0'
        }
      };
      return hoverStyles[variant];
    },
    spinner: {
      display: 'inline-block',
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTopColor: '#ffffff',
      animation: 'spin 0.8s linear infinite',
      marginRight: '8px',
      verticalAlign: 'middle'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .create-bill-input:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }
        .create-bill-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .create-bill-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          .create-bill-summary {
            position: static;
            margin-top: 20px;
          }
        }
      `}</style>

      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>📋 Create New Bill</h1>
          <p style={styles.headerSubtitle}>Admin Dashboard › Billing › Create New Bill</p>
        </div>

        {/* Loading Check Banner */}
        {loadingCheck && (
          <div style={{ ...styles.banner, ...styles.statusBanner('loading') }}>
            <p style={styles.bannerTitle}>⏳ Processing Request</p>
            <p style={styles.bannerText}>
              Please wait...
            </p>
          </div>
        )}

        {/* Manual Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {/* <button
            type="button"
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: loadingCheck || !rentId ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              border: 'none',
              opacity: loadingCheck || !rentId ? 0.6 : 1
            }}
            onClick={handleCreateFollowup}
            disabled={loadingCheck || !rentId}
            onMouseEnter={(e) => !loadingCheck && !rentId === false && Object.assign(e.target.style, { backgroundColor: '#059669', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' })}
            onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: '#10b981', boxShadow: 'none' })}
          >
            {loadingCheck ? '⏳ Creating...' : '➕ Create Followup'}
          </button> */}
        </div>

        {/* Status Indicators */}
        {existingFollowUp && (
          <div style={{ ...styles.banner, ...styles.statusBanner('success'), marginBottom: '20px' }}>
            <p style={styles.bannerTitle}>✅ Follow-up Created</p>
            <p style={styles.bannerText}>
              <strong>Created by:</strong> {existingFollowUp.adminName}
            </p>
            <p style={{ ...styles.bannerText, fontSize: '13px', marginBottom: 0 }}>
              <strong>Date:</strong> {new Date(existingFollowUp.createdAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* {existingBill && ( */}
          {/* <div style={{ ...styles.banner, ...styles.statusBanner('warning'), marginBottom: '20px' }}> */}
            {/* <p style={styles.bannerTitle}>⚠️ Bill Already Exists</p> */}
            {/* <p style={styles.bannerText}> */}
              {/* <strong>Bill No:</strong> {existingBill.billNo} */}
            {/* </p> */}
            {/* <p style={styles.bannerText}> */}
              {/* <strong>Created by:</strong> {existingBill.adminName}
            </p>
            <p style={{ ...styles.bannerText, fontSize: '13px', marginBottom: 0 }}>
              <strong>Date:</strong> {new Date(existingBill.createdAt).toLocaleString()}
            </p>
          </div>
        )} */}

        {/* Global Success/Error Message */}
        {message && (
          <div style={{
            ...styles.banner,
            ...styles.statusBanner(message.includes('successfully') ? 'success' : 'error'),
            marginBottom: '20px'
          }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
              {message}
            </p>
          </div>
        )}

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 350px',
          gap: '30px',
          '@media (max-width: 1024px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Form Section - Always Enabled */}
          <form
            onSubmit={handleSubmit}
            style={{
              ...styles.formSection
            }}
          >
            {/* Admin Information Section */}
            <h3 style={styles.sectionTitle}>📝 Admin Information</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Admin Office</label>
                <input
                  type="text"
                  name="adminOffice"
                  value={billData.adminOffice}
                  onChange={handleChange}
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  readOnly
                  
                  placeholder="Auto-filled"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Admin Name</label>
                <input
                  type="text"
                  name="adminName"
                  value={billData.adminName}
                  onChange={handleChange}
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  readOnly
                  
                  placeholder="Auto-filled"
                />
              </div>
            </div>

            {/* Bill Information Section */}
            <h3 style={styles.sectionTitle}>🧾 Bill Information</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bill No</label>
                <input
                  type="text"
                  name="billNo"
                  value={billData.billNo}
                  onChange={handleChange}
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  readOnly
                  
                  placeholder="Auto-generated"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bill Date</label>
                <input
                  type="date"
                  name="billDate"
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  value={billData.billDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  
                />
              </div>
            </div>

            {/* Tenant Information Section */}
            <h3 style={styles.sectionTitle}>👤 Customer Information</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Rent ID</label>
                <input
                  type="text"
                  name="ppId"
                  value={billData.rentId}
                  onChange={handleChange}
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  required
                  
                  placeholder="Enter rent ID"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Owner Phone</label>
                <input
                  type="text"
                  name="ownerPhone"
                  value={billData.ownerPhone}
                  onChange={handleChange}
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  required
                  
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Payment Details Section */}
            <h3 style={styles.sectionTitle}>💳 Payment Details</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Payment Type</label>
                <select
                  name="paymentType"
                  value={billData.paymentType}
                  onChange={handleChange}
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  required
                  
                >
                  <option value="">Select Payment Type</option>
                  {paymentTypes.map((payment, index) => (
                    <option key={index} value={payment.paymentType}>
                      {payment.paymentType}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Plan Name</label>
                <select
                  name="planName"
                  value={billData.planName}
                  onChange={handleChange}
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  required
                  
                >
                  <option value="">Select Plan</option>
                  {plans.map((plan, index) => (
                    <option key={index} value={plan.name.trim()}>
                      {plan.name.trim()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Main Charges Section */}
            <h3 style={styles.sectionTitle}>💰 Main Charges</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bill Amount</label>
                <input
                  type="number"
                  name="billAmount"
                  value={billData.billAmount}
                  onChange={handleChange}
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  required
                  
                  placeholder="0.00"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Validity (Days)</label>
                <input
                  type="number"
                  name="validity"
                  value={billData.validity}
                  onChange={handleChange}
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  required
                  
                  placeholder="0"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>No of Ads</label>
                <input
                  type="number"
                  name="noOfAds"
                  value={billData.noOfAds}
                  onChange={handleChange}
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  required
                  
                  placeholder="0"
                />
              </div>
            </div>

            {/* Featured Section */}
            <h3 style={styles.sectionTitle}>⭐ Featured Charges</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Featured Amount</label>
                <input
                  type="number"
                  name="featuredAmount"
                  value={billData.featuredAmount}
                  onChange={handleChange}
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  required
                  
                  placeholder="0.00"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Featured Validity (Days)</label>
                <input
                  type="number"
                  name="featuredValidity"
                  value={billData.featuredValidity}
                  onChange={handleChange}
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  required
                  
                  placeholder="0"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Featured Max Ads</label>
                <input
                  type="number"
                  name="featuredMaxAds"
                  value={billData.featuredMaxAds}
                  onChange={handleChange}
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  required
                  
                  placeholder="0"
                />
              </div>
            </div>

            {/* Final Calculations Section */}
            <h3 style={styles.sectionTitle}>📊 Final Calculations</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={billData.discount}
                  onChange={handleChange}
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  
                  placeholder="0"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Net Amount</label>
                <input
                  type="number"
                  name="netAmount"
                  value={billData.netAmount}
                  onChange={handleChange}
                  className="form-control create-bill-input"
                  style={{ ...styles.input }}
                  required
                  
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Button Group */}
            <div style={styles.buttonGroup}>
              <button
                type="button"
                style={{
                  ...styles.button('secondary')
                }}
                onClick={() => navigate(-1)}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover('secondary'))}
                onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: '#e2e8f0' })}
              >
                ← Cancel
              </button>
              <button
                type="submit"
                style={{
                  ...styles.button('primary'),
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                disabled={loading}
                onMouseEnter={(e) => !e.target.disabled && Object.assign(e.target.style, styles.buttonHover('primary'))}
                onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: '#3182ce', boxShadow: 'none' })}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Creating Bill...
                  </>
                ) : (
                  '✓ Create Bill'
                )}
              </button>
            </div>
          </form>

          {/* Bill Summary Panel */}
          <div className="create-bill-summary" style={styles.billSummary}>
            <h3 style={styles.summaryTitle}>📋 Bill Summary</h3>

            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Bill Amount:</span>
              <span style={styles.summaryValue}>₹{Number(billData.billAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Featured Amount:</span>
              <span style={styles.summaryValue}>₹{Number(billData.featuredAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Discount:</span>
              <span style={styles.summaryValue}>-{billData.discount || 0}%</span>
            </div>

            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Validity (Days):</span>
              <span style={styles.summaryValue}>{billData.validity || 0}</span>
            </div>

            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Number of Ads:</span>
              <span style={styles.summaryValue}>{billData.noOfAds || 0}</span>
            </div>

            <div style={styles.summaryTotal}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Total Amount:</span>
                <span>₹{Number(billData.netAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {billData.billDate && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#f7fafc',
                borderRadius: '6px',
                fontSize: '13px',
                textAlign: 'center',
                color: '#4a5568'
              }}>
                <strong>Bill Date:</strong>
                <div style={{ marginTop: '4px', fontSize: '12px' }}>
                  {new Date(billData.billDate).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}

            {/* Summary Info Box */}
            <div style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: '#eff6ff',
              borderLeft: '3px solid #3182ce',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#1e40af',
              lineHeight: '1.5'
            }}>
              <strong>💡 Quick Tips:</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '16px' }}>
                <li>Ensure all mandatory fields are filled</li>
                <li>Bill summary updates automatically</li>
                <li>Review amounts before submission</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBill;

