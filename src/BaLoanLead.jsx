import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BankLoanPropertiesTable = () => {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
const [rentIdFilter, setrentIdFilter] = useState("");
const [phoneFilter, setPhoneFilter] = useState("");
const [bankLoanFilter, setBankLoanFilter] = useState("");

  const itemsPerPage = 50;

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/properties-with-bankloan`);
      setProperties(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bank loan properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const totalPages = Math.ceil(properties.length / itemsPerPage);
 
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
const filteredData = properties.filter((item) => {
  const matchesrentId = item.rentId?.toString().toLowerCase().includes(rentIdFilter.toLowerCase());
  const matchesPhone = item.phoneNumber?.toString().toLowerCase().includes(phoneFilter.toLowerCase());

  const matchesBankLoan =
    bankLoanFilter === "yes"
      ? !!item.bankLoan
      : bankLoanFilter === "no"
      ? !item.bankLoan
      : true;

  return matchesrentId && matchesPhone && matchesBankLoan;
});


const currentData = filteredData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
  return (
    <div className="p-4">
      <div className="d-flex flex-row gap-2 align-items-center flex-nowrap"
>
  <input
    type="text"
    placeholder="Search by PPC ID"
    value={rentIdFilter}
    onChange={(e) => setrentIdFilter(e.target.value)}
  />

  <input
    type="text"
    placeholder="Search by Phone"
    value={phoneFilter}
    onChange={(e) => setPhoneFilter(e.target.value)}
  />
  <select onChange={(e) => setBankLoanFilter(e.target.value)} value={bankLoanFilter}>
    <option value="">Bank Loan Filter</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
</div>

      <h2 className="text-xl font-bold mb-4">Properties with Bank Loan: Yes</h2>

      {loading ? (
        <p>Loading...</p>
      ) : currentData.length === 0 ? (
        <p>No properties found with bank loan "Yes".</p>
      ) : (
        <>
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-2">S.No</th>
                <th className="border px-2 py-2">PPC ID</th>
                <th className="border px-2 py-2">Phone Number</th>
                <th className="border px-2 py-2">Price</th>
                <th className="border px-2 py-2">Property Mode</th>
                <th className="border px-2 py-2">Property Type</th>
                <th className="border px-2 py-2">Bank Loan</th>
                <th className="border px-2 py-2">State</th>
                <th className="border px-2 py-2">City</th>
                <th className="border px-2 py-2">Area</th>
                <th className="border px-2 py-2">Posted By</th>
                <th className="border px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, i) => (
                <tr key={item._id} className="text-center">
                  <td className="border px-2 py-2">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td className="border px-2 py-2">{item.rentId}</td>
                  <td className="border px-2 py-2">{item.phoneNumber}</td>
                  <td className="border px-2 py-2">₹{item.rentalAmount?.toLocaleString()}</td>
                  <td className="border px-2 py-2">{item.propertyMode}</td>
                  <td className="border px-2 py-2">{item.propertyType}</td>
                  <td className="border px-2 py-2">{item.bankLoan}</td>
                  <td className="border px-2 py-2">{item.state}</td>
                  <td className="border px-2 py-2">{item.city}</td>
                  <td className="border px-2 py-2">{item.area}</td>
                  <td className="border px-2 py-2">{item.postedBy}</td>
                  <td className="border px-2 py-2">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-4">
            <button style={{background:"blue"}}
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button style={{background:"blue"}}
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BankLoanPropertiesTable;
