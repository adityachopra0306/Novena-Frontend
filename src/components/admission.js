import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const Admission = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");

  const [availableRooms, setAvailableRooms] = useState([]);
  const [admissionHistory, setAdmissionHistory] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAvailableRooms, setShowAvailableRooms] = useState(false);

  useEffect(() => {
    if (!userId) {
      console.warn("No userId found in URL parameters. Redirecting to login.");
      navigate("/login");
    } else {
      console.log("Extracted userId:", userId);
      fetchAvailableRooms();
      fetchAdmissionHistory(userId);
    }
  }, [userId, navigate]);

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admission/get-available-rooms/");
      setAvailableRooms(response.data.available_rooms);
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      setErrorMessage("Failed to fetch available rooms.");
    }
  };

  const fetchAdmissionHistory = async (userId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/admission/get_admission_history/${userId}/`);
      setAdmissionHistory(response.data.admission_history);
    } catch (error) {
      console.error("Error fetching admission history:", error);
      setErrorMessage("Failed to fetch admission history.");
    }
  };

  const handleRoomBooking = async () => {
    if (!selectedRoom || !admissionDate) {
      setErrorMessage("Please select a room and provide an admission date.");
      return;
    }

    try {
      const payload = { room_id: selectedRoom, adm_date: admissionDate };
      await axios.post(`http://127.0.0.1:8000/api/admission/book-room/${userId}/`, payload);
      fetchAdmissionHistory(userId);
      alert("Room booked successfully!");
    } catch (error) {
      console.error("Error booking room:", error);
      setErrorMessage("Failed to book room.");
    }
  };

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="container my-5">
        <h1 className="text-center mb-4">Admission Management</h1>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        {/* Available Rooms */}
        <div className="section mb-4">
          <h2>
            Available Rooms
            <button
              className="btn btn-link ms-2"
              onClick={() => setShowAvailableRooms(!showAvailableRooms)}
              style={{ textDecoration: "none" }}
            >
              {showAvailableRooms ? "▼" : "►"}
            </button>
          </h2>
          {showAvailableRooms && (
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Room No</th>
                  <th>Type</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {availableRooms.map((room) => (
                  <tr key={room.room_id}>
                    <td>{room.room_no}</td>
                    <td>{room.room_type}</td>
                    <td>{room.room_cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Book a Room */}
        <div className="section mb-4">
          <h2>Book a Room</h2>
          <div className="form-group mb-3">
            <label>Room ID:</label>
            <select
              className="form-control"
              onChange={(e) => setSelectedRoom(e.target.value)}
              value={selectedRoom}
            >
              <option value="">Select a room</option>
              {availableRooms.map((room) => (
                <option key={room.room_id} value={room.room_id}>
                  {room.room_no} - {room.room_type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-3">
            <label>Admission Date:</label>
            <input
              type="date"
              className="form-control"
              onChange={(e) => setAdmissionDate(e.target.value)}
              value={admissionDate}
            />
          </div>
          <button className="btn btn-primary" onClick={handleRoomBooking}>
            Book Room
          </button>
        </div>

        {/* Admission History */}
        <div className="section">
          <h2>Admission History</h2>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Admission ID</th>
                <th>Admission Date</th>
                <th>Leave Date</th>
                <th>Room ID</th>
              </tr>
            </thead>
            <tbody>
              {admissionHistory.map((history) => (
                <tr key={history.adm_id}>
                  <td>{history.adm_id}</td>
                  <td>{history.adm_date}</td>
                  <td>{history.leave_date || "N/A"}</td>
                  <td>{history.room_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Admission;
