


// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// export default function RentStatsTable() {
//   const [stats, setStats] = useState(null);
//   const [viewType, setViewType] = useState("today");
//   const [filterType, setFilterType] = useState("all");
//   const [loading, setLoading] = useState(false);
//   const reportRef = useRef();

//   const reduxAdminName = useSelector((state) => state.admin.name);
//   const reduxAdminRole = useSelector((state) => state.admin.role);

//   const adminName = reduxAdminName || localStorage.getItem("adminName");
//   const adminRole = reduxAdminRole || localStorage.getItem("adminRole");

//   const [allowedRoles, setAllowedRoles] = useState([]);
//   const fileName = "Rent Property Daily Report";

//   useEffect(() => {
//     if (reduxAdminName) localStorage.setItem("adminName", reduxAdminName);
//     if (reduxAdminRole) localStorage.setItem("adminRole", reduxAdminRole);
//   }, [reduxAdminName, reduxAdminRole]);

//   useEffect(() => {
//     const recordDashboardView = async () => {
//       try {
//         await axios.post(`${process.env.REACT_APP_API_URL}/record-view`, {
//           userName: adminName,
//           role: adminRole,
//           viewedFile: fileName,
//           viewTime: moment().format("YYYY-MM-DD HH:mm:ss"),
//         });
//       } catch (err) {
//         console.error("Error recording view:", err);
//       }
//     };
//     if (adminName && adminRole) {
//       recordDashboardView();
//     }
//   }, [adminName, adminRole]);

//   useEffect(() => {
//     const fetchPermissions = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.REACT_APP_API_URL}/get-role-permissions`
//         );
//         const rolePermissions = res.data.find(
//           (perm) => perm.role === adminRole
//         );
//         const viewed = rolePermissions?.viewedFiles?.map((f) => f.trim()) || [];
//         setAllowedRoles(viewed);
//       } catch (err) {
//         console.error("Error fetching permissions:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (adminRole) {
//       fetchPermissions();
//     }
//   }, [adminRole]);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `${process.env.REACT_APP_API_URL}/get-rent-stats`
//       );
//       setStats(res.data);
//     } catch (err) {
//       console.error("Error fetching stats:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isSameDay = (date, targetDate) => {
//     const d = new Date(date);
//     return (
//       d.getFullYear() === targetDate.getFullYear() &&
//       d.getMonth() === targetDate.getMonth() &&
//       d.getDate() === targetDate.getDate()
//     );
//   };

// const filterData = (data) => {
//   if (!data) return null;

//   const filteredData = { ...data };
//   const dateToCheck = viewType === "today" ? new Date() : new Date(Date.now() - 86400000);
  
//   if (filterType !== "all") {
//     if (["active", "incomplete", "complete", "delete"].includes(filterType)) {
//       // Filter by status AND check if updated today
//       filteredData.properties = data.properties.filter(p => 
//         p.status === filterType && 
//         (isSameDay(p.createdAt, dateToCheck) || isSameDay(p.updatedAt, dateToCheck))
//       );
      
//       filteredData.statusCounts = {
//         ...data.statusCounts,
//         [filterType]: filteredData.properties.length
//       };
      
//       // Reset other counts
//       Object.keys(filteredData.statusCounts).forEach(key => {
//         if (key !== filterType) {
//           filteredData.statusCounts[key] = 0;
//         }
//       });
//     } else if (filterType === "helpRequests") {
//       filteredData.properties = data.properties.filter(p => 
//         p.helpRequests && 
//         p.helpRequests.some(h => isSameDay(h.requestedAt, dateToCheck))
//       );
//       filteredData.helpRequestsCount = filteredData.properties.reduce(
//         (acc, p) => acc + (p.helpRequests ? p.helpRequests.length : 0), 0
//       );
//     } else if (filterType === "reportProperty") {
//       filteredData.properties = data.properties.filter(p => 
//         p.reportProperty && 
//         p.reportProperty.some(r => isSameDay(r.date, dateToCheck))
//       );
//       filteredData.reportPropertyCount = filteredData.properties.reduce(
//         (acc, p) => acc + (p.reportProperty ? p.reportProperty.length : 0), 0
//       );
//     }
//   } else {
//     // For "all" filter, still check the dates
//     filteredData.properties = data.properties.filter(p => 
//       isSameDay(p.createdAt, dateToCheck) || isSameDay(p.updatedAt, dateToCheck)
//     );
//   }

//   return filteredData;
// };

//  const renderStatusTable = (data, statusLabel) => {
//     const filtered = data.properties.filter((p) => p.status === statusLabel);
//     if (filtered.length === 0) return null;

