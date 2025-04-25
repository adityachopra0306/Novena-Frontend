import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const Finance = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");

  const [financeData, setFinanceData] = useState({
    totalBilled: 0,
    totalPaid: 0,
    topBills: [],
    averagePayment: 0,
    billsInTimeframe: [],
  });

  const [timeframe, setTimeframe] = useState({ startDate: "", endDate: "" });
  const [paymentId, setPaymentId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchPatientFinanceData = async () => {
    try {
      const [amountOwedResponse, topBillsResponse, averagePaymentResponse] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/api/admission/get-patient-amount-owed/${userId}/`),
        axios.get(`http://127.0.0.1:8000/api/admission/get-top-5-expensive-bills/${userId}/`),
        axios.get(`http://127.0.0.1:8000/api/admission/get-average-payment-per-bill/${userId}/`),
      ]);
      setFinanceData({
        totalBilled: amountOwedResponse.data.total_billed,
        totalPaid: amountOwedResponse.data.total_paid,
        topBills: topBillsResponse.data.top_bills,
        averagePayment: averagePaymentResponse.data.average_payment,
        billsInTimeframe: [],
      });
    } catch (err) {
      setError("Failed to fetch financial data.");
    }
  };

  const fetchBillsInTimeframe = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/admission/get-bills-in-timeframe/${userId}/`, {
        start_date: timeframe.startDate,
        end_date: timeframe.endDate,
      });
      setFinanceData((prev) => ({ ...prev, billsInTimeframe: response.data.bills }));
    } catch (err) {
      setError("Failed to fetch bills in the specified timeframe.");
    }
  };

  const deletePaymentRecord = async () => {
    if (!paymentId) {
      setError("Payment ID is required to delete a payment.");
      return;
    }

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/admission/delete-payment-record/`, {
        payment_id: paymentId,
      });
      setMessage(response.data.message);
      setError("");
      setPaymentId("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete payment record.");
    }
  };

  useEffect(() => {
    if (!userId) {
      console.warn("No userId found in URL parameters. Redirecting to login.");
      navigate("/login");
    } else {
      fetchPatientFinanceData();
    }
  }, [userId, navigate]);

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="container mt-4">
        <h1 className="mb-4">Finance Dashboard</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <div className="mb-4">
          <h2>Financial Summary</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Total Billed</th>
                <th>Total Paid</th>
                <th>Average Payment Per Bill</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${financeData.totalBilled}</td>
                <td>${financeData.totalPaid}</td>
                <td>${financeData.averagePayment || 0 .toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-4">
          <h2>Most Expensive Bills</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {financeData.topBills.map((bill) => (
                <tr key={bill.bill_id}>
                  <td>${bill.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-4">
          <h2>Bills in Timeframe</h2>
          <div className="d-flex mb-3">
            <input
              type="date"
              value={timeframe.startDate}
              onChange={(e) => setTimeframe((prev) => ({ ...prev, startDate: e.target.value }))}
              className="form-control me-2"
            />
            <input
              type="date"
              value={timeframe.endDate}
              onChange={(e) => setTimeframe((prev) => ({ ...prev, endDate: e.target.value }))}
              className="form-control me-2"
            />
            <button onClick={fetchBillsInTimeframe} className="btn btn-primary">
              Fetch
            </button>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Total</th>
                <th>Payment Type</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {financeData.billsInTimeframe.map((bill) => (
                <tr key={bill.bill_id}>
                  <td>{bill.purpose}</td>
                  <td>${bill.total}</td>
                  <td>{bill.payment_type}</td>
                  <td>{bill.payment_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-4">
          <h2>Delete Payment Record</h2>
          <div className="d-flex">
            <input
              type="text"
              placeholder="Payment ID"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              className="form-control me-2"
            />
            <button onClick={deletePaymentRecord} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Finance;
