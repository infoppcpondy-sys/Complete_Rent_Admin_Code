

import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";
const InsuranceLoanLeadTable = () => {
  
    const reduxAdminName = useSelector((state) => state.admin.name);
    const reduxAdminRole = useSelector((state) => state.admin.role);
    
    const adminName = reduxAdminName || localStorage.getItem("adminName");
    const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
    
    
     const [allowedRoles, setAllowedRoles] = useState([]);
         const [loading, setLoading] = useState(true);
     
     const fileName = "Insurance Lead"; // current file
     
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
         }
       };
     
       if (adminName && adminRole) {
         recordDashboardView();
       }
     }, [adminName, adminRole]);
     
     // Fetch role-based permissions
     useEffect(() => {
       const fetchPermissions = async () => {
         try {
           const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-role-permissions`);
           const rolePermissions = res.data.find((perm) => perm.role === adminRole);
           const viewed = rolePermissions?.viewedFiles?.map(f => f.trim()) || [];
           setAllowedRoles(viewed);
         } catch (err) {
         } finally {
           setLoading(false);
         }
       };
     
       if (adminRole) {
         fetchPermissions();
       }
     }, [adminRole]);
     
    
     if (loading) return <p>Loading...</p>;
    
     if (!allowedRoles.includes(fileName)) {
       return (
         <div className="text-center text-red-500 font-semibold text-lg mt-10">
           Only admin is allowed to view this file.
         </div>
       );
     }
    
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Insurance Lead</h2>
        <button style={{background:"#5F9EA0", color:"#fff", border:'none'}}>Resolved Insurance - Loan Lead</button>
      </div>
      <Table striped bordered hover responsive className="table-sm align-middle">
                  <thead className="sticky-top">
          <tr>
            <th>CAR ID</th>
            <th>Posted From</th>
            <th>MOBILE NUMBER</th>
            <th>CAR TITLE</th>
            <th>AD SUBMIT DATE</th>
            <th>INSURANCE TYPE</th>
            <th>INSURANCE SALE LEAD</th>
            <th>INSURANCE EXPIRY DATE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>12345</td>
            <td>Chennai</td>
            <td>+91-9876543210</td>
            <td>Toyota Corolla</td>
            <td>2024-12-20</td>
            <td>Comprehensive</td>
            <td>Yes</td>
            <td>2025-12-20</td>
            <td>
              <button className="btn btn-sm btn-success">View</button>{" "}
              <button className="btn btn-sm btn-danger">Delete</button>
            </td>
          </tr>
          <tr>
            <td>67890</td>
            <td>Pondicherry</td>
            <td>+91-8765432109</td>
            <td>Honda Civic</td>
            <td>2024-12-22</td>
            <td>Third-Party</td>
            <td>No</td>
            <td>2025-06-15</td>
            <td>
              <button className="btn btn-sm btn-success">View</button>{" "}
              <button className="btn btn-sm btn-danger">Delete</button>
            </td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </Table>
    </div>
  );
};

export default InsuranceLoanLeadTable;