//     const dateToCheck = viewType === "today" ? new Date() : new Date(Date.now() - 86400000);

//     return (
//       <div className="mb-4">
//         <h5 className="mt-3">
//           {statusLabel.toUpperCase()} ({filtered.length})
//         </h5>
//         <table className="table table-bordered table-striped">
//           <thead className="table-dark">
//             <tr>
//               <th>PPC ID</th>
//               <th>Phone Number</th>
//               <th>Property Mode</th>
//               <th>Property Type</th>
//               <th>Price</th>
//               <th>Status</th>
//               <th>Created At</th>
//               <th>Updated At</th>
//               <th>Activity Type</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((p, idx) => {
//               let activityType = [];
//               const createdToday = isSameDay(p.createdAt, dateToCheck);
//               const updatedToday = isSameDay(p.updatedAt, dateToCheck);
              
//               if (createdToday) {
//                 activityType.push("New Property");
//               } else if (updatedToday) {
//                 activityType.push("Status Updated");
//               }
              
//               if ((p.helpRequests || []).length > 0) {
//                 activityType.push("Help Request");
//               }
//               if ((p.reportProperty || []).length > 0) {
//                 activityType.push("Report");
//               }

//               return (
//                 <tr
//                   key={idx}
//                   className={
//                     createdToday ? "table-success" : 
//                     updatedToday ? "table-warning" : ""
//                   }
//                 >
//                   <td>{p.ppcId}</td>
//                   <td>{p.phoneNumber}</td>
//                   <td>{p.propertyMode}</td>
//                   <td>{p.propertyType}</td>
//                   <td>{p.price}</td>
//                   <td>{p.status}</td>
//                   <td>{new Date(p.createdAt).toLocaleString()}</td>
//                   <td>{new Date(p.updatedAt).toLocaleString()}</td>
//                   <td>{activityType.join(", ")}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const renderHelpRequestsTable = (data) => {
//     const helpRequests = [];

//     data.properties.forEach((p) => {
//       if (p.helpRequests && p.helpRequests.length > 0) {
//         p.helpRequests.forEach((h) => {
//           helpRequests.push({
//             ppcId: p.ppcId,
//             postedPhone: p.phoneNumber,
//             requestPhone: h.phoneNumber,
//             reason: h.selectHelpReason,
//             comment: h.comment,
//             requestedAt: h.requestedAt,
//           });
//         });
//       }
//     });

//     if (helpRequests.length === 0) return null;

//     return (
//       <div className="mb-4">
//         <h5 className="mt-3">Help Requests ({helpRequests.length})</h5>
//         <table className="table table-bordered table-striped">
//           <thead className="table-dark">
//             <tr>
//               <th>PPC ID</th>
//               <th>Posted Phone</th>
//               <th>Request Phone</th>
//               <th>Reason</th>
//               <th>Comment</th>
//               <th>Requested At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {helpRequests.map((h, idx) => (
//               <tr key={idx}>
//                 <td>{h.ppcId}</td>
//                 <td>{h.postedPhone}</td>
//                 <td>{h.requestPhone}</td>
//                 <td>{h.reason}</td>
//                 <td>{h.comment}</td>
//                 <td>{new Date(h.requestedAt).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const renderReportedPropertiesTable = (data) => {
//     const reports = [];

//     data.properties.forEach((p) => {
//       if (p.reportProperty && p.reportProperty.length > 0) {
//         p.reportProperty.forEach((r) => {
//           reports.push({
//             ppcId: p.ppcId,
//             postedPhone: p.phoneNumber,
//             requestPhone: r.phoneNumber,
//             reason: r.selectReasons,
//             detail: r.reason,
//             date: r.date,
//           });
//         });
//       }
//     });

//     if (reports.length === 0) return null;

//     return (
//       <div className="mb-4">
//         <h5 className="mt-3">Reported Properties ({reports.length})</h5>
//         <table className="table table-bordered table-striped">
//           <thead className="table-dark">
//             <tr>
//               <th>PPC ID</th>
//               <th>Posted Phone</th>
//               <th>Request Phone</th>
//               <th>Reason</th>
//               <th>Detail</th>
//               <th>Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {reports.map((r, idx) => (
//               <tr key={idx}>
//                 <td>{r.ppcId}</td>
//                 <td>{r.postedPhone}</td>
//                 <td>{r.requestPhone}</td>
//                 <td>{r.reason}</td>
//                 <td>{r.detail}</td>
//                 <td>{new Date(r.date).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const handlePrint = () => {
//     const content = reportRef.current;
//     const printWindow = window.open("", "_blank");
    
//     if (!printWindow) {
//       alert("Popup blocked! Please allow popups for this site to print.");
//       return;
//     }

