


import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Container, Row, Table, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import pic from "./Assets/Mask Group 3.png";
import { getFirstPhotoUrl } from './utils/mediaHelper';
import * as XLSX from 'xlsx';

// ===== CENTRALIZED COLUMN CONFIGURATION =====
// This single configuration defines all table columns with export settings
const TABLE_COLUMNS = [
  { key: 'image', header: 'Image', exportable: false }, // UI-only
  { key: 'rentId', header: 'Rent ID', exportable: true },
  { key: 'phoneNumber', header: 'Phone Number', exportable: true },
  { key: 'alternatePhone', header: 'Alter Phone Number', exportable: true },
  { key: 'email', header: 'Email', exportable: true },
  { key: 'otpStatus', header: 'OTP Status', exportable: true },
  { key: 'isVerifiedUser', header: 'Direct Verified User', exportable: true },
  { key: 'propertyMode', header: 'Property Mode', exportable: true },
  { key: 'propertyType', header: 'Property Type', exportable: true },
  { key: 'rentalAmount', header: 'Rental Amount', exportable: true },
  { key: 'city', header: 'City', exportable: true },
  { key: 'createdBy', header: 'Created By', exportable: true },
  { key: 'required', header: 'Mandatory', exportable: true },
  { key: 'planName', header: 'Plan Name', exportable: true },
  { key: 'createdAt', header: 'Created At', exportable: true },
  { key: 'updatedAt', header: 'Updated At', exportable: true },
  { key: 'adsCount', header: 'No. Of ADS', exportable: true },
  { key: 'featureStatus', header: 'Feature Property', exportable: true },
  { key: 'adminOffice', header: 'Admin Office', exportable: true },
  { key: 'followUpAdminName', header: 'FollowUp Admin Name', exportable: true },
  { key: 'paymentPlanName', header: 'Payment Plan Name', exportable: true },
  { key: 'paymentProductInfo', header: 'Plan Type', exportable: true },
  { key: 'paymentCreatedAt', header: 'Plan Created', exportable: true },
  { key: 'paymentUpdatedAt', header: 'Plan UpdatedAt', exportable: true },
  { key: 'planExpiryDate', header: 'Plan Expiry', exportable: true },
  { key: 'payuStatus', header: 'PayU Status', exportable: true },
  { key: 'txnId', header: 'Transaction ID', exportable: true },
  { key: 'paymentAmount', header: 'Plan Amount', exportable: true },
  { key: 'paymentFirstName', header: 'Plan CreatedBy', exportable: true },
  { key: 'paymentEmail', header: 'Payment Email', exportable: true },
  { key: 'payUDate', header: 'PayU Date', exportable: true },
  { key: 'billNo', header: 'Bill No', exportable: true },
  { key: 'billDate', header: 'Bill Date', exportable: true },
  { key: 'validity', header: 'Validity', exportable: true },
  { key: 'billExpiryDate', header: 'Bill Expiry Date', exportable: true },
  { key: 'featureStatusToggle', header: 'Feature Status', exportable: false }, // UI-only
  { key: 'status', header: 'Status', exportable: true },
  { key: 'actions', header: 'Actions', exportable: false }, // UI-only
  { key: 'activeOrPending', header: 'Active OR Pending', exportable: false }, // UI-only
  { key: 'permanentDelete', header: 'Permanent Delete', exportable: false }, // UI-only
];

// Get only exportable columns
const EXPORT_COLUMNS = TABLE_COLUMNS.filter(col => col.exportable);

const AddPropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [statusProperties, setStatusProperties] = useState({});
  const [previousStatuses, setPreviousStatuses] = useState({}); // Store previous statuses before delete
  const navigate = useNavigate();


const [excelFile, setExcelFile] = useState(null);
  const [message, setMessage] = useState('');

 const [filters, setFilters] = useState({
  rentId: '',
  phoneNumber: '',
  fromDate: '',
  endDate: '',
    status: '', // e.g., "active" or "removed"

});


  // Handle Excel file selection
  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  // Handle Excel file upload
  const handleExcelUpload = async () => {
    if (!excelFile) {
      setMessage('Please select an Excel file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', excelFile);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/update-property-upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage(response.data.message);  
    } catch (error) {
      setMessage(error.response?.data?.message || 'Excel upload failed.');
    }
  };


  const statusOptions = [
  "incomplete",
  "active",
  "pending",
  "complete",
  "sendInterest",
  "soldOut",
  "reportProperties",
  "needHelp",
  "contact",
  "favorite",
  "alreadySaved",
  "favoriteRemoved",
  "delete",
  "undo"
];


  useEffect(() => {
    fetchProperties();
  }, []);
 
