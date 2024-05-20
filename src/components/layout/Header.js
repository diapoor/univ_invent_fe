import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header-container">
      <div className="logo">
        <Link to="/">Inventory Management System</Link>
      </div>
      <nav className="navigation">
        <ul>
          <li>
            <Link to="/inventory">Quản lý vật tư</Link>
          </li>
          <li>
            <Link to="/warehouse">Quản lý kho</Link>
          </li>
          <li>
            <Link to="/borrow">Quản lý mượn</Link>
          </li>
          <li>
            <Link to="/repair">Quản lý sửa</Link>
          </li>
          <li>
            <Link to="/damaged">Quản lý hỏng mất</Link>
          </li>
          <li>
            <Link to="/user">Quản lý tài khoản</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
