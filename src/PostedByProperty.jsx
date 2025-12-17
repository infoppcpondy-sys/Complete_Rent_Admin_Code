
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { MdDeleteForever, MdUndo } from "react-icons/md";
import pic from "./Assets/Mask Group 3.png";

const PostedByProperty = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rentIdFilter, setRentIdFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();

  
useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-postby-properties`);
        const sortedData = (response.data.users || []).sort((a, b) => {
          const updatedAtA = new Date(a.updatedAt);
          const updatedAtB = new Date(b.updatedAt);
          const createdAtA = new Date(a.createdAt);
          const createdAtB = new Date(b.createdAt);
  
          if (updatedAtB - updatedAtA !== 0) {
            return updatedAtB - updatedAtA; // Sort by updatedAt first
          }
          return createdAtB - createdAtA;   // Fallback to createdAt if updatedAt is equal
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
  

 
  const handleDelete = async (rentId) => {
    if (window.confirm(`Are you sure you want to delete PPC ID: ${rentId}?`)) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/delete-free-property/${rentId}`, {
          method: 'PUT',
        });
        const data = await response.json();
        alert(data.message);
  
        // Optimistically update the local state
        setFilteredData(prevData =>
          prevData.map(property =>
            property.rentId === rentId ? { ...property, isDeleted: true } : property
          )
        );
      } catch (error) {
        alert('Failed to delete the property.');
      }
    }
  };


  const handleUndoDelete = async (rentId) => {
  if (window.confirm(`Are you sure you want to undo delete for PPC ID: ${rentId}?`)) {
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
  const filterProperties = () => {
    const filtered = data.filter((property) => {
  const matchesRentId = rentIdFilter
  ? String(property.rentId || "").toLowerCase().includes(rentIdFilter.toLowerCase())
  : true

      const matchesPhone = phoneFilter
        ? property.phoneNumber?.toLowerCase().includes(phoneFilter.toLowerCase())
        : true;

      const matchesStatus = statusFilter
        ? property.status?.toLowerCase() === statusFilter.toLowerCase()
        : true;

      const planDate = new Date(property.planCreatedAt).getTime();
      const from = fromDate ? new Date(fromDate).getTime() : null;
      const to = toDate ? new Date(toDate).getTime() : null;

      const matchesDate =
        (!from || planDate >= from) && (!to || planDate <= to);

      return matchesRentId && matchesPhone && matchesStatus && matchesDate;
    });

    setFilteredData(filtered);
  };

  const resetFilters = () => {
    setRentIdFilter("");
    setPhoneFilter("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
  };
   useEffect(() => {
    filterProperties();
  }, [data, rentIdFilter, phoneFilter, statusFilter, fromDate, toDate]);


  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
  
  
 

  return (
    <div className="container">
      <h1 className="my-4 text-center">PostedBy Properties</h1>

      {/* Filter Inputs */}
      <div     className="d-flex flex-row gap-2 align-items-center flex-nowrap"
>
        <input
          type="text"
          className="form-control"
          placeholder="Rent ID"
          value={rentIdFilter}
          onChange={(e) => setRentIdFilter(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Phone Number"
          value={phoneFilter}
          onChange={(e) => setPhoneFilter(e.target.value)}
        />
     
        <input
          type="text"
          className="form-control"
          placeholder="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}>
  <option value="">All Status</option>
  <option value="incomplete">Incomplete</option>
  <option value="active">Active</option>
  <option value="pending">Pending</option>
  <option value="complete">Complete</option>
  <option value="sendInterest">Send Interest</option>
  <option value="soldOut">Sold Out</option>
  <option value="reportProperties">Report Properties</option>
  <option value="needHelp">Need Help</option>
  <option value="contact">Contact</option>
  <option value="favorite">Favorite</option>
  <option value="alreadySaved">Already Saved</option>
  <option value="favoriteRemoved">Favorite Removed</option>
  <option value="delete">Delete</option>
  <option value="undo">Undo</option>
</select>
        <input
          type="date"
          className="form-control"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={resetFilters}>
          Reset
        </button>
      </div>
              <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
<div ref={tableRef}>
      <h3 className="mt-4 mb-4">PostedBy Properties datas</h3> 
      <Table striped bordered hover responsive className="table-sm align-middle">
                  <thead className="sticky-top">
    <tr>
      <th>Sl. No</th>
      <th>Image</th>
      <th>RENT ID</th>
      <th>Phone Number</th>
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
      {/* <th>View Details</th> */}
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
    {filteredData.map((property, index) => (
      <tr key={property._id || index}>
        <td>{index + 1}</td>
        <td>
          <img
            src={
              property.photos && property.photos.length > 0
                ? `https://rentpondy.com/PPC/${property.photos[0]}`
                : pic
            }
            alt="Property"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        </td>
        <td  style={{cursor: "pointer"}}  onClick={() =>
              navigate(`/dashboard/detail`, {
                state: { rentId: property.rentId, phoneNumber: property.phoneNumber },
              })
            }>{property.rentId}</td>
        <td>{property.phoneNumber}</td>
        <td>{property.propertyMode || "N/A"}</td>
        <td>{property.propertyType || "N/A"}</td>
        <td>₹{property.rentalAmount}</td>
        <td>{property.streetName || "N/A"}</td>
        <td>{property.createdBy || "N/A"}</td>
        <td>{new Date(property.createdAt).toLocaleString()}</td>
        <td>{new Date(property.updatedAt).toLocaleString()}</td>
        <td>{property.required}</td>
        <td>{property.adsCount}</td>
        <td>{property.status}</td>
        <td>{property.planName}</td>
  
        <td>{property.adminName}</td>
        <td>{property.billNo}</td>
        <td>{property.featureStatus}</td>
        <td>{property.createdBy}</td>
        <td>{property.planCreatedAt}</td>
        <td>{property.planExpiryDate}</td>
 

         <td>
                                    {property.isDeleted ? (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleUndoDelete(property.rentId)}
                            >
                              <MdUndo />
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
    ))}
  </tbody>
</Table>
</div>
    </div>
  );
};

export default PostedByProperty;