









import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { MdDeleteForever, MdUndo } from 'react-icons/md';

const CustomerCare = () => {
  const [propertyData, setPropertyData] = useState([]);
  const [rentIdFilter, setrentIdFilter] = useState('');
const [phoneFilter, setPhoneFilter] = useState('');
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [statusFilter, setStatusFilter] = useState('');
const [planNameFilter, setPlanNameFilter] = useState('');
const [reasonFilter, setReasonFilter] = useState('');
const [selectReasonFilter, setSelectReasonFilter] = useState("");

    const navigate = useNavigate();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-property-details`);
        if (res.data.success) {
          setPropertyData(res.data.data);
        }
      } catch (error) {
      }
    };
    fetchData();
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
const filteredPropertyData = propertyData.filter((item) => {
  const ppcMatch = rentIdFilter
    ? item.rentId?.toString().toLowerCase().includes(rentIdFilter.toLowerCase())
    : true;

  const phoneMatch = phoneFilter
    ? item.phoneNumber?.toString().toLowerCase().includes(phoneFilter.toLowerCase())
    : true;

  const statusMatch = statusFilter
    ? item.status?.toLowerCase() === statusFilter.toLowerCase()
    : true;

  const planNameMatch = planNameFilter
    ? item.planName?.toLowerCase().includes(planNameFilter.toLowerCase())
    : true;

  const reason = item.help?.selectHelpReason || '-';
  const reasonMatch = reasonFilter
    ? reason.toLowerCase().includes(reasonFilter.toLowerCase())
    : true;
  const selectReasons = item.help?.selectReasons || '-';
  const selectReasonMatch = selectReasonFilter
    ? selectReasons.toLowerCase().includes(selectReasonFilter.toLowerCase())
    : true;
  const createdAt = item.createdAt ? new Date(item.createdAt) : null;
  const from = startDate ? new Date(startDate) : null;
  const to = endDate ? new Date(endDate) : null;

  const dateMatch =
    (!from || (createdAt && createdAt >= from)) &&
    (!to || (createdAt && createdAt <= to));

  return (
    ppcMatch &&
    phoneMatch &&
    statusMatch &&
    planNameMatch &&
    reasonMatch &&
        selectReasonMatch &&
    dateMatch
  );
});


  const handleDelete = async (rentId) => {
    if (window.confirm(`Are you sure you want to delete RENT ID: ${rentId}?`)) {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/delete-free-property/${rentId}`, {
                method: 'PUT',
            });
            const data = await response.json();
            alert(data.message);

            // Update state
            setPropertyData(prev =>
                prev.map(item =>
                    item.rentId === rentId ? { ...item, isDeleted: true } : item
                )
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

            // Update state
            setPropertyData(prev =>
                prev.map(item =>
                    item.rentId === rentId ? { ...item, isDeleted: false } : item
                )
            );
        } catch (error) {
            alert('Failed to undo delete.');
        }
    }
};

  

  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
  
 

  return (

    <div>
<form     style={{ 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  backgroundColor: '#fff' 
}}
className="d-flex flex-row flex-wrap gap-2 align-items-center"
onSubmit={(e) => e.preventDefault()}>
  {/* RENT ID Filter */}
  <div className="m-0">
    <label className="form-label fw-bold">RENT ID</label>
    <input
      type="text"
      className="form-control"
      placeholder="Search RENT ID"
      value={rentIdFilter}
      onChange={(e) => setrentIdFilter(e.target.value)}
    />
  </div>

  {/* Phone Number Filter */}
  <div className="m-0">
    <label className="form-label fw-bold">PhoneNumber</label>
    <input
      type="text"
      className="form-control"
      placeholder="Search Phone"
      value={phoneFilter}
      onChange={(e) => setPhoneFilter(e.target.value)}
    />
  </div>

  {/* Status Filter */}
  <div className="m-0">
    <label className="form-label fw-bold">Status</label>
 
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

  </div>

  {/* Plan Name Filter */}
  <div className="m-0">
    <label className="form-label fw-bold">PlanName</label>
    <input
      type="text"
      className="form-control"
      placeholder="Search Plan Name"
      value={planNameFilter}
      onChange={(e) => setPlanNameFilter(e.target.value)}
    />
  </div>

  {/* Help Reason Filter */}
  <div className="m-0">
    <label className="form-label fw-bold">HelpReason</label>
    <input
      type="text"
      className="form-control"
      placeholder="Search Help Reason"
      value={reasonFilter}
      onChange={(e) => setReasonFilter(e.target.value)}
    />
  </div>
  <div className="m-0">
    <label className="form-label fw-bold">ReportReason</label>
   
<input
  type="text"
        className="form-control"

  placeholder="Search Select Reason"
  value={selectReasonFilter}
  onChange={(e) => setSelectReasonFilter(e.target.value)}
/>
  </div>
  {/* Date Range Filter */}
  <div className="m-0">
    <label className="form-label fw-bold">From Date</label>
    <input
      type="date"
      className="form-control"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
    />
  </div>

  <div className="m-0">
    <label className="form-label fw-bold">To Date</label>
    <input
      type="date"
      className="form-control"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
    />
  </div>

  {/* Reset Button */}
  <div className="col-md-2 d-flex align-items-end">
    <button
      className="btn btn-secondary w-50"
      type="button"
      onClick={() => {
        setrentIdFilter('');
        setPhoneFilter('');
        setStatusFilter('');
        setPlanNameFilter('');
        setReasonFilter('');
        setStartDate('');
        setEndDate('');
      }}
    >
      Reset
    </button>
  </div>
</form>
              <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
<div ref={tableRef}>
     <Table striped bordered hover responsive className="table-sm align-middle">
        <thead className="sticky-top bg-dark text-white">
          <tr>
            <th>Sl.No</th>
            <th>Image</th>
            <th className="sticky-col sticky-col-1">RENT ID</th>
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
            <th>Reported Reason</th>
            <th>Report Date</th>
            <th>Help Reason</th>
            <th>Tentant Actioned Date</th>
            <th>Tentant Number</th>
            <th>Action</th>
          </tr>
        </thead>
  
        <tbody>
          {filteredPropertyData.map((item, index) => {
            const report = item.reportDetails?.[0];
            const help = item.helpRequests?.[0];
  
            return (
              <tr key={index}>
                <td>{item.slNo}</td>
                <td>{item.image ? <img src={item.image} alt="Property" width="60" /> : "No Image"}</td>
  
                <td
                  onClick={() =>
                    navigate(`/dashboard/detail`, {
                      state: { rentId: item.rentId, phoneNumber: item.phoneNumber },
                    })
                  }
                  style={{ cursor: "pointer" }}
                  className="sticky-col sticky-col-1"
                >
                  {item.rentId}
                </td>
  
                <td className="sticky-col sticky-col-2">{item.phoneNumber}</td>
                <td>{item.propertyMode}</td>
                <td>{item.propertyType}</td>
                <td>{item.rentalAmount}</td>
                <td>{item.city}</td>
                <td>{item.createdBy}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                <td>{item.required}</td>
                <td>{item.adsCount}</td>
                <td>{item.status}</td>
                <td>{item.planName || "-"}</td>
  
              
  
                <td>{report?.selectReasons || "-"}</td>
                <td>{report?.date ? new Date(report.date).toLocaleDateString() : "-"}</td>
                <td>{help?.selectHelpReason || "-"}</td>
                <td>{help?.requestedAt ? new Date(help.requestedAt).toLocaleDateString() : "-"}</td>
                <td>{help?.phoneNumber || report?.phoneNumber || "-"}</td>
  
                <td>
                  {item.isDeleted ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUndoDelete(item.rentId)}
                      title="Undo Delete"
                    >
                      <MdUndo size={20} />
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item.rentId)}
                      title="Delete"
                    >
                      <MdDeleteForever size={20} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
   </div>
    </div>
  );
};

export default CustomerCare;



