 

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaEdit, FaInfoCircle, FaTrash, FaUndo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Badge, Table } from "react-bootstrap";

const BuyerAssistanceTable = () => {
  const [buyerRequests, setBuyerRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchBAId, setSearchBAId] = useState("");
  const [searchPhoneNumber, setSearchPhoneNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBuyerRequests();
  }, []);

  const fetchBuyerRequests = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-buyer-assistance-rent`);
      const sorted = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
      const isBaIdMatch = searchBAId ? String(request.Ra_Id || '').includes(searchBAId) : true;
      const isPhoneMatch = searchPhoneNumber ? String(request.phoneNumber || '').includes(searchPhoneNumber) : true;
      const isStartDateMatch = startDate ? new Date(request.createdAt) >= new Date(startDate) : true;
      const isEndDateMatch = endDate ? new Date(request.createdAt) <= new Date(endDate) : true;
      return isBaIdMatch && isPhoneMatch && isStartDateMatch && isEndDateMatch;
    });
    setFilteredRequests(filtered);
  };

  const handleReset = () => {
    setSearchBAId('');
    setSearchPhoneNumber('');
    setStartDate('');
    setEndDate('');
    setFilteredRequests(buyerRequests);
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "raPending" ? "raActive" : "raPending";
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-buyerAssistance-status/${id}`,
        { newStatus }
      );
      alert(response.data.message);
      fetchBuyerRequests(); // refresh list
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
      fetchBuyerRequests();
    } catch (error) {
      setMessage("Error deleting Tentant Assistance.");
    }
  };


  const handleUndoDelete = async (id) => {
    if (!window.confirm("Are you sure you want to restore this request?")) return;
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/undo-delete-buyer-assistance-rent/${id}`);
      setMessage("Tentant Assistance restored successfully.");
      fetchBuyerRequests();
    } catch (error) {
      setMessage("Error restoring Tentant Assistance.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-5">
      <div className="container mt-3">
        <form className="d-flex flex-row gap-2 align-items-center flex-nowrap" onSubmit={handleFilterSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">RA ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by RA ID"
              value={searchBAId}
              onChange={(e) => setSearchBAId(e.target.value)}
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
        <h3 className="mb-3">Tentant Assistance Records</h3>
<div ref={tableRef}>
            <Table striped bordered hover responsive>
            <thead className="sticky-top bg-white">
              <tr>
                <th>RA ID</th>
                <th>Phone Number</th>
                <th>City</th>
                <th>Area</th>
                <th>Min Price</th>
                <th>Max Price</th>
                <th>BHK</th>
                <th>Property Mode</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Soft Delete</th>
                <th>Actions</th>
                <th>Status Toggle</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? filteredRequests.map((request, index) => {
                const id = request._id || request.Ra_Id;
                return (
                  <tr key={index}>
                      <td    onClick={() =>
                              navigate(`/dashboard/detail-rent-assis`, {
                                state: { Ra_Id: request.Ra_Id, phoneNumber: request.phoneNumber },
                              })
                            }
     style={{cursor: "pointer"}}
       className="sticky-col sticky-col-1">{request.Ra_Id}</td>
                    {/* <td>{request.Ra_Id}</td> */}
                    <td>{request.phoneNumber}</td>
                    <td>{request.city}</td>
                    <td>{request.area}</td>
                    <td>{request.minPrice}</td>
                    <td>{request.maxPrice}</td>
                    <td>{request.bedrooms}</td>
                    <td>{request.propertyMode}</td>
                    <td>{request.propertyType}</td>
                    <td>{request.ra_status}</td>
                    <td>{formatDate(request.createdAt)}</td>
                    <td>
                      {request.isDeleted ? (
                        <Badge bg="danger"><FaTrash className="me-1" />Deleted</Badge>
                      ) : (
                        <Badge bg="success"><FaInfoCircle className="me-1" />Active</Badge>
                      )}
                    </td>
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
                      <button
                        className={`btn btn-sm btn-${request.ra_status === "raPending" ? "warning" : "success"}`}
                        onClick={() => handleStatusToggle(id, request.ra_status)}
                      >
                        {request.ra_status === "raPending" ? "Activate" : "Deactivate"}
                      </button>
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
                  <td colSpan="17" className="text-center">No Data Found</td>
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
