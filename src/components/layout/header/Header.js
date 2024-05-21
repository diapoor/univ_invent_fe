import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import file CSS của bạn

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">Your Logo</Link>
        </div>
        <nav className="nav-menu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
        <div className="user-menu">
          <ul>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
