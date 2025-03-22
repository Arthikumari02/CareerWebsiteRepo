import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <h1 onClick={() => navigate("/")}>Mental Health Hub</h1>
      <div className="nav-links">
      <button
          onClick={() => navigate("/mental-health")}
          className="nav-item-button"
        >
          Back
        </button>
        <button
          onClick={() => navigate("/career-website-repo")}
          className="nav-item-button"
        >
          Home
        </button>
        <button onClick={() => navigate("/quotes")} className="nav-item-button">
          Life Tips
        </button>
        <button
          onClick={() => navigate("/journal")}
          className="nav-item-button"
        >
          Journal
        </button>
        <button
          onClick={() => navigate("/personalized-dashboard")}
          className="nav-item-button"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default Navbar;
