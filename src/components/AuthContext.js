import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [expiryTime, setExpiryTime] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedExpiryTime = parseInt(localStorage.getItem('expiryTime'));
    const now = new Date().getTime();
    console.log(storedUsername);
    if (storedUsername && !isNaN(storedExpiryTime) && now < storedExpiryTime) {
      console.log(storedUsername);
      setUsername(storedUsername);

      setExpiryTime(storedExpiryTime);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('expiryTime');
    }
  }, []);

  const login = (username) => {
    console.log(username);
    const expiryTime = new Date().getTime() + 10 * 60 * 1000; // 10 minutes from now
    setUsername(username);
    setExpiryTime(expiryTime);
    localStorage.setItem('username',username);
    localStorage.setItem('expiryTime', expiryTime.toString());
  };

  const logout = () => {
    setUsername('');
    setExpiryTime(null);
    localStorage.removeItem('username');
    localStorage.removeItem('expiryTime');
  };
  console.log(username);
  const isLoggedIn = !!username;
  console.log(isLoggedIn);

  return (
    <AuthContext.Provider value={{ username, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
