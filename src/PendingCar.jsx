 

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Table, Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const PendingProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [rentIdSearch, setRentIdSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRentId, setCurrentRentId] = useState('');
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState('');
  const [deletionReason, setDeletionReason] = useState('');
  const [phoneNumberSearch, setPhoneNumberSearch] = useState('');
  const [followUpMap, setFollowUpMap] = useState({});
    const [statusProperties, setStatusProperties] = useState({});


  const navigate = useNavigate();

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
      console.error("Error fetching follow-ups:", err);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const handleCreateAction = (actionType, rentId, phoneNumber) => {
    const confirmMessage = `Do you want to create ${actionType}?`;
    if (window.confirm(confirmMessage)) {
      if (actionType === 'FollowUp') {
        navigate('/dashboard/create-followup', {
          state: { rentId, phoneNumber },
        });
      } else if (actionType === 'Bill') {
        navigate('/dashboard/create-bill', {
          state: { rentId, phoneNumber },
        });
      }
    }
  };

  
      useEffect(() => {
        const fetchPendingProperties = async () => {
          try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/properties/pending-rent`);
            
            const sortedUsers = res.data.users.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // New to old
            );
            
            setProperties(sortedUsers);
            setFiltered(sortedUsers);
          } catch (err) {
          }
        };
        fetchPendingProperties();
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
      result = result.filter(prop => 
        String(prop.rentId || '').toLowerCase().includes(query)
      );
    }
    if (phoneNumberSearch.trim()) {
      const query = phoneNumberSearch.trim().toLowerCase();
      result = result.filter(prop => 
        String(prop.phoneNumber || '').toLowerCase().includes(query)
      );
    }
    result = result.filter(prop => {
      const createdDate = new Date(prop.createdAt).toISOString().split("T")[0];
      const matchStart = !startDate || createdDate >= startDate;
      const matchEnd = !endDate || createdDate <= endDate;
      return matchStart && matchEnd;
    });
    setFiltered(result);
  };

  useEffect(() => {
    handleSearch();
  }, [properties, rentIdSearch, startDate, endDate, phoneNumberSearch]);

  const handleReset = () => {
    setPhoneNumberSearch('');
    setRentIdSearch('');
    setStartDate('');
    setEndDate('');
    setFiltered(properties);
  };
// 🔁 Handle Delete Confirmation
const handleDeleteConfirm = async () => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/admin-delete`,
      { deletionReason },
      { params: { rentId: currentRentId } }
    );

    const updated = response.data?.data;

    // ✅ Update the frontend state with updated property
    setProperties(prev =>
      prev.map(prop =>
        prop.rentId === currentRentId ? { ...prop, ...updated } : prop
      )
    );

    setShowDeleteModal(false);
    setDeletionReason('');
  } catch (error) {
    alert(error.response?.data?.message || 'Error deleting property');
  }
};

