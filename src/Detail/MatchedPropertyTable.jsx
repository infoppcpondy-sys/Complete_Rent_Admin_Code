







import React, { useState, useEffect, useRef } from 'react';
import { Table, Badge, Button, Spinner } from 'react-bootstrap';
import { 
  FaPhone, FaMapMarkerAlt, FaMoneyBillWave, FaHome, 
  FaUser, FaCalendarAlt, FaTrash, FaUndo, FaInfoCircle,
  FaIdBadge, FaUserTag, FaFilePdf,
  FaFileExcel
} from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import * as XLSX from "xlsx";
import { useNavigate } from 'react-router-dom';



// ===== CENTRALIZED COLUMN CONFIGURATION =====
const TABLE_COLUMNS = [
  { key: 'rentId', header: 'Rent ID', exportable: true },
  { key: 'postedBy', header: 'Posted By', exportable: true },
  { key: 'contact', header: 'Contact', exportable: true },
  { key: 'rentalAmount', header: 'Rental Amount', exportable: true },
  { key: 'location', header: 'Location', exportable: true },
  { key: 'type', header: 'Type', exportable: true },
  { key: 'facing', header: 'Facing', exportable: true },
  { key: 'bedrooms', header: 'Bedrooms', exportable: true },
  { key: 'area', header: 'Area', exportable: true },
  { key: 'postedOn', header: 'Posted On', exportable: true },
  { key: 'raId', header: 'RA_ID', exportable: true },
  { key: 'raName', header: 'RA_NAME', exportable: true },
  { key: 'raPhone', header: 'RA PHONE', exportable: true },
  { key: 'raArea', header: 'RA AREA', exportable: true },
  { key: 'raCity', header: 'RA CITY', exportable: true },
  { key: 'status', header: 'Status', exportable: true },
  { key: 'whatsappStatus', header: 'Whatsapp Status', exportable: true },
  { key: 'actions', header: 'Action', exportable: false },
  { key: 'viewDetails', header: 'View Details', exportable: false },
];

const EXPORT_COLUMNS = TABLE_COLUMNS.filter(col => col.exportable);


const MatchedDataTable = () => {
  const [matchedData, setMatchedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchBaId, setSearchBaId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState(null);
  const [filters, setFilters] = useState({
    propertyId: '',
    raId: '',
    startDate: '',
    endDate: '',
    ownerPhoneNumber: '',
    raPhoneNumber: ''
  });
  const navigate = useNavigate();
  const tableRef = useRef();

  // Format price with Indian rupee symbol and commas
  const formatPrice = (rentalAmount) => {
    return rentalAmount ? `₹${new Intl.NumberFormat('en-IN').format(rentalAmount)}` : '-';
  };

  // Format date
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-IN') : '-';
  };

  // ===== HELPER FUNCTION: Extract data from matched property based on column key =====
  const getPropertyValue = (item, property, columnKey, index) => {
    switch (columnKey) {
      case 'rentId':
        return property.rentId || '-';
      case 'postedBy':
        return property.postedBy || '-';
      case 'contact':
        return property.postedByUser || '-';
      case 'rentalAmount':
        return property.rentalAmount || '-';
      case 'location':
        return `${property.city || '-'} / ${property.area || '-'}`;
      case 'type':
        return property.propertyType || '-';
      case 'facing':
        return property.facing || '-';
      case 'bedrooms':
        return property.bedrooms || '-';
      case 'area':
        return property.totalArea ? `${property.totalArea} ${property.areaUnit || ''}` : '-';
      case 'postedOn':
        return property.createdAt ? formatDate(property.createdAt) : '-';
      case 'raId':
        return item.buyerAssistanceCard?.Ra_Id || 'N/A';
      case 'raName':
        return item.buyerAssistanceCard?.name || 'N/A';
      case 'raPhone':
        return item.buyerAssistanceCard?.phoneNumber || 'N/A';
      case 'raArea':
        return item.buyerAssistanceCard?.area || 'N/A';
      case 'raCity':
        return item.buyerAssistanceCard?.city || 'N/A';
      case 'status':
        return property.isDeleted ? 'Deleted' : 'Active';
      case 'whatsappStatus':
        return property.Whatsappstatus || '-';
      default:
        return '';
    }
  };

  // ===== HELPER FUNCTION: Validate export data =====
  const validateExportData = (headers, rows) => {
    console.log('Validation Debug Info:');
    console.log('Headers:', headers);
    console.log('Headers length:', headers.length);
    console.log('Rows length:', rows.length);
    if (rows.length > 0) {
      console.log('First row:', rows[0]);
      console.log('First row keys:', Object.keys(rows[0]));
      console.log('First row keys length:', Object.keys(rows[0]).length);
    }

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
        console.warn('Row data:', rows[i]);
        return false;
      }
    }
    console.log(`Export validation passed: ${headers.length} columns, ${rows.length} rows`);
    return true;
  };

 const handleSoftDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this request?")) return;

  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/delete-buyer-assistance-rent/${id}`);
    setMessage("Tentant Assistance request deleted successfully.");

    setMatchedData((prevData) =>
      prevData.map((item) =>
        item.buyerAssistanceCard._id === id
          ? {
              ...item,
              buyerAssistanceCard: { ...item.buyerAssistanceCard, isDeleted: true },
              matchedProperties: item.matchedProperties.map(prop => ({
                ...prop,
                isDeleted: true,
              })),
            }
          : item
      )
    );
  } catch (error) {
    setMessage("Error deleting Tentant Assistance.");
  }
};

 

const handleUndoDelete = async (id) => {
  if (!window.confirm("Are you sure you want to restore this request?")) return;

  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/undo-delete-buyer-assistance-rent/${id}`);
    setMessage("Tentant Assistance request restored successfully.");

    setMatchedData((prevData) =>
      prevData.map((item) =>
        item.buyerAssistanceCard._id === id
          ? {
              ...item,
              buyerAssistanceCard: { ...item.buyerAssistanceCard, isDeleted: false },
              matchedProperties: item.matchedProperties.map(prop => ({
                ...prop,
                isDeleted: false,
              })),
            }
          : item
      )
    );
  } catch (error) {
    setMessage("Error restoring Tentant Assistance.");
  }
};

