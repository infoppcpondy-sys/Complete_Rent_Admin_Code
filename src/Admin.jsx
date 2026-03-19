import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAdminData } from './redux/adminSlice';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import rentadmin from './Assets/rentpondylogo.png';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5e9 50%, #f1f8fe 100%)',
    fontFamily: "'Segoe UI', sans-serif",
    padding: '20px',
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    maxWidth: '900px',
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(160deg, #1a7c3e 0%, #25a65a 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 32px',
    gap: '24px',
  },
  logoWrapper: {
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '24px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '120px',
    height: '120px',
    objectFit: 'contain',
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: '22px',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: '1.4',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  tagline: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '13px',
    textAlign: 'center',
    letterSpacing: '1px',
  },
  rightPanel: {
    flex: 1,
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  formTitle: {
    color: '#1a7c3e',
    fontSize: '20px',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '28px',
    letterSpacing: '0.5px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '6px',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#333',
    background: '#fafafa',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#333',
    background: '#fafafa',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    appearance: 'none',
    cursor: 'pointer',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #1a7c3e, #25a65a)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    letterSpacing: '0.5px',
    transition: 'opacity 0.2s, transform 0.1s',
  },
  timerText: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#777',
    marginBottom: '8px',
  },
  resendBtn: {
    background: 'none',
    border: 'none',
    color: '#1a7c3e',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
    display: 'block',
    margin: '0 auto 8px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#999',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'block',
    margin: '10px auto 0',
    textDecoration: 'underline',
  },
};

