

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import autoTable from "jspdf-autotable"; // <-- This is the critical missing part
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



useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-featured-properties`);
      const rawData = response.data.data || [];

      // Sort by the latest updatedAt (or createdAt) from the properties array
      const sortedData = rawData.sort((a, b) => {
        const latestA = getLatestPropertyDate(a.properties);
        const latestB = getLatestPropertyDate(b.properties);

        return latestB - latestA; // Descending order
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

// Utility to get latest date from properties
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/delete-free-property/${rentId}`, {
        method: 'PUT',
      });
      const data = await response.json();
      alert(data.message);

      // ✅ Update both `data` and `filteredData`
      setData(prevData =>
        prevData.map(item => ({
          ...item,
          properties: item.properties.map(prop =>
            prop.rentId === rentId ? { ...prop, isDeleted: true } : prop
          ),
        }))
      );

      setFilteredData(prevData =>
        prevData.map(item => ({
          ...item,
          properties: item.properties.map(prop =>
            prop.rentId === rentId ? { ...prop, isDeleted: true } : prop
          ),
        }))
      );
    } catch (error) {
      alert('Failed to delete the property.');
    }
  }
};



  const handleUndoDelete = async (rentId) => {
  if (window.confirm(`Are you sure you want to undo delete for RENT ID: ${rentId}?`)) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/undo-delete-free-property/${rentId}`, {
        method: 'PUT',
      });
      const data = await response.json();
      alert(data.message);

      // Optimistically update the local state
      setFilteredData(prevData =>
        prevData.map(property =>
          property.rentId === rentId ? { ...property, isDeleted: false } : property
        )
      );
    } catch (error) {
      alert('Failed to undo delete.');
    }
  }
};

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

  // Filter data based on user input
  const handleSearch = () => {
    const filtered = data.map((item) => ({
      ...item,
      properties: item.properties.filter((property) => {
        const rentIdMatch = searchTerm
          ? String(property.rentId).toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        const phoneNumberMatch = searchTerm
          ? String(property.phoneNumber).toLowerCase().includes(searchTerm.toLowerCase())
          : true;

        const createdAt = new Date(property.createdAt);
        const startMatch = startDate ? createdAt >= new Date(startDate) : true;
        const endMatch = endDate ? createdAt <= new Date(endDate + "T23:59:59") : true;

        return (rentIdMatch || phoneNumberMatch) && startMatch && endMatch;
      }),
    })).filter((item) => item.properties.length > 0);

    setFilteredData(filtered);
  };

const exportToPDF = () => {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.text("All Properties Report", 14, 10);

  const tableColumn = [
    "RENT ID", "Phone Number", "Property Mode", "Property Type", "rentalAmount",
    "Street Name", "Created By", "Created At", "Updated At", "Requirement",
    "Ads Count", "Status", "Plan Name", "Admin Name", "Bill No",
    "Feature Status", "Bill Created At", "Plan Expiry Date"
  ];

  const tableRows = filteredData.flatMap(item =>
    item.properties.map(prop => [
      prop.rentId || 'N/A',
      prop.phoneNumber || 'N/A',
      prop.propertyMode || 'N/A',
      prop.propertyType || 'N/A',
      prop.rentalAmount ? `₹ ${prop.rentalAmount.toLocaleString('en-IN')}` : 'N/A',
      prop.streetName || 'N/A',
      prop.createdBy || 'N/A',
      prop.createdAt ? new Date(prop.createdAt).toLocaleString() : 'N/A',
      prop.updatedAt ? new Date(prop.updatedAt).toLocaleString() : 'N/A',
      prop.required || 'N/A',
      item.user?.adsCount ?? 'N/A',
      prop.status || 'N/A',
      item.user?.planName || 'N/A',
      item.user?.adminName || 'N/A',
      item.user?.billNo || 'N/A',
      prop.featureStatus || 'N/A',
      item.user?.billCreatedAt ? new Date(item.user.billCreatedAt).toLocaleString() : 'N/A',
      item.user?.planExpiryDate ? new Date(item.user.planExpiryDate).toLocaleDateString() : 'N/A'
    ])
  );

  // Now use autoTable (not doc.autoTable directly)
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 15,
    styles: { fontSize: 7, cellPadding: 1.5 },
    margin: { top: 15, left: 5, right: 5 }
  });

  doc.save("FeaturedProperties.pdf");
};



const exportToExcel = () => {
  const wsData = filteredData.flatMap(item =>
    item.properties.map(prop => ({
      "RENT ID": prop.rentId || 'N/A',
      "Phone Number": prop.phoneNumber || 'N/A',
      "Property Mode": prop.propertyMode || 'N/A',
      "Property Type": prop.propertyType || 'N/A',
      "rentalAmount": prop.rentalAmount ? `₹ ${prop.rentalAmount.toLocaleString('en-IN')}` : 'N/A',
      "Street Name": prop.streetName || 'N/A',
      "Created By": prop.createdBy || 'N/A',
      "Created At": prop.createdAt ? new Date(prop.createdAt).toLocaleString() : 'N/A',
      "Updated At": prop.updatedAt ? new Date(prop.updatedAt).toLocaleString() : 'N/A',
      "Requirement": prop.required || 'N/A',
      "Ads Count": item.user?.adsCount ?? 'N/A',
      "Status": prop.status || 'N/A',
      "Plan Name": item.user?.planName || 'N/A',
      "Admin Name": item.user?.adminName || 'N/A',
      "Bill No": item.user?.billNo || 'N/A',
      "Feature Status": prop.featureStatus || 'N/A',
      "Bill Created At": item.user?.billCreatedAt ? new Date(item.user.billCreatedAt).toLocaleString() : 'N/A',
      "Plan Expiry Date": item.user?.planExpiryDate ? new Date(item.user.planExpiryDate).toLocaleDateString() : 'N/A',
    }))
  );

  const worksheet = XLSX.utils.json_to_sheet(wsData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "All Properties");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "AllProperties.xlsx");
};


  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
  
  
 
  return (
    <div className="container">
      <h1 className="my-4 text-center">Feature Property</h1>

      {/* Search Form */}
      <form     style={{ 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  backgroundColor: '#fff' 
}}
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
   className="d-flex flex-row gap-2 align-items-center flex-nowrap"
      >
        <div className="mb-3">
          <label htmlFor="searchTerm" className="form-label fw-bold">RENT ID / Phone Number</label>
          <input
            type="text"
            id="searchTerm"
            className="form-control"
            placeholder="Enter RENT ID or Phone Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="startDate" className="form-label fw-bold">From Date</label>
          <input
            type="date"
            id="startDate"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="endDate" className="form-label fw-bold">To Date</label>
          <input
            type="date"
            id="endDate"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-warning me-2" onClick={exportToPDF }>Download PDF</button>

  <button className="btn btn-success me-2" onClick={exportToExcel}>Download Excel</button>
              <button className="btn btn-secondary ms-3" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button></div>


      <h3 className="mt-4 mb-4">Featured Properties datas</h3> 
 
<div ref={tableRef}>
    <Table striped bordered hover responsive className="table-sm align-middle">
                  <thead className="sticky-top">
    <tr>
      <th>Sl. No</th>
      <th>Image</th>
      <th className="sticky-col sticky-col-1">Rent ID</th>
      <th className="sticky-col sticky-col-2">Phone Number</th>
      <th>Property Mode</th>
      <th>Property Type</th>
      <th>rentalAmount</th>
      <th>City</th>
      <th>Created By</th>
      <th>Created At</th>
      <th>Updated At</th>
      <th>Mandatory</th>
      <th>No. of Ads</th>
      <th>Status</th>
      <th>Plan Name</th>
       <th>Follow Up</th>
      <th>Bill No</th>
      <th>Set Feature</th>
       <th>APP BY</th>
      <th>APP DATE</th>
      <th>EXPIRED DATE</th>
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
                            <td style={{cursor: "pointer"}}   onClick={() =>
                              navigate(`/dashboard/detail`, {
                                state: { rentId: property.rentId, phoneNumber: property.phoneNumber },
                              })
                            }className="sticky-col sticky-col-1">{property.rentId}</td>
          <td className="sticky-col sticky-col-2">{property.phoneNumber}</td>
          <td>{property.propertyMode || "N/A"}</td>
          <td>{property.propertyType || "N/A"}</td>
          <td>₹{property.rentalAmount}</td>
          <td>{property.streetName || "N/A"}</td>
          <td>{property.createdBy}</td>
          <td>{new Date(property.createdAt).toLocaleString()}</td>
          <td>{new Date(property.updatedAt).toLocaleString()}</td>
          <td>{property.required}</td>
          <td>{ item.user.adsCount}</td>
          <td>{property.status}</td>
          <td>{item.user.planName}</td>
       
                         <td>{item.user.adminName}</td>
          <td>{item.user.billNo}</td>
          <td>{property.featureStatus}</td>
           <td>{property.createdBy}</td>
          <td>{item.user.billCreatedAt}</td>
          <td>{item.user.planExpiryDate}</td>
 

  <td>
          {property.isDeleted ? (
  <button
    className="btn btn-success btn-sm"
    onClick={() => handleUndoDelete(property.rentId)}
  >
    Undo
  </button>
) : (
  <button
    className="btn btn-danger btn-sm"
    onClick={() => handleDelete(property.rentId)}
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

export default FreePlansWithProperties;















