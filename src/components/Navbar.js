import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isLoggedIn, onLoginClick, onLogoutClick, onShowLoginPopup, onShowProfilePopup }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <img
            src="/images/logo.png"
            alt="Logo"
            width="30"
            height="30"
            className="rounded-circle"
          />{" "}
          NOVENA
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#services">Services</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#footer">Contact</a>
            </li>
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle profile-btn"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="/images/profile-icon.png"
                  alt="Profile"
                  width="30"
                  height="30"
                  className="rounded-circle"
                />
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                {!isLoggedIn ? (
                  <li>
                    <button className="dropdown-item" onClick={onShowLoginPopup}>
                      Log In
                    </button>
                  </li>
                ) : (
                  <>
                    <li>
                      <button className="dropdown-item" onClick={onShowProfilePopup}>
                        View Profile
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={onLogoutClick}>
                        Log Out
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
