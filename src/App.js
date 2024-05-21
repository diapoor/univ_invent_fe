import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import UserList from './components/user/UserList';
import Warehouse from './components/warehouse/WareHouse';
import Login from './components/auth/Login';
import { AuthProvider } from './components/AuthContext';
import Layout from './components/layout/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/user" element={<UserList />} />
                  <Route path="/ware-house" element={<Warehouse />} />
                  {/* Add more routes for other pages */}
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
