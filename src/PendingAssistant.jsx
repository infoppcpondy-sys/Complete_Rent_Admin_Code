


import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Table,Badge } from "react-bootstrap";
import { FaInfoCircle, FaTrash, FaUndo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";

const PendingBuyerAssistanceList = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchBaId, setSearchBaId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchPhoneNumber, setSearchPhoneNumber] = useState('');
  const navigate=useNavigate();

  const [message, setMessage] = useState("");

useEffect(() => {
  if (message) {
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }
}, [message]);

  
    const [billMap, setBillMap] = useState({});
  
  
  
    const fetchBills = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/buyer-bills-rent`);
        const map = {};
    
        res.data.data.forEach(bill => {
          if (!map[bill.Ra_Id]) {
            map[bill.Ra_Id] = {
              adminName: bill.adminName,
              billNo: bill.billNo
            };
          }
        });
    
        setBillMap(map);
      } catch (error) {
      }
    };
    
  useEffect(() => {
    fetchBills();
  }, []);
  
    const [followUpMap, setFollowUpMap] = useState({});
  
    const fetchFollowUps = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/followup-list-buyer`);
        const map = {};
    
        res.data.data.forEach(f => {
          if (!map[f.Ra_Id]) {
            map[f.Ra_Id] = {
              adminName: f.adminName,
              createdAt: f.createdAt
            };
          }
        });
    
        setFollowUpMap(map);
      } catch (err) {
      }
    };
    
    useEffect(() => {
      fetchFollowUps();
    }, []);
    
  
  
    // Handle creating bill or follow-up with confirmation
    const handleCreateAction = (actionType, Ra_Id, phoneNumber) => {
      const confirmMessage = `Do you want to create ${actionType}?`;
  
      const isConfirmed = window.confirm(confirmMessage);
  
      if (isConfirmed) {
        const currentDate = new Date().toLocaleDateString(); // Store current date
  
        // Update the specific property with the current date for the action
        setData(prevProperties =>
          prevProperties.map((item) =>
            item.Ra_Id === Ra_Id && item.phoneNumber === phoneNumber
              ? {
                  ...item,
                  [`create${actionType}Date`]: currentDate, // Dynamically set date field
                }
              : item
          )
        );
  
        // Navigate to the respective page (Follow-up or Bill creation)
        if (actionType === 'FollowUp') {
          navigate('/dashboard/create-followup-buyer', {
            state: { Ra_Id: Ra_Id, phoneNumber: phoneNumber },
          });
          
} else if (actionType === 'Bill') {
        navigate('/dashboard/buyer-create-bill', {
            state: { Ra_Id: Ra_Id, phoneNumber: phoneNumber },
        });
      
       
      
        } 
       
      }
    };


  useEffect(() => {
    fetchPendingAssistance();
  }, []);


  const fetchPendingAssistance = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-buyerAssistance-pending-rent`);
      setData(response.data.data);
      setFiltered(response.data.data);
    } catch (error) {
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
  const handleFilter = () => {
    let filteredData = data;

    if (searchBaId) {
      filteredData = filteredData.filter((item) =>
        item.Ra_Id.toString().includes(searchBaId)
      );
    }
 if (searchPhoneNumber) {
    filteredData = filteredData.filter((item) =>
      String(item.phoneNumber || '').includes(searchPhoneNumber)
    );
  }
    if (startDate) {
      const start = new Date(startDate);
      filteredData = filteredData.filter(
        (item) => new Date(item.createdAt) >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      filteredData = filteredData.filter(
        (item) => new Date(item.createdAt) <= end
      );
    }

    setFiltered(filteredData);
  };
const handleReset = () => {
  setSearchBaId('');
  setSearchPhoneNumber('');
  setStartDate('');
  setEndDate('');
  setFiltered(data);
};
 
  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
  
 
  

  

const handleGetFollowUp = () => {
  window.open('/process/dashboard/followup-list-buyer', '_blank');
};
  

  return (
    <div className="container mt-4">
      <h3>Pending Tentant Assistance Requests</h3>

      {/* Search Form */}
      <div     style={{ 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  backgroundColor: '#fff' 
}} className="row mb-3">
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by BA ID"
            value={searchBaId}
            onChange={(e) => setSearchBaId(e.target.value)}
          />
        </div>
               <div className="col-md-2">
          <input
            className="form-control"
       type="text"
  placeholder="Search by Phone Number"
  value={searchPhoneNumber}
  onChange={(e) => setSearchPhoneNumber(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleFilter}>
            Filter
          </button>
           <button className="btn btn-danger w-100 mt-2" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
              <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
       <div className="mb-3 text-end">
                  <button className="text-white bg-success"  onClick={handleGetFollowUp}>
                    Get Follow-Up Tentant
                  </button>
                </div>

      {/* Table */}
<div ref={tableRef}>       
      <Table striped bordered hover responsive className="table-sm align-middle">
      <thead className="sticky-top">
            <tr>
              <th>RA ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>City</th>
              <th>Area</th>
              <th>Price Range</th>
              <th>Bedrooms</th>
              <th>PropertyMode</th>
              <th>PropertyType</th>
              <th>ra_Status</th>
              <th>Created At</th>
              <th>Plan Name</th>
    <th>Plan Created</th>
    <th>Expires</th>
    <th>Status Changed</th>
    {/* <th>Actions</th> */}
        <th>Create FollowUp</th>
        <th>Create Bill</th>

            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.Ra_Id}>
                  <td>{item.Ra_Id}</td>
                  <td>{item.raName}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{item.city}</td>
                  <td>{item.area}</td>
                  <td>
                    ₹{item.minPrice} - ₹{item.maxPrice}
                  </td>
                  
                  <td>{item.bedrooms}</td>
                  <td>{item.propertyMode}</td>
                  <td>{item.propertyType}</td>
                  <td>{item.ra_status}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>{item.planDetails.planName}</td>
      <td>{item.planDetails.planCreatedAt}</td>
      <td>{item.planDetails.planExpiryDate}</td>
      <td>
  {item.isDeleted ? (
    <Badge bg="danger" className="d-flex align-items-center">
      <FaTrash className="me-1" /> Deleted
    </Badge>
  ) : (
    <Badge bg="success" className="d-flex align-items-center">
      <FaInfoCircle className="me-1" /> baPending
    </Badge>
  )}
</td>
 

<td>
  {followUpMap[item.Ra_Id] ? (
    <div className="text-success">
      <div><strong>{followUpMap[item.Ra_Id].adminName}</strong></div>
      <div>
        <small>
          {new Date(followUpMap[item.Ra_Id].createdAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  ) : (
    <button
      className="btn btn-sm btn-primary"
      onClick={() => handleCreateAction("FollowUp", item.Ra_Id, item.phoneNumber)}
    >
      Create Follow-up
    </button>
  )}
</td>

   <td>
                {followUpMap[item.Ra_Id] && !billMap[item.Ra_Id] ? (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleCreateAction("Bill", item.Ra_Id, item.phoneNumber)}
                  >
                    Create Bill
                  </button>
                ) : billMap[item.Ra_Id] ? (
                  <span className="text-success">Bill Created</span>
                ) : (
                  <span className="text-muted">Follow-up Required</span>
                )}
              </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default PendingBuyerAssistanceList;










