

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditBill = () => {
  const { rentId } = useParams(); // ✅ Get rentId from URL
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
    discount: '',
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
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-bill/${rentId}`);
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
        } else {
        }
      } catch (error) {
      }
    };

    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/plans-rent`);
        if (res.data && Array.isArray(res.data)) {
          setPlans(res.data);
        } else {
        }
      } catch (error) {
      }
    };

    fetchBill();
    fetchPaymentTypes();
    fetchPlans();
  }, [rentId]);

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
    setBillData({ ...billData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update the bill
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/update-bill/${rentId}`, billData);
      if (res.data.success) {
        setMessage('Bill updated successfully!');
        
        // Update property status from 'expired' (preapproved) to 'active' (approved)
        try {
          await axios.put(`${process.env.REACT_APP_API_URL}/update-property-status`, {
            rentId: rentId,
            status: 'active',
          });
        } catch (statusError) {
          console.error('Error updating property status:', statusError);
        }
        
        setTimeout(() => {
          navigate('/dashboard/approved-car', { state: { updatedBillRentId: rentId } });
        }, 1500);
      } else {
        setMessage('Failed to update bill.');
      }
    } catch (err) {
      setMessage('Server error while updating bill.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa', padding: '30px 20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .edit-bill-input:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }
        .edit-bill-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .edit-bill-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          .edit-bill-summary {
            position: static;
            margin-top: 20px;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#1a202c', margin: 0, marginBottom: '8px' }}>📋 Edit Bill</h1>
          <p style={{ fontSize: '14px', color: '#718096', margin: 0 }}>Admin Dashboard › Billing › Edit Bill</p>
        </div>

        {/* Global Success/Error Message */}
        {message && (
          <div style={{
            padding: '16px',
            marginBottom: '20px',
            borderRadius: '8px',
            fontSize: '14px',
            lineHeight: '1.5',
            backgroundColor: message.includes('successfully') ? '#dcfce7' : '#fee2e2',
            borderLeft: `4px solid ${message.includes('successfully') ? '#22c55e' : '#dc2626'}`,
            color: message.includes('successfully') ? '#15803d' : '#7f1d1d'
          }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
              {message}
            </p>
          </div>
        )}

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '30px' }}>
          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              padding: '30px'
            }}
          >
            {/* Admin Information Section */}
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>📝 Admin Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin Office</label>
                <input
                  type="text"
                  name="adminOffice"
                  value={billData.adminOffice}
                  onChange={handleChange}
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  readOnly
                  placeholder="Auto-filled"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin Name</label>
                <input
                  type="text"
                  name="adminName"
                  value={billData.adminName}
                  onChange={handleChange}
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  readOnly
                  placeholder="Auto-filled"
                />
              </div>
            </div>

            {/* Bill Information Section */}
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>🧾 Bill Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bill No</label>
                <input
                  type="text"
                  name="billNo"
                  value={billData.billNo}
                  onChange={handleChange}
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  readOnly
                  placeholder="Auto-generated"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bill Date</label>
                <input
                  type="text"
                  name="billDate"
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  value={billData.billDate}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            </div>

            {/* Tenant Information Section */}
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>👤 Customer Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rent ID</label>
                <input
                  type="text"
                  name="rentId"
                  value={billData.rentId}
                  onChange={handleChange}
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  required
                  placeholder="Enter rent ID"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Owner Phone</label>
                <input
                  type="text"
                  name="ownerPhone"
                  value={billData.ownerPhone}
                  onChange={handleChange}
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  required
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Payment Details Section */}
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>💳 Payment Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Type</label>
                <select
                  name="paymentType"
                  value={billData.paymentType}
                  onChange={handleChange}
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  required
                >
                  <option value="">Select Payment Type</option>
                  {paymentTypes.map((payment, idx) => (
                    <option key={idx} value={payment.paymentType}>
                      {payment.paymentType}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Plan Name</label>
                <select
                  name="planName"
                  value={billData.planName}
                  onChange={handleChange}
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  required
                >
                  <option value="">Select Plan</option>
                  {plans.map((plan, idx) => (
                    <option key={idx} value={plan.name.trim()}>
                      {plan.name.trim()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Main Charges Section */}
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>💰 Main Charges</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bill Amount</label>
                <input
                  type="number"
                  name="billAmount"
                  value={billData.billAmount}
                  onChange={handleChange}
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  required
                  placeholder="0.00"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Validity (Days)</label>
                <input
                  type="number"
                  name="validity"
                  value={billData.validity}
                  onChange={handleChange}
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  required
                  placeholder="0"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>No of Ads</label>
                <input
                  type="number"
                  name="noOfAds"
                  value={billData.noOfAds}
                  onChange={handleChange}
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  required
                  placeholder="0"
                />
              </div>
            </div>

            {/* Featured Section */}
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>⭐ Featured Charges</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Featured Amount</label>
                <input
                  type="number"
                  name="featuredAmount"
                  value={billData.featuredAmount}
                  onChange={handleChange}
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  required
                  placeholder="0.00"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Featured Validity (Days)</label>
                <input
                  type="number"
                  name="featuredValidity"
                  value={billData.featuredValidity}
                  onChange={handleChange}
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  required
                  placeholder="0"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Featured Max Ads</label>
                <input
                  type="number"
                  name="featuredMaxAds"
                  value={billData.featuredMaxAds}
                  onChange={handleChange}
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  required
                  placeholder="0"
                />
              </div>
            </div>

            {/* Final Calculations Section */}
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>📊 Final Calculations</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={billData.discount}
                  onChange={handleChange}
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  placeholder="0"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Net Amount</label>
                <input
                  type="number"
                  name="netAmount"
                  value={billData.netAmount}
                  onChange={handleChange}
                  className="form-control edit-bill-input"
                  style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s ease', backgroundColor: '#ffffff', fontFamily: 'inherit' }}
                  required
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Button Group */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '30px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                style={{
                  backgroundColor: '#e2e8f0',
                  color: '#2d3748',
                  padding: '12px 28px',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: 'none'
                }}
                onClick={() => navigate(-1)}
                onMouseEnter={(e) => Object.assign(e.target.style, { backgroundColor: '#cbd5e0' })}
                onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: '#e2e8f0' })}
              >
                ← Cancel
              </button>
              <button
                type="submit"
                className="edit-bill-button"
                style={{
                  backgroundColor: '#3182ce',
                  color: '#ffffff',
                  padding: '12px 28px',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  border: 'none',
                  opacity: loading ? 0.6 : 1
                }}
                disabled={loading}
                onMouseEnter={(e) => !loading && Object.assign(e.target.style, { backgroundColor: '#2c5aa0', boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)' })}
                onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: '#3182ce', boxShadow: 'none' })}
              >
                {loading ? 'Updating Bill...' : '✓ Update Bill'}
              </button>
            </div>
          </form>

          {/* Bill Summary Panel */}
          <div className="edit-bill-summary" style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            padding: '30px',
            position: 'sticky',
            top: '30px',
            height: 'fit-content'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>📋 Bill Summary</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #edf2f7', fontSize: '14px' }}>
              <span style={{ color: '#718096', fontWeight: '500' }}>Bill Amount:</span>
              <span style={{ color: '#2d3748', fontWeight: '600' }}>₹{Number(billData.billAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #edf2f7', fontSize: '14px' }}>
              <span style={{ color: '#718096', fontWeight: '500' }}>Featured Amount:</span>
              <span style={{ color: '#2d3748', fontWeight: '600' }}>₹{Number(billData.featuredAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #edf2f7', fontSize: '14px' }}>
              <span style={{ color: '#718096', fontWeight: '500' }}>Discount:</span>
              <span style={{ color: '#2d3748', fontWeight: '600' }}>-{billData.discount || 0}%</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #edf2f7', fontSize: '14px' }}>
              <span style={{ color: '#718096', fontWeight: '500' }}>Validity (Days):</span>
              <span style={{ color: '#2d3748', fontWeight: '600' }}>{billData.validity || 0}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #edf2f7', fontSize: '14px' }}>
              <span style={{ color: '#718096', fontWeight: '500' }}>Number of Ads:</span>
              <span style={{ color: '#2d3748', fontWeight: '600' }}>{billData.noOfAds || 0}</span>
            </div>

            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', backgroundColor: '#f7fafc', padding: '12px', borderRadius: '6px', marginTop: '12px' }}>
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

export default EditBill;
