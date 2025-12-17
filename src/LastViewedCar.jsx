




import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { Table , Pagination, Button} from 'react-bootstrap';
import { MdDeleteForever, MdUndo } from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";


const AllLastViewedProperties = () => {
  const [views, setViews] = useState([]);
  const [filteredViews, setFilteredViews] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");
   const [searchPhoneNumber, setSearchPhoneNumber] = useState('');
         const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLastViewedProperties();
  }, []);

  const fetchLastViewedProperties = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user-get-all-last-views`);
      setViews(data);
    } catch (err) {
    }
  };

// const filteredData = React.useMemo(() => {
//   return views.filter(entry => {
//     const createdAt = new Date(entry.createdAt || entry.viewedAt).getTime();
//     const from = fromDate ? new Date(fromDate).getTime() : null;
//     const to = endDate ? new Date(endDate).getTime() : null;

//     const rentId = entry.property?.rentId || "";
//         const phoneNumber = entry.phoneNumber || "";

//   const matchesSearch = search
//     ? String(rentId).toLowerCase().includes(search.toLowerCase())
//     : true;
//      const matchesPhone = searchPhoneNumber
//       ? String(phoneNumber).toLowerCase().includes(searchPhoneNumber.toLowerCase())
//       : true;

//     const matchesStartDate = from ? createdAt >= from : true;
//     const matchesEndDate = to ? createdAt <= to : true;

//     return matchesSearch && matchesPhone && matchesStartDate && matchesEndDate;
//   });
// }, [views, searchPhoneNumber , search, fromDate, endDate]);
const filteredData = React.useMemo(() => {
  const filtered = views.filter(entry => {
    const createdAt = new Date(entry.createdAt || entry.viewedAt).getTime();
    const from = fromDate ? new Date(fromDate).getTime() : null;
    const to = endDate ? new Date(endDate).getTime() : null;

    const rentId = entry.property?.rentId || "";
    const phoneNumber = entry.phoneNumber || "";

    const matchesSearch = search
      ? String(rentId).toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesPhone = searchPhoneNumber
      ? String(phoneNumber).toLowerCase().includes(searchPhoneNumber.toLowerCase())
      : true;

    const matchesStartDate = from ? createdAt >= from : true;
    const matchesEndDate = to ? createdAt <= to : true;

    return matchesSearch && matchesPhone && matchesStartDate && matchesEndDate;
  });

  // 🔹 Sort by most recent date first
  return filtered.sort(
    (a, b) =>
      new Date(b.createdAt || b.viewedAt).getTime() -
      new Date(a.createdAt || a.viewedAt).getTime()
  );
}, [views, searchPhoneNumber, search, fromDate, endDate]);

// Pagination logic
const itemsPerPage = 10;
const totalPages = Math.ceil(filteredData.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const currentPageData = filteredData.slice(startIndex, startIndex + itemsPerPage);


// Slice for current page data
  const handleDelete = async (rentId) => {
    if (window.confirm(`Are you sure you want to delete RENT ID: ${rentId}?`)) {
        // Optimistic update: mark as deleted immediately
        setViews(prev =>
            prev.map(item =>
                item.rentId === rentId ? { ...item, isDeleted: true } : item
            )
        );

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/delete-free-property/${rentId}`, {
                method: 'PUT',
            });
            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                // Fetch updated data after delete
                fetchLastViewedProperties();
            } else {
                // Reset optimistic change if the request failed
                setViews(prev =>
                    prev.map(item =>
                        item.rentId === rentId ? { ...item, isDeleted: false } : item
                    )
                );
                alert('Failed to delete the property.');
            }
        } catch (error) {
            alert('Failed to delete the property.');
        }
    }
};

