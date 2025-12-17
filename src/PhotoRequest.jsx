


import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { Table, Form, Button } from "react-bootstrap";
import { MdDeleteForever, MdUndo } from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



const PhotoRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupAction, setPopupAction] = useState(null);

  
    
useEffect(() => {
  if (message) {
    const timer = setTimeout(() => setMessage(""), 5000); // Auto-close after 3 seconds
    return () => clearTimeout(timer); // Cleanup timer
  }
}, [message]);

  // Fetch photo requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/all-photo-requests`);
        setRequests(response.data);
        setFilteredRequests(response.data);
      } catch (error) {
        setMessage("Error fetching photo requests.");
      }
    };
    fetchRequests();
  }, []);

 
  const handleDelete = async (rentId) => {
    if (window.confirm(`Are you sure you want to delete RENT ID: ${rentId}?`)) {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/delete-free-property/${rentId}`, {
                method: 'PUT',
            });
            const data = await response.json();
            alert(data.message);

            // Update state
            setRequests(prev =>
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
            setRequests(prev =>
                prev.map(item =>
                    item.rentId === rentId ? { ...item, isDeleted: false } : item
                )
            );
        } catch (error) {
            alert('Failed to undo delete.');
        }
    }
};
useEffect(() => {
  setCurrentPageRequests(1);
}, [searchQuery, fromDate, endDate]);

  // Handle dynamic search filter
const [currentPageRequests, setCurrentPageRequests] = useState(1);
const requestsPerPage = 5;

useEffect(() => {
  if (!Array.isArray(requests)) return;

  const normalizedSearch = searchQuery?.toString().toLowerCase().trim() || "";

  let filtered = requests.filter((req) => {
    const rentIdStr = req.rentId ? req.rentId.toString().toLowerCase() : "";
    const propertyTypeStr = req.propertyType ? req.propertyType.toLowerCase() : "";

    const matchesSearch =
      normalizedSearch === "" ||
      rentIdStr.includes(normalizedSearch) ||
      propertyTypeStr.includes(normalizedSearch);

    if (!matchesSearch) return false;

    const createdAtDate = req.createdAt ? new Date(req.createdAt) : null;

    if (fromDate && createdAtDate && createdAtDate < new Date(fromDate)) return false;
    if (endDate && createdAtDate && createdAtDate > new Date(endDate)) return false;

    return true;
  });

  setFilteredRequests(filtered);
}, [searchQuery, fromDate, endDate, requests]);

// Reset page when filters change
useEffect(() => {
  setCurrentPageRequests(1);
}, [searchQuery, fromDate, endDate]);

const indexOfLastRequest = currentPageRequests * requestsPerPage;
const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

const totalPagesRequests = Math.ceil(filteredRequests.length / requestsPerPage);

  // PDF Export
const handleDownloadPDF = () => {
  const doc = new jsPDF();
  doc.text("Photo Request Table", 14, 10);

  const tableColumn = ["RENT ID", "Requester", "Posted User", "Property Type", "Date", "Status"];
  const tableRows = [];

  filteredRequests.forEach((req) => {
    const row = [
      req.rentId || "",
      req.requesterPhoneNumber || "",
      req.postedUserPhoneNumber || "",
      req.propertyType || "",
      new Date(req.createdAt).toLocaleDateString(),
      req.status || ""
    ];
    tableRows.push(row);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.save("PhotoRequests.pdf");
};

// Excel Export
const handleDownloadExcel = () => {
  const dataToExport = filteredRequests.map((req) => ({
    "RENT ID": req.rentId,
    "Requester Phone": req.requesterPhoneNumber,
    "Posted User Phone": req.postedUserPhoneNumber,
    "Property Type": req.propertyType,
    "Created Date": new Date(req.createdAt).toLocaleDateString(),
    "Status": req.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "PhotoRequests");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "PhotoRequests.xlsx");
};


  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
  
  
 
const handleReset = () => {
  setSearchQuery('');
  setFromDate('');
  setEndDate('');
};

  return (
    <div className="container mt-4">
     
      <h2>Photo Requests</h2>
      {/* Search Form */}
      <Form     style={{ 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  backgroundColor: '#fff' 
}} className="d-flex flex-row gap-2 align-items-center flex-nowrap">
          <div >
            <Form.Group>
              <Form.Label>Search (RENT ID, Property Type)</Form.Label>
              <Form.Control
                type="text"
                value={searchQuery}
                placeholder="Search Here"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>
          </div>
          <div >
            <Form.Group>
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Form.Group>
          </div>
          <div >
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
          </div>
           <button
      type="button"
      className="btn btn-secondary m-0"
      onClick={handleReset}
    >
      Reset
    </button>
      </Form>
   
      <div className="mb-3">
  <Button variant="primary" className="me-2" onClick={handleDownloadPDF}>
    Download PDF
  </Button>
  <Button variant="success" onClick={handleDownloadExcel}>
    Download Excel
  </Button>
</div>


<div>
      {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}
      {showPopup && (
        <div style={{ 
          position: "fixed", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%)", 
          backgroundColor: "white", 
          padding: "20px", 
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px", 
          textAlign: "center" 
        }}>
          <p style={{ marginBottom: "10px" }}>Are you sure you want to proceed?</p>
          <button 
            onClick={() => { popupAction(); }} 
            style={{ marginRight: "10px", padding: "5px 10px", backgroundColor: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Yes
          </button>
          <button 
            onClick={() => setShowPopup(false)} 
            style={{ padding: "5px 10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            No
          </button>
        </div>
      )}
</div>

      <h3 className="mb-3 mt-3">Photo Request Datas</h3>
      {/* Table to Display Data */}
      <Table striped bordered hover responsive className="table-sm align-middle">
                    <thead className="sticky-top">
          <tr>
            <th>Request ID</th>
            <th>Requester Phone</th>
            <th>Posted User Phone</th>
            <th>Property Type</th>
            <th>Created Date</th>
            <th>Status</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRequests.map((request) => (
            <tr key={request._id}>
              <td>{request.rentId}</td>
              <td>{request.requesterPhoneNumber}</td>
              <td>{request.postedUserPhoneNumber}</td>
              <td>{request.propertyType}</td>
              <td>{new Date(request.createdAt).toLocaleDateString()}</td>
              <td>{request.status}</td>
              <td>
                {request.photoURL ? (
                  <img src={request.photoURL} alt="Property" width="50" height="50" />
                ) : (
                  "No Photo"
                )}
              </td>
        

 <td>
                                            {request.isDeleted ? (
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleUndoDelete(request.rentId)}
                                                    title="Undo Delete"
                                                >
                                                    <MdUndo size={24} />
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(request.rentId)}
                                                    title="Delete"
                                                >
                                                    <MdDeleteForever size={24} />
                                                </button>
                                            )}
                                        </td>

            </tr>
          ))}
        </tbody>
      </Table>
          <div style={{ marginTop: "10px" }}>
        {Array.from({ length: totalPagesRequests }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setCurrentPageRequests(idx + 1)}
            style={{
              marginRight: "5px",
              backgroundColor: currentPageRequests === idx + 1 ? "#007bff" : "#f0f0f0",
              color: currentPageRequests === idx + 1 ? "#fff" : "#000",
              border: "none",
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PhotoRequests;