//     const printContent = content.cloneNode(true);
//     const buttons = printContent.querySelectorAll('button');
//     buttons.forEach(button => button.remove());

//     const style = document.createElement('style');
//     style.innerHTML = `
//       @media print {
//         body { padding: 20px; }
//         table { width: 100%; border-collapse: collapse; }
//         th, td { border: 1px solid #ddd; padding: 8px; }
//         .table-striped tbody tr:nth-of-type(odd) { background-color: rgba(0,0,0,.05); }
//         .table-bordered { border: 1px solid #dee2e6; }
//       }
//     `;

//     printWindow.document.open();
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>${fileName}</title>
//           <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
//         </head>
//         <body>
//           <div class="container mt-4">
//             <h2>${fileName}</h2>
//             <p><strong>Admin:</strong> ${adminName}</p>
//             <p><strong>Date:</strong> ${moment().format("YYYY-MM-DD HH:mm:ss")}</p>
//             <p><strong>Filter:</strong> ${filterType.toUpperCase()}</p>
//             <p><strong>View:</strong> ${viewType.toUpperCase()}</p>
//             ${printContent.innerHTML}
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.head.appendChild(style);
//     printWindow.document.close();

//     setTimeout(() => {
//       printWindow.print();
//     }, 500);
//   };

//   const handleDownloadPDF = async () => {
//     try {
//       const input = reportRef.current;
//       const dateStr = moment().format("YYYY-MM-DD HH:mm:ss");
      
//       const clone = input.cloneNode(true);
//       const buttons = clone.querySelectorAll('button');
//       buttons.forEach(button => button.remove());
      
//       clone.style.width = '100%';
//       clone.style.padding = '20px';
      
//       const tempContainer = document.createElement('div');
//       tempContainer.appendChild(clone);
//       tempContainer.style.position = 'absolute';
//       tempContainer.style.left = '-9999px';
//       document.body.appendChild(tempContainer);
      
//       const canvas = await html2canvas(clone, {
//         scale: 1,
//         useCORS: true,
//         logging: false,
//         scrollY: -window.scrollY
//       });
      
//       document.body.removeChild(tempContainer);
      
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const imgWidth = 190;
//       const pageHeight = 277;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 30; // Start position after header
      
//       pdf.setFontSize(14);
//       pdf.text(fileName, 10, 10);
//       pdf.setFontSize(10);
//       pdf.text(`Admin: ${adminName}`, 10, 16);
//       pdf.text(`Date: ${dateStr}`, 10, 22);
//       pdf.text(`Filter: ${filterType.toUpperCase()}`, 10, 28);
//       pdf.text(`View: ${viewType.toUpperCase()}`, 10, 34);
      
//       pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
      
//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }
      
//       pdf.save(`${fileName} - ${dateStr}.pdf`);
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       alert('Error generating PDF. Please try again.');
//     }
//   };

//   if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;

//   const currentData = stats ? filterData(stats[viewType]) : null;
//   const currentDate = viewType === "today"
//     ? new Date().toLocaleDateString()
//     : new Date(Date.now() - 86400000).toLocaleDateString();

//   if (!allowedRoles.includes(fileName)) {
//     return (
//       <div className="text-center text-danger fw-bold mt-5">
//         Only admin is allowed to view this file.
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-3">Rent Property Stats</h2>

//       <div className="row mb-3">
//         <div className="col-md-4">
//           <select 
//             className="form-select"
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//           >
//             <option value="all">All Properties</option>
//             <option value="active">Active (Approved)</option>
//             <option value="incomplete">Incomplete (Pending)</option>
//             <option value="complete">Complete (Pre Approved)</option>
//             <option value="delete">Deleted</option>
//             <option value="helpRequests">Help Requests</option>
//             <option value="reportProperty">Reported Properties</option>
//           </select>
//         </div>
        
//         <div className="col-md-4">
//           <div className="btn-group w-100">
//             <button
//               className={`btn ${viewType === "today" ? "btn-primary" : "btn-outline-primary"}`}
//               onClick={() => setViewType("today")}
//             >
//               Today
//             </button>
//             <button
//               className={`btn ${viewType === "yesterday" ? "btn-primary" : "btn-outline-primary"}`}
//               onClick={() => setViewType("yesterday")}
//             >
//               Yesterday
//             </button>
//           </div>
//         </div>
        
//         <div className="col-md-4">
//           <div className="btn-group w-100">
//             <button className="btn btn-success" onClick={handlePrint}>
//               🖨 Print
//             </button>
//             <button className="btn btn-danger" onClick={handleDownloadPDF}>
//               ⬇ Download PDF
//             </button>
//           </div>
//         </div>
//       </div>