const handleUndoDelete = async (rentId) => {
    if (window.confirm(`Are you sure you want to undo delete for RENT ID: ${rentId}?`)) {
        // Optimistic update: mark as not deleted immediately
        setViews(prev =>
            prev.map(item =>
                item.rentId === rentId ? { ...item, isDeleted: false } : item
            )
        );

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/undo-delete-free-property/${rentId}`, {
                method: 'PUT',
            });
            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                // Fetch updated data after undo delete
                fetchLastViewedProperties();
            } else {
                // Reset optimistic change if the request failed
                setViews(prev =>
                    prev.map(item =>
                        item.rentId === rentId ? { ...item, isDeleted: true } : item
                    )
                );
                alert('Failed to undo delete.');
            }
        } catch (error) {
            alert('Failed to undo delete.');
        }
    }
};

// Function to fetch the latest data


// PDF download handler
const downloadPDF = () => {
  const doc = new jsPDF();
  doc.text("All Users' Last Viewed Properties", 14, 10);
  autoTable(doc, {
    head: [["#", "Phone Number", "RENT ID", "Property Type", "City", "District", "Viewed At"]],
    body: filteredViews.map((entry, index) => [
      index + 1,
      entry.phoneNumber,
      entry.property.rentId,
      entry.property.propertyType,
      entry.property.city || "-",
      entry.property.district || "-",
      new Date(entry.viewedAt).toLocaleString()
    ]),
  });
  doc.save("Last_Viewed_Properties.pdf");
};

// Excel download handler
const downloadExcel = () => {
  const worksheetData = filteredViews.map((entry, index) => ({
    "S.No": index + 1,
    "Phone Number": entry.phoneNumber,
    "RENT ID": entry.property.rentId,
    "Property Type": entry.property.propertyType,
    "City": entry.property.city || "-",
    "District": entry.property.district || "-",
    "Viewed At": new Date(entry.viewedAt).toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "LastViewedProperties");

  XLSX.writeFile(workbook, "Last_Viewed_Properties.xlsx");
};


  

  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
  
  

 const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Users' Last Viewed Properties</h2>

      {/* Filters */}
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
                        style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
                    />
                </div>
<div className="mb-3">
  <label className="form-label fw-bold">PhoneNumber</label>
  <input
    type="text"
    className="form-control"
    placeholder="Enter Phone Number"
    value={searchPhoneNumber}
    onChange={(e) => setSearchPhoneNumber(e.target.value)}
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
                        style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
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
                        style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
                    />
                </div>
                  <button
    type="button"
    className="btn btn-secondary"
    onClick={() => {
      setSearch('');
      setSearchPhoneNumber('');
      setFromDate('');
      setEndDate('');
    }}
  >
    Reset Filters
  </button>
            </form>


<div className="flex gap-4 mb-4">
  <button
    onClick={downloadPDF}
    className="bg-primary text-white me-3 px-4 py-2 rounded hover:bg-red-600"
  >
    Download PDF
  </button>
  <button
    onClick={downloadExcel}
    className="bg-success text-white px-4 py-2 rounded hover:bg-green-700"
  >
    Download Excel
  </button>
</div>


      {/* Table */}
      <div className="overflow-x-auto mt-3">
        <h3> All User Viewed Properties </h3>
        <Table striped bordered hover responsive className="table-sm align-middle">
        <thead className="sticky-top">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Phone Number</th>
              <th className="border px-4 py-2">RENT ID</th>
              <th className="border px-4 py-2">Property Type</th>
              <th className="border px-4 py-2">City</th>
              <th className="border px-4 py-2">District</th>
              <th className="border px-4 py-2">Viewed At</th>
              <th className="border px-4 py-2">Action</th>
{/* <th className="border px-4 py-2">View Details</th> */}
            </tr>
          </thead>
          <tbody>
            {currentPageData.length > 0 ? (
              currentPageData.map((entry, index) => (
                <tr key={entry.property._id || index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{entry.phoneNumber}</td>
                  <td style={{cursor: "pointer"}}   onClick={() =>
                              navigate(`/dashboard/detail`, {
                                state: { rentId: entry.property.rentId, phoneNumber: entry.property.phoneNumber },
                              })
                            } className="border px-4 py-2">{entry.property.rentId}</td>
                  <td className="border px-4 py-2">{entry.property.propertyType}</td>
                  <td className="border px-4 py-2">{entry.property.city || "-"}</td>
                  <td className="border px-4 py-2">{entry.property.district || "-"}</td>
                  <td className="border px-4 py-2">
                    {new Date(entry.viewedAt).toLocaleString()}
                  </td>
                  <td>
    {entry.property.isDeleted ? (
        <button className="btn btn-warning" onClick={() => handleUndoDelete(entry.property.rentId)}>
          <MdUndo />
        </button>
    ) : (
        <button className="btn btn-danger" onClick={() => handleDelete(entry.property.rentId)}>
            <MdDeleteForever size={24} />
        </button>
    )}
</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No entries found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
                         <div className="pagination-controls">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
  >
    Previous
  </button>

  {[...Array(totalPages)].map((_, idx) => (
    <button
      key={idx}
      className={currentPage === idx + 1 ? "active" : ""}
      onClick={() => setCurrentPage(idx + 1)}
    >
      {idx + 1}
    </button>
  ))}

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
  >
    Next
  </button>
</div>

      </div>
    </div>
  );
};

export default AllLastViewedProperties;
