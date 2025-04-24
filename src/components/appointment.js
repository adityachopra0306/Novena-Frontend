import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./appointmentStyle.css";

const Appointment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");

  const [appointments, setAppointments] = useState([]);
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [newAppointment, setNewAppointment] = useState({
    doctorId: "",
    date: "",
    time: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      console.warn("No userId found in URL parameters. Redirecting to login.");
      navigate("/login");
    } else {
      console.log("Extracted userId:", userId);
      fetchAppointments(userId);
    }
  }, [userId, navigate]);

  const fetchAppointments = async (userId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/appointments/${userId}/`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments.");
    }
  };

  const handleBookAppointment = async () => {
    try {
      const payload = { ...newAppointment, patientId: userId };
      await axios.post(`http://127.0.0.1:8000/appointments/book/`, payload);
      fetchAppointments(userId);
      setShowForm(false);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError("Failed to book appointment.");
    }
  };

  const filterAppointments = async (userId, date, doctorName) => {
    try {
      const params = new URLSearchParams();
      if (date) params.append("date", date);
      if (doctorName) params.append("doctorName", doctorName);
  
      const response = await axios.get(`http://127.0.0.1:8000/appointments/filter/${userId}/?${params.toString()}`);
      
      console.log("Filtered Appointments:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error filtering appointments:", error);
      throw error;
    }
  };
  
  const handleFilterAppointments = async () => {
    try {
      const filteredData = await filterAppointments(userId, filterDate, filterDoctor);
      setAppointments(filteredData);
    } catch (error) {
      setError("Failed to filter appointments.");
    }
  };  

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Scheduled Appointments</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by Doctor Name"
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
        <button
  className="btn btn-primary"
  onClick={handleFilterAppointments}
>
  Apply Filters
</button>

        </div>
      </div>

      {/* Appointment List */}
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{appointment.doctor_name}</td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Book New Appointment Button */}
      <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel Booking" : "Book New Appointment"}
      </button>

      {/* Book New Appointment Form */}
      {showForm && (
        <div className="mt-4">
          <h4>Book New Appointment</h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleBookAppointment();
            }}
          >
            <div className="mb-3">
              <label className="form-label">Doctor ID</label>
              <input
                type="text"
                className="form-control"
                value={newAppointment.doctorId}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, doctorId: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={newAppointment.date}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, date: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Time</label>
              <input
                type="time"
                className="form-control"
                value={newAppointment.time}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, time: e.target.value })
                }
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Book Appointment
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Appointment;
