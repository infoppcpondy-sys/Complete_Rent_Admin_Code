

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import moment from 'moment';


const CreateBuyerBill = () => {
  const [billData, setBillData] = useState({
    adminOffice: '',
    adminName: '',
    billNo: '',
    billDate: '',
    Ra_Id: '',
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



  const [paymentTypes, setPaymentTypes] = useState([]);
  const [plans, setPlans] = useState([]);



  useEffect(() => {
    const fetchDefaultBillData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/buyer-get-default-bill-data`);
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

  const fileName = "CreateBuyerBill"; // for dashboard view

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
  const { Ra_Id ,phoneNumber} = location.state || {};
  

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
      Ra_Id: Ra_Id,
      ownerPhone: phoneNumber
    }));
  }, [Ra_Id, phoneNumber]);
  

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
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/buyer-get-default-bill-data-rent`);
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
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/plans-buyer`);
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



  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/buyer-create-bill-rent`, billData);
      if (res.data.success) {
        setMessage('Bill created successfully!');
        
        // Trigger download after successful creation
        downloadBill(billData);
  
        // Reset form
        setBillData({
          adminOffice: '',
          adminName: '',
          billNo: '',
          billDate: '',
          Ra_Id: '',
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
        setMessage('Failed to create bill.');
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      setMessage('Server Error while creating bill.');
    }
  
  // Clear the message after 3 seconds
  setTimeout(() => {
    setMessage('');
  }, 3000);

  setLoading(false);
    setTimeout(() => {
      navigate(-1);
    }, 3000);
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
  Ra Id                ${bill.Ra_Id || ''}
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
    formSection: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      padding: '30px'
    },
    statusBanner: (type) => {
      const bannerStyles = {
        success: { backgroundColor: '#ecfdf5', borderLeft: '3px solid #10b981', color: '#065f46' },
        error: { backgroundColor: '#fef2f2', borderLeft: '3px solid #ef4444', color: '#7f1d1d' },
        loading: { backgroundColor: '#fef3c7', borderLeft: '3px solid #f59e0b', color: '#78350f' }
      };
      return bannerStyles[type] || bannerStyles.success;
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
          border: 'none',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '600',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        },
        secondary: {
          backgroundColor: '#e2e8f0',
          color: '#1a202c',
          border: 'none',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '600',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }
      };
      return buttonStyles[variant] || buttonStyles.primary;
    },
    buttonHover: (variant) => {
      const hoverStyles = {
        primary: {
          backgroundColor: '#2c5aa0',
          boxShadow: '0 4px 12px rgba(49, 130, 206, 0.4)',
          transform: 'translateY(-2px)'
        },
        secondary: {
          backgroundColor: '#cbd5e0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)'
        }
      };
      return hoverStyles[variant] || hoverStyles.primary;
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
        .create-buyer-bill-input:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }
        .create-buyer-bill-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .create-buyer-bill-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          .create-buyer-bill-summary {
            position: static;
            margin-top: 20px;
          }
        }
      `}</style>

      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>📋 Create Buyer Bill</h1>
          <p style={styles.headerSubtitle}>Admin Dashboard › Billing › Create Buyer Bill</p>
        </div>

        {/* Message Banner */}
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
          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.formSection}>
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
                  className="create-buyer-bill-input"
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
                  className="create-buyer-bill-input"
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
                  className="create-buyer-bill-input"
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
                  className="create-buyer-bill-input"
                  style={{ ...styles.input }}
                  value={billData.billDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            {/* Customer Information Section */}
            <h3 style={styles.sectionTitle}>👤 Customer Information</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Ra ID</label>
                <input
                  type="text"
                  name="ppId"
                  value={billData.Ra_Id}
                  onChange={handleChange}
                  className="create-buyer-bill-input"
                  style={{ ...styles.input }}
                  required
                  placeholder="Enter Ra ID"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Owner Phone</label>
                <input
                  type="text"
                  name="ownerPhone"
                  value={billData.ownerPhone}
                  onChange={handleChange}
                  className="create-buyer-bill-input"
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
                  className="create-buyer-bill-input"
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
                  className="create-buyer-bill-input"
                  style={{ ...styles.input }}
                  required
                >
                  <option value="">Select Plan</option>
                  {plans.map((plan, index) => {
                    const name = plan?.planName?.trim?.();
                    return (
                      <option key={index} value={name || ''}>
                        {name || 'Unnamed Plan'}
                      </option>
                    );
                  })}
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
                  className="create-buyer-bill-input"
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
                  className="create-buyer-bill-input"
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
                  className="create-buyer-bill-input"
                  style={{ ...styles.input }}
                  required
                  placeholder="0"
                />
              </div>
            </div>

            {/* Featured Charges Section */}
            <h3 style={styles.sectionTitle}>⭐ Featured Charges</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Featured Amount</label>
                <input
                  type="number"
                  name="featuredAmount"
                  value={billData.featuredAmount}
                  onChange={handleChange}
                  className="create-buyer-bill-input"
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
                  className="create-buyer-bill-input"
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
                  className="create-buyer-bill-input"
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
                  className="create-buyer-bill-input"
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
                  className="create-buyer-bill-input"
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
                className="create-buyer-bill-button"
                style={styles.button('secondary')}
                onClick={() => navigate(-1)}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover('secondary'))}
                onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: '#e2e8f0', boxShadow: 'none' })}
              >
                ← Cancel
              </button>
              <button
                type="submit"
                className="create-buyer-bill-button"
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

          {/* Bill Summary Sidebar */}
          <div className="create-buyer-bill-summary" style={styles.billSummary}>
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

            {/* Quick Tips */}
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

export default CreateBuyerBill;

