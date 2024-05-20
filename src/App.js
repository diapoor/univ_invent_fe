import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Thay đổi từ Switch thành Routes
import Home from './Home';
import AppBar from './components/Appbar';
import UserList from './components/user/UserList';

function App() {
  return (
    <Router>
      <Routes> {/* Thay thế Switch bằng Routes */}
        <Route path="/" exact element={<Home />} /> {/* Sử dụng prop 'element' thay vì 'component' */}
        <Route path="/user" element={<UserList />} /> {/* Sử dụng prop 'element' thay vì 'component' */}
        {/* Các tuyến đường khác nếu có */}
      </Routes> {/* Kết thúc Routes */}
    </Router>
  );
}

export default App;
