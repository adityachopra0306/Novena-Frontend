import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import Appointment from "./components/appointment";
import Prescription from "./components/prescription";
import Staff from './components/staff';
import Admission from "./components/admission";
import Finance from "./components/finance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/prescription" element={<Prescription />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/Finance" element={<Finance />} />
      </Routes>
    </Router>
  );
}

export default App;