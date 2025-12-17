


import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import pic from "./Assets/Mask Group 3.png";
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
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");

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
<div className="col-md-3 d-flex align-items-end">
  <button className="btn mt-1 btn-success" onClick={handleExcelUpload}>
    Upload Excel
  </button>

  {message && <div className="alert alert-info mt-3">{message}</div>}


</div>


<div className="col-md-3 d-flex align-items-end">
<button  className="btn mt-1 btn-primary  mb-3" onClick={handleActivateAll}>
  Activate All
</button>
</div>


<div className="col-md-3 d-flex align-items-end">
<button  className="btn mt-1 btn-primary  mb-3" onClick={handleDeleteAll}>
  Delete All
</button>
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
    onClick={() => setFilters((prev) => ({ ...prev, fromDate: '', endDate: '' }))}
    style={{ padding: '4px 10px', cursor: 'pointer' , background:'orange'
    }}
  >
    Reset Dates
  </button>
</div>
              <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>

      <h2 className="mb-4 mt-5">User All Properties</h2>
    
              {filteredProperties.length > 0 ? (
         <div ref={tableRef}>      
                 <Table striped bordered hover responsive className="table-sm align-middle">
                               <thead className="sticky-top">
                    <tr>
                    <th>Image</th>
                    <th className="sticky-col sticky-col-1">Rent ID</th>
                    <th className="sticky-col sticky-col-2">Phone Number</th>
                     <th>Alter Phone Number</th>
                     <th><th>email</th></th>
                     <th>Otp Status</th>
              <th>Direct Verified User</th>
                     <th>Property Mode</th>
    <th>Property Type</th>
    <th>Rental Amount</th>
    <th>City</th>
    <th>Created By</th>
    <th>Mandatory</th>
    <th>Plan Name</th>

      <th>Created At</th>
      <th>Updated At</th>
      <th>No.Of.ADS </th>
      <th>Feature Property</th>

      <th>Admin Office</th>
<th>FollowUp Admin Name</th>
   <th>Plan Name</th>
              <th>Plan Type</th>
          <th>Plan Created</th>
                    <th>Plan UpdatedAt</th>


                        <th>Plan Expiry</th>
                <th>PayU Status</th>
          <th>Transaction ID</th>
                    <th>Plan Amount</th>

          <th>Plan CreatedBy</th>

          <th>Email</th>
          <th>payU Date</th>

<th>Bill No</th>
<th>Bill Date</th>
<th>Validity</th>
<th>Bill Expiry Date</th>

    <th>Features Property Status</th>
    <th>Status</th>
    <th>Actions</th>
                      <th>Active OR Pending</th>
                      <th>Permenent Delete</th>
                      
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProperties.map((property) => (
                      <tr key={property._id}>
                        <td>
                          <img
                            src={
                              property.photos && property.photos.length > 0
                                ? `https://rentpondy.com/PPC/${property.photos[0]}`
                                : pic
                            }
                            alt="Property"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          />
                        </td>
                        <td    onClick={() =>
                              navigate(`/dashboard/detail`, {
                                state: { rentId: property.rentId, phoneNumber: property.phoneNumber },
                              })
                            }
     style={{cursor: "pointer"}}
       className="sticky-col sticky-col-1">{property.rentId}</td>
                                  <td
  className={`sticky-col sticky-col-2 ${
    property.otpStatus !== 'verified' || !property.isVerifiedUser ? 'text-danger' : ''
  }`}
>
  {property.phoneNumber}
</td>
<td>{property.alternatePhone}</td>
<td>{property.email}</td>
                  <td>{property.otpStatus}</td>
<td>{property.isVerifiedUser ? 'True' : 'False'}</td>
                      <td>{property.propertyMode}</td>
                        <td>{property.propertyType}</td>
                        <td>{property.rentalAmount}</td>
                        <td>{property.city}</td>
                      
                        <td>{property.createdBy || 'N/A'}</td>
                        <td>{property.required}</td>
                        <td>{property.planName || 'N/A'}</td>

        <td>{property.createdAt ? new Date(property.createdAt).toLocaleString() : 'N/A'}</td>
        <td>{property.updatedAt ? new Date(property.updatedAt).toLocaleString() : 'N/A'}</td>
        <td> {property.adsCount} </td>
        <td>{property.featureStatus}</td>

        <td>{property.adminOffice}</td>
<td>{property.followUpAdminName}</td>
   <td>{property.paymentInfo?.planName}</td>
                  <td>{property.paymentInfo?.productinfo}</td>
              <td>{new Date(property.paymentInfo?.createdAt).toLocaleDateString()}</td>
                            <td>{new Date(property.paymentInfo?.updatedAt).toLocaleDateString()}</td>

              <td>{property.planExpiryDate}</td>
            <td>{property.paymentInfo?.payustatususer}</td>
<td>{property.paymentInfo?.txnid}</td>
<td>{property.paymentInfo?.amount}</td>
<td>{property.paymentInfo?.firstname}</td>  
<td>{property.paymentInfo?.email}</td>
<td>{property.paymentInfo?.payUdate ? new Date(property.paymentInfo.payUdate).toLocaleString() : 'N/A'}</td>

<td>{property.billNo}</td>
<td>{property.billDate}</td>
<td>{property.validity}</td>
<td>{property.billExpiryDate}</td>

                        {/* Feature Status Toggle Button */}
                        <td>
                          <Button
                            variant={property.featureStatus === "yes" ? "danger" : "success"}
                            size="sm"
                            onClick={() => handleFeatureStatusChange(property.rentId, property.featureStatus)}
                          >
                            {property.featureStatus === "yes" ? "Set to No" : "Set to Yes"}
                          </Button>
                        </td>

 
<td>
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
            : "#6c757d", // default gray for other statuses
        color: "white",
      }}
    >
      {statusProperties[property.rentId] 
        ? statusProperties[property.rentId].charAt(0).toUpperCase() + statusProperties[property.rentId].slice(1)
        : "Pending"}
    </span>
  )}
</td>

                       <td>
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

                        {/* Status Change Button */}
                        <td>
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

                        <td>
  <Button
    variant="danger"
    size="sm"
    onClick={() => handlePermanentDelete(property.rentId)}
  >
   <MdDeleteForever /> Permenent 
  </Button>
</td>

                     
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
