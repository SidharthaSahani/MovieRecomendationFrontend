import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { API_URL } from '../constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySessions = async () => {
      const userToken = localStorage.getItem('userToken');
      const adminToken = localStorage.getItem('adminToken');
      
      const promises = [];

      if (userToken) {
        promises.push(
          axios.post(`${API_URL}/auth/verify`, {}, {
            headers: { Authorization: `Bearer ${userToken}` }
          }).then(res => {
            if (res.data.valid) setUser(res.data.user);
            else localStorage.removeItem('userToken');
          }).catch(() => localStorage.removeItem('userToken'))
        );
      }

      if (adminToken) {
        promises.push(
          axios.post(`${API_URL}/auth/verify`, {}, {
            headers: { Authorization: `Bearer ${adminToken}` }
          }).then(res => {
            if (res.data.valid && res.data.user.role === 'admin') setAdmin(res.data.user);
            else localStorage.removeItem('adminToken');
          }).catch(() => localStorage.removeItem('adminToken'))
        );
      }

      await Promise.all(promises);
      setLoading(false);
    };

    verifySessions();
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem('userToken', token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  const loginAdmin = (adminData, token) => {
    localStorage.setItem('adminToken', token);
    setAdmin(adminData);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      admin,
      isAuthenticated: !!user, 
      isAdminAuthenticated: !!admin,
      loginUser, 
      logoutUser,
      loginAdmin,
      logoutAdmin,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
