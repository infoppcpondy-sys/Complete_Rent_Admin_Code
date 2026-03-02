



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
  const [ownerPhoneFilter, setOwnerPhoneFilter] = useState("");
  const [tenantPhoneFilter, setTenantPhoneFilter] = useState("");
  const [ownerData, setOwnerData] = useState([]); // Store owner data from API
  const [tenantData, setTenantData] = useState([]); // Store tenant data from API
  const [ownerBillStatusMap, setOwnerBillStatusMap] = useState({}); // Store owner bill status by phone number
  const [tenantBillStatusMap, setTenantBillStatusMap] = useState({}); // Store tenant bill status by phone number

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

  // Fetch owner data from API
  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-alls-datas-all`);
        setOwnerData(response.data?.users || response.data || []);
      } catch (err) {
        console.error("Fetch owner data failed:", err);
        setOwnerData([]);
      }
    };

    fetchOwnerData();
  }, []);

  // Fetch tenant data from API
  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/raActive-buyerAssistance-all-plans-rent`);
        let data = response.data?.buyers || response.data?.data || response.data || [];
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setTenantData(data);
        } else if (typeof data === 'object' && data !== null) {
          setTenantData([data]);
        } else {
          setTenantData([]);
        }
      } catch (err) {
        console.error("Fetch tenant data failed:", err);
        setTenantData([]);
      }
    };

    fetchTenantData();
  }, []);

  // Fetch owner bill status (free/paid plans) from API
  useEffect(() => {
    const fetchOwnerBillStatus = async () => {
      try {
        const freeRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-free-plans`);
        const paidRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-paid-plans`);
        
        const ownerBillMap = {};
        
        // Map free properties by phone number
        if (freeRes.data.data && Array.isArray(freeRes.data.data)) {
          freeRes.data.data.forEach(item => {
            if (item.properties && Array.isArray(item.properties)) {
              item.properties.forEach(prop => {
                if (prop.phoneNumber) {
                  ownerBillMap[prop.phoneNumber] = 'Free';
                }
              });
            }
          });
        }
        
        // Map paid properties by phone number
        if (paidRes.data.data && Array.isArray(paidRes.data.data)) {
          paidRes.data.data.forEach(item => {
            if (item.properties && Array.isArray(item.properties)) {
              item.properties.forEach(prop => {
                if (prop.phoneNumber) {
                  ownerBillMap[prop.phoneNumber] = 'Paid';
                }
              });
            }
          });
        }
        
        setOwnerBillStatusMap(ownerBillMap);
      } catch (err) {
        console.error("Fetch owner bill status failed:", err);
        setOwnerBillStatusMap({});
      }
    };

    fetchOwnerBillStatus();
  }, []);

  // Fetch tenant bill status (free/paid plans) from API
  useEffect(() => {
    const fetchTenantBillStatus = async () => {
      try {
        const freeRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-free-plans`);
        const paidRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-paid-plans`);
        
        const tenantBillMap = {};
        
        // Map free properties by phone number
        if (freeRes.data.data && Array.isArray(freeRes.data.data)) {
          freeRes.data.data.forEach(item => {
            if (item.properties && Array.isArray(item.properties)) {
              item.properties.forEach(prop => {
                if (prop.phoneNumber) {
                  tenantBillMap[prop.phoneNumber] = 'Free';
                }
              });
            }
          });
        }
        
        // Map paid properties by phone number
        if (paidRes.data.data && Array.isArray(paidRes.data.data)) {
          paidRes.data.data.forEach(item => {
            if (item.properties && Array.isArray(item.properties)) {
              item.properties.forEach(prop => {
                if (prop.phoneNumber) {
                  tenantBillMap[prop.phoneNumber] = 'Paid';
                }
              });
            }
          });
        }
        
        setTenantBillStatusMap(tenantBillMap);
      } catch (err) {
        console.error("Fetch tenant bill status failed:", err);
        setTenantBillStatusMap({});
      }
    };

    fetchTenantBillStatus();
  }, []);
    const tableRef = useRef();

  // Get owner bill status based on phone number
  const getOwnerBillStatus = (phoneNumber) => {
    if (!phoneNumber || !ownerBillStatusMap[phoneNumber]) {
      return 'N/A';
    }
    return ownerBillStatusMap[phoneNumber];
  };

  // Get tenant bill status based on phone number
  const getTenantBillStatus = (phoneNumber) => {
    if (!phoneNumber || !tenantBillStatusMap[phoneNumber]) {
      return 'N/A';
    }
    return tenantBillStatusMap[phoneNumber];
  };

  // Get owner status based on phone number
  const getOwnerStatus = (phoneNumber) => {
    const owner = ownerData.find(
      owner => owner.phoneNumber === phoneNumber || owner.phone === phoneNumber
    );
    
    if (owner && owner.status === 'active') {
      return 'AP';
    }
    
    // If phone number is not found in API data
    return 'NP';
  };

  // Get tenant status based on phone number
  const getTenantStatus = (phoneNumber) => {
    if (!Array.isArray(tenantData)) {
      return 'NP';
    }

    const tenant = tenantData.find(
      tenant => tenant.phoneNumber === phoneNumber || tenant.phone === phoneNumber
    );
    
    if (tenant && tenant.ra_status === 'raActive') {
      return 'AP';
    }
    
    // If phone number is not found in API data
    return 'NP';
  };

  // Get badge style based on status
  const getBadgeStyle = (status) => {
    if (status === 'AP') {
      return {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '12px'
      };
    } else if (status === 'NP') {
      return {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '12px'
      };
    }
    return {};
  };
  
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

    const matchesOwnerPhone =
      ownerPhoneFilter === ""
        ? true
        : notification.recipientPhoneNumber.includes(ownerPhoneFilter);

    const matchesTenantPhone =
      tenantPhoneFilter === ""
        ? true
        : notification.senderPhoneNumber.includes(tenantPhoneFilter);

    return isWithinDate && matchesStatus && matchesOwnerPhone && matchesTenantPhone;
  });

  setFilteredNotifications(filtered);
  setCurrentPage(1);
};


 
const handleReset = () => {
  setStartDate("");
  setEndDate("");
  setStatusFilter("");
  setOwnerPhoneFilter("");
  setTenantPhoneFilter("");
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

  // Smart pagination: Generate page numbers array with ellipsis
  const generatePaginationArray = () => {
    const pages = [];
    const siblingsCount = 2; // Pages on each side of current page
    const showAlwaysCount = 1; // Always show first and last page

    // Calculate range around current page
    const leftSiblingIndex = Math.max(
      currentPage - siblingsCount,
      1
    );
    const rightSiblingIndex = Math.min(
      currentPage + siblingsCount,
      totalPages
    );

    // Add first page(s)
    for (let i = 1; i <= Math.min(showAlwaysCount, totalPages); i++) {
      pages.push(i);
    }

    // Add ellipsis or range before current page range
    if (leftSiblingIndex > showAlwaysCount + 1) {
      pages.push(null); // null represents ellipsis
    }

    // Add pages around current page
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Add ellipsis or range after current page range
    if (rightSiblingIndex < totalPages - showAlwaysCount) {
      pages.push(null); // null represents ellipsis
    }

    // Add last page(s)
    if (totalPages > 1) {
      for (let i = Math.max(totalPages - showAlwaysCount + 1, 1); i <= totalPages; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  const paginationPages = generatePaginationArray();

  
   if (loading) return <p>Loading...</p>;
  

  return (
    <div className="container">
<h2 className="text-center mb-4">Auto Notification By Admin - User Activity</h2>
      {/* Filter Form */}
      <div style={{ 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  backgroundColor: '#fff' 
}}  className="d-flex flex-row gap-2 align-items-center flex-wrap">
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
          <label className="form-label fw-bold">Owner Phone Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search owner phone..."
            value={ownerPhoneFilter}
            onChange={(e) => setOwnerPhoneFilter(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Tenant Phone Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search tenant phone..."
            value={tenantPhoneFilter}
            onChange={(e) => setTenantPhoneFilter(e.target.value)}
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
        <div className="col-md-3 d-flex align-items-end gap-2">
          <button className="btn btn-primary" onClick={handleFilter}>
            Filter
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
          <button className="btn btn-secondary" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
        </div>
        </div>
      <h2>Auto Notification</h2>
<div ref={tableRef}>
      {/* Notifications Table */}
      <Table striped bordered hover responsive className="table-sm align-middle">
      <thead className="sticky-top">
          <tr>
            <th>SI.No</th>
            <th>Message</th>
            <th>Type</th>
            <th>Owner Phone Number</th>
            <th>Owner Status</th>
            <th>Owner Bill Status</th>
            <th>Tenant Phone Number</th>
            <th>Tenant Status</th>
            <th>Tenant Bill Status</th>
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
                <td>
                  <span style={getBadgeStyle(getOwnerStatus(notification.recipientPhoneNumber))}>
                    {getOwnerStatus(notification.recipientPhoneNumber)}
                  </span>
                </td>
                <td>{getOwnerBillStatus(notification.recipientPhoneNumber)}</td>
                <td>{notification.senderPhoneNumber}</td>
                <td>
                  <span style={getBadgeStyle(getTenantStatus(notification.senderPhoneNumber))}>
                    {getTenantStatus(notification.senderPhoneNumber)}
                  </span>
                </td>
                <td>{getTenantBillStatus(notification.senderPhoneNumber)}</td>
                <td>{notification.isRead ? "Read" : "Unread"}</td>
                <td>{new Date(notification.createdAt).toLocaleString()}</td>
               
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No notifications found</td>
            </tr>
          )}
        </tbody>
      </Table>
</div>
      {/* Pagination */}
      <div 
        className="pagination mt-3" 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px', 
          maxWidth: '100%',
          justifyContent: 'center',
          padding: '10px 0'
        }}
      >
        <button
          className="btn btn-primary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {paginationPages.map((pageNum, index) => {
          if (pageNum === null) {
            // Render ellipsis
            return (
              <span
                key={`ellipsis-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 4px',
                  fontWeight: 'bold'
                }}
              >
                ...
              </span>
            );
          }

          // Render page button
          return (
            <button
              key={pageNum}
              className={`btn btn-secondary ${
                currentPage === pageNum ? "active" : ""
              }`}
              onClick={() => handlePageChange(pageNum)}
              style={{ minWidth: '40px' }}
            >
              {pageNum}
            </button>
          );
        })}

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
