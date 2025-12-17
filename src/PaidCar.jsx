








// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";
// import { Table } from "react-bootstrap";
// import { MdDeleteForever } from "react-icons/md";
// import pic from "./Assets/Mask Group 3.png";

// const FreePlansWithProperties = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//     const [billNo, setBillNo] = useState("");

//   const navigate = useNavigate();



//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-paid-plans`);
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

//      const tableRef = useRef();
   
//    const handlePrint = () => {
//      const printContent = tableRef.current.innerHTML;
//      const printWindow = window.open("", "", "width=1200,height=800");
//      printWindow.document.write(`
//        <html>
//          <head>
//            <title>Print Table</title>
//            <style>
//              table { border-collapse: collapse; width: 100%; font-size: 12px; }
//              th, td { border: 1px solid #000; padding: 6px; text-align: left; }
//              th { background: #f0f0f0; }
//            </style>
//          </head>
//          <body>
//            <table>${printContent}</table>
//          </body>
//        </html>
//      `);
//      printWindow.document.close();
//      printWindow.print();
//    };
//   // Filter data based on user input
// const handleSearch = () => {
//   const filtered = data.map((item) => {
//     const billNoMatch = billNo
//       ? String(item.bill?.billNo || "").toLowerCase().includes(billNo.toLowerCase())
//       : true;

//     return {
//       ...item,
//       properties: item.properties.filter((property) => {
//         const rentIdMatch = searchTerm
//           ? String(property.rentId || "").toLowerCase().includes(searchTerm.toLowerCase())
//           : true;
//         const phoneNumberMatch = searchTerm
//           ? String(property.phoneNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
//           : true;

//         const createdAt = new Date(property.createdAt);
//         const startMatch = startDate ? createdAt >= new Date(startDate) : true;
//         const endMatch = endDate ? createdAt <= new Date(endDate + "T23:59:59") : true;

//         return (rentIdMatch || phoneNumberMatch) && startMatch && endMatch;
//       }),
//     };
//   }).filter((item) => item.properties.length > 0 && billNo
//     ? String(item.bill?.billNo || "").toLowerCase().includes(billNo.toLowerCase())
//     : true
//   );

//   setFilteredData(filtered);
// };
// const handleReset = () => {
//   setSearchTerm("");
//   setBillNo("");
//   setStartDate("");
//   setEndDate("");
//   setFilteredData(data); // Reset to original data
// };

  
//   const handleDelete = async (rentId) => {
//     if (window.confirm(`Are you sure you want to delete RENT ID: ${rentId}?`)) {
//       try {
//         const response = await fetch(`${process.env.REACT_APP_API_URL}/delete-free-property/${rentId}`, {
//           method: 'PUT',
//         });
//         const data = await response.json();
//         alert(data.message);
  
//         // ✅ Update both `data` and `filteredData`
//         setData(prevData =>
//           prevData.map(item => ({
//             ...item,
//             properties: item.properties.map(prop =>
//               prop.rentId === rentId ? { ...prop, isDeleted: true } : prop
//             ),
//           }))
//         );
  
//         setFilteredData(prevData =>
//           prevData.map(item => ({
//             ...item,
//             properties: item.properties.map(prop =>
//               prop.rentId === rentId ? { ...prop, isDeleted: true } : prop
//             ),
//           }))
//         );
//       } catch (error) {
//         alert('Failed to delete the property.');
//       }
//     }
//   };
  

