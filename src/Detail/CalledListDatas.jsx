


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table , Pagination, Button} from 'react-bootstrap';
import { MdDeleteForever, MdUndo } from 'react-icons/md';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

// ===== CENTRALIZED COLUMN CONFIGURATION =====
const TABLE_COLUMNS = [
  { key: 'sNo', header: 'S.No', exportable: true },
  { key: 'rentId', header: 'RENT ID', exportable: true },
  { key: 'contactedAt', header: 'contactedAt', exportable: true },
  { key: 'userPhone', header: 'userPhone', exportable: true },
  { key: 'postedUserPhone', header: 'postedUserPhone', exportable: true },
  { key: 'createdAt', header: 'Created At', exportable: true },
  { key: 'updatedAt', header: 'Updated At', exportable: true },
  { key: 'views', header: 'views', exportable: true },
  { key: 'actions', header: 'Actions', exportable: false },
];

const EXPORT_COLUMNS = TABLE_COLUMNS.filter(col => col.exportable);


const CalledListDatas = () => {
    const [contactRequestsData, setContactRequestsData] = useState([]);
    const [propertiesData, setPropertiesData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [endDate, setEndDate] = useState("");
      const navigate = useNavigate();
    
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 30;

    
  useEffect(() => {
    fetchAllContactSentProperties();
    
    // Set up polling interval to refresh data every 15 seconds for real-time count updates
    const refreshInterval = setInterval(() => {
      fetchAllContactSentProperties();
    }, 15000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchAllContactSentProperties = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/get-all-contact-sent-properties`
      );

      if (res.data.success) {
        setContactRequestsData(res.data.properties);
        // setMessage(res.data.message);
      } else {
        // setMessage("No data found");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    //   setMessage("Server error while fetching contact sent properties");
    } finally {
      setLoading(false);
    }
  };
    const tableRef = useRef();

  // ===== HELPER FUNCTION: Extract data from item based on column key =====
  const getItemValue = (item, columnKey, index) => {
    switch (columnKey) {
      case 'sNo':
        return index + 1;
      case 'rentId':
        return item.rentId || '';
      case 'contactedAt':
        return item.contactedAt ? new Date(item.contactedAt).toLocaleString() : 'N/A';
      case 'userPhone':
        return item.userPhone || '';
      case 'postedUserPhone':
        return item.postedUserPhone || '';
      case 'createdAt':
        return item.property?.createdAt ? new Date(item.property.createdAt).toLocaleString() : 'N/A';
      case 'updatedAt':
        return item.property?.updatedAt ? new Date(item.property.updatedAt).toLocaleString() : 'N/A';
      case 'views':
        return item.property?.views || 0;
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

  // ===== FIXED PRINT FUNCTION: Uses filtered data with proper column alignment =====
  const handlePrint = () => {
    // Validate we have data to export
    if (filteredData.length === 0) {
      alert('No data to print. Please adjust filters.');
      return;
    }

    // Build header row using exportable columns
    const exportHeaders = EXPORT_COLUMNS.map(col => col.header);
    
    // Build data rows using exportable columns
    const exportRows = filteredData.map((item, idx) => {
      const row = {};
      EXPORT_COLUMNS.forEach(col => {
        row[col.header] = getItemValue(item, col.key, idx);
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
          <title>Called List Print - ${new Date().toLocaleString()}</title>
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
          <h2>Called List Export - ${new Date().toLocaleString()}</h2>
          <p>Total Records: ${exportRows.length}</p>
          ${tableHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  // ===== FIXED EXCEL FUNCTION: Uses filtered data with proper column mapping =====
  const downloadExcel = () => {
    // Validate we have data to export
    if (filteredData.length === 0) {
      alert('No data to export. Please adjust filters.');
      return;
    }

    console.log('Starting Excel export...');
    console.log('EXPORT_COLUMNS:', EXPORT_COLUMNS);
    console.log('Filtered data count:', filteredData.length);

    // Build data rows using only exportable columns
    const exportRows = filteredData.map((item, idx) => {
      const row = {};
      EXPORT_COLUMNS.forEach(col => {
        const value = getItemValue(item, col.key, idx);
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Called List');
    
    const filename = `CalledList_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, filename);
    
    console.log(`Excel file exported: ${filename} with ${exportRows.length} rows`);
  };

  // ===== DOWNLOAD PDF FUNCTION: Uses filtered data =====
  const handlePrintPDF = () => {
    // Validate we have data to export
    if (filteredData.length === 0) {
      alert('No data to export. Please adjust filters.');
      return;
    }

    // Build header row using exportable columns
    const exportHeaders = EXPORT_COLUMNS.map(col => col.header);
    
    // Build data rows using exportable columns
    const exportRows = filteredData.map((item, idx) => {
      const row = {};
      EXPORT_COLUMNS.forEach(col => {
        row[col.header] = getItemValue(item, col.key, idx);
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
          <title>Called List PDF - ${new Date().toLocaleString()}</title>
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
          <h2>Called List PDF Export - ${new Date().toLocaleString()}</h2>
          <p>Total Records: ${exportRows.length}</p>
          ${tableHTML}
        </body>
      </html>
    `);
    pdfWindow.document.close();
    setTimeout(() => {
      pdfWindow.print();
      // Optional: close the window after printing
      // pdfWindow.close();
    }, 500);
  };

const filterData = (data) => {
  return data.filter(item => {
    // Parse dates properly for comparison
    const contactedAtTime = item.contactedAt ? new Date(item.contactedAt).getTime() : null;
    const fromTime = fromDate ? new Date(fromDate + 'T00:00:00').getTime() : null;
    const toTime = endDate ? new Date(endDate + 'T23:59:59').getTime() : null;

    // Check RENT ID search (fixed: was RENTId, should be rentId)
    const matchesSearch = search
      ? String(item.rentId || '').toLowerCase().includes(search.toLowerCase())
      : true;

    // Check date range
    const matchesStartDate = fromTime ? (contactedAtTime >= fromTime) : true;
    const matchesEndDate = toTime ? (contactedAtTime <= toTime) : true;

    return matchesSearch && matchesStartDate && matchesEndDate;
  });
};

const handleReset = () => {
  setSearch('');
  setFromDate('');
  setEndDate('');
};

    // Filter data
const combinedData = contactRequestsData.map(data => ({ ...data, type: 'Owner' }));
const filteredData = filterData(combinedData);  // ← use only as variable
const totalItems = filteredData.length;

const totalPages = Math.ceil(totalItems / itemsPerPage);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentPageData = filteredData.slice(indexOfFirstItem, indexOfLastItem);


 

const handleDelete = async (rentId) => {
  if (window.confirm(`Are you sure you want to delete RENT ID: ${rentId}?`)) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/delete-free-property/${rentId}`, {
        method: 'PUT',
      });
      const data = await response.json();
      alert(data.message);

      // ✅ Refresh from server
      fetchAllContactSentProperties();
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

      // ✅ Refresh from server
      fetchAllContactSentProperties();
    } catch (error) {
      alert('Failed to undo delete.');
    }
  }
};



    
const reduxAdminName = useSelector((state) => state.admin.name);

const adminName = reduxAdminName || localStorage.getItem("adminName");


 
const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  
    return (
        <div className="container mt-5">
            <h2 className="mb-4">Search Contact Requests</h2>

            <form     style={{ 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  backgroundColor: '#fff' 
}}
                onSubmit={(e) => e.preventDefault()}
            className="d-flex flex-row gap-2 align-items-center flex-nowrap"
            >
                <div className="mb-3">
                    <label htmlFor="searchInput" className="form-label fw-bold">Search RENT ID</label>
                    <input
                        type="text"
                        id="searchInput"
                        className="form-control"
                        placeholder="Enter RENT ID"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="fromDate" className="form-label fw-bold">From Date</label>
                    <input
                        type="date"
                        id="fromDate"
                        className="form-control"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="endDate" className="form-label fw-bold">End Date</label>
                    <input
                        type="date"
                        id="endDate"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                                <button className="btn btn-primary" onClick={handleReset}>Reset All</button>

            </form>

            <div className="d-flex justify-content-start mb-3 gap-2 align-items-center flex-wrap">
              <div style={{ 
                background: '#6c757d', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '4px', 
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                Total: {contactRequestsData.length} Records
              </div>
              <div style={{ 
                background: '#007bff', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '4px', 
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                Showing: {filteredData.length} Records
              </div>
              <button className="btn btn-danger" style={{width: '110px', fontSize: '15px', padding: '6px 10px'}} onClick={handlePrint}>Print</button>
              <button className="btn btn-success" style={{width: '110px', fontSize: '15px', padding: '6px 10px'}} onClick={downloadExcel}>Download Excel</button>
              <button className="btn btn-warning" style={{width: '110px', fontSize: '15px', padding: '6px 10px'}} onClick={handlePrintPDF}>Download PDF</button>
            </div>
            {loading ? (
                <p>Loading data...</p>
            ) : (
                <>
                    <h3 className='text-success pb-3 mt-4'>Contact List  Data</h3>
                    {filteredData.length > 0 ? (
                    <>  <div ref={tableRef}>   <Table striped bordered hover responsive className="table-sm align-middle">
                            <thead className="sticky-top">
                                <tr>
                                  {TABLE_COLUMNS.map((col, idx) => (
                                    <th key={idx}>
                                      {col.header}
                                    </th>
                                  ))}
                                </tr>
                            </thead>
                      <tbody>
  {currentPageData.map((data, index) => (
    <tr key={index}>
      {TABLE_COLUMNS.map((col, idx) => {
        if (col.key === 'rentId') {
          return (
            <td
              key={idx}
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/dashboard/detail`, {
                  state: {
                    rentId: data.rentId,
                    phoneNumber: data.postedUserPhone,
                  },
                })
              }
            >
              {data.rentId}
            </td>
          );
        }

        if (col.key === 'actions') {
          return (
            <td key={idx}>
              {!data.property?.isDeleted ? (
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(data.rentId)}
                >
                  <MdDeleteForever size={24} />
                </button>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={() => handleUndoDelete(data.rentId)}
                >
                  <MdUndo size={24} />
                </button>
              )}
            </td>
          );
        }

        return (
          <td key={idx}>
            {getItemValue(data, col.key, index)}
          </td>
        );
      })}
    </tr>
  ))}
</tbody>

                        </Table> </div> 
                                 <Pagination className="justify-content-center mt-3">
                                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <Pagination.Item
                                            key={i + 1}
                                            active={i + 1 === currentPage}
                                            onClick={() => handlePageChange(i + 1)}
                                        >
                                            {i + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                                </Pagination>  
                                 </> 
                    ) : (
                        <p>No contact request owner data found.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default CalledListDatas;