const fetchProperties = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-alls-datas-all`);
    
    const sortedProperties = response.data.users.sort((a, b) => {
      const updatedAtComparison = new Date(b.updatedAt) - new Date(a.updatedAt);
      if (updatedAtComparison !== 0) return updatedAtComparison;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setProperties(sortedProperties);

    // Initialize statusProperties with values from the API
    const initialStatuses = {};
    sortedProperties.forEach(property => {
      initialStatuses[property.rentId] = property.status || 'pending';
    });

    setStatusProperties(initialStatuses);
    setPreviousStatuses(initialStatuses); // Also initialize previous statuses
    localStorage.setItem("statusProperties", JSON.stringify(initialStatuses));

  } catch (error) {
    console.error("Error fetching properties:", error);
  }
};

    const tableRef = useRef();

  // ===== HELPER FUNCTION: Extract data from property based on column key =====
  const getPropertyValue = (property, columnKey) => {
    switch (columnKey) {
      case 'rentId':
        return property.rentId;
      case 'phoneNumber':
        return property.phoneNumber;
      case 'alternatePhone':
        return property.alternatePhone || '';
      case 'email':
        return property.email || '';
      case 'otpStatus':
        return property.otpStatus || '';
      case 'isVerifiedUser':
        return property.isVerifiedUser ? 'True' : 'False';
      case 'propertyMode':
        return property.propertyMode || '';
      case 'propertyType':
        return property.propertyType || '';
      case 'rentalAmount':
        return property.rentalAmount || '';
      case 'city':
        return property.city || '';
      case 'createdBy':
        return property.createdBy || 'N/A';
      case 'required':
        return property.required || '';
      case 'planName':
        return property.planName || 'N/A';
      case 'createdAt':
        return property.createdAt ? new Date(property.createdAt).toLocaleString() : 'N/A';
      case 'updatedAt':
        return property.updatedAt ? new Date(property.updatedAt).toLocaleString() : 'N/A';
      case 'adsCount':
        return property.adsCount || 0;
      case 'featureStatus':
        return property.featureStatus || '';
      case 'adminOffice':
        return property.adminOffice || '';
      case 'followUpAdminName':
        return property.followUpAdminName || '';
      case 'paymentPlanName':
        return property.paymentInfo?.planName || '';
      case 'paymentProductInfo':
        return property.paymentInfo?.productinfo || '';
      case 'paymentCreatedAt':
        return property.paymentInfo?.createdAt ? new Date(property.paymentInfo.createdAt).toLocaleDateString() : '';
      case 'paymentUpdatedAt':
        return property.paymentInfo?.updatedAt ? new Date(property.paymentInfo.updatedAt).toLocaleDateString() : '';
      case 'planExpiryDate':
        return property.planExpiryDate || '';
      case 'payuStatus':
        return property.paymentInfo?.payustatususer || '';
      case 'txnId':
        return property.paymentInfo?.txnid || '';
      case 'paymentAmount':
        return property.paymentInfo?.amount || '';
      case 'paymentFirstName':
        return property.paymentInfo?.firstname || '';
      case 'paymentEmail':
        return property.paymentInfo?.email || '';
      case 'payUDate':
        return property.paymentInfo?.payUdate ? new Date(property.paymentInfo.payUdate).toLocaleString() : 'N/A';
      case 'billNo':
        return property.billNo || '';
      case 'billDate':
        return property.billDate || '';
      case 'validity':
        return property.validity || '';
      case 'billExpiryDate':
        return property.billExpiryDate || '';
      case 'status':
        return statusProperties[property.rentId] 
          ? statusProperties[property.rentId].charAt(0).toUpperCase() + statusProperties[property.rentId].slice(1)
          : 'Pending';
      default:
        return '';
    }
  };

  // ===== HELPER FUNCTION: Validate export data =====
  const validateExportData = (headers, rows) => {
    if (headers.length === 0) {
      console.warn('Export validation failed: No headers defined');
      return false;
    }
    if (rows.length === 0) {
      console.warn('Export validation failed: No data rows to export');
      return false;
    }
    for (let i = 0; i < rows.length; i++) {
      if (Object.keys(rows[i]).length !== headers.length) {
        console.warn(`Export validation failed: Row ${i} has ${Object.keys(rows[i]).length} columns, expected ${headers.length}`);
        return false;
      }
    }
    console.log(`Export validation passed: ${headers.length} columns, ${rows.length} rows`);
    return true;
  };

  // ===== FIXED PRINT FUNCTION: Uses filtered data with proper column alignment =====
  const handlePrint = () => {
    // Validate we have data to export
    if (filteredProperties.length === 0) {
      alert('No data to print. Please adjust filters.');
      return;
    }

    // Build header row using exportable columns
    const exportHeaders = EXPORT_COLUMNS.map(col => col.header);
    
    // Build data rows using exportable columns
    const exportRows = filteredProperties.map((property) => {
      const row = {};
      EXPORT_COLUMNS.forEach(col => {
        row[col.header] = getPropertyValue(property, col.key);
      });
      return row;
    });

    // Validate data
    if (!validateExportData(exportHeaders, exportRows)) {
      alert('Export validation failed. Check console for details.');
      return;
    }

    // Build HTML table
    let tableHTML = '<table style="border-collapse: collapse; width: 100%; font-size: 11px;">';
    tableHTML += '<thead><tr>';
    exportHeaders.forEach(header => {
      tableHTML += `<th style="border: 1px solid #000; padding: 8px; background: #f0f0f0; text-align: left;">${header}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';

    exportRows.forEach(row => {
      tableHTML += '<tr>';
      Object.values(row).forEach(value => {
        tableHTML += `<td style="border: 1px solid #000; padding: 6px; text-align: left; vertical-align: top;">${value}</td>`;
      });
      tableHTML += '</tr>';
    });

    tableHTML += '</tbody></table>';

    const printWindow = window.open("", "", "width=1400,height=900");
    printWindow.document.write(`
      <html>
        <head>
          <title>Properties Print - ${new Date().toLocaleString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 10px; }
            h1 { margin: 0 0 20px 0; text-align: center; font-size: 24px; }
            h2 { margin-bottom: 10px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background: #f0f0f0; font-weight: bold; }
            tr:nth-child(even) { background: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>RENT PONDY</h1>
          <h2>Property List Export - ${new Date().toLocaleString()}</h2>
          <p>Total Records: ${exportRows.length}</p>
          ${tableHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  // ===== FIXED EXCEL FUNCTION: Uses filtered data with proper column mapping =====
  const handleExcel = () => {
    // Validate we have data to export
    if (filteredProperties.length === 0) {
      alert('No data to export. Please adjust filters.');
      return;
    }

    // Build data rows using only exportable columns
    const exportRows = filteredProperties.map((property, idx) => {
      const row = { 'S.No': idx + 1 };
      EXPORT_COLUMNS.forEach(col => {
        row[col.header] = getPropertyValue(property, col.key);
      });
      return row;
    });

    // Validate data
    const exportHeaders = ['S.No', ...EXPORT_COLUMNS.map(col => col.header)];
    if (!validateExportData(exportHeaders, exportRows)) {
      alert('Export validation failed. Check console for details.');
      return;
    }

    // Create Excel workbook
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    
    // Set column widths for better readability
    const columnWidths = exportHeaders.map(header => ({
      wch: Math.min(header.length + 5, 30)
    }));
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Properties');
    
    const filename = `Properties_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, filename);
    
    console.log(`Excel file exported: ${filename} with ${exportRows.length} rows`);
  };

