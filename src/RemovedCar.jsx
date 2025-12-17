









import React, { useEffect, useState , useRef} from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DeletedPropertiesTable = () => {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusProperties, setStatusProperties] = useState({});
  const [previousStatuses, setPreviousStatuses] = useState({});
const [phoneNumberSearch, setPhoneNumberSearch] = useState('');
const [statusFilter, setStatusFilter] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeletedProperties = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/properties/deleted-rent`);
        const deleted = res.data.data.filter((prop) => prop.status === "delete");

        setProperties(deleted);
        setFiltered(deleted);

        const statusMap = {};
        deleted.forEach((prop) => {
          statusMap[prop.rentId] = prop.status;
        });
        setStatusProperties(statusMap);
      } catch (err) {
      }
    };
    fetchDeletedProperties();
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
  const handleSearch = () => {
    let result = properties;

   if (search.trim()) {
  result = result.filter((prop) =>
    prop.rentId && String(prop.rentId).toLowerCase().includes(search.toLowerCase())
  );
}

  if (phoneNumberSearch.trim()) {
    result = result.filter((prop) =>
      String(prop.phoneNumber || '').toLowerCase().includes(phoneNumberSearch.toLowerCase())
    );
  }
 if (statusFilter) {
    result = result.filter((prop) => statusProperties[prop.rentId] === statusFilter);
  }
    if (fromDate) {
      const start = new Date(fromDate);
      result = result.filter((prop) => new Date(prop.createdAt) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      result = result.filter((prop) => new Date(prop.createdAt) <= end);
    }

    setFiltered(result);
  };
const handleReset = () => {
  setSearch('');
  setPhoneNumberSearch('');
  setFromDate('');
  setEndDate('');
  setFiltered(properties);
};

  const handleDelete = async (rentId, phoneNumber) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this property?");
    if (!isConfirmed) return;

    setPreviousStatuses((prev) => ({
      ...prev,
      [rentId]: statusProperties[rentId],
    }));

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/delete-datas`, null, {
        params: { rentId, phoneNumber },
      });

      if (response.status === 200) {
        setStatusProperties((prev) => ({
          ...prev,
          [rentId]: "delete",
        }));
      }
    } catch (error) {
      alert("Failed to delete property.");
    }
  };

  const handleUndo = async (rentId) => {
    const restoredStatus = previousStatuses[rentId] || "incomplete";

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/update-property-status`, {
        rentId,
        status: restoredStatus,
      });

      // Remove it from list since status is no longer 'delete'
      setFiltered((prev) => prev.filter((prop) => prop.rentId !== rentId));
      setProperties((prev) => prev.filter((prop) => prop.rentId !== rentId));

      // Clean up status tracking
      setStatusProperties((prev) => {
        const updated = { ...prev };
        delete updated[rentId];
        return updated;
      });

      setPreviousStatuses((prev) => {
        const updated = { ...prev };
        delete updated[rentId];
        return updated;
      });
    } catch (error) {
      alert("Failed to undo delete.");
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
          <label className="form-label fw-bold">RENT ID</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter RENT ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
           <div className="mb-3">
          <label className="form-label fw-bold">PhoneNumber</label>
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
      <h4>Removed Properties</h4>
<div ref={tableRef}>
    <Table striped bordered hover responsive className="table-sm align-middle">
                  <thead className="sticky-top">
          <tr>
            <th>S.No</th>
            <th>Rent ID</th>
            <th>Phone</th>
            <th>City</th>
            <th>Status</th>
            <th>Property Type</th>
            <th>Property Mode</th>
            <th>Rental Amount</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Deleted By</th>
            <th>Bill No</th>
            <th>Follow Up</th>
            <th>Remarks</th>
            <th>Deleted Date</th>
            <th>Undo</th>
 
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="16" className="text-center">
                No properties found.
              </td>
            </tr>
          ) : (
            filtered.map((prop, idx) => (
              <tr key={prop._id}>
                <td>{idx + 1}</td>
                <td style={{cursor: "pointer"}}
                    onClick={() =>
                                              navigate(`/dashboard/detail`, {
                                                state: { rentId: prop.rentId, phoneNumber: prop.phoneNumber },
                                              })
                                            }>{prop.rentId}</td>
                <td>{prop.phoneNumber}</td>
                <td>{prop.city}</td>
                <td>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: "5px",
                      backgroundColor: "red",
                      color: "white",
                    }}
                  >
                    {statusProperties[prop.rentId]}
                  </span>
                </td>
                <td>{prop.propertyType}</td>
                <td>{prop.propertyMode}</td>
                <td>{prop.price}</td>
                <td>{new Date(prop.createdAt).toLocaleDateString()}</td>
                <td>{new Date(prop.updatedAt).toLocaleDateString()}</td>
                <td>{prop.deletedBy}</td>
                <td>{prop.billNo}</td>
                <td>{prop.adminName}</td>
                <td>{prop.remarks || "-"}</td>
                <td>
                  {prop.deletedAt
                    ? new Date(prop.deletedAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUndo(prop.rentId)}
                  >
                    Undo
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

export default DeletedPropertiesTable;
