










import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table , Pagination, Button} from 'react-bootstrap';
import { MdDeleteForever, MdUndo } from 'react-icons/md';
import moment from 'moment';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';


const ContactTables = () => {
    const [contactRequestsData, setContactRequestsData] = useState([]);
    const [propertiesData, setPropertiesData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [endDate, setEndDate] = useState("");
      const navigate = useNavigate();
    
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 30;

    // Fetch all contact request data
    const fetchAllContactData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-all-contact-requests`);
            if (response.status === 200 && response.data.contactRequestsData) {
                setContactRequestsData(response.data.contactRequestsData);
                setPropertiesData(response.data.propertiesData);
            } else {
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllContactData();
    }, []);

    // Filter data
    const filterData = (data) => {
        return data.filter(item => {
            const createdAt = item.createdAt ? new Date(item.createdAt).getTime() : 0;
            const from = fromDate ? new Date(fromDate).getTime() : null;
            const to = endDate ? new Date(endDate).getTime() : null;

            // support different rent id field names
            const rentIdentifier = String(item.rentId || item.RENTId || item.RentId || item.rentID || '').toLowerCase();
            const matchesSearch = search ? rentIdentifier.includes(search.toLowerCase()) : true;
            const matchesStartDate = from ? createdAt >= from : true;
            const matchesEndDate = to ? createdAt <= to : true;

            return matchesSearch && matchesStartDate && matchesEndDate;
        });
    };

const handleReset = () => {
  setSearch('');
  setFromDate('');
  setEndDate('');
};
const combinedData = contactRequestsData.map(data => ({ ...data, type: 'Owner' }));
const filteredData = filterData(combinedData);  // ← use only as variable
const totalItems = filteredData.length;

const totalPages = Math.ceil(totalItems / itemsPerPage);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentPageData = filteredData.slice(indexOfFirstItem, indexOfLastItem);


    // Handle Delete
    const handleDelete = async (rentId) => {
        if (window.confirm(`Are you sure you want to delete RENT ID: ${rentId}?`)) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/delete-free-property/${rentId}`, {
                    method: 'PUT',
                });
                const data = await response.json();
                alert(data.message);
                setContactRequestsData(prev =>
                    prev.map(item =>
                        item.rentId === rentId ? { ...item, isDeleted: true } : item
                    )
                );
            } catch (error) {
                alert('Failed to delete the property.');
            }
        }
    };

    // Handle Undo Delete
    const handleUndoDelete = async (rentId) => {
        if (window.confirm(`Are you sure you want to undo delete for RENT ID: ${rentId}?`)) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/undo-delete-free-property/${rentId}`, {
                    method: 'PUT',
                });
                const data = await response.json();
                alert(data.message);
                setContactRequestsData(prev =>
                    prev.map(item =>
                        item.rentId === rentId ? { ...item, isDeleted: false } : item
                    )
                );
            } catch (error) {
                alert('Failed to undo delete.');
            }
        }
    };

    // Download PDF
const downloadPDF = () => {
    // landscape A4 to better fit columns
    const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'landscape' });
    const marginLeft = 40;
    const marginTop = 40;
    doc.setFontSize(12);
    doc.text('Contact Request Owner Data', marginLeft, marginTop - 8);

    // Use filteredData (matches what user sees after filters)
    const rows = filteredData.map(item => {
        const contacts = (item.contactRequestedUserPhoneNumbers || []).map(r => {
            const phone = r?.phoneNumber || r || '';
            const dateStr = r?.date ? moment(r.date).format('M/D/YYYY, h:mm:ss A') : '';
            // phone on one line, date/time on next line
            return dateStr ? `${phone}\n${dateStr}` : `${phone}`;
        }).join('\n\n'); // separate multiple contacts with a blank line

        return [
            item.rentId || item.RENTId || 'N/A',
            item.postedUserPhoneNumber || 'N/A',
            contacts || 'N/A',
            item.bestTimeToCall || 'N/A',
            item.email || 'Not provided',
            item.views || 0,
            item.createdAt ? moment(item.createdAt).format('M/D/YYYY, h:mm:ss A') : 'N/A',
            item.updatedAt ? moment(item.updatedAt).format('M/D/YYYY, h:mm:ss A') : 'N/A',
        ];
    });

    autoTable(doc, {
        startY: marginTop + 6,
        head: [[
            'Rent ID', 'Posted User Phone Number', 'Contact Requested User Phone Numbers',
            'Best Time to Call', 'Email', 'Views', 'Created At', 'Updated At'
        ]],
        body: rows,
        theme: 'striped',
        tableWidth: 'auto',
        styles: {
            fontSize: 9,
            overflow: 'linebreak',
            cellPadding: 4,
            valign: 'top'
        },
        headStyles: {
            fillColor: [240,240,240],
            textColor: 40,
            halign: 'center'
        },
        columnStyles: {
            2: { cellWidth: 'wrap' }
        },
        pageBreak: 'auto'
    });

    doc.save('ContactRequests.pdf');
};

// Download Excel
const downloadExcel = () => {
    const filtered = filteredData;

    const worksheetData = filtered.map(item => ({
        "RENT ID": item.rentId || item.RENTId || 'N/A',
        "Posted User Phone": item.postedUserPhoneNumber || 'N/A',
        "Contact Requested Users": (item.contactRequestedUserPhoneNumbers || []).map(r => r.phoneNumber || r).join(', '),
        "Best Time to Call": item.bestTimeToCall || 'N/A',
        "Email": item.email || 'N/A',
        "Views": item.views || 0,
        "Created At": item.createdAt ? moment(item.createdAt).format('YYYY-MM-DD HH:mm') : 'N/A',
        "Updated At": item.updatedAt ? moment(item.updatedAt).format('YYYY-MM-DD HH:mm') : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contact Requests");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "ContactRequests.xlsx");
};

    
const reduxAdminName = useSelector((state) => state.admin.name);
const reduxAdminRole = useSelector((state) => state.admin.role);

const adminName = reduxAdminName || localStorage.getItem("adminName");
const adminRole = reduxAdminRole || localStorage.getItem("adminRole");


 const [allowedRoles, setAllowedRoles] = useState([]);
 
 const fileName = "Contact Table"; // current file
 
 // Sync Redux to localStorage
 useEffect(() => {
   if (reduxAdminName) localStorage.setItem("adminName", reduxAdminName);
   if (reduxAdminRole) localStorage.setItem("adminRole", reduxAdminRole);
 }, [reduxAdminName, reduxAdminRole]);
 
 // Record dashboard view
 useEffect(() => {
   const recordDashboardView = async () => {
     try {
       await axios.post(`${process.env.REACT_APP_API_URL}/record-view`, {
         userName: adminName,
         role: adminRole,
         viewedFile: fileName,
         viewTime: moment().format("YYYY-MM-DD HH:mm:ss"),
       });
     } catch (err) {
     }
   };
 
   if (adminName && adminRole) {
     recordDashboardView();
   }
 }, [adminName, adminRole]);
 
 // Fetch role-based permissions
 useEffect(() => {
   const fetchPermissions = async () => {
     try {
       const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-role-permissions`);
       const rolePermissions = res.data.find((perm) => perm.role === adminRole);
       const viewed = rolePermissions?.viewedFiles?.map(f => f.trim()) || [];
       setAllowedRoles(viewed);
     } catch (err) {
     } finally {
       setLoading(false);
     }
   };
 
   if (adminRole) {
     fetchPermissions();
   }
 }, [adminRole]);
 

 if (loading) return <p>Loading...</p>;

 if (!allowedRoles.includes(fileName)) {
   return (
     <div className="text-center text-red-500 font-semibold text-lg mt-10">
       Only admin is allowed to view this file.
     </div>
   );
 }
 
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

                <button className="btn btn-primary" onClick={handleReset}>Reset</button>
            </form>

                        {/* Realtime counters and export buttons in one row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', margin: '15px 0', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ 
                                    background: '#6c757d', 
                                    color: 'white', 
                                    padding: '8px 16px', 
                                    borderRadius: '4px', 
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                }}>
                                    Total: {propertiesData.length} Records
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
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button className="btn btn-danger" onClick={downloadPDF}>Download PDF</button>
                                <button className="btn btn-success" onClick={downloadExcel}>Download Excel</button>
                            </div>
                        </div>


            {loading ? (
                <p>Loading data...</p>
            ) : (
                <>
                    <h3 className='text-success pb-3 mt-4'>Contact Request Owner Data</h3>
                    {filteredData.length > 0 ? (
                    <>      <Table striped bordered hover responsive className="table-sm align-middle">
                            <thead className="sticky-top">
                                <tr>
                                    <th>Rent ID</th>
                                    <th>Posted User Phone Number</th>
                                    <th>Contact Requested User Phone Numbers</th>
                                    <th>Best Time to Call</th>
                                    <th>Email</th>
                                    <th>Views</th>
                                    <th>Created At</th>
                                    <th>Updated At</th>
                                    <th>Actions</th>
 </tr>
                            </thead>
                            <tbody>
  {currentPageData.map((data, index) => (
                                    <tr key={index}>
                                        <td style={{cursor: "pointer"}}
                                          onClick={() =>
                                             navigate(`/dashboard/detail`, {
                                                state: { rentId: data.rentId, phoneNumber: data.phoneNumber },
                                                  })}>{data.rentId}</td>
                                        <td>{data.postedUserPhoneNumber}</td>
                                           <td>
  {(data.contactRequestedUserPhoneNumbers || []).map((req, i) => (
    <div key={i}>
     <strong> {req.phoneNumber}</strong> <br />
      {new Date(req.date).toLocaleDateString()}  {new Date(req.date).toLocaleTimeString()} ,
    </div>
  ))}
</td>
                                        <td>{data.bestTimeToCall || 'N/A'}</td>
                                        <td>{data.email || 'N/A'}</td>
                                        <td>{data.views || 0}</td>
                                        <td>{data.createdAt ? new Date(data.createdAt).toLocaleString() : 'N/A'}</td>
                                        <td>{data.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'N/A'}</td>
                                        <td>
                                            {!data.isDeleted ? (
                                                <button className="btn btn-danger" onClick={() => handleDelete(data.rentId)}>
                                                    <MdDeleteForever size={24} />
                                                </button>
                                            ) : (
                                                <button className="btn btn-secondary" onClick={() => handleUndoDelete(data.rentId)}>
                                                    <MdUndo size={24} />
                                                </button>
                                            )}
                                        </td>
                                         
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
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

export default ContactTables;