const filteredProperties = properties.filter((property) => {
  const matchesrentId = String(property.rentId || '')
    .toLowerCase()
    .includes(filters.rentId.toLowerCase());

  const matchesPhone = String(property.phoneNumber || '')
    .includes(filters.phoneNumber);
  
  // Use statusProperties for filtering
  const matchesStatus = !filters.status || 
    statusProperties[property.rentId] === filters.status;

  const createdAt = new Date(property.createdAt);
  const from = filters.fromDate ? new Date(filters.fromDate) : null;
  const end = filters.endDate ? new Date(filters.endDate) : null;

  const matchesDate = (!from || createdAt >= from) && (!end || createdAt <= end);

  return matchesrentId && matchesPhone && matchesDate && matchesStatus;
});


  const handleFeatureStatusChange = async (rentId, currentStatus) => {
    const newStatus = currentStatus === "yes" ? "no" : "yes"; // Toggle status
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/update-feature-status`, {
        rentId,
        featureStatus: newStatus,
      });

      setProperties((prevProperties) =>
        prevProperties.map((property) =>
          property.rentId === rentId ? { ...property, featureStatus: newStatus } : property
        )
      );
    } catch (error) {
    }
  };

 
  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all properties?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/delete-all-properties`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
        if (response.ok) {
          setMessage(data.message); // optional: show a success message
          // Optionally refresh property list here
        } else {
          setMessage(data.message || 'Failed to delete properties.');
        }
      } catch (error) {
        setMessage('Server error while deleting properties.');
      }
    }
  };
  
  

  useEffect(() => {
    const storedStatusProperties = localStorage.getItem("statusProperties");
    if (storedStatusProperties) {
      setStatusProperties(JSON.parse(storedStatusProperties));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("statusProperties", JSON.stringify(statusProperties));
  }, [statusProperties]);



 

const handleStatusChange = async (rentId, currentStatus) => {
  const newStatus = currentStatus === "active" ? "pending" : "active";

  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/update-property-status`, {
      rentId,
      status: newStatus,
    });

    // Update both statusProperties and the property in the main state
    setStatusProperties(prev => ({
      ...prev,
      [rentId]: newStatus
    }));

    setProperties(prev => prev.map(prop => 
      prop.rentId === rentId ? { ...prop, status: newStatus } : prop
    ));

  } catch (error) {
    console.error("Error updating status:", error);
    alert("Failed to update status.");
  }
};

const handleDelete = async (rentId, phoneNumber) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this property?");
  if (!isConfirmed) return;

  const deletionReason = prompt("Please provide a reason for deletion:");
  if (deletionReason === null) return;
  if (deletionReason.trim() === "") {
    alert("Deletion reason cannot be empty");
    return;
  }

  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/delete-datas`, 
      { 
        deletionReason: deletionReason.trim(),
        deletionDate: new Date()
      },
      {
        params: { rentId, phoneNumber }
      }
    );

    if (response.status === 200) {
      // Store previous status
      setPreviousStatuses(prev => ({
        ...prev,
        [rentId]: statusProperties[rentId]
      }));

      // Update status to 'delete'
      setStatusProperties(prev => ({
        ...prev,
        [rentId]: "delete"
      }));

      // Also update the property in the main state
      setProperties(prev => prev.map(prop => 
        prop.rentId === rentId 
          ? { 
              ...prop, 
              status: "delete",
              deletionReason: deletionReason.trim(),
              deletionDate: new Date()
            } 
          : prop
      ));

      alert("Property marked as deleted successfully!");
    }
  } catch (error) {
    alert("Failed to delete property.");
  }
};

  const handleActivateAll = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/activate-all-properties`);
      
      if (response.status === 200) {
        // Update all local statuses to 'active'
        const updatedStatuses = { ...statusProperties };
        Object.keys(updatedStatuses).forEach(rentId => {
          updatedStatuses[rentId] = "active";
        });
        setStatusProperties(updatedStatuses);
  
        alert("All properties activated successfully!");
      } else {
        alert("Failed to activate all properties.");
      }
    } catch (error) {
      alert("An error occurred while activating all properties.");
    }
  };
  
  
  // **Handle Undo Functionality**
  const handleUndo = async (rentId) => {
    const restoredStatus = previousStatuses[rentId] || "active"; // Restore previous status or default to 'active'

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/update-property-status`, {
        rentId,
        status: restoredStatus,
      });

      setStatusProperties((prev) => ({
        ...prev,
        [rentId]: restoredStatus,
      }));

      // Remove previous status tracking
      setPreviousStatuses((prev) => {
        const updated = { ...prev };
        delete updated[rentId];
        return updated;
      });
    } catch (error) {
      alert("Failed to undo delete.");
    }
  };
 


  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  
  const adminName = reduxAdminName || localStorage.getItem("adminName");

     // Sync Redux to localStorage
   useEffect(() => {
     if (reduxAdminName) localStorage.setItem("adminName", reduxAdminName);
     if (reduxAdminRole) localStorage.setItem("adminRole", reduxAdminRole);
   }, [reduxAdminName, reduxAdminRole]);
   

  const handlePermanentDelete = async (rentId) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this record?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/delete-rentId-data?rentId=${rentId}`,
        {
          data: { deletedBy: adminName },
        }
      );

      if (response.status === 200) {
        alert("User permanently deleted successfully!");

        setProperties((prev) => prev.filter((property) => property.rentId !== rentId));

        const updatedStatus = { ...statusProperties };
        delete updatedStatus[rentId];
        setStatusProperties(updatedStatus);
        localStorage.setItem("statusProperties", JSON.stringify(updatedStatus));
      } else {
        alert(response.data.message || "Failed to delete user.");
      }
    } catch (error) {
      alert("An error occurred while deleting.");
      console.error(error);
    }
  };

  

  
  
  

  return (
    <Container fluid className="p-3">
      <Helmet>
        <title>Rental Property | Properties</title>
      </Helmet>

      <Row className="mb-3">
 

<div className="col-md-6">
  <label className="form-label">Upload Excel File:</label>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      border: "2px dashed rgba(10, 90, 129, 0.72)",
      padding: "15px",
      borderRadius: "10px",
      backgroundColor: "#CCFFFF",
      cursor: "pointer",
      justifyContent: "center",
      flexDirection: "column",
      textAlign: "center",
    }}
    onClick={() => document.getElementById("excelFile").click()}  // Triggers file input
    aria-label="Click to upload Excel file"
  >
    <i
      className="bi bi-file-earmark-arrow-up"
      style={{ fontSize: "2rem", color: "#007bff" }}
    ></i>
    <span style={{ fontSize: "1rem", color: "#333" }}>Click to upload Excel file</span>
    
    {/* Hidden file input */}
    <input
      type="file"
      id="excelFile"
      accept=".xlsx, .xls"
      onChange={handleExcelChange}  // Handle file change
      style={{ display: "none" }}  // Hide the default file input
    />
  </div>
</div>

{/* Upload Button */}
<div className="col-md-12 d-flex align-items-end gap-2">
  <button className="btn mt-1 btn-success" onClick={handleExcelUpload}>
    Upload Excel
  </button>
  <button className="btn mt-1 btn-primary" onClick={handleActivateAll}>
    Activate All
  </button>
  <button className="btn mt-1 btn-danger" onClick={handleDeleteAll}>
    Delete All
  </button>
  {message && <div className="alert alert-info mt-3 mb-0">{message}</div>}
</div>

</Row>

<div  className="d-flex flex-row gap-2 align-items-center flex-nowrap"
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
    placeholder="Filter by Phone Number"
    value={filters.phoneNumber}
    onChange={(e) => setFilters({ ...filters, phoneNumber: e.target.value })}
  />
  <input
    type="date"
    value={filters.fromDate}
    onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
  />
  <input
    type="date"
    value={filters.endDate}
    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
  />
 
 <select
  value={filters.status}
  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
>
  <option value="">All Status</option>
  {statusOptions.map((status) => (
    <option key={status} value={status}>
      {status.charAt(0).toUpperCase() + status.slice(1)} 
    </option>
  ))}
</select>


    <button
    onClick={() => setFilters({
      rentId: '',
      phoneNumber: '',
      fromDate: '',
      endDate: '',
      status: ''
    })}
    style={{ padding: '4px 10px', cursor: 'pointer' , background:'orange'
    }}
  >
    Reset All
  </button>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '15px 0', flexWrap: 'wrap' }}>
  <div style={{ 
    background: '#6c757d', 
    color: 'white', 
    padding: '8px 16px', 
    borderRadius: '4px', 
    fontWeight: 'bold',
    fontSize: '14px'
  }}>
    Total: {properties.length} Records
  </div>
  <div style={{ 
    background: '#007bff', 
    color: 'white', 
    padding: '8px 16px', 
    borderRadius: '4px', 
    fontWeight: 'bold',
    fontSize: '14px'
  }}>
    Showing: {filteredProperties.length} Records
  </div>
  <div style={{ display: 'flex', gap: '10px' }}>
    <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
      Print
    </button>
    <button className="btn btn-secondary mb-3 mt-2 ms-2" style={{background:"#217346"}} onClick={handleExcel}>
      Excel
    </button>
  </div>
</div>

      <h2 className="mb-4 mt-5">User All Properties</h2>
    
              {filteredProperties.length > 0 ? (
         <div ref={tableRef}>      
                 <Table striped bordered hover responsive className="table-sm align-middle">
                               <thead className="sticky-top">
                    <tr>
                      {TABLE_COLUMNS.map((col, idx) => (
                        <th key={idx} className={col.key === 'rentId' || col.key === 'phoneNumber' ? 'sticky-col' : ''}>
                          {col.header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProperties.map((property) => (
                      <tr key={property._id}>
                        {TABLE_COLUMNS.map((col, idx) => {
                          // Handle UI-only columns with special rendering
                          if (col.key === 'image') {
                            return (
                              <td key={idx}>
                                <img
                                  src={getFirstPhotoUrl(property.photos, pic)}
                                  alt="Property"
                                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                />
                              </td>
                            );
                          }
                          
                          if (col.key === 'rentId') {
                            return (
                              <td
                                key={idx}
                                onClick={() =>
                                  navigate(`/dashboard/detail`, {
                                    state: { rentId: property.rentId, phoneNumber: property.phoneNumber },
                                  })
                                }
                                style={{ cursor: "pointer" }}
                                className="sticky-col"
                              >
                                {property.rentId}
                              </td>
                            );
                          }
                          
                          if (col.key === 'phoneNumber') {
                            return (
                              <td
                                key={idx}
                                className={`sticky-col ${
                                  property.otpStatus !== 'verified' || !property.isVerifiedUser ? 'text-danger' : ''
                                }`}
                              >
                                {property.phoneNumber}
                              </td>
                            );
                          }

                          if (col.key === 'featureStatusToggle') {
                            return (
                              <td key={idx}>
                                <Button
                                  variant={property.featureStatus === "yes" ? "danger" : "success"}
                                  size="sm"
                                  onClick={() => handleFeatureStatusChange(property.rentId, property.featureStatus)}
                                >
                                  {property.featureStatus === "yes" ? "Set to No" : "Set to Yes"}
                                </Button>
                              </td>
                            );
                          }

                          if (col.key === 'status') {
                            return (
                              <td key={idx}>
                                {statusProperties[property.rentId] === "delete" ? (
                                  <div>
                                    <span
                                      style={{
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                        backgroundColor: "red",
                                        color: "white",
                                        display: "inline-block",
                                        marginBottom: "5px"
                                      }}
                                    >
                                      Deleted
                                    </span>
                                    <div style={{ fontSize: "0.8rem", color: "#666" }}>
                                      <strong>Reason:</strong> {property.deletionReason || 'No reason provided'}
                                      <br />
                                      <strong>Date:</strong> {property.deletionDate ? new Date(property.deletionDate).toLocaleString() : 'N/A'}
                                    </div>
                                  </div>
                                ) : (
                                  <span
                                    style={{
                                      padding: "5px 10px",
                                      borderRadius: "5px",
                                      backgroundColor: statusProperties[property.rentId] === "active" 
                                        ? "green" 
                                        : statusProperties[property.rentId] === "pending"
                                          ? "orange"
                                          : "#6c757d",
                                      color: "white",
                                    }}
                                  >
                                    {statusProperties[property.rentId] 
                                      ? statusProperties[property.rentId].charAt(0).toUpperCase() + statusProperties[property.rentId].slice(1)
                                      : "Pending"}
                                  </span>
                                )}
                              </td>
                            );
                          }

                          if (col.key === 'actions') {
                            return (
                              <td key={idx}>
                                {statusProperties[property.rentId] === "delete" ? (
                                  <Button variant="secondary" size="sm" onClick={() => handleUndo(property.rentId)}>
                                    Undo
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      variant="info"
                                      size="sm"
                                      className="ms-2"
                                      onClick={() =>
                                        navigate(`/dashboard/edit-property`, {
                                          state: { rentId: property.rentId, phoneNumber: property.phoneNumber },
                                        })
                                      }
                                    >
                                      <FaEdit />
                                    </Button>

                                    <Button
                                      variant="danger"
                                      size="sm"
                                      className="ms-2 mt-2"
                                      onClick={() => handleDelete(property.rentId, property.phoneNumber)}
                                    >
                                      <MdDeleteForever />
                                    </Button>
                                  </>
                                )}
                              </td>
                            );
                          }

                          if (col.key === 'activeOrPending') {
                            return (
                              <td key={idx}>
                                <Button
                                  variant="warning"
                                  size="sm"
                                  onClick={() =>
                                    handleStatusChange(property.rentId, statusProperties[property.rentId] || "pending")
                                  }
                                >
                                  {statusProperties[property.rentId] === "active" ? "Pending" : "Active"}
                                </Button>
                              </td>
                            );
                          }

                          if (col.key === 'permanentDelete') {
                            return (
                              <td key={idx}>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handlePermanentDelete(property.rentId)}
                                >
                                  <MdDeleteForever /> Permanent
                                </Button>
                              </td>
                            );
                          }

                          // For data columns, use the generic data extraction
                          return (
                            <td key={idx}>
                              {getPropertyValue(property, col.key)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </Table>
                </div> 
              ) : (
                <p>Loading properties...</p>
              )}
        
    </Container>
  );
};

export default AddPropertyList;
