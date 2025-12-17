














import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAdminData } from './redux/adminSlice';
import './Admin.css';
import 'react-toastify/dist/ReactToastify.css';
import rentadmin from './Assets/rentadmin.png';

const Admin = () => {
  const [formData, setFormData] = useState({
    officeName: '',
    name: '',
    password: '',
    role: '',
    userType: '',
    otp: '',
  });

  const [step, setStep] = useState('login'); // 'login' | 'verify'
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const officeOptions = ['ADMIN', 'ARV 1', 'ARV 2', 'ARV 3'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  const { name, password, role, userType, officeName } = formData;

  // Check all fields
  if (!name || !password || !role || !userType || !officeName) {
    return toast.error("All fields are required");
  }

  setLoading(true);
  try {
    // Send login request
    const loginRes = await axios.post(
      `${process.env.REACT_APP_API_URL}/adminlogin-rent`,
      { name, password, role, userType }
    );

    const loginMessage = loginRes?.data?.message?.toLowerCase();

    // Check if login was successful
    if (loginRes.status === 200 && loginMessage?.includes("login successful")) {
      // Send OTP after successful login
      const otpRes = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin-send-otp-login-rent`,
        { officeName }
      );

      if (otpRes?.data?.success) {
        toast.success("OTP sent to registered contact");
        setStep('verify');
      } else {
        toast.error(otpRes?.data?.message || "OTP service error");
      }
    } else {
      // Handle login failure
      if (loginMessage?.includes("password")) {
        toast.error("Password is incorrect");
      } else if (loginMessage?.includes("username")) {
        toast.error("Username is incorrect");
      } else if (loginMessage?.includes("invalid credentials")) {
        toast.error("Login failed. Please check name, password, role, and user type.");
      } else {
        toast.error(loginRes?.data?.message || "Login failed. Please try again.");
      }
    }
  } catch (err) {
    // Handle any unexpected errors
    const errorMsg = err.response?.data?.message?.toLowerCase() || "Connection error";

    if (errorMsg.includes("password")) {
      toast.error("Password is incorrect");
    } else if (errorMsg.includes("username")) {
      toast.error("Username is incorrect");
    } else if (errorMsg.includes("invalid credentials")) {
      toast.error("Login failed. Please check name, password, role, and user type.");
    } else {
      toast.error(err.response?.data?.message || "An unexpected error occurred");
    }
  } finally {
    setLoading(false);
  }
};


  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!formData.otp) {
      return toast.error("Enter OTP");
    }

    setLoading(true);
    try {
      const otpRes = await axios.post(
        `${process.env.REACT_APP_API_URL}/verify-otp-login-admin-rent`,
        {
          officeName: formData.officeName,
          otp: formData.otp,
        }
      );

      if (otpRes.data.success) {
        dispatch(setAdminData({
          name: formData.name,
          role: formData.role,
          userType: formData.userType,
          isVerified: true,
        }));

        toast.success("Login Successful");
        navigate('/dashboard/statistics');
      } else {
        toast.error(otpRes.data.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <ToastContainer />
      <Row className="w-100">
        <Col md={7} className="d-none d-md-block">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            // src='https://www.freepik.com/free-vector/mobile-login-concept-illustration_4957412.htm#fromView=keyword&page=1&position=5&uuid=5d7020a6-a9b3-44db-b860-784b2f856e6a&query=Admin+Login'
            alt="Login Illustration"
            className="img-fluid"
          />
        </Col>
        <Col md={5} lg={4}>
          <div className="p-4 rounded shadow bg-white">
            <h5 className="text-primary text-center mb-4">ADMIN LOGIN RENT PONDY</h5>
            <Form onSubmit={step === 'login' ? handleLogin : handleVerifyOtp}>
              {/* Office Dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>Office Name</Form.Label>
                <Form.Control
                  as="select"
                  name="officeName"
                  value={formData.officeName}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Office</option>
                  {officeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              {step === 'login' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter admin name"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      as="select"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                      <option value="accountant">Accountant</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>User Type</Form.Label>
                    <Form.Control
                      as="select"
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="all">ALL</option>
                      <option value="PUC">PUC</option>
                      <option value="TUC">TUC</option>
                    </Form.Control>
                  </Form.Group>
                </>
              )}

              {step === 'verify' && (
                <Form.Group className="mb-3">
                  <Form.Label>Enter OTP</Form.Label>
                  <Form.Control
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter the OTP"
                    required
                  />
                </Form.Group>
              )}

              <Button type="submit" className="w-100 mt-2" disabled={loading}>
                {loading ? 'Processing...' : step === 'login' ? 'Send OTP' : 'Verify OTP & Login'}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
