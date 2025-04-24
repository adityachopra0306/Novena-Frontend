import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./prescriptionStyle.css";
import Navbar from "./Navbar";

const Prescription = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");

  const [prescriptions, setPrescriptions] = useState([]);
  const [expandedPrescription, setExpandedPrescription] = useState(null);
  const [error, setError] = useState(null);
  const [sortByPrescriptions, setSortByPrescriptions] = useState("date");
  const [sortOrderPrescriptions, setSortOrderPrescriptions] = useState("asc");
  const [sortByDetails, setSortByDetails] = useState("name");
  const [sortOrderDetails, setSortOrderDetails] = useState("asc");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    } else {
      fetchPrescriptions();
    }
  }, [userId, navigate, sortByPrescriptions, sortOrderPrescriptions]);

  useEffect(() => {
    if (expandedPrescription?.id) {
      fetchPrescriptionDetails(expandedPrescription.id);
    }
  }, [sortByDetails, sortOrderDetails]);

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/prescription/${userId}/?sort_by=${sortByPrescriptions}&order=${sortOrderPrescriptions}`
      );
      setPrescriptions(response.data);
    } catch (err) {
      setError("Failed to fetch prescriptions.");
    }
  };

  const fetchPrescriptionDetails = async (prescriptionId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/prescription/details/${prescriptionId}/?sort_by=${sortByDetails}&order=${sortOrderDetails}`
      );
      setExpandedPrescription({
        id: prescriptionId,
        medicines: response.data.medicines,
      });
    } catch (err) {
      setError("Failed to fetch prescription details.");
    }
  };

  const handleExpandPrescription = (prescriptionId) => {
    if (expandedPrescription?.id === prescriptionId) {
      setExpandedPrescription(null);
    } else {
      fetchPrescriptionDetails(prescriptionId);
    }
  };

  const handlePrescriptionSortChange = (event) => {
    setSortByPrescriptions(event.target.value);
  };

  const togglePrescriptionSortOrder = () => {
    setSortOrderPrescriptions((prevOrder) =>
      prevOrder === "asc" ? "desc" : "asc"
    );
  };

  const handleDetailsSortChange = (event) => {
    setSortByDetails(event.target.value);
  };

  const toggleDetailsSortOrder = () => {
    setSortOrderDetails((prevOrder) =>
      prevOrder === "asc" ? "desc" : "asc"
    );
  };

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="container my-5">
        <h1 className="text-center mb-4">User Prescriptions</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="sorting-controls mb-4">
          <label className="me-2">Sort Prescriptions By:</label>
          <select
            value={sortByPrescriptions}
            onChange={handlePrescriptionSortChange}
            className="form-select w-auto d-inline-block"
          >
            <option value="date">Date</option>
            <option value="time">Time</option>
            <option value="doctor_name">Doctor Name</option>
          </select>
          <button
            onClick={togglePrescriptionSortOrder}
            className="btn btn-primary ms-3"
          >
            Order: {sortOrderPrescriptions === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>

        <table className="table table-bordered table-hover prescription-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Doctor Name</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription, index) => (
              <React.Fragment key={prescription.id}>
                <tr
                  className="prescription-row"
                  onClick={() => handleExpandPrescription(prescription.id)}
                >
                  <td>{index + 1}</td>
                  <td>{prescription.doctor_name}</td>
                  <td>{prescription.date}</td>
                  <td>{prescription.time}</td>
                </tr>
                {expandedPrescription?.id === prescription.id && (
                  <tr>
                    <td colSpan="4" className="subtable-cell">
                      <h5 className="subtable-title">Prescribed Medicines</h5>
                      <div className="sorting-controls mb-2">
                        <label className="me-2">Sort Medicines By:</label>
                        <select
                          value={sortByDetails}
                          onChange={handleDetailsSortChange}
                          className="form-select w-auto d-inline-block"
                        >
                          <option value="name">Name</option>
                          <option value="company">Company</option>
                          <option value="expiry_date">Expiry Date</option>
                          <option value="price">Price</option>
                        </select>
                        <button
                          onClick={toggleDetailsSortOrder}
                          className="btn btn-primary ms-3"
                        >
                          Order: {sortOrderDetails === "asc" ? "Ascending" : "Descending"}
                        </button>
                      </div>
                      <table className="table subtable">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Medicine Name</th>
                            <th>Company</th>
                            <th>Expiry Date</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expandedPrescription.medicines.map((medicine, idx) => (
                            <tr key={medicine.id}>
                              <td>{idx + 1}</td>
                              <td>{medicine.name}</td>
                              <td>{medicine.company}</td>
                              <td>{medicine.expiry_date}</td>
                              <td>${medicine.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Prescription;
