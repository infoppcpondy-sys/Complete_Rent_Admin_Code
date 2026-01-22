 

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaEdit, FaInfoCircle, FaTrash, FaUndo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Badge, Table } from "react-bootstrap";

const BuyerAssistanceTable = () => {
  const [buyerRequests, setBuyerRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchRentId, setSearchRentId] = useState("");
  const [searchPhoneNumber, setSearchPhoneNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState(null);
  const [billMap, setBillMap] = useState({});
  const [sortColumn, setSortColumn] = useState("approvedDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    fetchApprovedProperties();
  }, []);

  // Fetch bills and create a map of rentId -> bill data
  const fetchBills = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/bills`);
      const map = {};

      if (res.data.data && Array.isArray(res.data.data)) {
        res.data.data.forEach(bill => {
          // Find the related property
          const relatedProperty = buyerRequests.find(p => String(p.rentId).trim() === String(bill.rentId).trim());
          
          if (relatedProperty) {
            // Only add if bill was created after the property
            const propertyTime = new Date(relatedProperty.createdAt).getTime();
            const billTime = new Date(bill.createdAt).getTime();
            
            if (billTime >= propertyTime) {
              // Only add to map if not already exists (first one wins)
              if (!map[bill.rentId]) {
                map[bill.rentId] = {
                  billNo: bill.billNo,
                  createdAt: bill.createdAt,
                  adminName: bill.adminName
                };
              }
            }
          }
        });
      }

      setBillMap(map);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  // Fetch bills after buyer requests are loaded
  useEffect(() => {
    if (buyerRequests && buyerRequests.length > 0) {
      fetchBills();
    }
  }, [buyerRequests]);

  const fetchApprovedProperties = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users-datas-all-rent`);
      const freeRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-free-plans`);
      const paidRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-paid-plans`);
      
      // Create a map of rentId -> plan type
      const planTypeMap = {};
      
      // Map free properties
      if (freeRes.data.data && Array.isArray(freeRes.data.data)) {
        freeRes.data.data.forEach(item => {
          if (item.properties && Array.isArray(item.properties)) {
            item.properties.forEach(prop => {
              planTypeMap[prop.rentId] = 'Free';
            });
          }
        });
      }
      
      // Map paid properties
      if (paidRes.data.data && Array.isArray(paidRes.data.data)) {
        paidRes.data.data.forEach(item => {
          if (item.properties && Array.isArray(item.properties)) {
            item.properties.forEach(prop => {
              planTypeMap[prop.rentId] = 'Paid';
            });
          }
        });
      }
      
      // Add planName to each property
      const sorted = response.data.users
        .map(prop => ({
          ...prop,
          planName: planTypeMap[prop.rentId] || 'Free'
        }))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      
      setBuyerRequests(sorted);
      setFilteredRequests(sorted);
    } catch (error) {
      setMessage("Failed to fetch data");
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
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const filtered = buyerRequests.filter((request) => {
      const isRentIdMatch = searchRentId ? String(request.rentId || '').includes(searchRentId) : true;
      const isPhoneMatch = searchPhoneNumber ? String(request.phoneNumber || '').includes(searchPhoneNumber) : true;
      const isStartDateMatch = startDate ? new Date(request.createdAt) >= new Date(startDate) : true;
      const isEndDateMatch = endDate ? new Date(request.createdAt) <= new Date(endDate) : true;
      return isRentIdMatch && isPhoneMatch && isStartDateMatch && isEndDateMatch;
    });
    // Sort by Approved Date (updatedAt) in descending order
    const sorted = filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setFilteredRequests(sorted);
  };

  const handleReset = () => {
    setSearchRentId('');
    setSearchPhoneNumber('');
    setStartDate('');
    setEndDate('');
    setFilteredRequests(buyerRequests);
    handleResetSorting();
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "raPending" ? "raActive" : "raPending";
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-buyerAssistance-status/${id}`,
        { newStatus }
      );
      alert(response.data.message);
      fetchApprovedProperties(); // refresh list
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleEdit = (Ra_Id) => {
    navigate("/dashboard/edit-buyer-assistance", { state: { Ra_Id } });
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete-buyer-assistance-rent/${id}`);
      setMessage("Tentant Assistance deleted successfully.");
      fetchApprovedProperties();
    } catch (error) {
      setMessage("Error deleting Tentant Assistance.");
    }
  };


  const handleUndoDelete = async (id) => {
    if (!window.confirm("Are you sure you want to restore this request?")) return;
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/undo-delete-buyer-assistance-rent/${id}`);
      setMessage("Tentant Assistance restored successfully.");
      fetchApprovedProperties();
    } catch (error) {
      setMessage("Error restoring Tentant Assistance.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Helper function to parse date string (dd/mm/yyyy or ISO) into timestamp
  const parseDate = (dateString) => {
    if (!dateString || dateString === "-" || dateString.trim() === "") {
      return null;
    }
    
    let date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.getTime();
    }
    
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) {
        return date.getTime();
      }
    }
    
    return null;
  };

  // Get sorted data based on current sort column and order
  const getSortedData = (data) => {
    return data.slice().sort((a, b) => {
      let aValue, bValue;

      if (sortColumn === "approvedDate") {
        // Use raw date objects, not formatted strings
        aValue = a.updatedAt ? new Date(a.updatedAt).getTime() : null;
        bValue = b.updatedAt ? new Date(b.updatedAt).getTime() : null;
      } else if (sortColumn === "propertyCreatedDate") {
        aValue = a.createdAt ? new Date(a.createdAt).getTime() : null;
        bValue = b.createdAt ? new Date(b.createdAt).getTime() : null;
      } else if (sortColumn === "billCreatedDate") {
        aValue = billMap[a.rentId] ? new Date(billMap[a.rentId].createdAt).getTime() : null;
        bValue = billMap[b.rentId] ? new Date(billMap[b.rentId].createdAt).getTime() : null;
      } else if (sortColumn === "rpId") {
        aValue = a.rentId ? String(a.rentId).trim() : null;
        bValue = b.rentId ? String(b.rentId).trim() : null;
      }

      // Push null/missing values to bottom
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      // Sort based on order
      if (sortColumn === "rpId") {
        // Numeric sorting for RP ID
        const aNum = parseInt(aValue, 10);
        const bNum = parseInt(bValue, 10);
        if (sortOrder === "desc") {
          return bNum - aNum; // High to Low
        } else {
          return aNum - bNum; // Low to High
        }
      } else {
        // Date sorting
        if (sortOrder === "desc") {
          return bValue - aValue; // Recent to Old
        } else {
          return aValue - bValue; // Old to Recent
        }
      }
    });
  };

  // Handle column sort click
  const handleColumnSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortColumn(column);
      setSortOrder("desc");
    }
  };

  // Reset sorting to default (Approved Date, Descending)
  const handleResetSorting = () => {
    setSortColumn("approvedDate");
    setSortOrder("desc");
  };

  return (
    <div className="mt-5">
      <div className="container mt-3">
        <form className="d-flex flex-row gap-2 align-items-center flex-nowrap" onSubmit={handleFilterSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Rent ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by Rent ID"
              value={searchRentId}
              onChange={(e) => setSearchRentId(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Phone Number</label>
            <input
              className="form-control"
              type="text"
              placeholder="Search by Phone Number"
              value={searchPhoneNumber}
              onChange={(e) => setSearchPhoneNumber(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col-md-6 col-lg-3 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">Filter</button>
            <button onClick={handleReset} type="button" className="btn btn-danger w-100 ms-2">Reset</button>
          </div>
        </form>
      </div>
              <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
      <div className="mt-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <h3 className="mb-0">Owner and Tenant App Menu</h3>
          <button 
            type="button"
            onClick={() => {
              setSortColumn("approvedDate");
              setSortOrder("desc");
            }}
            className="btn btn-sm"
            title="Reset sorting to default (Approved Date - Recent to Old)"
            style={{ padding: "0.25rem 0.5rem", fontSize: "14px", backgroundColor: "#6c757d", color: "white", border: "none" }}
          >
            🔄 Reset Sort
          </button>
        </div>
<div ref={tableRef}>
            <Table striped bordered hover responsive>
            <thead className="sticky-top bg-white">
              <tr>
                <th>SI.No</th>
                <th 
                  style={{ cursor: "pointer", userSelect: "none", minWidth: "100px" }}
                  onClick={() => handleColumnSort("rpId")}
                  title="Click to sort by RP ID"
                >
                  RP ID
                  <span style={{ marginLeft: "6px", fontSize: "12px", opacity: sortColumn === "rpId" ? 1 : 0.4 }}>
                    {sortColumn === "rpId" && sortOrder === "desc" ? "⬆️" : "⬇️"}
                  </span>
                </th>
                <th 
                  style={{ cursor: "pointer", userSelect: "none", minWidth: "120px" }}
                  onClick={() => handleColumnSort("approvedDate")}
                  title="Click to sort by Approved Date"
                >
                  Approved Date
                  <span style={{ marginLeft: "6px", fontSize: "12px", opacity: sortColumn === "approvedDate" ? 1 : 0.4 }}>
                    {sortColumn === "approvedDate" && sortOrder === "desc" ? "⬆️" : "⬇️"}
                  </span>
                </th>
                <th>Owner Number</th>
                <th>Plan Name</th>
                <th 
                  style={{ cursor: "pointer", userSelect: "none", minWidth: "130px" }}
                  onClick={() => handleColumnSort("propertyCreatedDate")}
                  title="Click to sort by Property Created Date"
                >
                  Property Created Date
                  <span style={{ marginLeft: "6px", fontSize: "12px", opacity: sortColumn === "propertyCreatedDate" ? 1 : 0.4 }}>
                    {sortColumn === "propertyCreatedDate" && sortOrder === "desc" ? "⬆️" : "⬇️"}
                  </span>
                </th>
                <th 
                  style={{ cursor: "pointer", userSelect: "none", minWidth: "120px" }}
                  onClick={() => handleColumnSort("billCreatedDate")}
                  title="Click to sort by Bill Created Date"
                >
                  Bill Created Date
                  <span style={{ marginLeft: "6px", fontSize: "12px", opacity: sortColumn === "billCreatedDate" ? 1 : 0.4 }}>
                    {sortColumn === "billCreatedDate" && sortOrder === "desc" ? "⬆️" : "⬇️"}
                  </span>
                </th>
                <th>Bill By</th>
                <th>Property Expiry Date</th>
                <th>Owner Action</th>
                <th>Delete/Undo</th>
                <th>Edit</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? getSortedData(filteredRequests).map((request, index) => {
                const id = request._id || request.Ra_Id;
                return (
                  <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{request.rentId}</td>
                      <td>{formatDate(request.updatedAt)}</td>
                      <td>{request.phoneNumber}</td>
                    <td>{request.planName}</td>
                    <td>{formatDate(request.createdAt)}</td>
                    <td>{billMap[request.rentId] ? formatDate(billMap[request.rentId].createdAt) : '-'}</td>
                    <td>{billMap[request.rentId]?.adminName || '-'}</td>
                    <td>{request.propertyType}</td>
                    <td>{request.ra_status}</td>
                    <td>
                      {!request.isDeleted ? (
                        <button onClick={() => handleSoftDelete(id)} className="btn btn-outline-danger btn-sm">
                          <FaTrash />
                        </button>
                      ) : (
                        <button onClick={() => handleUndoDelete(id)} className="btn btn-outline-primary btn-sm">
                          <FaUndo />
                        </button>
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleEdit(request.Ra_Id)} className="btn btn-outline-secondary btn-sm">
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="12" className="text-center">No Data Found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default BuyerAssistanceTable;
