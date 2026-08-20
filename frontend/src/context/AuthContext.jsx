import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (err) {
        console.error('Failed to parse user info', err);
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    const { data } = await api.post('/api/users/login', { email, password });
    // Our backend sends: { success: true, data: { _id, name, email, role, token } }
    const userData = data.data;
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  // Register handler
  const register = async (name, email, password, phoneNumber, role) => {
    const { data } = await api.post('/api/users/register', {
      name,
      email,
      password,
      phoneNumber,
      role,
    });
    const userData = data.data;
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    const { data } = await api.put('/api/users/profile', profileData);
    const userData = data.data;
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
