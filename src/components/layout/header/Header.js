import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../..//AuthContext";
import "./Header.css"; // Import file CSS của bạn

function Header() {
  const { username, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleUsernameClick = () => {
    setShowLogout(true);
    setTimeout(() => {
      setShowLogout(false);
    }, 3000); // Hide logout button after 3 seconds
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img
              src="../../logo.png"
              alt="Logo"
              style={{ width: "150px", height: "50px" }}
            />
          </Link>
        </div>
        <nav className="nav-menu">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
        {isLoggedIn && (
          <div className={`user-info ${showLogout ? "show-logout" : ""}`}>
            <span className="username" onClick={handleUsernameClick}>
              {username}
            </span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