const Admin = () => {
  const [formData, setFormData] = useState({
    officeName: '',
    name: '',
    password: '',
    role: '',
    userType: '',
    otp: '',
  });

  const [step, setStep] = useState('login');
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const officeOptions = ['ADMIN', 'ARV 1', 'ARV 2', 'ARV 3'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (otpTimer === 0 && step === 'verify') {
      setCanResendOtp(true);
    }
  }, [otpTimer, step]);

  const getFocusStyle = (field) =>
    focusField === field
      ? { borderColor: '#25a65a', boxShadow: '0 0 0 3px rgba(37,166,90,0.1)', background: '#fff' }
      : {};

  const handleLogin = async (e) => {
    e.preventDefault();
    const { name, password, role, officeName } = formData;
    if (!name || !password || !role) {
      return toast.error('All fields are required');
    }
    setLoading(true);
    try {
      const loginRes = await axios.post(`${process.env.REACT_APP_API_URL}/adminlogin-rent`, {
        name, password, role,
      });
      const loginMessage = loginRes?.data?.message?.toLowerCase();
      if (loginRes.status === 200 && loginMessage?.includes('login successful')) {
        if (role.toLowerCase() === 'marketing') {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('adminName', name);
          localStorage.setItem('adminRole', role);
          // localStorage.setItem('adminUserType', userType);
          localStorage.setItem('otpVerified', 'true');
          dispatch(setAdminData({ name, role, isVerified: true }));
          toast.success('Login Successful');
          navigate('/dashboard/statistics');
        } else {
          const otpRes = await axios.post(`${process.env.REACT_APP_API_URL}/admin-send-otp-login-rent`, {
            officeName: 'ADMIN', adminName: name,
          });
          if (otpRes?.data?.success) {
            toast.success('OTP sent to registered contact');
            setOtpTimer(60);
            setCanResendOtp(false);
            setStep('verify');
          } else {
            toast.error(otpRes?.data?.message || 'OTP service error');
          }
        }
      } else {
        if (loginMessage?.includes('password')) toast.error('Password is incorrect');
        else if (loginMessage?.includes('username')) toast.error('Username is incorrect');
        else toast.error(loginRes?.data?.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message?.toLowerCase() || '';
      if (errorMsg.includes('password')) toast.error('Password is incorrect');
      else if (errorMsg.includes('username')) toast.error('Username is incorrect');
      else toast.error(err.response?.data?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) return toast.error('Enter OTP');
    setLoading(true);
    try {
      const otpRes = await axios.post(`${process.env.REACT_APP_API_URL}/verify-otp-login-admin-rent`, {
        officeName: 'ADMIN', otp: formData.otp, adminName: formData.name,
      });
      if (otpRes.data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('adminName', formData.name);
        localStorage.setItem('adminRole', formData.role);
        // localStorage.setItem('adminUserType', formData.userType);
        localStorage.setItem('otpVerified', 'true');
        dispatch(setAdminData({ name: formData.name, role: formData.role, isVerified: true }));
        toast.success('Login Successful');
        navigate('/dashboard/statistics');
      } else {
        toast.error(otpRes.data.message || 'Invalid OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const otpRes = await axios.post(`${process.env.REACT_APP_API_URL}/admin-send-otp-login-rent`, {
        officeName: 'ADMIN', adminName: formData.name,
      });
      if (otpRes?.data?.success) {
        toast.success('OTP resent to registered contact');
        setOtpTimer(60);
        setCanResendOtp(false);
        setFormData((prev) => ({ ...prev, otp: '' }));
      } else {
        toast.error(otpRes?.data?.message || 'Failed to resend OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error resending OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={styles.card}>

        {/* Left Branding Panel */}
        <div style={styles.leftPanel}>
          <div style={styles.logoWrapper}>
            <img src={rentadmin} alt="Rent Pondy Logo" style={styles.logo} />
          </div>
          <div style={styles.welcomeTitle}>Welcome to{'\n'}Rent Pondy Admin</div>
          {/* <div style={styles.tagline}>Manage your properties with ease</div> */}
        </div>

        {/* Right Form Panel */}
        <div style={styles.rightPanel}>
          <div style={styles.formTitle}>
            {step === 'login' ? 'Admin Login' : 'Verify OTP'}
          </div>

          <form onSubmit={step === 'login' ? handleLogin : handleVerifyOtp}>

            {/* Office Name — shown in both steps */}
            {/* <div style={styles.formGroup}>
              <label style={styles.label}>Office Name</label>
              <select
                name="officeName"
                value={formData.officeName}
                onChange={handleChange}
                style={{ ...styles.select, ...getFocusStyle('officeName') }}
                onFocus={() => setFocusField('officeName')}
                onBlur={() => setFocusField(null)}
                required
              >
                <option value="">Select Office</option>
                {officeOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div> */}

            {step === 'login' && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>User Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter admin name"
                    style={{ ...styles.input, ...getFocusStyle('name') }}
                    onFocus={() => setFocusField('name')}
                    onBlur={() => setFocusField(null)}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    style={{ ...styles.input, ...getFocusStyle('password') }}
                    onFocus={() => setFocusField('password')}
                    onBlur={() => setFocusField(null)}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    style={{ ...styles.select, ...getFocusStyle('role') }}
                    onFocus={() => setFocusField('role')}
                    onBlur={() => setFocusField(null)}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="accountant">Accountant</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>

                {/* <div style={styles.formGroup}>
                  <label style={styles.label}>User Type</label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    style={{ ...styles.select, ...getFocusStyle('userType') }}
                    onFocus={() => setFocusField('userType')}
                    onBlur={() => setFocusField(null)}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="all">ALL</option>
                    <option value="PUC">PUC</option>
                    <option value="TUC">TUC</option>
                  </select>
                </div> */}
              </>
            )}

            {step === 'verify' && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Enter OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter the OTP sent to you"
                    style={{ ...styles.input, ...getFocusStyle('otp'), letterSpacing: '4px', fontSize: '18px', textAlign: 'center' }}
                    onFocus={() => setFocusField('otp')}
                    onBlur={() => setFocusField(null)}
                    maxLength={6}
                    required
                  />
                </div>

                {otpTimer > 0 && (
                  <p style={styles.timerText}>
                    OTP expires in:{' '}
                    <strong style={{ color: '#1a7c3e' }}>
                      {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}
                    </strong>
                  </p>
                )}

                {canResendOtp && (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    style={styles.resendBtn}
                  >
                    Resend OTP
                  </button>
                )}
              </>
            )}

            <button
              type="submit"
              style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? 'Processing...' : step === 'login' ? 'Send OTP' : 'Verify OTP & Login'}
            </button>

            {step === 'verify' && (
              <button
                type="button"
                style={styles.backBtn}
                onClick={() => { setStep('login'); setFormData(prev => ({ ...prev, otp: '' })); }}
              >
                ← Back to Login
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;