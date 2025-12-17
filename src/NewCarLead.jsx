 


import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";


const RecentProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
const [rentIdFilter, setRentIdFilter] = useState('');
const [phoneNumberFilter, setPhoneNumberFilter] = useState('');
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [filteredData, setFilteredData] = useState([]);

  const fetchRecentProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/fetch-recent-properties`
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (data.properties && data.properties.length > 0) {
        setProperties(data.properties);
          setFilteredData(data.properties); // <== Add this

        setMessage("");
      } else {
        setProperties([]);
        setMessage("No recent properties found in the last 15 days.");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setMessage("Failed to fetch recent properties.");
      setProperties([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecentProperties();
  }, []);
    const tableRef = useRef();
  
  const handlePrint = () => {
    const printContent = tableRef.current.innerHTML;
    const printWindow = window.open("", "", "width=1200,height=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
          <style>
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: left; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <table>${printContent}</table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
useEffect(() => {
  if (!properties || properties.length === 0) return;

const filtered = properties.filter((item) => {
  const rentId = String(item.rentId || '').toLowerCase();
  const phone = String(item.phoneNumber || '').toLowerCase();

  const matchesRentId = rentIdFilter
    ? rentId.includes(rentIdFilter.toLowerCase())
    : true;

  const matchesPhone = phoneNumberFilter
    ? phone.includes(phoneNumberFilter.toLowerCase())
    : true;

  const createdAt = new Date(item.createdAt).getTime();
  const from = startDate ? new Date(startDate).getTime() : null;
  const to = endDate ? new Date(endDate).getTime() : null;
  const matchesDate = (!from || createdAt >= from) && (!to || createdAt <= to);

  return matchesRentId && matchesPhone && matchesDate;
});


  setFilteredData(filtered);
}, [properties, rentIdFilter, phoneNumberFilter, startDate, endDate]);

const handleReset = () => {
  setRentIdFilter('');
  setPhoneNumberFilter('');
  setStartDate('');
  setEndDate('');
  setFilteredData(properties); // Reset to full list
};

  
  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
  
  
   const [allowedRoles, setAllowedRoles] = useState([]);
   
   const fileName = "New Property Lead"; // current file
   
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
    <div className="container">
<h4>Quick filter</h4>
      <div     className="d-flex flex-row gap-2 align-items-center flex-nowrap"
>
  <input
    type="text"
    placeholder="Search Rent ID"
    value={rentIdFilter}
    onChange={(e) => setRentIdFilter(e.target.value)}
    style={{ marginRight: "10px" }}
  />
  <input
    type="text"
    placeholder="Search Phone Number"
    value={phoneNumberFilter}
    onChange={(e) => setPhoneNumberFilter(e.target.value)}
    style={{ marginRight: "10px" }}
  />
  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    style={{ marginRight: "10px" }}
  />
  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    style={{ marginRight: "10px" }}
  />
  <button style={{background:"orange"}} onClick={handleReset}>Reset</button>
</div>

      <h2>Recent Properties (Last 15 Days)</h2>
              <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
      {loading && <p>Loading...</p>}

      {!loading && message && (
        <div style={{ color: "red", marginBottom: "10px" }}>{message}</div>
      )}

      {!loading && properties.length > 0 && (
        <div ref={tableRef}>
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>S.No</th>
              <th>RENT ID</th>
              <th>PhoneNumber</th>
              <th>Property Mode</th>
              <th>Property Type</th>
              <th>rentalAmount</th>
              <th>City</th>
                            <th>State</th>
              <th>Created At</th>
               {/* <th>View Details</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((property, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td style={{cursor: "pointer"}}
                   onClick={() =>
                              navigate(`/dashboard/detail`, {
                                state: { rentId: property.rentId, phoneNumber: property.phoneNumber },
                              })
                            }>{property.rentId || "N/A"}</td>
                                <td>{property.phoneNumber || "N/A"}</td>
                <td>{property.propertyMode || "N/A"}</td>
                <td>{property.propertyType || "N/A"}</td>
                <td>{property.rentalAmount || "N/A"}</td>
                <td>{property.city || "N/A"}</td>
                <td>{property.state || "N/A"}</td>

                <td>{new Date(property.createdAt).toLocaleString()}</td>
             {/* <td>
                          <Button
                            variant=""
                            size="sm"
                            style={{backgroundColor:"#0d94c1",color:"white"}}
                            onClick={() =>
                              navigate(`/dashboard/detail`, {
                                state: { rentId: property.rentId, phoneNumber: property.phoneNumber },
                              })
                            }
                          >
                            View Details
                          </Button>
                        </td>  */}
                         </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default RecentProperties;
