










import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Form, Row, Col, Container, Button } from "react-bootstrap";
import moment from "moment";
import { useSelector } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const FavoriteRemoved = () => {
  const [favoriteRemovedData, setFavoriteRemovedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
const [searchrentId, setSearchrentId] = useState('');
  const navigate = useNavigate();

  // Filters
  const [searchPhone, setSearchPhone] = useState("");
  const [searchOwner, setSearchOwner] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const fetchFavoriteRemovedData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-all-favorite-removed`);
      if (response.status === 200 && response.data.data) {
        setFavoriteRemovedData(response.data.data);
        setFilteredData(response.data.data);
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteRemovedData();
  }, []);

  // Filtering logic
 useEffect(() => {
    const filtered = favoriteRemovedData.filter((property) => {
      const ownerMatch = searchOwner
        ? property.ownerName?.toLowerCase().includes(searchOwner.toLowerCase())
        : true;
const rentIdMatch = searchrentId
  ? String(property?.rentId || '').toLowerCase().includes(searchrentId.toLowerCase())
  : true;

      const phoneMatch = searchPhone
        ? property.favoriteRemoved.some((fav) =>
            fav.phoneNumber?.toLowerCase().includes(searchPhone.toLowerCase())
          )
        : true;

      const from = fromDate ? new Date(fromDate).getTime() : null;
      const to = endDate ? new Date(endDate).getTime() : null;

      const dateMatch = property.favoriteRemoved.some((fav) => {
        const removedTime = new Date(fav.removedAt).getTime();
        const afterFrom = from ? removedTime >= from : true;
        const beforeTo = to ? removedTime <= to : true;
        return afterFrom && beforeTo;
      });

      return ownerMatch && phoneMatch && rentIdMatch && dateMatch;
    });

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page after filter
  }, [searchPhone, searchOwner, fromDate,searchrentId, endDate, favoriteRemovedData]);

  // 📄 Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleDelete = async (rentId) => {
    if (window.confirm(`Are you sure you want to delete RENT ID: ${rentId}?`)) {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/delete-free-property/${rentId}`, {
                method: 'PUT',
            });
            const data = await response.json();
            alert(data.message);

            setFavoriteRemovedData(prev =>
                prev.map(item =>
                    item.rentId === rentId ? { ...item, isDeleted: true } : item
                )
            );
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

            setFavoriteRemovedData(prev =>
                prev.map(item =>
                    item.rentId === rentId ? { ...item, isDeleted: false } : item
                )
            );
        } catch (error) {
            alert('Failed to undo delete.');
        }
    }
};


  // Export PDF function
  const exportPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "RENT_ID",
      "PhoneNumber",
      "Owner Name",
      "Property Mode",
      "Property Type",
      "Rental Amount",
      "Area",
      "City",
      "Removed By (Phone)",
      "Removed At",
    ];

    // Format rows: join multiple removed phones and dates with newline
    const tableRows = filteredData.map((property) => [
      property.rentId,
      property.postedUserPhoneNumber,
      property.ownerName || "N/A",
      property.propertyMode || "N/A",
      property.propertyType || "N/A",
      property.rentalAmount || "N/A",
      property.area || "N/A",
      property.city || "N/A",
      property.favoriteRemoved?.map((fav) => fav.phoneNumber).join("\n") || "N/A",
      property.favoriteRemoved
        ?.map((fav) => (fav.removedAt ? moment(fav.removedAt).format("DD-MM-YYYY hh:mm A") : "N/A"))
        .join("\n") || "N/A",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [22, 160, 133] },
      theme: "grid",
    });

    doc.text("Favorite Removed Data", 14, 15);
    doc.save("FavoriteRemovedData.pdf");
  };

  // Export Excel function
  const exportExcel = () => {
    // Prepare worksheet data as array of objects
    const worksheetData = filteredData.map((property) => ({
      RENT_ID: property.rentId,
      PhoneNumber: property.postedUserPhoneNumber,
      OwnerName: property.ownerName || "N/A",
      PropertyMode: property.propertyMode || "N/A",
      PropertyType: property.propertyType || "N/A",
      RentalAmount: property.rentalAmount || "N/A",
      Area: property.area || "N/A",
      City: property.city || "N/A",
      RemovedByPhones:
        property.favoriteRemoved?.map((fav) => fav.phoneNumber).join(", ") || "N/A",
      RemovedAtDates:
        property.favoriteRemoved
          ?.map((fav) => (fav.removedAt ? moment(fav.removedAt).format("DD-MM-YYYY hh:mm A") : "N/A"))
          .join(", ") || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FavoriteRemoved");

    XLSX.writeFile(workbook, "FavoriteRemovedData.xlsx");
  };

    
  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
  
 

  return (
    <Container className="p-3">
      <h4 className="mb-4 text-primary fw-bold">Favorite Removed Data</h4>

      {/* Filters */}
      <Form     style={{ 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  backgroundColor: '#fff' 
}} className="mb-4">
        <Row className="g-3">
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Search Owner Name"
              value={searchOwner}
              onChange={(e) => setSearchOwner(e.target.value)}
            />
          </Col>
            <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Enter RENT ID"
    value={searchrentId}
    onChange={(e) => setSearchrentId(e.target.value)}    />
          </Col>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Search by Phone Number"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Col>
        </Row>
      </Form>

<button
  type="button"
  className="btn btn-secondary mb-3"
  onClick={() => {
    setSearchPhone('');
    setSearchOwner('');
    setSearchrentId('');
    setFromDate('');
    setEndDate('');
  }}
>
  Reset Filters
</button>
       {/* Export Buttons */}
      <div className="mb-3 d-flex gap-2">
        <button  className="text-white bg-success" onClick={exportExcel}>
          Download Excel
        </button>
        <button className="text-white bg-warning" onClick={exportPDF}>
          Download PDF
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
        </div>
      ) : filteredData.length === 0 ? (
        <p>No favorite removed data found.</p>
      ) : (
    <Table striped bordered hover responsive className="table-sm align-middle">
                  <thead className="sticky-top">
            <tr>
                <th>RENT_ID</th>
                <th>PhoneNumber</th>
              <th>Owner Name</th>
              <th>Property Mode</th>
              <th>Property Type</th>
              <th>Rental Amount</th>
              <th>Area</th>
              <th>City</th>
              <th>Removed By (Phone)</th>
              <th>Removed At</th>
              <th>Action</th>
             </tr>
          </thead>
          <tbody>
 
            {currentItems.map((property, index) => (
  <tr key={index}>
    <td style={{cursor: "pointer"}}     onClick={() =>
                              navigate(`/dashboard/detail`, {
                                state: { rentId: property.rentId, phoneNumber: property.phoneNumber },
                              })
                            }>{property.rentId}</td>
    <td>{property.postedUserPhoneNumber}</td>
    <td>{property.ownerName || "N/A"}</td>
    <td>{property.propertyMode || "N/A"}</td>
    <td>{property.propertyType || "N/A"}</td>
    <td>{property.rentalAmount || "N/A"}</td>
    <td>{property.area || "N/A"}</td>
    <td>{property.city || "N/A"}</td>
    <td>
      {property.favoriteRemoved?.map((fav, idx) => (
        <div key={idx}>{fav.phoneNumber || "N/A"}</div>
      ))}
    </td>
    <td>
      {property.favoriteRemoved?.map((fav, idx) => (
        <div key={idx}>
          {fav.removedAt
            ? moment(fav.removedAt).format("DD-MM-YYYY hh:mm A")
            : "N/A"}
        </div>
      ))}
    </td>
    <td>
      {property.isDeleted ? (
        <button className="btn btn-warning" onClick={() => handleUndoDelete(property.rentId)}>
          Undo
        </button>
      ) : (
        <button className="btn btn-danger" onClick={() => handleDelete(property.rentId)}>
          <MdDeleteForever size={24} />
        </button>
      )}
    </td>
          

  </tr>
))}

          </tbody>
        </Table>
      )}
      <div className="mt-3">
  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      onClick={() => setCurrentPage(i + 1)}
      className={`btn btn-sm me-2 ${currentPage === i + 1 ? "btn-primary" : "btn-outline-secondary"}`}
    >
      {i + 1}
    </button>
  ))}
</div>

    </Container>
  );
};

export default FavoriteRemoved;
