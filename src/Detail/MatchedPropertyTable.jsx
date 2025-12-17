







import React, { useState, useEffect } from 'react';
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useNavigate } from 'react-router-dom';


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
  startDate: '',
  endDate: ''
});
  const navigate = useNavigate();

  // Format price with Indian rupee symbol and commas
  const formatPrice = (rentalAmount) => {
    return rentalAmount ? `₹${new Intl.NumberFormat('en-IN').format(rentalAmount)}` : '-';
  };

  // Format date
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-IN') : '-';
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



  
  useEffect(() => {
    fetchMatchedData();
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
      const matchesId = filters.propertyId
        ? (property.propertyId && property.propertyId.toString().toLowerCase().includes(filters.propertyId.toLowerCase()))
        : true;

      const createdDate = new Date(property.createdAt);
      const startMatch = filters.startDate ? createdDate >= new Date(filters.startDate) : true;
      const endMatch = filters.endDate ? createdDate <= new Date(filters.endDate) : true;

      return matchesId && startMatch && endMatch;
    });

    return { ...item, matchedProperties: matched };
  }).filter(item => item.matchedProperties.length > 0);
};


const handleResetFilters = () => {
  setFilters({ propertyId: '', startDate: '', endDate: '' });
};

   // -------------- PDF EXPORT ----------------
  const exportPDF = () => {
    const doc = new jsPDF();
    const title = "Matched Tentant Requests & Properties";

    // Prepare headers for table columns
    const headers = [
      "Rent ID",
      "Posted By",
      "Contact",
      "Rental Amount",
      "Location",
      "Type",
      "Facing",
      "Bedrooms",
      "Area",
      "Posted On",
      "BA_ID",
      "BA_NAME",
      "BA PHONE",
      "BA AREA",
      "BA CITY",
      "Status",
    ];

    // Flatten data for export, one row per matched property with BA details
    const data = [];
    filteredData.forEach((item) => {
      item.matchedProperties.forEach((property) => {
        data.push([
          property.rentId || "-",
          property.postedBy || "-",
          property.postedByUser || "-",
          formatPrice(property.rentalAmount),
          `${property.city || "-"} / ${property.area || "-"}`,
          property.propertyType || "-",
          property.facing || "-",
          property.bedrooms || "-",
          property.totalArea ? `${property.totalArea} ${property.areaUnit || ""}` : "-",
          property.createdAt ? formatDate(property.createdAt) : "-",
          item.buyerAssistanceCard.Ra_Id || "N/A",
          item.buyerAssistanceCard.name || "N/A",
          item.buyerAssistanceCard.phoneNumber || "N/A",
          item.buyerAssistanceCard.area || "N/A",
          item.buyerAssistanceCard.city || "N/A",
          property.isDeleted ? "Deleted" : "Active",
        ]);
      });
    });

    doc.text(title, 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [headers],
      body: data,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
      margin: { left: 14, right: 14 },
    });

    doc.save("Matched_Buyer_Requests_Properties.pdf");
  };

  // -------------- EXCEL EXPORT ----------------
  const exportExcel = () => {
    // Prepare data array of objects for XLSX
    const dataForExcel = [];

    filteredData.forEach((item) => {
      item.matchedProperties.forEach((property) => {
        dataForExcel.push({
          "Rent ID": property.rentId || "-",
          "Posted By": property.postedBy || "-",
          Contact: property.postedByUser || "-",
          rentalAmount: property.rentalAmount || "-",
          Location: `${property.city || "-"} / ${property.area || "-"}`,
          Type: property.propertyType || "-",
          Facing: property.facing || "-",
          Bedrooms: property.bedrooms || "-",
          Area: property.totalArea
            ? `${property.totalArea} ${property.areaUnit || ""}`
            : "-",
          "Posted On": property.createdAt ? formatDate(property.createdAt) : "-",
          RA_ID: item.buyerAssistanceCard.Ra_Id || "N/A",
          RA_NAME: item.buyerAssistanceCard.name || "N/A",
          "BA PHONE": item.buyerAssistanceCard.phoneNumber || "N/A",
          "BA AREA": item.buyerAssistanceCard.area || "N/A",
          "BA CITY": item.buyerAssistanceCard.city || "N/A",
          Status: property.isDeleted ? "Deleted" : "Active",
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Matched Data");

    XLSX.writeFile(workbook, "Matched_Buyer_Requests_Properties.xlsx");
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

      <div className="mb-4 p-3 border rounded bg-light">
       <div className="d-flex gap-3 mb-3">
  <input
    type="text"
    placeholder="Search Property ID"
    value={filters.propertyId}
    onChange={e => setFilters({ ...filters, propertyId: e.target.value })}
    className="form-control"
  />

  <input
    type="date"
    value={filters.startDate}
    onChange={e => setFilters({ ...filters, startDate: e.target.value })}
    className="form-control"
  />

  <input
    type="date"
    value={filters.endDate}
    onChange={e => setFilters({ ...filters, endDate: e.target.value })}
    className="form-control"
  />

  <button onClick={handleResetFilters} className="btn btn-secondary">
    Reset
  </button>
</div>

      </div>
  <div className='mb-4'>
         <Button variant="success" className='me-4' onClick={exportExcel}>
          <FaFileExcel className="me-2" />
          Download Excel
        </Button>

        <Button variant="danger" onClick={exportPDF}>
          <FaFilePdf className="me-2" />
          Download PDF
        </Button>
      </div>
    

      <div className="table-responsive">
        <h3>Get Matched Property Datas</h3>
    <Table striped bordered hover responsive className="table-sm align-middle">
    <thead className="sticky-top">
            <tr>
              <th><FaIdBadge className="me-1" /> Rent ID</th>
              <th><FaUser className="me-1" /> Posted By</th>
              <th><FaPhone className="me-1" /> Contact</th>
              <th><FaMoneyBillWave className="me-1" /> Rental Amount</th>
              <th><FaMapMarkerAlt className="me-1" /> Location</th>
              <th><FaHome className="me-1" /> Type</th>
              <th>Facing</th>
              <th>Bedrooms</th>
              <th>Area</th>
              <th><FaCalendarAlt className="me-1" /> Posted On</th>
              <th><FaIdBadge className="me-1" /> RA_ID</th>
              <th><FaUserTag className="me-1" /> RA_NAME</th>
              <th><FaPhone className="me-1" /> RA PHONE</th>
              <th><FaMapMarkerAlt className="me-1" /> RA AREA</th>
              <th><FaMapMarkerAlt className="me-1" /> RA CITY</th>
              <th>Status</th>
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