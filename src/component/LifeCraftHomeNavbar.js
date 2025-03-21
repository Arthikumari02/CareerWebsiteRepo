import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LifeCraftHome.css";
import logo from './logo.png';
import { useAuth } from './SignInAndOut/AuthContext';
import LogoutButton from './SignInAndOut/SignOut';

const CareerWebsiteNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isMentalHealthPage =
    location.pathname === "/mental-health" ||
    location.pathname === "/quotes" ||
    location.pathname === "/journal" || 
    location.pathname === "/gratitude"
    ;

  if (isMentalHealthPage) {
    return null; 
  }

  return (
    <div className="life-craft-home-navbar">
      <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", gap:"10px"}}>
        <img src={logo} alt="logo" className="logo" />
        <h1 onClick={() => navigate("/career-website-repo")}>Life Craft</h1>
      </div>
      <div style={{display:"flex", gap:"10px"}}>
        <button onClick={() => navigate("/career-website-repo")}>Home</button>
        {isAuthenticated  ? (
           <LogoutButton />
        ) : (<button onClick={() => navigate("/signup")}>Sign Up</button>)}
      </div>
    </div>
  );
};

export default CareerWebsiteNavbar;