// 🔄 Handle Undo Delete
const handleUndo = async (rentId) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/admin-undo-delete`,
      {},
      { params: { rentId } }
    );

    const updated = response.data?.data;

    // ✅ Replace the local property with backend response (restored)
    setProperties(prev =>
      prev.map(prop =>
        prop.rentId === rentId ? { ...prop, ...updated } : prop
      )
    );
  } catch (error) {
    alert(error.response?.data?.message || 'Error undoing delete');
  }
};


  const handleDeleteClick = (rentId, phoneNumber) => {
    setCurrentRentId(rentId);
    setCurrentPhoneNumber(phoneNumber);
    setShowDeleteModal(true);
  };

  const handlePermanentDelete = async (rentId) => {
      const confirmDelete = window.confirm("Are you sure you want to permanently delete this record?");
      if (!confirmDelete) return;
    
      try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/delete-rentId-data`, {
          params: { rentId },
        });
    
        if (response.status === 200) {
          alert("User Permenent deleted successfully!");
    
          // Remove from UI list
          setProperties((prevProperties) =>
            prevProperties.filter((property) => property.rentId !== rentId)
          );
    
          // Also update localStorage if status is stored
          const updatedStatus = { ...statusProperties };
          delete updatedStatus[rentId];
          setStatusProperties(updatedStatus);
          localStorage.setItem("statusProperties", JSON.stringify(updatedStatus));
        } else {
          alert(response.data.message || "Failed to delete user.");
        }
      } catch (error) {
        alert("An error occurred while deleting.");
      }
    };
  

  return (
    <div className="p-3">
      <h4>Pending Properties</h4>
      <form onSubmit={(e) => e.preventDefault()} className="d-flex flex-row gap-2 align-items-center flex-nowrap">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Rent ID"
          value={rentIdSearch}
          onChange={(e) => setRentIdSearch(e.target.value)}
          style={{ maxWidth: "150px" }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Search by Phone Number"
          value={phoneNumberSearch}
          onChange={(e) => setPhoneNumberSearch(e.target.value)}
          style={{ maxWidth: "150px" }}
        />
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
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="secondary" onClick={handleReset} style={{ marginLeft: "10px" }}>
          Reset
        </Button>
      </form>
              <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
<div ref={tableRef}>
      <Table striped bordered hover responsive className="table-sm align-middle mt-3">
        <thead className="sticky-top">
          <tr>
            <th>S.No</th>
            <th>Image</th>
            <th className="sticky-col sticky-col-1">Rent ID</th>
            <th>Views</th>
            <th className="sticky-col sticky-col-2">PhoneNumber</th>
            <th>Property Type</th>
            <th>Property Mode</th>
            <th>Rental Amount</th>
            <th>City</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Deletion Reason</th>
            <th>Deleted At</th>
            <th>Plan Name</th>
            <th>Plan Type</th>
            <th>Plan Created</th>
            <th>Plan Expiry</th>
            <th>Remaining Days</th>
            <th>PayU Status</th>
            <th>Payment ID</th>
            <th>Transaction ID</th>
            <th>Action</th>
            <th>Perment Delete</th>
            <th>Create FollowUp</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="22" className="text-center">No properties found.</td>
            </tr>
          ) : (
            filtered.map((prop, idx) => (
              <tr key={prop._id} className={prop.status === "delete" ? 'table-danger' : ''}>
                <td>{idx + 1}</td>
                <td>
                  <img
                    src={prop.photos?.[0] ? 
                      `https://RENTpondy.com/PPC/${prop.photos[0].replace(/\\/g, '/')}` : 
                      'https://d17r9yv50dox9q.cloudfront.net/car_gallery/default.jpg'}
                    alt="Property"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td 
                  className="sticky-col sticky-col-1" 
                  style={{cursor: "pointer"}}
                  onClick={() => navigate('/dashboard/detail', {
                    state: { rentId: prop.rentId, phoneNumber: prop.phoneNumber },
                  })}
                >
                  {prop.rentId}
                </td>
                <td><FaEye /> {prop.views}</td>
                <td className="sticky-col sticky-col-2">{prop.phoneNumber}</td>
                <td>{prop.propertyType}</td>
                <td>{prop.propertyMode}</td>
                <td>{prop.rentalAmount}</td>
                <td>{prop.city}</td>
                <td>{new Date(prop.createdAt).toLocaleDateString()}</td>
                <td>{prop.status}</td>
                <td>{prop.deletionReason || '-'}</td>
                <td>{prop.deletionDate ? new Date(prop.deletionDate).toLocaleString() : '-'}</td>
                <td>{prop.planName}</td>
                <td>{prop.packageType}</td>
                <td>{prop.planCreatedAt}</td>
                <td>{prop.planExpiryDate}</td>
                <td>{prop.remainingDays}</td>
                <td>{prop.payUStatus}</td>
                <td>{prop.paymentId}</td>
                <td>{prop.transactionId}</td>
                <td>
                  {prop.status === "delete" ? (
                    <>
                      <Button 
                        variant="success" 
                        size="sm" 
                        onClick={() => handleUndo(prop.rentId)}
                        className="me-2"
                      >
                        Undo
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handlePermanentDelete(prop.rentId)}
                      >
                        <MdDeleteForever /> Permanent
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          navigate('/dashboard/edit-property', {
                            state: { rentId: prop.rentId, phoneNumber: prop.phoneNumber },
                          })
                        }
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
                    </>
                  )}
                </td>
                <td>
          
                <Button className="mt-1"
                        variant="warning"
                        size="sm"
                        onClick={() => handlePermanentDelete(prop.rentId)}
                      >
                      <MdDeleteForever /> Permenent 
                      </Button>
                </td>

                <td>
                  {followUpMap[prop.rentId] ? (
                    <div className="text-success">
                      <div><strong>{followUpMap[prop.rentId].adminName}</strong></div>
                      <div>
                        <small>
                          {new Date(followUpMap[prop.rentId].createdAt).toLocaleDateString()}
                        </small>
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
          <p>Are you sure you want to delete property {currentRentId}?</p>
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

export default PendingProperties;