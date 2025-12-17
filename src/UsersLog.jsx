

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';

const RecordViewsTable = () => {
  const [views, setViews] = useState([]);
  const [filteredViews, setFilteredViews] = useState([]);
  const [phoneFilter, setPhoneFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/get-record-views-user`)
     .then(response => {
  const apiData = Array.isArray(response.data)
    ? response.data
    : response.data?.data || [];  // fallback if wrapped

  setViews(apiData);
  setFilteredViews(apiData);
})

.catch(() => {})  }, []);

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
  // Filter logic
  const handleFilter = () => {
    const filtered = views.filter(view => {
      const viewDate = new Date(view.viewTime);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (
        (!phoneFilter || view.phoneNumber.includes(phoneFilter)) &&
        (!start || viewDate >= start) &&
        (!end || viewDate <= end)
      );
    });
    setFilteredViews(filtered);
  };

  const handleReset = () => {
    setPhoneFilter('');
    setStartDate('');
    setEndDate('');
    setFilteredViews(views);
  };


  
  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
  
  
   const [allowedRoles, setAllowedRoles] = useState([]);
       const [loading, setLoading] = useState(true);
   
   const fileName = "Users Log"; // current file
   
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
   
  
  
   if (!allowedRoles.includes(fileName)) {
     return (
       <div className="text-center text-red-500 font-semibold text-lg mt-10">
         Only admin is allowed to view this file.
       </div>
     );
   }



  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User View Records</h2>
              <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
      {/* Filters */}
      <div className="flex justify-center items-center min-h-screen">
  <div     style={{ 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  backgroundColor: '#fff' 
}}  className="d-flex flex-row gap-2 align-items-center flex-nowrap">
    <input
      type="text"
      placeholder="Search by phone number"
      value={phoneFilter}
      onChange={e => setPhoneFilter(e.target.value)}
      className="border p-2 rounded"
    />
    <input
      type="date"
      value={startDate}
      onChange={e => setStartDate(e.target.value)}
      className="border p-2 rounded"
    />
    <input
      type="date"
      value={endDate}
      onChange={e => setEndDate(e.target.value)}
      className="border p-2 rounded"
    />
    <button
      onClick={handleFilter}
      className="bg-primary text-white px-4 py-2 rounded"
    >
      Filter
    </button>
    <button
      onClick={handleReset}
      className="bg-danger ms-2 text-white px-4 py-2 rounded"
    >
      Reset
    </button>
  </div>
</div>

<div ref={tableRef}>
      {/* Table */}
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">S.No</th>
            <th className="border px-4 py-2 text-left">Phone Number</th>
            <th className="border px-4 py-2 text-left">Viewed File</th>
            <th className="border px-4 py-2 text-left">View Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredViews.length > 0 ? (
          filteredViews.map((view, index) => (
            <tr key={view._id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{view.phoneNumber}</td>
              <td className="border px-4 py-2">{view.viewedFile}</td>
              <td className="border px-4 py-2">
                {new Date(view.viewTime).toLocaleString()}
              </td>
            </tr>
          ))) : (
            <tr>
              <td className="border px-4 py-2 text-center" colSpan={4}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default RecordViewsTable;
