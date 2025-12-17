



import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const PayuBuyerPaynow = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/payments-with-plan/pay-now-buyer`);
      setPayments(res.data.data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
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
  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Pay Now Payments with Plan Details</h2>
                   <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button> {loading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p>No payment data found.</p>
      ) : (
        <div ref={tableRef}>
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>RA ID</th>
                                                <th>PayU User Status</th>
                <th>Transaction ID</th>

                <th>Amount</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Plan Name</th>
                <th>Package Type</th>
                <th>Price</th>
                <th>Used Cars</th>
                <th>Remaining Cars</th>
                <th>Duration (Days)</th>
                <th>Expiry Date</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment._id}>
                  <td>{index + 1}</td>
               <td>{payment.Ra_Id}</td>
                                    <td>{payment.payustatususer}</td>
                                                      <td>{payment.txnid}</td>

                  <td>{payment.amount}</td>
                  <td>{payment.firstname}</td>
                  <td>{payment.email}</td>
                  <td>{payment.phone}</td>
                  <td>{payment.planName || '-'}</td>
                  <td>{payment.planDetails?.packageType || '-'}</td>
                  <td>{payment.planDetails?.price || 0}</td>
                  <td>{payment.planDetails?.usedCars || 0}</td>
                  <td>{payment.planDetails?.remainingCars || 0}</td>
                  <td>{payment.planDetails?.durationDays || 0}</td>
                  <td>{payment.planDetails?.expiryDate || '-'}</td>
                  <td>{new Date(payment.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}
    </div>
  );
};

export default PayuBuyerPaynow;
