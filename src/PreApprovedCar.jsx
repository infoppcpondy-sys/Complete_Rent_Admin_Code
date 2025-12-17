 
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { Table, Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { FaEdit, FaEye, FaUndo } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const PreApprovedCar = () => {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [rentIdSearch, setrentIdSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentrentId, setCurrentrentId] = useState('');
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState('');
  const [deletionReason, setDeletionReason] = useState('');
  const [phoneNumberSearch, setPhoneNumberSearch] = useState('');
  const [featureStatusFilter, setFeatureStatusFilter] = useState('');
  const [billMap, setBillMap] = useState({});
  const [followUpMap, setFollowUpMap] = useState({});

  const navigate = useNavigate();
  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");

  const statusColorMap = {
    active: "#28a745",
    pending: "#ffc107",
    complete: "#6610f2",
    delete: "#dc3545"
  };

  useEffect(() => {
    const fetchPreApprovedProperties = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/properties/pre-approved-all-rent`);
        const sortedUsers = res.data.users.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProperties(sortedUsers);
        setFiltered(sortedUsers);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPreApprovedProperties();
  }, []);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/bills`);
        const map = {};
        res.data.data.forEach(bill => {
          if (!map[bill.rentId]) {
            map[bill.rentId] = {
              adminName: bill.adminName,
              billNo: bill.billNo
            };
          }
        });
        setBillMap(map);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBills();
  }, []);

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/followup-list`);
        const map = {};
        res.data.data.forEach(f => {
          if (!map[f.rentId]) {
            map[f.rentId] = {
              adminName: f.adminName,
              createdAt: f.createdAt
            };
          }
        });
        setFollowUpMap(map);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFollowUps();
  }, []);
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
  const handleSearch = () => {
    let result = [...properties];

    if (rentIdSearch.trim()) {
      const query = rentIdSearch.trim().toLowerCase();
      result = result.filter((prop) => {
        const ppc = String(prop.rentId || '').toLowerCase();
        return ppc.includes(query);
      });
    }

    if (phoneNumberSearch.trim()) {
      const query = phoneNumberSearch.trim().toLowerCase();
      result = result.filter((prop) => {
        const phone = String(prop.phoneNumber || '').toLowerCase();
        return phone.includes(query);
      });
    }

    if (featureStatusFilter) {
      result = result.filter((prop) => prop.status === featureStatusFilter);
    }

    result = result.filter((prop) => {
      const createdDate = new Date(prop.createdAt).toISOString().split("T")[0];
      const matchStart = !startDate || createdDate >= startDate;
      const matchEnd = !endDate || createdDate <= endDate;
      return matchStart && matchEnd;
    });

    setFiltered(result);
  };

  useEffect(() => {
    handleSearch();
  }, [properties, rentIdSearch, startDate, endDate, featureStatusFilter]);

  const handleReset = () => {
    setPhoneNumberSearch('');
    setrentIdSearch('');
    setStartDate('');
    setEndDate('');
    setFeatureStatusFilter('');
    setFiltered(properties);
  };

  const handleStatusChange = async (rentId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "pending" : "active";

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/update-property-status`, {
        rentId,
        status: newStatus,
      });

      setProperties(prev => prev.map(prop => 
        prop.rentId === rentId ? { ...prop, status: newStatus } : prop
      ));
      
      setFiltered(prev => prev.map(prop => 
        prop.rentId === rentId ? { ...prop, status: newStatus } : prop
      ));
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const handleFeatureStatusChange = async (rentId, currentStatus) => {
    const newStatus = currentStatus === "yes" ? "no" : "yes";
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/update-feature-status`, {
        rentId,
        featureStatus: newStatus,
      });

      setProperties(prev => prev.map(prop => 
        prop.rentId === rentId ? { ...prop, featureStatus: newStatus } : prop
      ));
      
      setFiltered(prev => prev.map(prop => 
        prop.rentId === rentId ? { ...prop, featureStatus: newStatus } : prop
      ));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (rentId, phoneNumber) => {
    setCurrentrentId(rentId);
    setCurrentPhoneNumber(phoneNumber);
    setShowDeleteModal(true);
  };

  
const handleDeleteConfirm = async () => {
  if (!deletionReason.trim()) {
    alert("Please enter a deletion reason");
    return;
  }

  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/admin-delete`,
      { deletionReason },
      { params: { rentId: currentrentId } }
    );

    const updatedItem = response.data?.data;

    const updatedProperties = properties.map(prop =>
      prop.rentId === currentrentId ? { ...prop, ...updatedItem } : prop
    );

    setProperties(updatedProperties);
    setFiltered(updatedProperties);
    setShowDeleteModal(false);
    setDeletionReason('');
    alert("Property marked as deleted successfully!");
  } catch (error) {
    alert(error.response?.data?.message || 'Error deleting property');
  }
};

