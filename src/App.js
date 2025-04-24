import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import Appointment from "./components/appointment";
import Prescription from "./components/prescription";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/prescription" element={<Prescription />} />
      </Routes>
    </Router>
  );
}

export default App;