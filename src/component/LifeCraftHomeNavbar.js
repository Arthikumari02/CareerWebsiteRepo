import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LifeCraftHome.css";

const CareerWebsiteNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMentalHealthPage =
    location.pathname === "/mental-health" ||
    location.pathname === "/quotes" ||
    location.pathname === "/journal";

  if (isMentalHealthPage) {
    return null; // Hide Navbar for Mental Health Hub
  }

  return (
    <div className="life-craft-home-navbar">
      <h1 onClick={() => navigate("/career-website-repo")}>Life Craft</h1>
      <button onClick={() => navigate("/career-website-repo")}>Home</button>
    </div>
  );
};

export default CareerWebsiteNavbar;
