




import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Admin from "./Admin";
import Dashboard from "./Dashboard";
import EditProperty from "./EditProperty";
import GetForm from "./DataAddAdmin/GetForm";
import AdminSetForm from "./DataAddAdmin/AdminSetForm";
import Plan from "./Plan";
import Detail from "./Detail";
import GetBuyerAssistance from "./GetBuyerAssistance";
import PropertyAssistance from "./PropertyAssistance";
import PMLogin from "./PMLogin";
import PMDashboard from "./PMDashboard";
 
import { useDispatch } from 'react-redux';
import { setName } from './redux/adminSlice';
import { setRole } from './redux/adminSlice';

// Protected Route - Check if user is authenticated and has completed OTP
const ProtectedDashboard = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const adminName = localStorage.getItem('adminName');
  const adminRole = localStorage.getItem('adminRole');
  const otpVerified = localStorage.getItem('otpVerified');
  
  // Check all required authentication conditions
  if (!isAuthenticated || isAuthenticated !== 'true' || 
      !adminName || !adminRole || 
      !otpVerified || otpVerified !== 'true') {
    // Clear any partial authentication data
    localStorage.clear();
    return <Navigate to="/admin" replace />;
  }
  
  return <Dashboard />;
};

// Protected Route - Check if PM is authenticated (no OTP required)
const ProtectedPM = () => {
  const pmAuthenticated = localStorage.getItem('pmAuthenticated');
  const pmEmail = localStorage.getItem('pmEmail');
  
  // Check PM authentication conditions
  if (!pmAuthenticated || pmAuthenticated !== 'true' || !pmEmail) {
    return <Navigate to="/dashboard/pm" replace />;
  }
  
  return <PMDashboard />;
};

const App = () => {

  
  const dispatch = useDispatch();


  useEffect(() => {
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
  
    if (name) {
      dispatch(setName(name));
    }
    if (role) {
      dispatch(setRole(role));
    }
  }, [dispatch]);
  


  
  return (
   

    <Router basename="/process">
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/dashboard/pm" element={<PMLogin />} />
      <Route path="/dashboard/pm/home" element={<ProtectedPM />} />
      <Route path="/dashboard/*" element={<ProtectedDashboard />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
    </Router>
    
  );
};

export default App;



















