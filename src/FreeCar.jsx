 

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";
// import { Table } from "react-bootstrap";
// import pic from "./Assets/Mask Group 3.png";

// const FreePlansWithProperties = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-free-plans`);
//         const rawData = response.data.data || [];
  
//         // Sort by the latest updatedAt (or createdAt) from the properties array
//         const sortedData = rawData.sort((a, b) => {
//           const latestA = getLatestPropertyDate(a.properties);
//           const latestB = getLatestPropertyDate(b.properties);
  
//           return latestB - latestA; // Descending order
//         });
  
//         setData(sortedData);
//         setFilteredData(sortedData);
//       } catch (err) {
//         setError("Error fetching data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchData();
//   }, []);
  

//   const handleDelete = async (rentId) => {
//     if (window.confirm(`Are you sure you want to delete RENT ID: ${rentId}?`)) {
//       try {
//         const response = await fetch(`${process.env.REACT_APP_API_URL}/delete-free-property/${rentId}`, {
//           method: 'PUT',
//         });
//         const data = await response.json();
//         alert(data.message);
//         // Optionally refresh data here
//       } catch (error) {
//         alert('Failed to delete the property.');
//       }
//     }
//   };
  
//   const handleUndoDelete = async (rentId) => {
//     if (window.confirm(`Are you sure you want to undo delete for RENT ID: ${rentId}?`)) {
//       try {
//         const response = await fetch(`${process.env.REACT_APP_API_URL}/undo-delete-free-property/${rentId}`, {
//           method: 'PUT',
//         });
//         const data = await response.json();
//         alert(data.message);
//         // Optionally refresh data here
//       } catch (error) {
//         alert('Failed to undo delete.');
//       }
//     }
//   };
  

//   // Utility to get latest date from properties
//   const getLatestPropertyDate = (properties = []) => {
//     let latestDate = new Date(0);
//     properties.forEach((p) => {
//       const updatedAt = new Date(p.updatedAt || 0);
//       const createdAt = new Date(p.createdAt || 0);
//       const maxDate = updatedAt > createdAt ? updatedAt : createdAt;
//       if (maxDate > latestDate) latestDate = maxDate;
//     });
//     return latestDate;
//   };

  
//   const handleDeleteProperty = async (rentId) => {
//     if (!window.confirm(`Are you sure you want to delete property with RENT ID ${rentId}?`)) return;
  
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/delete-free-property/${rentId}`, {
//         method: 'DELETE',
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         alert('Property deleted successfully!');
//         // Optionally re-fetch your list or remove the property from state
//       } else {
//         alert(data.message || 'Failed to delete property');
//       }
//     } catch (error) {
//       alert('Server error while deleting property');
//     }
//   };
//       const tableRef = useRef();
    
//     const handlePrint = () => {
//       const printContent = tableRef.current.innerHTML;
//       const printWindow = window.open("", "", "width=1200,height=800");
//       printWindow.document.write(`
//         <html>
//           <head>
//             <title>Print Table</title>
//             <style>
//               table { border-collapse: collapse; width: 100%; font-size: 12px; }
//               th, td { border: 1px solid #000; padding: 6px; text-align: left; }
//               th { background: #f0f0f0; }
//             </style>
//           </head>
//           <body>
//             <table>${printContent}</table>
//           </body>
//         </html>
//       `);
//       printWindow.document.close();
//       printWindow.print();
//     };

//   // Filter data based on user input
// const handleSearch = () => {
//   const filtered = data.map((item) => ({
//     ...item,
//     properties: item.properties.filter((property) => {
//       const searchTermLower = searchTerm.toLowerCase();

//       const rentIdMatch = property.rentId?.toString().toLowerCase().includes(searchTermLower);
//       const phoneNumberMatch = property.phoneNumber?.toString().toLowerCase().includes(searchTermLower);
//       const statusMatch = property.status?.toLowerCase().includes(searchTermLower);
//       const planNameMatch = property.planName?.toLowerCase().includes(searchTermLower);
//       const billNoMatch = property.billNo?.toLowerCase().includes(searchTermLower);

