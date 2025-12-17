

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, Badge } from 'react-bootstrap';
import { FaTrash, FaUndo, FaInfoCircle } from 'react-icons/fa';

const BuyerAssistanceActive = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
const [baId, setBaId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/raActive-buyerAssistance-all-plans-rent`);
      setData(res.data.data);
      setFilteredData(res.data.data);
    } catch (error) {
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
  const handleFilter = () => {
    let filtered = data;

    if (phoneNumber) {
      filtered = filtered.filter(item =>
        item.phoneNumber.includes(phoneNumber)
      );
    }
  if (baId) {
    filtered = filtered.filter(item =>
      String(item.Ra_Id || '').includes(baId)
    );
  }

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(item => {
        const createdAt = new Date(item.planDetails.planCreatedAt);
        return createdAt >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      filtered = filtered.filter(item => {
        const createdAt = new Date(item.planDetails.planCreatedAt);
        return createdAt <= end;
      });
    }

    setFilteredData(filtered);
  };

const handleReset = () => {
  setPhoneNumber('');
  setBaId('');
  setStartDate('');
  setEndDate('');
  setFilteredData(data); // Reset to original data
};


const handleSoftDelete = async (_id) => {
  if (!window.confirm("Are you sure you want to delete this request?")) return;

  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/delete-buyer-assistances/${_id}`);
    alert("Tenant Assistance request deleted successfully.");

    setData(prevData =>
      prevData.map(item =>
        item._id === _id ? { ...item, isDeleted: true } : item
      )
    );

    setFilteredData(prevData =>
      prevData.map(item =>
        item._id === _id ? { ...item, isDeleted: true } : item
      )
    );
  } catch (error) {
    alert(`Error deleting Tenant Assistance: ${error.response?.data?.message || error.message}`);
  }
};

const handleUndoDelete = async (_id) => {
  if (!window.confirm("Are you sure you want to restore this request?")) return;

  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/undo-delete-buyer-assistances/${_id}`);
    alert("Tenant Assistance request restored successfully.");

    setData(prevData =>
      prevData.map(item =>
        item._id === _id ? { ...item, isDeleted: false } : item
      )
    );

    setFilteredData(prevData =>
      prevData.map(item =>
        item._id === _id ? { ...item, isDeleted: false } : item
      )
    );
  } catch (error) {
    alert(`Error restoring Tenant Assistance: ${error.response?.data?.message || error.message}`);
  }
};

 
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Expired Buyer Assistance</h2>

      {/* Filter Form */}
      <form     style={{ 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  backgroundColor: '#fff' 
}}
        onSubmit={(e) => {
          e.preventDefault();
          handleFilter();
        }}
 className="d-flex flex-row gap-2 align-items-center flex-nowrap"      >

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
      

        <div className="mt-4 text-right">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          >
            Apply Filters
          </button>

            <button
onClick={handleReset}         
   className="btn btn-primary ms-2 text-white px-6 py-2 rounded shadow"
          >
            Reset
          </button>
        </div>
      </form>
              <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
      {/* Data Table */}
      <div className="overflow-x-auto mt-5 mb-3">
        <h3 className="text-primary">All Buyer Assistance With Plan Datas</h3>
    <div ref={tableRef}>    <Table striped bordered hover responsive className="table-sm align-middle">
          <thead className="sticky-top">
            <tr>
              <th className="border px-4 py-2">Ra_Id</th>
              <th className="border px-4 py-2">Phone Number</th>
              <th className="border px-4 py-2">Tanent Name</th>
              <th className="border px-4 py-2">PropertyMode</th>
              <th className="border px-4 py-2">Property Type</th>
              <th className="border px-4 py-2">Min Price</th>
              <th className="border px-4 py-2">Max Price</th>
              <th className="border px-4 py-2">Plan Name</th>
              <th className="border px-4 py-2">Created At</th>
              <th className="border px-4 py-2">Duration (Days)</th>
              <th className="border px-4 py-2">Expiry Date</th>
              <th className="border px-4 py-2">Package Type</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr key={idx} className="text-center">
                <td className="border px-4 py-2">{item.Ra_Id}</td>
                <td className="border px-4 py-2">{item.phoneNumber}</td>
                <td className="border px-4 py-2">{item.raName}</td>
                <td className="border px-4 py-2">{item.propertyMode}</td>
                <td className="border px-4 py-2">{item.propertyType}</td>
                <td className="border px-4 py-2">{item.minPrice}</td>
                <td className="border px-4 py-2">{item.maxPrice}</td>

                <td className="border px-4 py-2">{item.planDetails.planName}</td>
                <td className="border px-4 py-2">{item.planDetails.planCreatedAt}</td>
                <td className="border px-4 py-2">{item.planDetails.durationDays}</td>
                <td className="border px-4 py-2">{item.planDetails.planExpiryDate}</td>
                <td className="border px-4 py-2">{item.planDetails.packageType}</td>
              

<td className="border px-4 py-2">
  {item.isDeleted ? (
    <Badge bg="danger" className="d-flex align-items-center justify-content-center">
      <FaTrash className="me-1" /> Deleted
    </Badge>
  ) : (
    <Badge bg="success" className="d-flex align-items-center justify-content-center">
      <FaInfoCircle className="me-1" /> raActive
    </Badge>
  )}
</td>

 


<td className="border px-4 py-2">
  {item.isDeleted ? (
    <button
      onClick={() => handleUndoDelete(item._id)}   // ✅ use _id
      className="d-flex align-items-center justify-content-center btn btn-outline-primary btn-sm mx-auto"
    >
      <FaUndo className="me-1" /> Undo
    </button>
  ) : (
    <button
      onClick={() => handleSoftDelete(item._id)}   // ✅ use _id
      className="d-flex align-items-center justify-content-center btn btn-outline-danger btn-sm mx-auto"
    >
      <FaTrash className="me-1" /> Delete
    </button>
  )}
</td>


              </tr>
            ))}
          </tbody>
        </Table>
    </div>  </div>
    </div>
  );
};

export default BuyerAssistanceActive;