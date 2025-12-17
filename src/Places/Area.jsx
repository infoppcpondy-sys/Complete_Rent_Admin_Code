 

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";

const ActivePropertyFilterTable = () => {
  const [states, setStates] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    fetchStateAreaData();
    fetchActiveProperties();
  }, []);

  useEffect(() => {
    filterProperties();
    setCurrentPage(1); // Reset to first page when filter changes
  }, [selectedState, selectedArea, properties]);

  // ✅ Fetch states from /fetch and areas from /unique-areas
  const fetchStateAreaData = async () => {
    try {
      // Fetch states
      const stateRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch`);
      const allData = stateRes.data.data || [];

      const stateValues = allData
        .filter(item => item.field === "state")
        .map(item => item.value);

      setStates([...new Set(stateValues)]);

      // Fetch unique areas
      const areaRes = await axios.get(`${process.env.REACT_APP_API_URL}/unique-areas`);
      const areaValues = areaRes.data.areas || [];
      setAreas(areaValues);
    } catch (err) {
      console.error("Error fetching state or area data:", err);
    }
  };

  const fetchActiveProperties = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/active-properties-area`);
      const allData = res.data.data || [];
      setProperties(allData);
    } catch (err) {
      console.error("Error fetching active properties:", err);
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
  const filterProperties = () => {
    let filtered = properties;

    if (selectedState) {
      filtered = filtered.filter(item => item.state === selectedState);
    }

    if (selectedArea) {
      filtered = filtered.filter(item => item.area === selectedArea);
    }

    setFilteredProperties(filtered);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const goToPrevious = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

 
  return (
    <div style={{ padding: "20px" }}>
      <h3>Active Properties Area Data Filter</h3>

      {/* Filters */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label>Select State:</label><br />
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedArea("");
            }}
          >
            <option value="">-- All States --</option>
            {states.map((state, i) => (
              <option key={i} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Select Area:</label><br />
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="">-- All Areas --</option>
            {areas.map((area, i) => (
              <option key={i} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>
              <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
      {/* Table */}
      {filteredProperties.length === 0 ? (
        <p>No matching active properties.</p>
      ) : (
        <>
        <div ref={tableRef}>

          <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Rent ID</th>
                <th>Phone Number</th>
                <th>Status</th>
                <th>State</th>
                <th>Area</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((property, i) => (
                <tr key={i}>
                  <td>{indexOfFirstItem + i + 1}</td>
                  <td>{property.rentId}</td>
                  <td>{property.phoneNumber}</td>
                  <td>{property.status}</td>
                  <td>{property.state}</td>
                  <td>{property.area}</td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
          {/* Pagination */}
          <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px" }}>
            <button onClick={goToPrevious} className="bg-primary" disabled={currentPage === 1}>⬅ Prev</button>
            <span><strong>Page {currentPage} of {totalPages}</strong></span>
            <button onClick={goToNext} className="bg-success" disabled={currentPage === totalPages}>Next ➡</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivePropertyFilterTable;