// ✅ UNDO DELETE (Restore Status)
const handleUndo = async (rentId) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/admin-undo-delete`,
      {},
      { params: { rentId } }
    );

    const updatedItem = response.data?.data;

    const updatedProperties = properties.map(prop =>
      prop.rentId === rentId ? { ...prop, ...updatedItem } : prop
    );

    setProperties(updatedProperties);
    setFiltered(updatedProperties);
    alert("Delete action undone successfully!");
  } catch (error) {
    alert(error.response?.data?.message || 'Error undoing delete');
  }
};

  
  
  const handlePermanentDelete = async (rentId) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this record?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/delete-rentId-data`,
        {
          params: { rentId },
          data: { deletedBy: adminName }
        }
      );

      if (response.status === 200) {
        alert("User permanently deleted successfully!");
        const updatedProperties = properties.filter(property => property.rentId !== rentId);
        setProperties(updatedProperties);
        setFiltered(updatedProperties);
      } else {
        alert(response.data.message || "Failed to delete user.");
      }
    } catch (error) {
      alert("An error occurred while deleting.");
      console.error(error);
    }
  };

  const handleCreateAction = (actionType, rentId, phoneNumber) => {
    const confirmMessage = `Do you want to create ${actionType}?`;
    if (!window.confirm(confirmMessage)) return;

    if (actionType === 'FollowUp') {
      navigate('/dashboard/create-followup', {
        state: { rentId: rentId, phoneNumber: phoneNumber },
      });
    } else if (actionType === 'Bill') {
      navigate('/dashboard/create-bill', {
        state: { rentId: rentId, phoneNumber: phoneNumber },
      });
    }
  };

  return (
    <div className="p-3">
      <h4>Pending Properties</h4>
      <form className="d-flex flex-row gap-2 align-items-center flex-nowrap" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className="form-control"
          placeholder="RENT ID"
          value={rentIdSearch}
          onChange={(e) => setrentIdSearch(e.target.value)}
          style={{ maxWidth: "150px" }}
        />

        <input
          type="text"
          className="form-control"
          placeholder="Phone Number"
          value={phoneNumberSearch}
          onChange={(e) => setPhoneNumberSearch(e.target.value)}
        />

        <select
          className="form-select"
          value={featureStatusFilter}
          onChange={(e) => setFeatureStatusFilter(e.target.value)}
          style={{ maxWidth: "150px" }}
        >
          <option value="">All Status</option>
          <option value="complete">Complete</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="delete">Deleted</option>
        </select>

        <input
          type="date"
          className="form-control"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ maxWidth: "150px" }}
        />

        <input
          type="date"
          className="form-control"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ maxWidth: "150px" }}
        />

        <button type="button" className="btn btn-outline-primary" onClick={handleSearch}>
          Search
        </button>

        <button type="button" className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </form>
              <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
      <h3 className="text-success mt-3 mb-4">Pre Approved Properties All Datas</h3>