//       const planExpiry = new Date(property.planExpiryDate); // updated field
//       const startMatch = startDate ? planExpiry >= new Date(startDate) : true;
//       const endMatch = endDate ? planExpiry <= new Date(endDate + "T23:59:59") : true;

//       return (
//         (rentIdMatch || phoneNumberMatch || statusMatch || planNameMatch || billNoMatch) &&
//         startMatch &&
//         endMatch
//       );
//     }),
//   })).filter((item) => item.properties.length > 0);

//   setFilteredData(filtered);
// };

//   const handleReset = () => {
//   setSearchTerm("");
//   setStartDate("");
//   setEndDate("");
//   setFilteredData(data); // show original data
// };


//   const reduxAdminName = useSelector((state) => state.admin.name);
//   const reduxAdminRole = useSelector((state) => state.admin.role);
  
//   const adminName = reduxAdminName || localStorage.getItem("adminName");
//   const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
  
 

//   return (
//     <div className="container">
//       <h1 className="my-4 text-center">Free Plans Properties</h1>

//       {/* Search Form */}
//   <form     style={{ 
//   boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
//   padding: '20px', 
//   backgroundColor: '#fff' 
// }} onSubmit={(e) => e.preventDefault()}
//    className="d-flex flex-row gap-2 align-items-center flex-nowrap"
//    >
//   {/* Search input (for rentId, phoneNumber, status, planName, billNo) */}
//   <div>
//     <label className="form-label fw-bold">Search</label>
//     <input
//       type="text"
//       className="form-control"
//       placeholder="Search by RENT ID, Phone, Status, Plan, Bill No"
//       value={searchTerm}
//       onChange={(e) => setSearchTerm(e.target.value)}
//     />
//   </div>

//   {/* Plan Expiry Date - From */}
//   <div>
//     <label className="form-label fw-bold">Plan Expiry From</label>
//     <input
//       type="date"
//       className="form-control"
//       value={startDate}
//       onChange={(e) => setStartDate(e.target.value)}
//     />
//   </div>

//   {/* Plan Expiry Date - To */}
//   <div>
//     <label className="form-label fw-bold">Plan Expiry To</label>
//     <input
//       type="date"
//       className="form-control"
//       value={endDate}
//       onChange={(e) => setEndDate(e.target.value)}
//     />
//   </div>

//   {/* Buttons */}
//   <div className="d-flex gap-2">
//     <button type="button" className="btn btn-primary" onClick={handleSearch}>
//       Search
//     </button>
//     <button type="button" className="btn btn-secondary" onClick={handleReset}>
//       Reset
//     </button>
//   </div>
// </form>

//               <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
//   Print
// </button>
//       <h3 className="mt-4 mb-4">Free Properties datas</h3> 

// <div ref={tableRef}>
//       <Table striped bordered hover responsive className="table-sm align-middle">
//       <thead className="sticky-top">
//     <tr>
//       <th>Sl. No</th>
//       <th>Image</th>
//       <th>RENT ID</th>
//       <th>Phone Number</th>
//       <th>Property Mode</th>
//       <th>Property Type</th>
//       <th>rentalAmount</th>
//       <th>City</th>
//       <th>Created By</th>
//       <th>Created At</th>
//       <th>Updated At</th>
//       <th>Mandatory</th>
//       <th>No. of Ads</th>
//       <th>Status</th>
//       <th>Plan Name</th>
//       {/* <th>View Details</th> */}
//       <th>Follow Up</th>
//       <th>Bill No</th>
//       <th>Set Feature</th>
//       {/* <th>Set RENT</th> */}
//       <th>APP BY</th>
//       <th>APP DATE</th>
//       <th>EXPIRED DATE</th>
//       <th>Action</th>
//     </tr>
//   </thead>
//   <tbody>
//     {filteredData.map((item, index) =>
//       item.properties.map((property, propertyIndex) => (
//         <tr key={`${index}-${propertyIndex}`}>
//           <td>{propertyIndex + 1}</td>
//           <td>
//                           <img
//                             src={
//                               property.photos && property.photos.length > 0
//                                 ? `https://RENTpondy.com/PPC/${property.photos[0]}`
//                                 : pic
//                             }
//                             alt="Property"
//                             style={{ width: "50px", height: "50px", objectFit: "cover" }}
//                           />
//                         </td>
//                         <td style={{cursor: "pointer"}}     
//                          onClick={() =>
//                               navigate(`/dashboard/detail`, {
//                                 state: { rentId: property.rentId, phoneNumber: property.phoneNumber },
//                               })
//                             }>{property.rentId}</td>
//           <td>{property.phoneNumber}</td>
//           <td>{property.propertyMode || "N/A"}</td>
//           <td>{property.propertyType || "N/A"}</td>
//           <td>₹{property.rentalAmount}</td>
//           <td>{property.streetName || "N/A"}</td>
//           <td>{property.createdBy}</td>
//           <td>{new Date(property.createdAt).toLocaleString()}</td>
//           <td>{new Date(property.updatedAt).toLocaleString()}</td>
//           <td>{property.required}</td>
//           <td>{ item.user.adsCount}</td>
//           <td>{property.status}</td>
//           <td>{item.user.planName}</td>
        