//       <div ref={reportRef}>
//         {currentData && (
//           <div className="mb-3">
//             <h5>Date: {currentDate}</h5>
//             <p>
//               Total: {currentData.total} | Active: {currentData.statusCounts.active} | 
//               Incomplete: {currentData.statusCounts.incomplete} | Complete: {currentData.statusCounts.complete} | 
//               Delete: {currentData.statusCounts.delete} | Help Requests: {currentData.helpRequestsCount} | 
//               Reports: {currentData.reportPropertyCount}
//             </p>
//           </div>
//         )}

//         {currentData && (
//           <>
//             {filterType === "all" || filterType === "active" ? renderStatusTable(currentData, "active") : null}
//             {filterType === "all" || filterType === "incomplete" ? renderStatusTable(currentData, "incomplete") : null}
//             {filterType === "all" || filterType === "complete" ? renderStatusTable(currentData, "complete") : null}
//             {filterType === "all" || filterType === "delete" ? renderStatusTable(currentData, "delete") : null}
//             {filterType === "all" || filterType === "helpRequests" ? renderHelpRequestsTable(currentData) : null}
//             {filterType === "all" || filterType === "reportProperty" ? renderReportedPropertiesTable(currentData) : null}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }







import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Table, 
  Spinner, 
  Alert, 
  Card,
  Badge
} from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'bootstrap/dist/css/bootstrap.min.css';

