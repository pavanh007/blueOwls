import "antd/dist/antd.css";
import "./App.css";
import React from "react";
import Appointment from "./component/Appointment/appointmentList.jsx";
import Login from "./component/Login/login.jsx";
import Register from "./component/Register/register.jsx";
import { Route, Routes } from "react-router-dom"; // Import BrowserRouter, Route, and Routes

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor" element={<Appointment />} />
        <Route path="/patient" element={<Appointment />} />
      </Routes>
    </div>
  );
}

export default App;