<div ref={tableRef}>
      <Table striped bordered hover responsive className="table-sm align-middle">
        <thead className="sticky-top">
          <tr>
            <th>S.No</th>
            <th>Image</th>
            <th className="sticky-col sticky-col-1">Rent Id</th>
            <th>Views</th>
            <th className="sticky-col sticky-col-2">PhoneNumber</th>
            <th>Otp Status</th>
            <th>Direct Verified User</th>
            <th>Property Type</th>
            <th>Property Mode</th>
            <th>Rental Amount</th>
            <th>City</th>
            <th>CreatedBy</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>No.Of.Ads</th>
            <th>Mandatory</th>
            <th>Set rentId Status</th>
            <th>Set rentId Assigned Date</th>
            <th>Set rentId Assigned PhoneNumber</th>
            <th>Plan Name</th>
            <th>Plan Type</th>
            <th>Plan Created</th>
            <th>Plan Expiry</th>
            <th>PayU Status</th>
            <th>Transaction ID</th>
            <th>Plan Amount</th>
            <th>Plan CreatedBy</th>
            <th>Email</th>
            <th>payU Date</th>
            <th>Deletion Reason</th>
            <th>Deleted At</th>
            <th>Feature Status</th>
            <th>Status</th>
            <th>Action</th>
            <th>Change Status</th>
            <th>Create FollowUp</th>
            <th>Create Bill</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="36" className="text-center">No properties found.</td>
            </tr>
          ) : (
            filtered.map((prop, idx) => (
              <tr key={prop._id}>
                <td>{idx + 1}</td>
                <td>
                  <img
                    src={prop.photos?.[0] ? `https://rentpondy.com/PPC/${prop.photos[0].replace(/\\/g, '/')}` : 'https://d17r9yv50dox9q.cloudfront.net/car_gallery/default.jpg'}
                    alt="Property"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td
                  className="sticky-col sticky-col-1"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate('/dashboard/detail', {
                      state: { rentId: prop.rentId, phoneNumber: prop.phoneNumber }
                    })
                  }
                >
                  {prop.rentId}
                </td>
                <td><FaEye /> {prop.views}</td>
                <td className={`sticky-col sticky-col-2 ${prop.otpStatus !== 'verified' || !prop.isVerifiedUser ? 'text-danger' : ''}`}>
                  {prop.phoneNumber}
                </td>
                <td>{prop.otpStatus}</td>
                <td>{prop.isVerifiedUser ? 'True' : 'False'}</td>
                <td>{prop.propertyType}</td>
                <td>{prop.propertyMode}</td>
                <td>{prop.rentalAmount}</td>
                <td>{prop.city || '-'}</td>
                <td>{prop.createdBy}</td>
                <td>{prop.createdAt ? new Date(prop.createdAt).toLocaleDateString() : new Date(prop.planCreatedAt).toLocaleDateString()}</td>
                <td>{prop.updatedAt ? new Date(prop.updatedAt).toLocaleDateString() : '-'}</td>
                <td>{prop.adsCount}</td>
                <td>{prop.required}</td>
                <td>{prop.setrentId ? 'True' : 'False'}</td>
                <td>{prop.setrentIdAssignedAt ? new Date(prop.setrentIdAssignedAt).toLocaleDateString() : 'N/A'}</td>
                <td>{prop.assignedPhoneNumber || 'N/A'}</td>
                <td>{prop.planName}</td>
                <td>{prop.packageType}</td>
                <td>{new Date(prop.planCreatedAt).toLocaleDateString()}</td>
                <td>{prop.planExpiryDate}</td>
                <td>{prop.paymentData?.payustatususer}</td>
                <td>{prop.paymentData?.txnid}</td>
                <td>{prop.paymentData?.amount}</td>
                <td>{prop.paymentData?.firstname}</td>
                <td>{prop.paymentData?.email}</td>
                <td>{prop.paymentData?.payUdate}</td>
                <td>{prop.deletionReason || '-'}</td>
                <td>{prop.deletionDate ? new Date(prop.deletionDate).toLocaleString() : '-'}</td>

                <td>
                  <Button
                    variant={prop.featureStatus === "yes" ? "danger" : "success"}
                    size="sm"
                    onClick={() => handleFeatureStatusChange(prop.rentId, prop.featureStatus)}
                  >
                    {prop.featureStatus === "yes" ? "Set to No" : "Set to Yes"}
                  </Button>
                </td>

                <td>
                  <span style={{
                    padding: "5px 10px",
                    borderRadius: "5px",
                    backgroundColor: statusColorMap[prop.status] || "#343a40",
                    color: "white",
                  }}>
                    {prop.status}
                  </span>
                  {prop.status === "delete" && (
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>
                      <strong>Reason:</strong> {prop.deletionReason || "-"}<br />
                      <strong>Date:</strong> {prop.deletionDate ? new Date(prop.deletionDate).toLocaleString() : "-"}
                    </div>
                  )}
                </td>

                <td>
                  {prop.status === "delete" ? (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleUndo(prop.rentId)}
                    >
                      <FaUndo /> Undo
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate('/dashboard/edit-property', {
                          state: { rentId: prop.rentId, phoneNumber: prop.phoneNumber }
                        })}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(prop.rentId, prop.phoneNumber)}
                      >
                        <MdDeleteForever />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="mt-2"
                        onClick={() => handlePermanentDelete(prop.rentId)}
                      >
                        <MdDeleteForever /> Permanent
                      </Button>
                    </>
                  )}
                </td>

                <td>
                  {prop.status !== "delete" && (
                    <Button
                      variant=""
                      size="sm"
                      style={{
                        backgroundColor: "#6c757d",
                        color: "#fff",
                        border: "none"
                      }}
                      onClick={() => handleStatusChange(prop.rentId, prop.status || "pending")}
                    >
                      {prop.status === "active" ? "Set Pending" : "Set Active"}
                    </Button>
                  )}
                </td>

                <td>
                  {followUpMap[prop.rentId] ? (
                    <div className="text-success">
                      <div><strong>{followUpMap[prop.rentId].adminName}</strong></div>
                      <div>
                        <small>{new Date(followUpMap[prop.rentId].createdAt).toLocaleDateString()}</small>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleCreateAction("FollowUp", prop.rentId, prop.phoneNumber)}
                    >
                      Create Follow-up
                    </button>
                  )}
                </td>

                <td>
                  {followUpMap[prop.rentId] && !billMap[prop.rentId] ? (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleCreateAction("Bill", prop.rentId, prop.phoneNumber)}
                    >
                      Create Bill
                    </button>
                  ) : billMap[prop.rentId] ? (
                    <span className="text-success">Bill Created</span>
                  ) : (
                    <span className="text-muted">Follow-up Required</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
</div>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete property {currentrentId}?</p>
          <Form.Group controlId="deletionReason">
            <Form.Label>Deletion Reason (required)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={deletionReason}
              onChange={(e) => setDeletionReason(e.target.value)}
              placeholder="Enter reason for deletion"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={!deletionReason.trim()}
          >
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PreApprovedCar;
