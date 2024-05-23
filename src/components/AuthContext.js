import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [expiryTime, setExpiryTime] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedExpiryTime = parseInt(localStorage.getItem("expiryTime"));
    const now = new Date().getTime();

    if (storedUsername && !isNaN(storedExpiryTime) && now < storedExpiryTime) {
      setUsername(storedUsername);
      setExpiryTime(storedExpiryTime);
    } else {
      logout(); // Nếu không có thông tin đăng nhập hợp lệ, tự động logout
    }
  }, []);

  const login = (username) => {
    const expiryTime = new Date().getTime() + 10 * 60 * 1000; // 10 minutes from now
    setUsername(username);
    setExpiryTime(expiryTime);
    localStorage.setItem("username", username);
    localStorage.setItem("expiryTime", expiryTime.toString());
  };

  const logout = () => {
    setUsername("");
    setExpiryTime(null);
    localStorage.removeItem("username");
    localStorage.removeItem("expiryTime");
  };

  const isLoggedIn = !!username;

  return (
    <AuthContext.Provider value={{ username, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