const handleRestoreAllDeleted = async () => {
  if (!window.confirm("Are you sure you want to restore ALL deleted requests? This action cannot be undone.")) {
    return;
  }

  try {
    setLoading(true);
    
    // Get all deleted records from current data
    const deletedRecords = matchedData
      .filter(item => item.buyerAssistanceCard?.isDeleted === true)
      .map(item => item.buyerAssistanceCard._id);
    
    if (deletedRecords.length === 0) {
      setMessage("No deleted records found to restore.");
      setLoading(false);
      return;
    }

    // Restore each deleted record
    let restoredCount = 0;
    for (const id of deletedRecords) {
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/undo-delete-buyer-assistance-rent/${id}`);
        restoredCount++;
      } catch (error) {
        console.error(`Failed to restore record ${id}:`, error);
      }
    }

    setMessage(`Successfully restored ${restoredCount} deleted request(s)`);
    fetchMatchedData();
  } catch (error) {
    console.error("Error restoring deleted records:", error);
    setMessage("Error restoring deleted records");
  } finally {
    setLoading(false);
  }
};

      
  
  
  useEffect(() => {
    fetchMatchedData();
    
    // Set up polling interval to refresh data every 15 seconds for real-time count updates
    const refreshInterval = setInterval(() => {
      fetchMatchedData();
    }, 15000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchMatchedData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-matched-datas-rent`);
      if (res.data.success) {
        setMatchedData(res.data.data);
        setFilteredData(res.data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
const applyFilters = () => {
  return filteredData.map(item => {
    const matched = item.matchedProperties.filter(property => {
      // Check Rent ID (fixed: was propertyId, should be rentId)
      const matchesId = filters.propertyId
        ? (property.rentId && property.rentId.toString().toLowerCase().includes(filters.propertyId.toLowerCase()))
        : true;

      // Check RA_ID
      const matchesRaId = filters.raId
        ? (item.buyerAssistanceCard?.Ra_Id && item.buyerAssistanceCard.Ra_Id.toString().toLowerCase().includes(filters.raId.toLowerCase()))
        : true;

      // Check Owner Phone Number (Contact)
      const matchesOwnerPhone = filters.ownerPhoneNumber
        ? (property.postedByUser && property.postedByUser.toString().toLowerCase().includes(filters.ownerPhoneNumber.toLowerCase()))
        : true;

      // Check RA Phone Number (Tenant Phone)
      const matchesRaPhone = filters.raPhoneNumber
        ? (item.buyerAssistanceCard?.phoneNumber && item.buyerAssistanceCard.phoneNumber.toString().toLowerCase().includes(filters.raPhoneNumber.toLowerCase()))
        : true;

      // Check date range with proper time handling
      const createdDate = new Date(property.createdAt);
      const startMatch = filters.startDate ? createdDate >= new Date(filters.startDate + 'T00:00:00') : true;
      const endMatch = filters.endDate ? createdDate <= new Date(filters.endDate + 'T23:59:59') : true;

      return matchesId && matchesRaId && matchesOwnerPhone && matchesRaPhone && startMatch && endMatch;
    });

    return { ...item, matchedProperties: matched };
  }).filter(item => item.matchedProperties.length > 0);
};

// ===== HELPER FUNCTION: Calculate total matched properties count =====
const getTotalMatchedPropertiesCount = () => {
  return matchedData.reduce((total, item) => total + (item.matchedProperties?.length || 0), 0);
};

// ===== HELPER FUNCTION: Calculate filtered matched properties count =====
const getFilteredMatchedPropertiesCount = () => {
  const filtered = applyFilters();
  return filtered.reduce((total, item) => total + (item.matchedProperties?.length || 0), 0);
};


const handleResetFilters = () => {
  setFilters({ propertyId: '', raId: '', startDate: '', endDate: '', ownerPhoneNumber: '', raPhoneNumber: '' });
};

// ===== FLATTEN MATCHED DATA FOR EXPORT =====
const getFlattenedData = () => {
  const flattened = [];
  const filtered = applyFilters();
  filtered.forEach((item) => {
    item.matchedProperties.forEach((property) => {
      flattened.push({ item, property });
    });
  });
  return flattened;
};

// ===== PRINT FUNCTION: Generate PDF with RENT PONDY heading =====
const handlePrint = () => {
  const flattenedData = getFlattenedData();
  
  if (flattenedData.length === 0) {
    alert('No data to print. Please adjust filters.');
    return;
  }

  // Build header row using exportable columns
  const exportHeaders = EXPORT_COLUMNS.map(col => col.header);
  
  // Build data rows using exportable columns
  const exportRows = flattenedData.map(({ item, property }, idx) => {
    const row = {};
    EXPORT_COLUMNS.forEach(col => {
      row[col.header] = getPropertyValue(item, property, col.key, idx);
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
        <title>Matched Property Print - ${new Date().toLocaleString()}</title>
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
        <h2>Matched Property Export - ${new Date().toLocaleString()}</h2>
        <p>Total Records: ${exportRows.length}</p>
        ${tableHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
};

// ===== EXCEL DOWNLOAD FUNCTION: Uses filtered data with proper column mapping =====
const downloadExcel = () => {
  const flattenedData = getFlattenedData();
  
  if (flattenedData.length === 0) {
    alert('No data to export. Please adjust filters.');
    return;
  }

  console.log('Starting Excel export...');
  console.log('EXPORT_COLUMNS:', EXPORT_COLUMNS);
  console.log('Flattened data count:', flattenedData.length);

  // Build data rows using only exportable columns
  const exportRows = flattenedData.map(({ item, property }, idx) => {
    const row = {};
    EXPORT_COLUMNS.forEach(col => {
      const value = getPropertyValue(item, property, col.key, idx);
      row[col.header] = value;
    });
    return row;
  });

  // Log sample data for debugging
  if (exportRows.length > 0) {
    console.log('First row keys:', Object.keys(exportRows[0]));
    console.log('First row sample:', exportRows[0]);
  }

  // Validate data
  const exportHeaders = EXPORT_COLUMNS.map(col => col.header);
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
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Matched Properties');
  
  const filename = `MatchedProperties_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, filename);
  
  console.log(`Excel file exported: ${filename} with ${exportRows.length} rows`);
};

// ===== DOWNLOAD PDF FUNCTION: Uses filtered data =====
const handlePrintPDF = () => {
  const flattenedData = getFlattenedData();
  
  if (flattenedData.length === 0) {
    alert('No data to export. Please adjust filters.');
    return;
  }

  // Build header row using exportable columns
  const exportHeaders = EXPORT_COLUMNS.map(col => col.header);
  
  // Build data rows using exportable columns
  const exportRows = flattenedData.map(({ item, property }, idx) => {
    const row = {};
    EXPORT_COLUMNS.forEach(col => {
      row[col.header] = getPropertyValue(item, property, col.key, idx);
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

  // Create PDF using HTML2PDF-style approach (simple print to PDF)
  const pdfWindow = window.open("", "", "width=1400,height=900");
  pdfWindow.document.write(`
    <html>
      <head>
        <title>Matched Property PDF - ${new Date().toLocaleString()}</title>
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
        <h2>Matched Property PDF Export - ${new Date().toLocaleString()}</h2>
        <p>Total Records: ${exportRows.length}</p>
        ${tableHTML}
      </body>
    </html>
  `);
  pdfWindow.document.close();
  setTimeout(() => {
    pdfWindow.print();
  }, 500);
};



  

  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");


 


  return (
    <div className="container mt-4">
      <h2 className="mb-3">Matched Tentant Requests & Properties</h2>
      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      <div className="mb-4 p-3 border rounded" style={{
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#fff'
      }}>
        <div className="d-flex flex-row gap-2 align-items-center flex-wrap">
          <div className="mb-0">
            <label className="form-label fw-bold" style={{marginBottom: '5px'}}>Search Owner RENT ID</label>
            <input
              type="text"
              placeholder="Enter RENT ID"
              value={filters.propertyId}
              onChange={e => setFilters({ ...filters, propertyId: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="mb-0">
            <label className="form-label fw-bold" style={{marginBottom: '5px'}}>Search Tenant ID</label>
            <input
              type="text"
              placeholder="Enter Tenant ID"
              value={filters.raId}
              onChange={e => setFilters({ ...filters, raId: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="mb-0">
            <label className="form-label fw-bold" style={{marginBottom: '5px'}}>Owner Phone Number</label>
            <input
              type="text"
              placeholder="Enter Owner Phone"
              value={filters.ownerPhoneNumber}
              onChange={e => setFilters({ ...filters, ownerPhoneNumber: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="mb-0">
            <label className="form-label fw-bold" style={{marginBottom: '5px'}}>Tenant Phone Number</label>
            <input
              type="text"
              placeholder="Enter Tenant Phone"
              value={filters.raPhoneNumber}
              onChange={e => setFilters({ ...filters, raPhoneNumber: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="mb-0">
            <label className="form-label fw-bold" style={{marginBottom: '5px'}}>From Date</label>
            <input
              type="date"
              placeholder="dd-mm-yyyy"
              value={filters.startDate}
              onChange={e => setFilters({ ...filters, startDate: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="mb-0">
            <label className="form-label fw-bold" style={{marginBottom: '5px'}}>End Date</label>
            <input
              type="date"
              placeholder="dd-mm-yyyy"
              value={filters.endDate}
              onChange={e => setFilters({ ...filters, endDate: e.target.value })}
              className="form-control"
            />
          </div>

          <button onClick={handleResetFilters} className="btn btn-primary" style={{marginTop: '20px'}}>
            Reset All
          </button>
        </div>
      </div>

      

      
  <div className='mb-4'>
    <div className="d-flex justify-content-start mb-3 gap-2 align-items-center flex-wrap">
      <div style={{ 
        background: '#6c757d', 
        color: 'white', 
        padding: '8px 16px', 
        borderRadius: '4px', 
        fontWeight: 'bold',
        fontSize: '14px'
      }}>
        Total: {getTotalMatchedPropertiesCount()} Records
      </div>
      <div style={{ 
        background: '#007bff', 
        color: 'white', 
        padding: '8px 16px', 
        borderRadius: '4px', 
        fontWeight: 'bold',
        fontSize: '14px'
      }}>
        Showing: {getFilteredMatchedPropertiesCount()} Records
      </div>
      <button className="btn btn-danger" style={{width: '110px', fontSize: '15px', padding: '6px 10px'}} onClick={handlePrint}>Print</button>
      <button className="btn btn-success" style={{width: '110px', fontSize: '15px', padding: '6px 10px'}} onClick={downloadExcel}>Download Excel</button>
      <button className="btn btn-warning" style={{width: '110px', fontSize: '15px', padding: '6px 10px'}} onClick={handlePrintPDF}>Download PDF</button>
      <button className="btn btn-info" style={{width: '180px', fontSize: '15px', padding: '6px 10px'}} onClick={handleRestoreAllDeleted}>Restore All Deleted</button>
    </div>
  </div>
    

      <div className="table-responsive">
        <h3>Get Matched Property Datas</h3>
    <Table striped bordered hover responsive className="table-sm align-middle">
    <thead className="sticky-top">
            <tr>
              <th><FaIdBadge className="me-1" /> Rent ID</th>
              <th><FaUser className="me-1" /> Posted By</th>
              <th><FaPhone className="me-1" /> Owner Contact</th>
              <th><FaMoneyBillWave className="me-1" /> Rental Amount</th>
              <th><FaMapMarkerAlt className="me-1" /> Location</th>
              <th><FaHome className="me-1" /> Type</th>
              <th>Facing</th>
              <th>Bedrooms</th>
              <th>Area</th>
              <th><FaCalendarAlt className="me-1" /> Posted On</th>
              <th><FaIdBadge className="me-1" /> Tenant ID</th>
              <th><FaUserTag className="me-1" /> Posted by</th>
              <th><FaPhone className="me-1" /> Tenant Contact</th>
              <th><FaMapMarkerAlt className="me-1" /> Tenant Area</th>
              <th><FaMapMarkerAlt className="me-1" /> Tenant City</th>
              <th>Status</th>
              <th>Whatsapp Status</th>
              <th>Action</th>
               <th>Views Details</th>
            </tr>
          </thead>
          <tbody>
{applyFilters().map((item, index) => (
              item.matchedProperties.map((property, idx) => (
                <tr key={`${index}-${idx}`}>
                  <td>{property.rentId || '-'}</td>
                  <td>{property.postedBy || '-'}</td>
                  <td>{property.postedByUser || '-'}</td>
                  <td className="text-nowrap">{formatPrice(property.rentalAmount)}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <FaMapMarkerAlt className="text-muted me-1" />
                      {property.city || '-'} / {property.area || '-'}
                    </div>
                  </td>
                  <td>{property.propertyType || '-'}</td>
                  <td>{property.facing || '-'}</td>
                  <td>{property.bedrooms || '-'}</td>
                  <td>
                    {property.totalArea ? (
                      <span className="text-nowrap">
                        {property.totalArea} {property.areaUnit || ''}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="text-nowrap">
                    <FaCalendarAlt className="text-muted me-1" />
                    {formatDate(property.createdAt)}
                  </td>
                  <td>
                    <Badge bg="secondary">
                      {item.buyerAssistanceCard.Ra_Id || 'N/A'}
                    </Badge>
                  </td>
                  <td>{item.buyerAssistanceCard.name || 'N/A'}</td>
                  <td>
                    <a href={`tel:${item.buyerAssistanceCard.phoneNumber}`}>
                      {item.buyerAssistanceCard.phoneNumber || 'N/A'}
                    </a>
                  </td>
                  <td>{item.buyerAssistanceCard.area || 'N/A'}</td>
                  <td>{item.buyerAssistanceCard.city || 'N/A'}</td>
                  <td>
                    {property.isDeleted ? (
                      <Badge bg="danger" className="d-flex align-items-center">
                        <FaTrash className="me-1" /> Deleted
                      </Badge>
                    ) : (
                      <Badge bg="success" className="d-flex align-items-center">
                        <FaInfoCircle className="me-1" /> Active
                      </Badge>
                    )}
                  </td>
                  <td>
                    {property.Whatsappstatus ? (
                      <Badge bg="info">{property.Whatsappstatus}</Badge>
                    ) : (
                      <span>Not Send</span>
                    )}
                  </td>
    

{item?.buyerAssistanceCard && (
  <td>
    {!item.buyerAssistanceCard.isDeleted ? (
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => handleSoftDelete(item.buyerAssistanceCard._id)}
        className="d-flex align-items-center"
      >
        <FaTrash className="me-1" /> Delete
      </Button>
    ) : (
      <Button
        variant="outline-primary"
        size="sm"
        onClick={() => handleUndoDelete(item.buyerAssistanceCard._id)}
        className="d-flex align-items-center"
      >
        <FaUndo className="me-1" /> Restore
      </Button>
    )}
  </td>
)}


                           <td>
                                            <Button
                                              variant=""
                                              size="sm"
                                              style={{backgroundColor:"#0d94c1",color:"white"}}
                                              onClick={() =>
                                                navigate(`/dashboard/detail`, {
                                                  state: { rentId: property.rentId, phoneNumber: property.phoneNumber },
                                                })
                                              }
                                            >
                                              View Details
                                            </Button>
                                          </td>
                </tr>
              ))
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default MatchedDataTable;