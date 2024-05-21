import React from 'react';
import './Footer.css'; // Import file CSS của bạn

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2024 University Inventory Management.</p>
        <div className="social-links">
          {/*<a href="#"><i className="fa fa-facebook"></i></a>
          <a href="#"><i className="fa fa-twitter"></i></a>
          <a href="#"><i className="fa fa-instagram"></i></a>
          <a href="#"><i className="fa fa-linkedin"></i></a>*/}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
