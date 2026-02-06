









import React, { useEffect, useState , useRef} from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const RemovedTenant = () => {
  const [tenantRequests, setTenantRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [phoneNumberSearch, setPhoneNumberSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeletedTenantRequests = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-buyer-assistance-rent`);
        const deleted = res.data.data.filter((request) => request.isDeleted === true);

        // Sort by createdAt (latest first)
        const sortedDeleted = deleted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setTenantRequests(sortedDeleted);
        setFiltered(sortedDeleted);
      } catch (err) {
      }
    };
    fetchDeletedTenantRequests();
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

  const handleExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filtered.map((request, idx) => ({
        'S.No': idx + 1,
        'RA ID': request.Ra_Id,
        'Phone Number': request.phoneNumber,
        'City': request.city,
        'Area': request.area,
        'Min Price': request.minPrice,
        'Max Price': request.maxPrice,
        'BHK': request.bedrooms,
        'Property Mode': request.propertyMode,
        'Property Type': request.propertyType,
        'Status': request.ra_status,
        'Created At': moment(request.createdAt).format('YYYY-MM-DD'),
        'Deleted At': request.deletedAt ? moment(request.deletedAt).format('YYYY-MM-DD') : 'N/A'
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'RemovedTenantAssistance');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `RemovedTenantAssistance_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const handleSearch = () => {
    let result = tenantRequests;

   if (search.trim()) {
  result = result.filter((request) =>
    request.Ra_Id && String(request.Ra_Id).toLowerCase().includes(search.toLowerCase())
  );
}

  if (phoneNumberSearch.trim()) {
    result = result.filter((request) =>
      String(request.phoneNumber || '').toLowerCase().includes(phoneNumberSearch.toLowerCase())
    );
  }
 if (statusFilter) {
    result = result.filter((request) => request.ra_status === statusFilter);
  }
    if (fromDate) {
      const start = new Date(fromDate);
      result = result.filter((request) => new Date(request.createdAt) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      result = result.filter((request) => new Date(request.createdAt) <= end);
    }

    setFiltered(result);
  };
const handleReset = () => {
  setSearch('');
  setPhoneNumberSearch('');
  setFromDate('');
  setEndDate('');
  setFiltered(tenantRequests);
};

  const handleDelete = async (rentId, phoneNumber) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this tenant assistance?");
    if (!isConfirmed) return;

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/delete-buyer-assistance-rent`, null, {
        params: { Ra_Id: rentId, phoneNumber },
      });

      if (response.status === 200) {
        setFiltered((prev) => prev.filter((request) => request.Ra_Id !== rentId));
        setTenantRequests((prev) => prev.filter((request) => request.Ra_Id !== rentId));
      }
    } catch (error) {
      alert("Failed to delete tenant assistance.");
    }
  };

  const handleUndo = async (raId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/undo-delete-buyer-assistance-rent/${raId}`);

      // Remove it from list since isDeleted is no longer true
      setFiltered((prev) => prev.filter((request) => request.Ra_Id !== raId));
      setTenantRequests((prev) => prev.filter((request) => request.Ra_Id !== raId));

      alert("Tenant assistance restored successfully");
    } catch (error) {
      alert("Failed to undo delete.");
    }
  };

  const reduxAdminName = useSelector((state) => state.admin.name);
  const adminName = reduxAdminName || localStorage.getItem("adminName");

  const handlePermanentDelete = async (raId) => {
    const confirmed = window.confirm(
      `Are you sure you want to PERMANENTLY delete RA ID ${raId}? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(raId);

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/permanent-delete-buyer-assistance-rent/${raId}`,
        {
          data: { deletedBy: adminName },
        }
      );

      if (response.status === 200) {
        // Remove from UI immediately
        setFiltered((prev) => prev.filter((request) => request.Ra_Id !== raId));
        setTenantRequests((prev) => prev.filter((request) => request.Ra_Id !== raId));

        alert(`RA ID ${raId} has been permanently deleted.`);
      } else {
        alert(response.data?.message || "Failed to permanently delete tenant assistance.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to permanently delete tenant assistance.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-3">

      <form   style={{ 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  backgroundColor: '#fff' 
}}
        onSubmit={(e) => e.preventDefault()}
    className="d-flex flex-row gap-2 align-items-center flex-nowrap"
      >
        <div className="mb-3">
          <label className="form-label fw-bold">RA ID</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter RA ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
           <div className="mb-3">
          <label className="form-label fw-bold">Phone Number</label>
          <input
            type="text"
            className="form-control"
    placeholder="Search by Phone Number"
    value={phoneNumberSearch}
    onChange={(e) => setPhoneNumberSearch(e.target.value)}
          />
        </div>


        <div className="mb-3">
          <label className="form-label fw-bold">From Date</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
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
      <div className="mb-3">
          <label className="form-label fw-bold">Status</label>
   
       <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>

  <option value="">All Status</option>
  <option value="raPending">Pending</option>
  <option value="raActive">Active</option>
</select>

        </div>
        <div className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
           <Button variant="secondary" onClick={handleReset} className="ms-2">
            Reset
          </Button>
        </div>
        
      </form>
                    <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
                    <button className="btn btn-secondary mb-3 mt-2 ms-2" style={{background:"#217346"}} onClick={handleExcel}>
  Excel
</button>
      <h4>Removed Tenant Assistance - List</h4>
<div ref={tableRef}>
    <Table striped bordered hover responsive className="table-sm align-middle">
                  <thead className="sticky-top">
          <tr>
            <th>S.No</th>
            <th>RA ID</th>
            <th>Phone</th>
            <th>City</th>
            <th>Area</th>
            <th>Min Price</th>
            <th>Max Price</th>
            <th>BHK</th>
            <th>Property Mode</th>
            <th>Property Type</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Deleted At</th>
            <th>Undo</th>
            <th>Permanent Delete</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="15" className="text-center">
                No tenant assistance requests found.
              </td>
            </tr>
          ) : (
            filtered.map((request, idx) => (
              <tr key={request._id}>
                <td>{idx + 1}</td>
                <td style={{cursor: "pointer"}}
                    onClick={() =>
                                              navigate(`/dashboard/detail-rent-assis`, {
                                                state: { Ra_Id: request.Ra_Id, phoneNumber: request.phoneNumber },
                                              })
                                            }>{request.Ra_Id}</td>
                <td>{request.phoneNumber}</td>
                <td>{request.city}</td>
                <td>{request.area}</td>
                <td>{request.minPrice}</td>
                <td>{request.maxPrice}</td>
                <td>{request.bedrooms}</td>
                <td>{request.propertyMode}</td>
                <td>{request.propertyType}</td>
                <td>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: "5px",
                      backgroundColor: request.ra_status === "raActive" ? "#28a745" : "#ffc107",
                      color: request.ra_status === "raActive" ? "white" : "black",
                    }}
                  >
                    {request.ra_status}
                  </span>
                </td>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                <td>
                  {request.deletedAt
                    ? new Date(request.deletedAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUndo(request.Ra_Id)}
                  >
                    Undo
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handlePermanentDelete(request.Ra_Id)}
                    disabled={deletingId === request.Ra_Id}
                  >
                    {deletingId === request.Ra_Id ? "Deleting..." : "Permanent Delete"}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
    </div>
  );
};

export default RemovedTenant;
