


import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { Table, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';  // Import delete icon from react-icons
import { useNavigate } from "react-router-dom";

const DeletedProperties = () => {

  const [filters, setFilters] = useState({
  rentId: '',
  phoneNumber: '',
  status: '',
  startDate: '',
  endDate: ''
});
const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setFilters((prev) => ({ ...prev, [name]: value }));
};
  const [deletedProperties, setDeletedProperties] = useState([]);
 
  const fetchDeletedProperties = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-deleted-properties-datas`);
    
    const sorted = (response.data.deleted || []).sort((a, b) => {
      return new Date(b.deletedAt) - new Date(a.deletedAt); // New to old
    });

    setDeletedProperties(sorted);
  } catch (error) {
    console.error("Failed to fetch deleted properties:", error);
  }
};


  useEffect(() => {
    fetchDeletedProperties();
  }, []);

    const navigate = useNavigate();
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
const filteredProperties = deletedProperties.filter((property) => {
  const { rentId, phoneNumber, status, startDate, endDate } = filters;

  const matchrentId = !rentId || property.rentId.toLowerCase().includes(rentId.toLowerCase());
  const matchPhone = !phoneNumber || String(property.phoneNumber || '').includes(phoneNumber);
  const matchStatus = !status || property.status === status;

  const deletedAt = property.deletedAt ? new Date(property.deletedAt) : null;
  const matchStart = !startDate || (deletedAt && deletedAt >= new Date(startDate));
  const matchEnd = !endDate || (deletedAt && deletedAt <= new Date(endDate));

  return matchrentId && matchPhone && matchStatus && matchStart && matchEnd;
});

  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
  
 
  return (
    <div className="container mt-4">

      <h4>Permanently Deleted Properties</h4>
      <div   style={{ 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  backgroundColor: '#fff' 
}} className="row mb-3">
  <div className="col">
    <input
      type="text"
      name="rentId"
      placeholder="Search RENT ID"
      className="form-control"
      value={filters.rentId}
      onChange={handleFilterChange}
    />
  </div>
  <div className="col">
    <input
      type="text"
      name="phoneNumber"
      placeholder="Search Phone Number"
      className="form-control"
      value={filters.phoneNumber}
      onChange={handleFilterChange}
    />
  </div>
  <div className="col">
 
    <select
  value={filters.status}
      onChange={handleFilterChange}
>
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

  </div>
  <div className="col">
    <input
      type="date"
      name="startDate"
      className="form-control"
      value={filters.startDate}
      onChange={handleFilterChange}
    />
  </div>
  <div className="col">
    <input
      type="date"
      name="endDate"
      className="form-control"
      value={filters.endDate}
      onChange={handleFilterChange}
    />
  </div>
  <div className="col-auto d-flex align-items-end">
    <button
      className="btn btn-secondary"
      onClick={() =>
        setFilters({
          rentId: '',
          phoneNumber: '',
          status: '',
          startDate: '',
          endDate: ''
        })
      }
    >
      Reset
    </button>
  </div>
</div>
              <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
      {filteredProperties.length === 0 ? (
        <p>No deleted properties found.</p>
      ) : ( <div ref={tableRef}>
       <Table striped bordered hover responsive className="table-sm align-middle">
                     <thead className="sticky-top">
            <tr>
              <th>RENT ID</th>
              <th>Phone Number</th>
              <th>Property Mode</th>
              <th>Property Type</th>
              <th>Rental Amount</th>
              <th>Status</th>
              <th>Deleted At</th>
              <th>DeletedBy AdminName </th>
 
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((property) => (
              <tr key={property.rentId}>
                <td  style={{cursor: "pointer"}}  onClick={() =>
                                            navigate(`/dashboard/detail`, {
                                              state: { rentId: property.rentId, phoneNumber: property.phoneNumber },
                                            })
                                          }>{property.rentId}</td>
                <td>{property.phoneNumber}</td>
                <td>{property.propertyMode}</td>
                <td>{property.propertyType}</td>
                <td>₹ {property.rentalAmount}</td>
                <td>{property.status || 'N/A'}</td>
                <td>{property.deletedAt || '—'}</td>
                <td>{property.permanentDeletedBy}</td>
                 
              </tr>
            ))}
          </tbody>
        </Table>
           </div>
      )}
    </div>
  );
};

export default DeletedProperties;
