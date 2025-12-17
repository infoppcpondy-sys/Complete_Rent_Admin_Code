



import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { Table } from "react-bootstrap";

const NotificationsTable = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "Read", "Unread", or ""

  const itemsPerPage = 50;

  useEffect(() => {
 
const fetchNotifications = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-all-notifications-rent`);
    setNotifications(response.data.notifications);
    setFilteredNotifications(response.data.notifications);
  } catch (err) {
    console.error("Fetch failed, retrying...", err);
    // retry after short delay
    setTimeout(fetchNotifications, 2000);
  } finally {
    setLoading(false);
  }
};

    fetchNotifications();
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
  const handleFilter = () => {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  const filtered = notifications.filter(notification => {
    const createdAt = new Date(notification.createdAt);
    const isWithinDate =
      (!start || createdAt >= start) &&
      (!end || createdAt <= end);

    const matchesStatus =
      statusFilter === ""
        ? true
        : statusFilter === "Read"
        ? notification.isRead
        : !notification.isRead;

    return isWithinDate && matchesStatus;
  });

  setFilteredNotifications(filtered);
  setCurrentPage(1);
};


 
const handleReset = () => {
  setStartDate("");
  setEndDate("");
  setStatusFilter(""); // Reset status
  setFilteredNotifications(notifications);
  setCurrentPage(1);
};

  



 

   

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>{error}</div>;

  const totalItems = filteredNotifications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  
   if (loading) return <p>Loading...</p>;
  

  return (
    <div className="container">

      {/* Filter Form */}
      <div style={{ 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  backgroundColor: '#fff' 
}}  className="d-flex flex-row gap-2 align-items-center flex-nowrap">
        <div className="mb-3">
  <label className="form-label fw-bold">Filter by Status</label>
  <select
    className="form-select"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="">All</option>
    <option value="Read">Read</option>
    <option value="Unread">Unread</option>
  </select>
</div>

        <div className="mb-3">
          <label>Start Date</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>End Date</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button className="btn btn-primary me-2" onClick={handleFilter}>
            Filter
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
                        <button className="btn btn-secondary ms-2 " style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
        </div>
        </div>
      <h2>Notifications</h2>
<div ref={tableRef}>
      {/* Notifications Table */}
      <Table striped bordered hover responsive className="table-sm align-middle">
      <thead className="sticky-top">
          <tr>
            <th>#</th>
            <th>Message</th>
            <th>Type</th>
            <th>Recipient Phone</th>
            <th>Sender Phone</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {currentNotifications.length > 0 ? (
            currentNotifications.map((notification, index) => (
              <tr key={notification._id}>
                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td>{notification.message}</td>
                <td>{notification.type}</td>
                <td>{notification.recipientPhoneNumber}</td>
                <td>{notification.senderPhoneNumber}</td>
                <td>{notification.isRead ? "Read" : "Unread"}</td>
                <td>{new Date(notification.createdAt).toLocaleString()}</td>
               
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No notifications found</td>
            </tr>
          )}
        </tbody>
      </Table>
</div>
      {/* Pagination */}
      <div className="pagination mt-3">
        <button
          className="btn btn-primary me-1"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`btn btn-secondary me-1 ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="btn btn-primary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NotificationsTable;
