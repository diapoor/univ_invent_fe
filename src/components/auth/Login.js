import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import { useAuth } from '../AuthContext';


function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState('');
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

 
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000); // 3seconds

      return () => clearTimeout(timer);
    }
  }, [error, isLoggedIn, navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', { username, password });
      console.log('Login successful:', response.data);
      login(username);
      // Redirect to the Home page after successful login
      navigate('/');
    } catch (error) {
      setError('Incorrect account');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/register', {
        username: username,
        password: password,
        fullName: fullName
      });
      console.log('Register successful:', response.data);
      // Show success message
      setError('');
      setFullName('');
      setUsername('');
      setPassword('');
      setDone(`Registration successful! Let's try logging in.`);
    } catch (error) {
      setDone('');
      if (error.response && error.response.status === 400) {
        setError(error.response.data);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };
  
  const handleForgotPassword = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/recovery-password', {
        username: username,
        fullName: fullName,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      });
      console.log('Password reset successful:' + response.data);
      // Show success message
      setError('');
      setFullName('');
      setUsername('');
      setNewPassword('');
      setConfirmPassword('');
      setDone('Password reset successful! You can now log in with your new password.');
    } catch (error) {
      setDone('');
      if (error.response && error.response.status === 400) {
        setError(error.response.data);
      } else {
        setError(`We couldn't reset your password. Please make sure you entered the correct information and try again.`);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <h5 className="card-header">University Inventory Management System</h5>
            <div className="card-body">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'login' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('login')}
                  >
                    Log In
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'register' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('register')}
                  >
                    Register
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'forgot' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('forgot')}
                  >
                    Forgot Password
                  </button>
                </li>
              </ul>
              <div className="mt-3">
                {activeTab === 'login' && (
                  <form>
                    <div className="form-group">
                      <label htmlFor="username">Username:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password:</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="button" className="btn btn-primary" onClick={handleLogin}>Log In</button>
                  </form>
                )}
                {activeTab === 'register' && (
                  <form>
                    <div className="form-group">
                      <label htmlFor="username">Username:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password:</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {done && <div className="alert alert-success">{done}</div>}
                    <button type="button" className="btn btn-primary" onClick={handleRegister}>Register</button>
                  </form>
                )}
                {activeTab === 'forgot' && (
                    <form>
                    <div className="form-group">
                      <label htmlFor="username">Username:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">New Password:</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Confirm Password:</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {done && <div className="alert alert-success">{done}</div>}
                    <button type="button" className="btn btn-primary" onClick={handleForgotPassword}>Send Request</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
