
import React, {useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { useAuth } from './components/AuthContext';
function Home() {
  const { username, isLoggedIn, logout,whoLogin } = useAuth();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const storedExpiryTime = localStorage.getItem('expiryTime');
    const now = new Date().getTime();
    console.log(isLoggedIn);
    if (!isLoggedIn || !storedExpiryTime || now >= storedExpiryTime) {
      navigate('/auth/login');
    }
  }, [isLoggedIn, navigate, logout,whoLogin]);

  const handleUsernameClick = () => {
    setShowLogout(true);
    setTimeout(() => {
      setShowLogout(false);
    }, 3000); // Hide logout button after 3 seconds
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="home-container">
      <h1 className="main-title animate__animated animate__bounceIn">
        Welcome to Inventory Management System
      </h1>
      {isLoggedIn && (
        <div className={`user-info ${showLogout ? 'show-logout' : ''}`}>
          <span className="username" onClick={handleUsernameClick}>
            {username}
          </span>
          <button
            onClick={handleLogout}
            className="logout-button animate__animated animate__fadeInUp"
          >
            Logout
          </button>
        </div>
      )}
      <div className="menu-container animate__animated animate__fadeInUp">
        <div className="menu-item">
          <Link to="/inventory">Inventory Management</Link>
        </div>
        <div className="menu-item">
          <Link to="/ware-house">Warehouse Management</Link>
        </div>
        <div className="menu-item">
          <Link to="/borrow">Borrow Management</Link>
        </div>
        <div className="menu-item">
          <Link to="/repair">Repair Management</Link>
        </div>
        <div className="menu-item">
          <Link to="/damaged">Damaged Items Management</Link>
        </div>
        <div className="menu-item">
          <Link to="/user">User Management</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;