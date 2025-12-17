


import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";import { Table, Pagination, Button, Modal } from "react-bootstrap";

const RecievedInterest = () => {
  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
            
  const adminName = useSelector((state) => state.admin.name);
  

  // ✅ Record view on mount
useEffect(() => {
 const recordDashboardView = async () => {
   try {
     await axios.post(`${process.env.REACT_APP_API_URL}/record-view`, {
       userName: adminName,
       viewedFile: "Recieved Interest ",
       viewTime: moment().format("YYYY-MM-DD HH:mm:ss"), // optional, backend already handles it


     });
   } catch (err) {
   }
 };

 if (adminName) {
   recordDashboardView();
 }
}, [adminName]);
    
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Search: ${search}, From Date: ${fromDate}, End Date: ${endDate}`);
  };
  const initialData = [
    {
      sNo: 1,
      pucId: 3147,
      postedFrom: "PUC",
      carTitle: "Renault Kwid 2017",
      customer: "9715045623",
      owner: "8825581916",
      view: "Unread",
      date: "2024-12-24 16:11:06",
      planName: "FREE",
    },
    {
      sNo: 2,
      pucId: 8254,
      postedFrom: "PUC",
      carTitle: "Renault Kwid 2017",
      customer: "9944981504",
      owner: "8778268681",
      view: "Unread",
      date: "2024-12-24 00:05:15",
      planName: "FREE",
    },
    {
      sNo: 3,
      pucId: 4060,
      postedFrom: "TUC",
      carTitle: "Maruthi Suzuki Swift 2015",
      customer: "7708880931",
      owner: "7008574861",
      view: "Unread",
      date: "2024-12-21 17:21:44",
      planName: "FREE",
    },
  ];

  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const itemsPerPage = 3;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteClick = (car) => {
    setSelectedCar(car);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    setData(data.filter((item) => item.pucId !== selectedCar.pucId));
    setShowModal(false);
    setSelectedCar(null);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Manage Received Interest
        </h2>
        <button className="btn" style={{background:"#2EA44F", color:"#fff", border:'none'}}>EXPORT WITH OTP VERIFICATION</button>
      </div>
      <button className="btn" style={{background:"#5F9EA0", color:"#fff", border:'none'}}>deleted Recived Interest </button>

 <div className="container mt-5">
      <h2 className="mb-4">Search Form with Dates</h2>
      <form onSubmit={handleSubmit}>
        {/* Search Field */}
        <div className="mb-3">
          <label htmlFor="searchInput" className="form-label">
            Search
          </label>
          <input
            type="text"
            id="searchInput"
            className="form-control"
            placeholder="Enter search term"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* From Date Field */}
        <div className="mb-3">
          <label htmlFor="fromDate" className="form-label">
            From Date
          </label>
          <input
            type="date"
            id="fromDate"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        {/* End Date Field */}
        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn" style={{background:"#E91E63", color:"#fff", border:'none'}}>
          Submit
        </button>
      </form>
    </div>
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>S.No</th>
            <th>PUC Id</th>
            <th>Posted From</th>
            <th>Car Title</th>
            <th>Customer</th>
            <th>Owner</th>
            <th>View</th>
            <th>Date</th>
            <th>Plan Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.pucId}>
              <td>{item.sNo}</td>
              <td>{item.pucId}</td>
              <td>{item.postedFrom}</td>
              <td>{item.carTitle}</td>
              <td>{item.customer}</td>
              <td>{item.owner}</td>
              <td>{item.view}</td>
              <td>{item.date}</td>
              <td>{item.planName}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClick(item)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {[...Array(totalPages).keys()].map((page) => (
          <Pagination.Item
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => handlePageChange(page + 1)}
          >
            {page + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCar && (
            <div>
              <p>
                <strong>PUC ID:</strong> {selectedCar.pucId}
              </p>
              <p>
                <strong>Car Title:</strong> {selectedCar.carTitle}
              </p>
              <p>
                <strong>Customer:</strong> {selectedCar.customer}
              </p>
              <p>
                <strong>Owner:</strong> {selectedCar.owner}
              </p>
              <p>
                <strong>Date:</strong> {selectedCar.date}
              </p>
            </div>
          )}
          <p>Are you sure you want to delete this car?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>

  );
};

export default RecievedInterest;
