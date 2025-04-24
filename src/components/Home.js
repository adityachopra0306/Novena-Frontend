import React from "react";
import { Link } from "react-router-dom";
import "./homeStyle.css";
import { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showLoggedIn, setShowLoggedIn] = useState(false);
  const [showInvalid, setShowInvalid] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userId, setUserId] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        phoneNumber,
      });

      setUserId(response.data.user_id);
      setIsLoggedIn(true);
      setShowLoginPopup(false);
      setShowLoggedIn(true);

      setTimeout(() => setShowLoggedIn(false), 3000);
    } catch (error) {
      setShowLoginPopup(false);
      setShowInvalid(true);
      setTimeout(() => setShowInvalid(false), 3000);
    }
  };

  const handleProfileClick = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/profile/${userId}/`);
      setProfileData(response.data);
      setShowProfilePopup(true);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleLoginClick = () => {
    handleSubmit();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setProfileData(null);
  };

  const handleShowLoginPopup = () => {
    setShowLoginPopup(true);
  };

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const handleCloseProfilePopup = () => {
    setShowProfilePopup(false);
  };

  const handleCloseNotification = () => {
    setShowLoggedIn(false);
  };

  const handleCloseInvalidNotification = () => {
    setShowInvalid(false);
  };

  const handleInputChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLoginClick}
        onLogoutClick={handleLogout}
        onShowLoginPopup={handleShowLoginPopup}
        onShowProfilePopup={handleProfileClick}
      />

<header className="hero-section">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Welcome to Novena</h1>
          <p>Your Health, Our Priority</p>
          <a href="#services" className="btn btn-primary">Explore Services</a>
        </div>
      </header>

      <section id="services" className="container-fluid my-5">
        <h2 className="text-center mb-4">Our Services</h2>
        <div className="row g-4">
          {[
            { img: "appointment.png", title: "Scheduled Appointments", desc: "View and schedule appointments with our specialists.", link: "/appointment" },
            { img: "medication.png", title: "View Prescribed Medication", desc: "Access your prescribed medications securely.", link: "/prescription" },
            { img: "doctor.png", title: "View Department Record", desc: "Get info about our medical staff in several departments.", link: "/staff" },
            { img: "treatment.png", title: "Treatment Undergoing", desc: "Monitor your current treatments.", link: "/treatment" },
            { img: "procedure.png", title: "Finances", desc: "Get your Financial Records associated with our clinics.", link: "/procedure" },
            { img: "admit.png", title: "Admission Details", desc: "Find out about admission procedures.", link: "/admission" },
          ].map((service, index) => (
            <div className="col-md-4" key={index}>
              <div className="card h-100">
                <img src={`/images/${service.img}`} className="card-img-top" alt={service.title} />
                <div className="card-body">
                  <h5 className="card-title">{service.title}</h5>
                  <p className="card-text">{service.desc}</p>

                  {isLoggedIn ? ( 
                   <Link
  to={`${service.link}?userId=${userId}`}
  className="btn btn-outline-primary"
>
  Learn More
</Link>
                ) : (<button className="btn btn-outline-primary" onClick={handleShowLoginPopup}> Learn More</button>)
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-dark text-white text-center py-3 mt-5" id= "footer">
        <p>&copy; 2025 NOVENA | Demo Project</p>
        <p>Contact:         +91 98919 30234 -         health@novena.com</p>
      </footer>

      {showLoginPopup && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Log In</h5>
                <button type="button" className="btn-close" onClick={handleCloseLoginPopup}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input type="text" className="form-control" id="phone" value={phoneNumber} onChange={handleInputChange} />
                  </div>
                  <button type="button" className="btn btn-primary w-100" onClick={handleLoginClick}>
                    Log In
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProfilePopup && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Profile</h5>
                <button type="button" className="btn-close" onClick={handleCloseProfilePopup}></button>
              </div>
              <div className="modal-body">
                {profileData ? (
                  <div>
                    <p><strong>Name:</strong> {profileData.name}</p>
                    <p><strong>Age:</strong> {profileData.age}</p>
                    <p><strong>Sex:</strong> {profileData.sex}</p>
                    <p><strong>Date of Birth:</strong> {profileData.dob}</p>
                    <p><strong>Address:</strong> {profileData.address}</p>
                    <p><strong>Phone Number:</strong> {profileData.mob}</p>
                  </div>
                ) : (
                  <p>Loading profile details...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showLoggedIn && (
        <div className="position-fixed top-0 start-50 translate-middle-x bg-success text-white py-2 px-4 rounded shadow d-flex align-items-center justify-content-between" style={{ zIndex: 1050, width: "100%", maxWidth: "400px", cursor: "default" }}>
          <span>You are now logged in.</span>
          <button className="btn-close btn-close-white" onClick={handleCloseNotification} style={{ marginLeft: "10px" }}></button>
        </div>
      )}

      {showInvalid && (
        <div className="position-fixed top-0 start-50 translate-middle-x bg-danger text-white py-2 px-4 rounded shadow d-flex align-items-center justify-content-between" style={{ zIndex: 1050, width: "100%", maxWidth: "400px", cursor: "default" }}>
          <span>Invalid Credentials.</span>
          <button className="btn-close btn-close-white" onClick={handleCloseInvalidNotification} style={{ marginLeft: "10px" }}></button>
        </div>
      )}
    </>
  );
};

export default Home;