//   const handleUndoDelete = async (rentId) => {
//   if (window.confirm(`Are you sure you want to undo delete for RENT ID: ${rentId}?`)) {
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/undo-delete-free-property/${rentId}`, {
//         method: 'PUT',
//       });
//       const data = await response.json();
//       alert(data.message);

//       // Optimistically update the local state
//       setFilteredData(prevData =>
//         prevData.map(property =>
//           property.rentId === rentId ? { ...property, isDeleted: false } : property
//         )
//       );
//     } catch (error) {
//       alert('Failed to undo delete.');
//     }
//   }
// };


//   const reduxAdminName = useSelector((state) => state.admin.name);
//   const reduxAdminRole = useSelector((state) => state.admin.role);
  
//   const adminName = reduxAdminName || localStorage.getItem("adminName");
//   const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
  
 
 
//   return (
//     <div className="container">
//       <h1 className="my-4 text-center">Paid Properties</h1>

//       {/* Search Form */}
//       <form onSubmit={(e) => e.preventDefault()}
//        className="d-flex flex-row gap-2 align-items-center flex-nowrap"
//        >
//   <div className="mb-3">
//     <label className="form-label fw-bold">RENT ID / Phone</label>
//     <input
//       type="text"
//       placeholder="Search by RENT ID or Phone"
//       value={searchTerm}
//       onChange={(e) => setSearchTerm(e.target.value)}
//     />
//   </div>

//   <div className="mb-3">
//     <label className="form-label fw-bold">Bill No</label>
//     <input
//       type="text"
//       placeholder="Search by Bill No"
//       value={billNo}
//       onChange={(e) => setBillNo(e.target.value)}
//     />
//   </div>

//   <div className="mb-3">
//     <label className="form-label fw-bold">Start Date</label>
//     <input
//       type="date"
//       value={startDate}
//       onChange={(e) => setStartDate(e.target.value)}
//     />
//   </div>

//   <div className="mb-3">
//     <label className="form-label fw-bold">End Date</label>
//     <input
//       type="date"
//       value={endDate}
//       onChange={(e) => setEndDate(e.target.value)}
//     />
//   </div>

//   <button type="button" className="btn btn-primary" onClick={handleSearch}>
//     Search
//   </button>

//   <button type="button" className="btn btn-secondary" onClick={handleReset}>
//     Reset
//   </button>
// </form>
//               <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
//   Print
// </button>

//       <h3 className="mt-4 mb-4 text-primary">Paid Properties datas</h3> 
    
// <div ref={tableRef}>
//       <Table striped bordered hover responsive className="table-sm align-middle">
//       <thead className="sticky-top">
//     <tr>
//       <th>Sl. No</th>
//       <th>Image</th>
//       <th className="sticky-col sticky-col-1">RENT ID</th>
//       <th className="sticky-col sticky-col-2">Phone Number</th>
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
//        <th>Follow Up</th>
//       <th>Bill No</th>
//       <th>Set Feature</th>
//        <th>APP BY</th>
//       <th>APP DATE</th>
//       <th>EXPIRED DATE</th>
//       <th>Action</th>
//     </tr>
//   </thead>
//   <tbody>
//     {filteredData.map((item, index) =>
//       item.properties.map((property, propertyIndex) => (
//         <tr key={`${index}-${propertyIndex}`}>
//            <td>{propertyIndex + 1}</td>
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
//                                 <td style={{cursor: "pointer"}}     onClick={() =>
//                               navigate(`/dashboard/detail`, {
//                                 state: { rentId: property.rentId, phoneNumber: property.phoneNumber },
//                               })
//                             } className="sticky-col sticky-col-1">{property.rentId}</td>
//           <td className="sticky-col sticky-col-2">{property.phoneNumber}</td>
//           <td>{property.propertyMode || "N/A"}</td>
//           <td>{property.propertyType || "N/A"}</td>
//           <td>₹{property.rentalAmount}</td>
//           <td>{property.streetName || "N/A"}</td>
//           <td>{property.createdBy}</td>
//           <td>{new Date(property.createdAt).toLocaleString()}</td>
//           <td>{new Date(property.updatedAt).toLocaleString()}</td>
//           <td>{property.required}</td>
//            <td>{item.user.adsCount}</td>
//           <td>{property.status}</td>
//           <td>{ item.user.planName}</td>
          
//                                 <td>{item.user.adminName}</td>
//           <td>{item.user.billNo}</td>
//           <td>{property.featureStatus}</td>
//            <td>{property.createdBy}</td>
//           <td>{item.user.billCreatedAt}</td>
//           <td>{ item.user.planExpiryDate}</td>
//           <td>
//           {property.isDeleted ? (
//   <button
//     className="btn btn-success btn-sm"
//     onClick={() => handleUndoDelete(property.rentId)}
//   >
//     Undo
//   </button>
// ) : (
//   <button
//     className="btn btn-danger btn-sm"
//     onClick={() => handleDelete(property.rentId)}
//   >
//     <MdDeleteForever />
//   </button>
// )}

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
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import pic from "./Assets/Mask Group 3.png";

const PaidPlansWithProperties = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [billNo, setBillNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();
  const tableRef = useRef();

  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");

  // ✅ Fetch all paid plans
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-paid-plans`);
        const rawData = response.data.data || [];

        // Sort based on latest property update
        const sortedData = rawData.sort((a, b) => {
          const latestA = getLatestPropertyDate(a.properties);
          const latestB = getLatestPropertyDate(b.properties);
          return latestB - latestA;
        });

        setData(sortedData);
        setFilteredData(sortedData);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Utility - get the latest updated/created property date
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

  // ✅ Print table
  const handlePrint = () => {
    const printContent = tableRef.current.innerHTML;
    const printWindow = window.open("", "", "width=1200,height=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Paid Properties</title>
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

  // ✅ Search Filter
const handleSearch = () => {
  const filtered = data
    .map((item) => {
      // Check Bill No match if available
      const billNoMatches =
        billNo && item.bill
          ? String(item.bill.billNo || "").toLowerCase().includes(billNo.toLowerCase())
          : true;

      // Filter properties by search term and date range
      const matchedProperties = item.properties.filter((property) => {
        const rentIdMatch = searchTerm
          ? String(property.rentId || "").toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        const phoneNumberMatch = searchTerm
          ? String(property.phoneNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
          : true;

        const createdAt = new Date(property.createdAt);
        const startMatch = startDate ? createdAt >= new Date(startDate) : true;
        const endMatch = endDate ? createdAt <= new Date(endDate + "T23:59:59") : true;

        return (rentIdMatch || phoneNumberMatch) && startMatch && endMatch;
      });

      return { ...item, properties: matchedProperties, billNoMatches };
    })
    .filter(
      (item) =>
        item.properties.length > 0 &&
        (billNo ? item.billNoMatches : true)
    );

  setFilteredData(filtered);
};


  const handleReset = () => {
    setSearchTerm("");
    setBillNo("");
    setStartDate("");
    setEndDate("");
    setFilteredData(data);
  };

  // ✅ Delete and Undo Delete
  const handleDelete = async (rentId) => {
    if (window.confirm(`Are you sure you want to delete RENT ID: ${rentId}?`)) {
      try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/delete-free-property/${rentId}`);
        alert(res.data.message);

        setFilteredData((prev) =>
          prev.map((plan) => ({
            ...plan,
            properties: plan.properties.map((p) =>
              p.rentId === rentId ? { ...p, isDeleted: true } : p
            ),
          }))
        );
      } catch {
        alert("Failed to delete property.");
      }
    }
  };

  const handleUndoDelete = async (rentId) => {
    if (window.confirm(`Undo delete for RENT ID: ${rentId}?`)) {
      try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/undo-delete-free-property/${rentId}`);
        alert(res.data.message);

        setFilteredData((prev) =>
          prev.map((plan) => ({
            ...plan,
            properties: plan.properties.map((p) =>
              p.rentId === rentId ? { ...p, isDeleted: false } : p
            ),
          }))
        );
      } catch {
        alert("Failed to undo delete.");
      }
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="container">
      <h2 className="text-center my-4">Paid Plans & Properties</h2>

      {/* Search Filters */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="d-flex flex-wrap gap-3 align-items-end"
      >
        <div>
          <label className="fw-bold">RENT ID / Phone</label>
          <input
            className="form-control"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by RENT ID or Phone"
          />
        </div>

        <div>
          <label className="fw-bold">Bill No</label>
          <input
            className="form-control"
            type="text"
            value={billNo}
            onChange={(e) => setBillNo(e.target.value)}
            placeholder="Search by Bill No"
          />
        </div>

        <div>
          <label className="fw-bold">Start Date</label>
          <input
            className="form-control"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="fw-bold">End Date</label>
          <input
            className="form-control"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </form>

      <button className="btn btn-danger my-3" onClick={handlePrint}>
        Print
      </button>

      <div ref={tableRef}>
        <Table striped bordered hover responsive className="table-sm align-middle">
          <thead className="table-primary sticky-top">
            <tr>
              <th>Sl. No</th>
              <th>Image</th>
              <th>RENT ID</th>
              <th>Phone</th>
              <th>City</th>
              <th>Property Type</th>
              <th>Mode</th>
              <th>Rent (₹)</th>
              <th>Plan</th>
              <th>Bill No</th>
              <th>Admin</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Expiry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.flatMap((item, i) =>
              item.properties.map((p, j) => (
                <tr key={`${i}-${j}`}>
                  <td>{j + 1}</td>
                  <td>
                    <img
                      src={
                        p.photos?.length
                          ? `https://RENTpondy.com/PPC/${p.photos[0]}`
                          : pic
                      }
                      alt="Property"
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                  </td>
                  <td
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate("/dashboard/detail", {
                        state: { rentId: p.rentId, phoneNumber: p.phoneNumber },
                      })
                    }
                  >
                    {p.rentId}
                  </td>
                  <td>{p.phoneNumber}</td>
                  <td>{p.city || "N/A"}</td>
                  <td>{p.propertyType || "N/A"}</td>
                  <td>{p.propertyMode || "N/A"}</td>
                  <td>₹{p.rentalAmount}</td>
                  <td>{item.bill?.planName || item.user?.planName}</td>
                  <td>{item.bill?.billNo || item.user?.billNo || "N/A"}</td>
                  <td>{item.bill?.adminName || item.user?.adminName || "N/A"}</td>
                  <td>{moment(p.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                  <td>{moment(p.updatedAt).format("DD/MM/YYYY HH:mm")}</td>
                  <td>
                    {moment(
                      item.bill?.planExpiryDate || item.user?.planExpiryDate
                    ).format("DD/MM/YYYY")}
                  </td>
                  <td>
                    {p.isDeleted ? (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleUndoDelete(p.rentId)}
                      >
                        Undo
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(p.rentId)}
                      >
                        <MdDeleteForever />
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

export default PaidPlansWithProperties;
