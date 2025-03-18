import React from "react";
import { Link } from "react-router-dom";
import "./pages/styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Mental Health & Motivation Hub</h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/quotes">Daily Quotes</Link></li>
        <li><Link to="/journal">Journal</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
