import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="main-title">Welcome to Inventory Management System</h1>
      <div className="menu-container">
        <div className="menu-item">
          <Link to="/inventory">Quản lý vật tư</Link>
        </div>
        <div className="menu-item">
          <Link to="/warehouse">Quản lý kho</Link>
        </div>
        <div className="menu-item">
          <Link to="/borrow">Quản lý mượn</Link>
        </div>
        <div className="menu-item">
          <Link to="/repair">Quản lý sửa</Link>
        </div>
        <div className="menu-item">
          <Link to="/damaged">Quản lý hỏng mất</Link>
        </div>
        <div className="menu-item">
          <Link to="/user">Quản lý tài khoản</Link> {/* Thêm điều hướng đến trang danh sách tài khoản */}
        </div>
      </div>
    </div>
  );
}

export default Home;
