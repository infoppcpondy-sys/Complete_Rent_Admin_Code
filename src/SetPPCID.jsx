






import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaTrash, FaUndo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const SetRENTID = () => {
  const [rentId, setrentId] = useState('');
  const [assignedPhoneNumber, setAssignedPhoneNumber] = useState('');
  const [allProperties, setAllProperties] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAssignPhone = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/assign-phone`, {
        rentId,
        assignedPhoneNumber,
      });
      setMessage(response.data.message);
      setError('');
      fetchAllProperties(); // refresh table
      setrentId('');
      setAssignedPhoneNumber('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error occurred');
      setMessage('');
    }
  };

  const handleDelete = async (rentId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/unassign-phone`, { rentId });
      setMessage('Phone assignment removed temporarily.');
      setError('');
      fetchAllProperties();
    } catch (err) {
      setError(err.response?.data?.error || 'Error occurred during delete');
      setMessage('');
    }
  };

  const handleUndo = async (rentId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/undo-unassign-phone`, { rentId });
      setMessage('Phone assignment restored.');
      setError('');
      fetchAllProperties();
    } catch (err) {
      setError(err.response?.data?.error || 'Error occurred during undo');
      setMessage('');
    }
  };

  const fetchAllProperties = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-property-details`);
      setAllProperties(response.data);
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchAllProperties();
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

  const handlePermanentDelete = async (rentId) => {
  const confirmed = window.confirm(`Are you sure you want to permanently delete RENT ID ${rentId}?`);
  if (!confirmed) return;

  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/permanent-delete/${rentId}`);
    setMessage(`Permanently deleted RENT ID ${rentId}`);
    setError('');
    fetchAllProperties();
  } catch (err) {
    setError(err.response?.data?.error || 'Error during permanent deletion');
    setMessage('');
  }
};

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Property Phone Set rentId Assign</h2>

      <div     className="d-flex flex-row gap-2 align-items-center flex-nowrap"
>
        <label>RENT ID: </label>
        <input
          type="text"
          value={rentId}
          onChange={(e) => setrentId(e.target.value)}
          placeholder="Enter RENT ID"
          style={{ marginRight: '10px' }}
        />

        <label>Assign Phone: </label>
        <input
          type="text"
          value={assignedPhoneNumber}
          onChange={(e) => setAssignedPhoneNumber(e.target.value)}
          placeholder="Enter Phone"
          style={{ marginRight: '10px' }}
        />

        <button className='text-white bg-primary' onClick={handleAssignPhone}>Assign</button>
      </div>
              <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3 style={{ marginTop: '30px' }}>All Property Assignments</h3>
 <div ref={tableRef}>    <table border="1" cellPadding="10" style={{ marginTop: '10px', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>RENT ID</th>
            <th>Original Phone Number</th>
            <th>Assigned Phone Number</th>
            <th>Assignment Status</th>
            <th> Date </th>
            <th>Actions</th>
            <th>Permanent</th>
            {/* <th>View Details</th> */}

          </tr>
        </thead>
        <tbody>
          {allProperties.map((prop, index) => (
            <tr key={prop.rentId}>
              <td>{index + 1}</td>
              <td style={{cursor: "pointer"}}  onClick={() =>
                              navigate(`/dashboard/detail`, {
                                state: { rentId: prop.rentId, phoneNumber: prop.phoneNumber },
                              })
                            }>{prop.rentId}</td>
              <td>{prop.originalPhoneNumber || 'N/A'}</td>
              <td>{prop.assignedPhoneNumber || 'Not Assigned'}</td>
              <td>{prop.setRentId ? 'Assigned' : 'Unassigned'}</td>
<td>
  {prop.setRentAssignedAt
    ? new Date(prop.setRentAssignedAt).toISOString().split('T')[0]
    : 'N/A'}
</td>              <td>
                {prop.setRentId ? (
                  <button style={{ background: '#dc3545', color: '#fff' }} onClick={() => handleDelete(prop.rentId)}>
                    <FaTrash />
                  </button>
                ) : (
                  <button style={{ background: '#28a745', color: '#fff' }} onClick={() => handleUndo(prop.rentId)}>
                    <FaUndo />
                  </button>
                )}
              </td>

              <td>
  <button
    style={{ background: '#000', color: '#fff' }}
    onClick={() => handlePermanentDelete(prop.rentId)}
  >
    Permanent Delete
  </button>
</td>
 
            </tr>
          ))}
        </tbody>
      </table>
      </div> 
    </div>
  );
};

export default SetRENTID;


