import React, { useState, useEffect } from "react";
import axios from "axios";
import "./staffStyle.css";
import Navbar from "./Navbar";

const Staff = () => {
  const [categories, setCategories] = useState([
    "Doctors",
    "Nurses",
    "Receptionists",
    "Accountants",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStaff, setFilteredStaff] = useState([]);

  useEffect(() => {
    if (selectedCategory) {
      fetchStaffData();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = staffList.filter((staff) =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStaff(filtered);
    } else {
      setFilteredStaff(staffList);
    }
  }, [searchTerm, staffList]);

  const fetchStaffData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/staff/${selectedCategory.toLowerCase()}/`
      );
      setStaffList(response.data);
      setFilteredStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    }
  };

  const renderTableHeaders = () => {
    if (filteredStaff.length === 0) return null;
    return (
      <thead className="table-dark">
        <tr>
          {Object.keys(filteredStaff[0]).map((key, index) => (
            <th key={index}>{key.replace("_", " ").toUpperCase()}</th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderTableRows = () => {
    return filteredStaff.map((staff, index) => (
      <tr key={staff.id || index}>
        {Object.values(staff).map((value, idx) => (
          <td key={idx}>{value !== null ? value : "N/A"}</td>
        ))}
      </tr>
    ));
  };

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="container staff-container">
        <h1 className="text-center mt-4">Staff Management</h1>
        <div className="dropdown mt-3">
          <label htmlFor="categorySelect" className="form-label">
            Select Category:
          </label>
          <select
            id="categorySelect"
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Select --</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {selectedCategory && (
          <>
            <div className="search-bar mt-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="staff-table mt-4">
              {filteredStaff.length > 0 ? (
                <table className="table table-bordered">
                  {renderTableHeaders()}
                  <tbody>{renderTableRows()}</tbody>
                </table>
              ) : (
                <p>No staff found for this category.</p>
              )}
            </div>
            <p className="text-center mt-3">
              Total Results: {filteredStaff.length}
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default Staff;
