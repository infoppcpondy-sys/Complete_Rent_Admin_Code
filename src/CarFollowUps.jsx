 

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const FollowUpTable = () => {
  const [followups, setFollowups] = useState([]);
  const [propertiesMap, setPropertiesMap] = useState({});
  const [loading, setLoading] = useState(true);
const [filters, setFilters] = useState({
  rentId: '',
  phoneNumber: '',
  startDate: '',
  endDate: ''
});
  const navigate = useNavigate();

  useEffect(() => {
  fetchFollowups();
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
const fetchFollowups = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/followups`);
    if (res.data.success) {
      const { followups, properties } = res.data;

      // Map properties by RENT ID
      const propertyMap = {};
      properties.forEach((prop) => {
        propertyMap[Number(prop.rentId)] = prop;
      });

      // Sort followups by property createdAt or fallback to followup createdAt
      const sortedFollowups = [...followups].sort((a, b) => {
        const propA = propertyMap[Number(a.rentId)];
        const propB = propertyMap[Number(b.rentId)];

        const dateA = propA?.createdAt ? new Date(propA.createdAt) : new Date(a.createdAt);
        const dateB = propB?.createdAt ? new Date(propB.createdAt) : new Date(b.createdAt);

        return dateB - dateA; // Newest first
      });

      setFollowups(sortedFollowups);
      setPropertiesMap(propertyMap);
    }
  } catch (err) {
    console.error('Error fetching followups:', err);
  } finally {
    setLoading(false);
  }
};


  if (loading) return <div className="p-3">Loading followups...</div>;

  return (
    <div className="container mt-4">

      <div className="d-flex flex-row gap-2 align-items-center flex-nowrap"
    style={{ 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  backgroundColor: '#fff' 
}}>
  <input
    type="text"
    placeholder="Filter by RENT ID"
    value={filters.rentId}
    onChange={(e) => setFilters({ ...filters, rentId: e.target.value })}
  />
  <input
    type="text"
    placeholder="Filter by Phone"
    value={filters.phoneNumber}
    onChange={(e) => setFilters({ ...filters, phoneNumber: e.target.value })}
  />
  <input
    type="date"
    value={filters.startDate}
    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
  />
  <input
    type="date"
    value={filters.endDate}
    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
  />
    <button
    onClick={() => setFilters((prev) => ({ ...prev, startDate: '', endDate: '' }))}
    style={{
      padding: '4px 8px',
      background: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }}
  >
    Reset Dates
  </button>
</div>
              <button className="btn btn-secondary mb-3 mt-3" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
      <h3 className="mb-3">Followup & Property Table</h3>
     <div ref={tableRef}>            <Table striped bordered hover responsive className="table-sm align-middle">
                               <thead className="sticky-top">
          <tr>
            <th>#</th>
                    <th className="sticky-col sticky-col-1">RENT ID</th>
                    <th className="sticky-col sticky-col-2">Phone Number</th>
            <th>Admin</th>
            <th>FollowUp Status</th>
            <th>Followup Type</th>
            <th>Followup Date</th>
            <th>Property Type</th>
            <th>Mode</th>
            <th>rentalAmount</th>
            <th>Negotiation</th>
            <th>Property Status</th>
            <th>Created By</th>
            <th>OwnerName</th>
            <th>City</th>
            <th>State</th>
               <th>Property Created At</th>
    <th>Property Updated At</th>
{/* <th>Views Details</th> */}
          </tr>
        </thead>
        <tbody>
       
          {followups
  .filter((fu) => {
    const { rentId, phoneNumber, startDate, endDate } = filters;
    const followupDate = new Date(fu.followupDate);

    const matchrentId = rentId ? fu.rentId.toString().includes(rentId) : true;
    const matchPhone = phoneNumber ? fu.phoneNumber.includes(phoneNumber) : true;
    const matchStartDate = startDate ? followupDate >= new Date(startDate) : true;
    const matchEndDate = endDate ? followupDate <= new Date(endDate) : true;

    return matchrentId && matchPhone && matchStartDate && matchEndDate;
  })
  .map((fu, index) => {
    const prop = propertiesMap[Number(fu.rentId)] || {};
    return (
      <tr key={fu._id}>
        <td>{index + 1}</td>
        <td    onClick={() =>
                              navigate(`/dashboard/detail`, {
                                state: { rentId: prop.rentId, phoneNumber: prop.phoneNumber },
                              })
                            }                 className="sticky-col sticky-col-1">{fu.rentId}</td>
        <td className="sticky-col sticky-col-2">{fu.phoneNumber}</td>
        <td>{fu.adminName}</td>
        <td>{fu.followupStatus}</td>
        <td>{fu.followupType}</td>
        <td>{new Date(fu.followupDate).toLocaleDateString()}</td>
        <td>{prop.propertyType || 'N/A'}</td>
        <td>{prop.propertyMode || 'N/A'}</td>
        <td>{prop.rentalAmount || 'N/A'}</td>
        <td>{prop.negotiation || 'N/A'}</td>
        <td>{prop.status || 'N/A'}</td>
        <td>{prop.createdBy || 'N/A'}</td>
        <td>{prop.ownerName || 'N/A'}</td>
        <td>{prop.city || 'N/A'}</td>
        <td>{prop.state || 'N/A'}</td>
        <td>{prop.createdAt ? new Date(prop.createdAt).toLocaleString() : 'N/A'}</td>
        <td>{prop.updatedAt ? new Date(prop.updatedAt).toLocaleString() : 'N/A'}</td>
     
               
      </tr>
    );
  })}

        </tbody>
      </Table>
      </div>
    </div>
  );
};

export default FollowUpTable;
