

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditBuyerBill = () => {
  const { ba_id } = useParams(); // ✅ Get Ra_Id from URL (ba_id = Ra_Id)
  const navigate = useNavigate();
  
  const [billData, setBillData] = useState({
    adminOffice: '',
    adminName: '',
    billNo: '',
    billDate: '',
    ba_id: '',
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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [plans, setPlans] = useState([]);

  // Fetch bill data on mount
  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/buyer-get-bill/${ba_id}`);
        if (res.data.success) {
          setBillData(res.data.data);
        } else {
          setMessage('Bill not found.');
        }
      } catch (err) {
        setMessage('Error loading bill data.');
      }
    };

    const fetchPaymentTypes = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/payment-all-rent`);
        if (res.data && Array.isArray(res.data)) {
          setPaymentTypes(res.data);
        }
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

    if (ba_id) {
      fetchBill();
      fetchPaymentTypes();
      fetchPlans();
    }
  }, [ba_id]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/buyer-update-bill/${ba_id}`, billData);
      if (res.data.success) {
        setMessage('Bill updated successfully!');
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        setMessage('Failed to update bill.');
      }
    } catch (err) {
      setMessage('Server error while updating bill.');
    }
    setLoading(false);
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
        error: { backgroundColor: '#fef2f2', borderLeft: '3px solid #ef4444', color: '#7f1d1d' }
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
        .edit-buyer-bill-input:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }
        .edit-buyer-bill-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .edit-buyer-bill-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          .edit-buyer-bill-summary {
            position: static;
            margin-top: 20px;
          }
        }
      `}</style>

      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>📋 Edit Tenant Bill</h1>
          <p style={styles.headerSubtitle}>Admin Dashboard › Billing › Edit Tenant Bill</p>
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
                  className="edit-buyer-bill-input"
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
                  className="edit-buyer-bill-input"
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
                  className="edit-buyer-bill-input"
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
                  className="edit-buyer-bill-input"
                  style={{ ...styles.input }}
                  value={billData.billDate}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            </div>

            {/* Customer Information Section */}
            <h3 style={styles.sectionTitle}>👤 Customer Information</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Ba ID</label>
                <input
                  type="text"
                  name="ba_id"
                  value={billData.ba_id}
                  onChange={handleChange}
                  className="edit-buyer-bill-input"
                  style={{ ...styles.input }}
                  readOnly
                  placeholder="Auto-filled"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Owner Phone</label>
                <input
                  type="text"
                  name="ownerPhone"
                  value={billData.ownerPhone}
                  onChange={handleChange}
                  className="edit-buyer-bill-input"
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
                  className="edit-buyer-bill-input"
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
                  className="edit-buyer-bill-input"
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
                  className="edit-buyer-bill-input"
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
                  className="edit-buyer-bill-input"
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
                  className="edit-buyer-bill-input"
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
                  className="edit-buyer-bill-input"
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
                  className="edit-buyer-bill-input"
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
                  className="edit-buyer-bill-input"
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
                  className="edit-buyer-bill-input"
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
                  className="edit-buyer-bill-input"
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
                className="edit-buyer-bill-button"
                style={styles.button('secondary')}
                onClick={() => navigate(-1)}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover('secondary'))}
                onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: '#e2e8f0', boxShadow: 'none' })}
              >
                ← Cancel
              </button>
              <button
                type="submit"
                className="edit-buyer-bill-button"
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
                    Updating Bill...
                  </>
                ) : (
                  '✓ Update Bill'
                )}
              </button>
            </div>
          </form>

          {/* Bill Summary Sidebar */}
          <div className="edit-buyer-bill-summary" style={styles.billSummary}>
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
              <span style={styles.summaryLabel}>Total Amount:</span>
              <span style={styles.summaryValue}>₹{Number((Number(billData.billAmount || 0) + Number(billData.featuredAmount || 0))).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                <span>Net Amount:</span>
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

export default EditBuyerBill;