const RentDatesReport = () => {
  const [inputDates, setInputDates] = useState('');
  const [dateData, setDateData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [filterType, setFilterType] = useState('all');
  const reportRef = useRef();

  // Validate date format (YYYY-MM-DD)
  const isValidDate = (dateStr) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  };

  // Process dates from input (handles comma separated and line breaks)
  const processDatesInput = (input) => {
    // Split by commas or newlines
    const dateStrings = input.split(/[\n,]+/)
      .map(date => date.trim())
      .filter(date => date.length > 0);
    
    // Validate each date
    const validDates = [];
    const invalidDates = [];
    
    dateStrings.forEach(dateStr => {
      if (isValidDate(dateStr)) {
        validDates.push(dateStr);
      } else {
        invalidDates.push(dateStr);
      }
    });
    
    return { validDates, invalidDates };
  };

  const fetchRentDates = async () => {
    const { validDates, invalidDates } = processDatesInput(inputDates);
    
    if (validDates.length === 0) {
      setError('Please enter at least one valid date in YYYY-MM-DD format');
      return;
    }
    
    if (invalidDates.length > 0) {
      setError(`Invalid date formats detected: ${invalidDates.join(', ')}. These will be ignored.`);
    } else {
      setError('');
    }

    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-rent-dates`, {
        params: {
          dates: validDates.join(',')
        }
      });
      
      setDateData(response.data.data);
      const firstDate = Object.keys(response.data.data)[0];
      if (firstDate) {
        setSelectedDate(firstDate);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch rent dates data');
      console.error('Error fetching rent dates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRentDates();
  };

  // Format date without date-fns
  const formatDateTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const pad = num => num.toString().padStart(2, '0');
      return `${pad(date.getDate())}-${pad(date.getMonth()+1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } catch {
      return dateStr;
    }
  };

  const filterData = (data) => {
    if (!data || filterType === 'all') return data;

    const filtered = { ...data };
    
    if (['active', 'incomplete', 'complete', 'delete'].includes(filterType)) {
      filtered.properties = data.properties.filter(p => p.status === filterType);
      filtered.statusCounts = {
        ...data.statusCounts,
        [filterType]: filtered.properties.length
      };
    } else if (filterType === 'helpRequests') {
      filtered.properties = data.properties.filter(p => 
        p.helpRequests && p.helpRequests.length > 0
      );
      filtered.helpRequestsCount = filtered.properties.reduce(
        (sum, p) => sum + (p.helpRequests?.length || 0), 0
      );
    } else if (filterType === 'reportProperty') {
      filtered.properties = data.properties.filter(p => 
        p.reportProperty && p.reportProperty.length > 0
      );
      filtered.reportPropertyCount = filtered.properties.reduce(
        (sum, p) => sum + (p.reportProperty?.length || 0), 0
      );
    }

    return filtered;
  };

  const renderStatusTable = (data, status) => {
    const filtered = data.properties.filter(p => p.status === status);
    if (filtered.length === 0) return null;

    return (
      <div className="mb-4">
        <h5 className="mt-3">
          {status.toUpperCase()} ({filtered.length})
        </h5>
        <Table>
          <thead className="table-dark">
            <tr>
              <th>RENT ID</th>
              <th>Phone</th>
              <th>Mode</th>
              <th>Type</th>
              <th>Price</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Activities</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => (
              <tr key={idx}>
                <td>{p.rentId}</td>
                <td>{p.phoneNumber}</td>
                <td>{p.propertyMode}</td>
                <td>{p.propertyType}</td>
                <td>{p.price}</td>
                <td>{formatDateTime(p.createdAt)}</td>
                <td>{formatDateTime(p.updatedAt)}</td>
                <td>
                  {p.helpRequests?.length > 0 && (
                    <Badge bg="warning" text="dark" className="me-1">
                      Help ({p.helpRequests.length})
                    </Badge>
                  )}
                  {p.reportProperty?.length > 0 && (
                    <Badge bg="danger" className="me-1">
                      Reports ({p.reportProperty.length})
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const renderHelpRequests = (data) => {
    const allRequests = data.properties.flatMap(p => 
      (p.helpRequests || []).map(h => ({ ...h, rentId: p.rentId, ownerPhone: p.phoneNumber }))
    );

    if (allRequests.length === 0) return null;

    return (
      <div className="mb-4">
        <h5>Help Requests ({allRequests.length})</h5>
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>RENT ID</th>
              <th>Owner Phone</th>
              <th>Requester Phone</th>
              <th>Reason</th>
              <th>Comment</th>
              <th>Requested At</th>
            </tr>
          </thead>
          <tbody>
            {allRequests.map((h, idx) => (
              <tr key={idx}>
                <td>{h.rentId}</td>
                <td>{h.ownerPhone}</td>
                <td>{h.phoneNumber}</td>
                <td>{h.selectHelpReason}</td>
                <td>{h.comment}</td>
                <td>{formatDateTime(h.requestedAt)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const renderReports = (data) => {
    const allReports = data.properties.flatMap(p => 
      (p.reportProperty || []).map(r => ({ ...r, rentId: p.rentId, ownerPhone: p.phoneNumber }))
    );

    if (allReports.length === 0) return null;

    return (
      <div className="mb-4">
        <h5>Property Reports ({allReports.length})</h5>
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>RENT ID</th>
              <th>Owner Phone</th>
              <th>Reporter Phone</th>
              <th>Reason</th>
              <th>Details</th>
              <th>Reported At</th>
            </tr>
          </thead>
          <tbody>
            {allReports.map((r, idx) => (
              <tr key={idx}>
                <td>{r.rentId}</td>
                <td>{r.ownerPhone}</td>
                <td>{r.phoneNumber}</td>
                <td>{r.selectReasons}</td>
                <td>{r.reason}</td>
                <td>{formatDateTime(r.date)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const handlePrint = () => {
    const content = reportRef.current;
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Popup blocked! Please allow popups for this site to print.');
      return;
    }

    const printContent = content.cloneNode(true);
    const buttons = printContent.querySelectorAll('button');
    buttons.forEach(button => button.remove());

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Rent Dates Report</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>
            @media print {
              body { padding: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; }
              .table-striped tbody tr:nth-of-type(odd) { background-color: rgba(0,0,0,.05); }
              .table-bordered { border: 1px solid #dee2e6; }
            }
          </style>
        </head>
        <body>
          <div class="container mt-4">
            <h2>Rent Property Report - ${selectedDate}</h2>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Filter:</strong> ${filterType}</p>
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleDownloadPDF = async () => {
    try {
      const input = reportRef.current;
      const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
      
      const canvas = await html2canvas(input, {
        scale: 1,
        useCORS: true,
        logging: false,
        scrollY: -window.scrollY
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 277;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      
      pdf.setFontSize(14);
      pdf.text(`Rent Property Report - ${selectedDate}`, 10, position);
      position += 10;
      pdf.setFontSize(10);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 10, position);
      position += 5;
      pdf.text(`Filter: ${filterType}`, 10, position);
      position += 10;
      
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Rent_Report_${selectedDate}_${dateStr}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const currentData = selectedDate ? filterData(dateData[selectedDate]) : null;

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Rent Property Date Report</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group controlId="formDates">
                  <Form.Label>Enter dates (YYYY-MM-DD)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter dates separated by commas or new lines\nExample:\n2023-01-15\n2023-01-16\n2023-01-17"
                    value={inputDates}
                    onChange={(e) => setInputDates(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    You can enter multiple dates separated by commas or new lines
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Fetch Data'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {Object.keys(dateData).length > 0 && (
        <>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Select 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                {Object.keys(dateData).map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Data</option>
                <option value="active">Active Properties</option>
                <option value="incomplete">Incomplete Properties</option>
                <option value="complete">Complete Properties</option>
                <option value="delete">Deleted Properties</option>
                <option value="helpRequests">Help Requests</option>
                <option value="reportProperty">Property Reports</option>
              </Form.Select>
            </Col>
            <Col md={4} className="d-flex justify-content-end gap-2">
              <Button variant="success" onClick={handlePrint}>
                Print Report
              </Button>
              <Button variant="danger" onClick={handleDownloadPDF}>
                Export PDF
              </Button>
            </Col>
          </Row>

          <div ref={reportRef}>
            {currentData && (
              <>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Summary for {selectedDate}</Card.Title>
                    <Row>
                      <Col md={4}>
                        <p><strong>Total Properties:</strong> {currentData.total}</p>
                        <p><strong>Active:</strong> {currentData.statusCounts.active}</p>
                        <p><strong>Incomplete:</strong> {currentData.statusCounts.incomplete}</p>
                      </Col>
                      <Col md={4}>
                        <p><strong>Complete:</strong> {currentData.statusCounts.complete}</p>
                        <p><strong>Deleted:</strong> {currentData.statusCounts.delete}</p>
                      </Col>
                      <Col md={4}>
                        <p><strong>Help Requests:</strong> {currentData.helpRequestsCount}</p>
                        <p><strong>Property Reports:</strong> {currentData.reportPropertyCount}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {filterType === 'all' || filterType === 'active' ? renderStatusTable(currentData, 'active') : null}
                {filterType === 'all' || filterType === 'incomplete' ? renderStatusTable(currentData, 'incomplete') : null}
                {filterType === 'all' || filterType === 'complete' ? renderStatusTable(currentData, 'complete') : null}
                {filterType === 'all' || filterType === 'delete' ? renderStatusTable(currentData, 'delete') : null}
                {filterType === 'all' || filterType === 'helpRequests' ? renderHelpRequests(currentData) : null}
                {filterType === 'all' || filterType === 'reportProperty' ? renderReports(currentData) : null}
              </>
            )}
          </div>
        </>
      )}
    </Container>
  );
};

export default RentDatesReport;


















// import React, { useState, useRef } from 'react';
// import axios from 'axios';
// import { format } from 'date-fns';
// import { 
//   Container, 
//   Row, 
//   Col, 
//   Form, 
//   Button, 
//   Table, 
//   Spinner, 
//   Alert, 
//   Card,
//   Badge
// } from 'react-bootstrap';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const RentDatesReport = () => {
//   const [inputDates, setInputDates] = useState('');
//   const [dateData, setDateData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [filterType, setFilterType] = useState('all');
//   const reportRef = useRef();

//   const fetchRentDates = async () => {
//     if (!inputDates) {
//       setError('Please enter at least one date (YYYY-MM-DD)');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-rent-dates`, {
//         params: {
//           dates: inputDates
//         }
//       });
//       setDateData(response.data.data);
//       // Set the first date as selected by default
//       const firstDate = Object.keys(response.data.data)[0];
//       if (firstDate) {
//         setSelectedDate(firstDate);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch rent dates data');
//       console.error('Error fetching rent dates:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     fetchRentDates();
//   };

//   const formatDateTime = (dateStr) => {
//     try {
//       return format(new Date(dateStr), 'dd-MM-yyyy HH:mm:ss');
//     } catch {
//       return dateStr;
//     }
//   };

//   const filterData = (data) => {
//     if (!data || filterType === 'all') return data;

//     const filtered = { ...data };
    
//     if (['active', 'incomplete', 'complete', 'delete'].includes(filterType)) {
//       filtered.properties = data.properties.filter(p => p.status === filterType);
//       filtered.statusCounts = {
//         ...data.statusCounts,
//         [filterType]: filtered.properties.length
//       };
//     } else if (filterType === 'helpRequests') {
//       filtered.properties = data.properties.filter(p => 
//         p.helpRequests && p.helpRequests.length > 0
//       );
//       filtered.helpRequestsCount = filtered.properties.reduce(
//         (sum, p) => sum + (p.helpRequests?.length || 0), 0
//       );
//     } else if (filterType === 'reportProperty') {
//       filtered.properties = data.properties.filter(p => 
//         p.reportProperty && p.reportProperty.length > 0
//       );
//       filtered.reportPropertyCount = filtered.properties.reduce(
//         (sum, p) => sum + (p.reportProperty?.length || 0), 0
//       );
//     }

//     return filtered;
//   };

//   const renderStatusTable = (data, status) => {
//     const filtered = data.properties.filter(p => p.status === status);
//     if (filtered.length === 0) return null;

//     return (
//       <div className="mb-4">
//         <h5 className="mt-3">
//           {status.toUpperCase()} ({filtered.length})
//         </h5>
//         <Table>
//           <thead className="table-dark">
//             <tr>
//               <th>RENT ID</th>
//               <th>Phone</th>
//               <th>Mode</th>
//               <th>Type</th>
//               <th>Price</th>
//               <th>Created</th>
//               <th>Updated</th>
//               <th>Activities</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((p, idx) => (
//               <tr key={idx}>
//                 <td>{p.rentId}</td>
//                 <td>{p.phoneNumber}</td>
//                 <td>{p.propertyMode}</td>
//                 <td>{p.propertyType}</td>
//                 <td>{p.price}</td>
//                 <td>{formatDateTime(p.createdAt)}</td>
//                 <td>{formatDateTime(p.updatedAt)}</td>
//                 <td>
//                   {p.helpRequests?.length > 0 && (
//                     <Badge bg="warning" text="dark" className="me-1">
//                       Help ({p.helpRequests.length})
//                     </Badge>
//                   )}
//                   {p.reportProperty?.length > 0 && (
//                     <Badge bg="danger" className="me-1">
//                       Reports ({p.reportProperty.length})
//                     </Badge>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     );
//   };

//   const renderHelpRequests = (data) => {
//     const allRequests = data.properties.flatMap(p => 
//       (p.helpRequests || []).map(h => ({ ...h, ppcId: p.ppcId, ownerPhone: p.phoneNumber }))
//     );

//     if (allRequests.length === 0) return null;

//     return (
//       <div className="mb-4">
//         <h5>Help Requests ({allRequests.length})</h5>
//         <Table striped bordered hover>
//           <thead className="table-dark">
//             <tr>
//               <th>RENT ID</th>
//               <th>Owner Phone</th>
//               <th>Requester Phone</th>
//               <th>Reason</th>
//               <th>Comment</th>
//               <th>Requested At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {allRequests.map((h, idx) => (
//               <tr key={idx}>
//                 <td>{h.rentId}</td>
//                 <td>{h.ownerPhone}</td>
//                 <td>{h.phoneNumber}</td>
//                 <td>{h.selectHelpReason}</td>
//                 <td>{h.comment}</td>
//                 <td>{formatDateTime(h.requestedAt)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     );
//   };

//   const renderReports = (data) => {
//     const allReports = data.properties.flatMap(p => 
//       (p.reportProperty || []).map(r => ({ ...r, ppcId: p.ppcId, ownerPhone: p.phoneNumber }))
//     );

//     if (allReports.length === 0) return null;

//     return (
//       <div className="mb-4">
//         <h5>Property Reports ({allReports.length})</h5>
//         <Table striped bordered hover>
//           <thead className="table-dark">
//             <tr>
//               <th>RENT ID</th>
//               <th>Owner Phone</th>
//               <th>Reporter Phone</th>
//               <th>Reason</th>
//               <th>Details</th>
//               <th>Reported At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {allReports.map((r, idx) => (
//               <tr key={idx}>
//                 <td>{r.rentId}</td>
//                 <td>{r.ownerPhone}</td>
//                 <td>{r.phoneNumber}</td>
//                 <td>{r.selectReasons}</td>
//                 <td>{r.reason}</td>
//                 <td>{formatDateTime(r.date)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     );
//   };

//   const handlePrint = () => {
//     const content = reportRef.current;
//     const printWindow = window.open('', '_blank');
    
//     if (!printWindow) {
//       alert('Popup blocked! Please allow popups for this site to print.');
//       return;
//     }

//     const printContent = content.cloneNode(true);
//     const buttons = printContent.querySelectorAll('button');
//     buttons.forEach(button => button.remove());

//     printWindow.document.open();
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Rent Dates Report</title>
//           <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
//           <style>
//             @media print {
//               body { padding: 20px; }
//               table { width: 100%; border-collapse: collapse; }
//               th, td { border: 1px solid #ddd; padding: 8px; }
//               .table-striped tbody tr:nth-of-type(odd) { background-color: rgba(0,0,0,.05); }
//               .table-bordered { border: 1px solid #dee2e6; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="container mt-4">
//             <h2>Rent Property Report - ${selectedDate}</h2>
//             <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
//             <p><strong>Filter:</strong> ${filterType}</p>
//             ${printContent.innerHTML}
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();

//     setTimeout(() => {
//       printWindow.print();
//     }, 500);
//   };

//   const handleDownloadPDF = async () => {
//     try {
//       const input = reportRef.current;
//       const dateStr = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      
//       const canvas = await html2canvas(input, {
//         scale: 1,
//         useCORS: true,
//         logging: false,
//         scrollY: -window.scrollY
//       });
      
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const imgWidth = 190;
//       const pageHeight = 277;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 10;
      
//       pdf.setFontSize(14);
//       pdf.text(`Rent Property Report - ${selectedDate}`, 10, position);
//       position += 10;
//       pdf.setFontSize(10);
//       pdf.text(`Generated: ${new Date().toLocaleString()}`, 10, position);
//       position += 5;
//       pdf.text(`Filter: ${filterType}`, 10, position);
//       position += 10;
      
//       pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
      
//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }
      
//       pdf.save(`Rent_Report_${selectedDate}_${dateStr}.pdf`);
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       alert('Error generating PDF. Please try again.');
//     }
//   };

//   const currentData = selectedDate ? filterData(dateData[selectedDate]) : null;

//   return (
//     <Container className="mt-4">
//       <h2 className="mb-4">Rent Property Date Report</h2>
      
//       <Card className="mb-4">
//         <Card.Body>
//           <Form onSubmit={handleSubmit}>
//             <Row>
//               <Col md={8}>
//                 <Form.Group controlId="formDates">
//                   <Form.Label>Enter dates (YYYY-MM-DD, comma separated)</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="e.g. 2023-01-15,2023-01-16"
//                     value={inputDates}
//                     onChange={(e) => setInputDates(e.target.value)}
//                   />
//                   <Form.Text className="text-muted">
//                     Enter one or more dates separated by commas
//                   </Form.Text>
//                 </Form.Group>
//               </Col>
//               <Col md={4} className="d-flex align-items-end">
//                 <Button variant="primary" type="submit" disabled={loading}>
//                   {loading ? <Spinner animation="border" size="sm" /> : 'Fetch Data'}
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </Card.Body>
//       </Card>

//       {error && <Alert variant="danger">{error}</Alert>}

//       {Object.keys(dateData).length > 0 && (
//         <Row className="mb-3">
//           <Col md={4}>
//             <Form.Select 
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//             >
//               {Object.keys(dateData).map(date => (
//                 <option key={date} value={date}>{date}</option>
//               ))}
//             </Form.Select>
//           </Col>
//           <Col md={4}>
//             <Form.Select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//             >
//               <option value="all">All Data</option>
//               <option value="active">Active Properties</option>
//               <option value="incomplete">Incomplete Properties</option>
//               <option value="complete">Complete Properties</option>
//               <option value="delete">Deleted Properties</option>
//               <option value="helpRequests">Help Requests</option>
//               <option value="reportProperty">Property Reports</option>
//             </Form.Select>
//           </Col>
//           <Col md={4} className="d-flex justify-content-end gap-2">
//             <Button variant="success" onClick={handlePrint}>
//               Print Report
//             </Button>
//             <Button variant="danger" onClick={handleDownloadPDF}>
//               Export PDF
//             </Button>
//           </Col>
//         </Row>
//       )}

//       <div ref={reportRef}>
//         {currentData && (
//           <>
//             <Card className="mb-4">
//               <Card.Body>
//                 <Card.Title>Summary for {selectedDate}</Card.Title>
//                 <Row>
//                   <Col md={4}>
//                     <p><strong>Total Properties:</strong> {currentData.total}</p>
//                     <p><strong>Active:</strong> {currentData.statusCounts.active}</p>
//                     <p><strong>Incomplete:</strong> {currentData.statusCounts.incomplete}</p>
//                   </Col>
//                   <Col md={4}>
//                     <p><strong>Complete:</strong> {currentData.statusCounts.complete}</p>
//                     <p><strong>Deleted:</strong> {currentData.statusCounts.delete}</p>
//                   </Col>
//                   <Col md={4}>
//                     <p><strong>Help Requests:</strong> {currentData.helpRequestsCount}</p>
//                     <p><strong>Property Reports:</strong> {currentData.reportPropertyCount}</p>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             {filterType === 'all' || filterType === 'active' ? renderStatusTable(currentData, 'active') : null}
//             {filterType === 'all' || filterType === 'incomplete' ? renderStatusTable(currentData, 'incomplete') : null}
//             {filterType === 'all' || filterType === 'complete' ? renderStatusTable(currentData, 'complete') : null}
//             {filterType === 'all' || filterType === 'delete' ? renderStatusTable(currentData, 'delete') : null}
//             {filterType === 'all' || filterType === 'helpRequests' ? renderHelpRequests(currentData) : null}
//             {filterType === 'all' || filterType === 'reportProperty' ? renderReports(currentData) : null}
//           </>
//         )}
//       </div>
//     </Container>
//   );
// };

// export default RentDatesReport;