//                               <td>{item.user.adminName}</td>
//           <td>{item.user.billNo}</td>
//           <td>{property.featureStatus}</td>
//            <td>{property.createdBy}</td>
//           <td>{item.user.billCreatedAt}</td>
//           <td>{item.user.planExpiryDate}</td>
//           <td>
//   {property.isDeleted ? (
//     <button
//       className="btn btn-success btn-sm"
//       onClick={() => handleUndoDelete(property.rentId)}
//     >
//       Undo
//     </button>
//   ) : (
//     <button
//       className="btn btn-danger btn-sm"
//       onClick={() => handleDelete(property.rentId)}
//     >
//       Delete
//     </button>
//   )}
// </td>

//         </tr>
//       ))
//     )}
//   </tbody>
// </Table>
// </div>
//     </div>
//   );
// };

// export default FreePlansWithProperties;




















import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import pic from "./Assets/Mask Group 3.png";

const FreePlansWithProperties = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();
  const tableRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-free-plans`);
        const rawData = res.data.data || [];

        // Sort based on latest property update/creation date
        const sortedData = rawData.sort((a, b) => {
          const latestA = getLatestPropertyDate(a.properties);
          const latestB = getLatestPropertyDate(b.properties);
          return latestB - latestA;
        });

        setData(sortedData);
        setFilteredData(sortedData);
      } catch (err) {
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getLatestPropertyDate = (properties = []) => {
    let latestDate = new Date(0);
    properties.forEach((p) => {
      const updatedAt = new Date(p.updatedAt || 0);
      const createdAt = new Date(p.createdAt || 0);
      const maxDate = updatedAt > createdAt ? updatedAt : createdAt;
      if (maxDate > latestDate) latestDate = maxDate;
    });
    return latestDate;
  };

  const handleDelete = async (rentId) => {
    if (window.confirm(`Are you sure you want to delete RENT ID: ${rentId}?`)) {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/delete-free-property/${rentId}`, {
          method: "PUT",
        });
        const data = await res.json();
        alert(data.message);
      } catch {
        alert("Failed to delete property.");
      }
    }
  };

  const handleUndoDelete = async (rentId) => {
    if (window.confirm(`Are you sure you want to undo delete for RENT ID: ${rentId}?`)) {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/undo-delete-free-property/${rentId}`, {
          method: "PUT",
        });
        const data = await res.json();
        alert(data.message);
      } catch {
        alert("Failed to undo delete.");
      }
    }
  };

  const handleSearch = () => {
    const filtered = data
      .map((item) => ({
        ...item,
        properties: item.properties.filter((property) => {
          const searchLower = searchTerm.toLowerCase();

          const rentIdMatch = property.rentId?.toString().toLowerCase().includes(searchLower);
          const phoneNumberMatch = property.phoneNumber?.toString().toLowerCase().includes(searchLower);
          const statusMatch = property.status?.toLowerCase().includes(searchLower);
          const planMatch = item.billInfo.planName?.toLowerCase().includes(searchLower);
          const billMatch = item.billInfo.billNo?.toLowerCase().includes(searchLower);

          const planExpiry = new Date(item.billInfo.planExpiryDate);
          const startMatch = startDate ? planExpiry >= new Date(startDate) : true;
          const endMatch = endDate ? planExpiry <= new Date(endDate + "T23:59:59") : true;

          return (rentIdMatch || phoneNumberMatch || statusMatch || planMatch || billMatch) && startMatch && endMatch;
        }),
      }))
      .filter((item) => item.properties.length > 0);

    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setFilteredData(data);
  };

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
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);

  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container">
      <h1 className="my-4 text-center">Free Plans Properties</h1>

      {/* Search Form */}
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
          padding: "20px",
          backgroundColor: "#fff",
        }}
        className="d-flex flex-row gap-2 align-items-center flex-nowrap"
      >
        <div>
          <label className="form-label fw-bold">Search</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by RENT ID, Phone, Status, Plan, Bill No"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label fw-bold">Plan Expiry From</label>
          <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        <div>
          <label className="form-label fw-bold">Plan Expiry To</label>
          <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <div className="d-flex gap-2">
          <button type="button" className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      <button className="btn btn-secondary mb-3 mt-2" style={{ background: "tomato" }} onClick={handlePrint}>
        Print
      </button>

      <h3 className="mt-4 mb-4">Free Properties Data</h3>

      <div ref={tableRef}>
        <Table striped bordered hover responsive className="table-sm align-middle">
          <thead className="sticky-top">
            <tr>
              <th>Sl. No</th>
              <th>Image</th>
              <th>RENT ID</th>
              <th>Phone Number</th>
              <th>Property Mode</th>
              <th>Property Type</th>
              <th>Rent</th>
              <th>City</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Mandatory</th>
              <th>No. of Ads</th>
              <th>Status</th>
              <th>Plan Name</th>
              <th>Admin Name</th>
              <th>Bill No</th>
              <th>Feature Status</th>
              <th>Bill Created By</th>
              <th>Bill Created At</th>
              <th>Expiry Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) =>
              item.properties.map((property, propertyIndex) => (
                <tr key={`${index}-${propertyIndex}`}>
                  <td>{propertyIndex + 1}</td>
                  <td>
                    <img
                      src={
                        property.photos && property.photos.length > 0
                          ? `https://RENTpondy.com/PPC/${property.photos[0]}`
                          : pic
                      }
                      alt="Property"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  </td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/dashboard/detail`, {
                        state: { rentId: property.rentId, phoneNumber: property.phoneNumber },
                      })
                    }
                  >
                    {property.rentId}
                  </td>
                  <td>{property.phoneNumber}</td>
                  <td>{property.propertyMode || "N/A"}</td>
                  <td>{property.propertyType || "N/A"}</td>
                  <td>₹{property.rentalAmount}</td>
                  <td>{property.city || "N/A"}</td>
                  <td>{property.createdBy}</td>
                  <td>{new Date(property.createdAt).toLocaleString()}</td>
                  <td>{new Date(property.updatedAt).toLocaleString()}</td>
                  <td>{property.required}</td>
                  <td>{item.billInfo.adsCount}</td>
                  <td>{property.status}</td>
                  <td>{item.billInfo.planName}</td>
                  <td>{item.billInfo.adminName}</td>
                  <td>{item.billInfo.billNo}</td>
                  <td>{property.featureStatus}</td>
                  <td>{item.billInfo.billCreatedBy}</td>
                  <td>{item.billInfo.billCreatedAt}</td>
                  <td>{item.billInfo.planExpiryDate}</td>
                  <td>
                    {property.isDeleted ? (
                      <button className="btn btn-success btn-sm" onClick={() => handleUndoDelete(property.rentId)}>
                        Undo
                      </button>
                    ) : (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(property.rentId)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default FreePlansWithProperties;
