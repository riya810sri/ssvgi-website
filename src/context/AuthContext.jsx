import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, getMe, loginUser, getUserMe } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || localStorage.getItem('userToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const adminToken = localStorage.getItem('token');
      const userToken = localStorage.getItem('userToken');
      
      if (adminToken) {
        try {
          const response = await getMe(adminToken);
          // The response contains admin data with role (admin/master)
          setUser({
            ...response.admin,
            _type: 'admin',
            role: response.admin.role // 'admin' or 'master'
          });
          setToken(adminToken);
        } catch (adminErr) {
          console.error('Failed to get admin from token:', adminErr);
          localStorage.removeItem('token');
          setToken(null);
        }
      } else if (userToken) {
        try {
          const response = await getUserMe(userToken);
          // The response contains user data
          setUser({
            ...response.user,
            _type: 'user',
            role: response.user.role || 'user'
          });
          setToken(userToken);
        } catch (userErr) {
          console.error('Failed to get user from token:', userErr);
          localStorage.removeItem('userToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, type = 'admin') => {
    let response;
    if (type === 'user') {
      response = await loginUser(email, password);
      const { token: userToken, user: userData } = response;
      
      localStorage.setItem('userToken', userToken);
      setToken(userToken);
      setUser({
        ...userData,
        _type: 'user',
        role: userData.role || 'user'
      });
    } else {
      response = await apiLogin(email, password);
      const { token: adminToken, admin } = response;

      localStorage.setItem('token', adminToken);
      setToken(adminToken);
      setUser({
        ...admin,
        _type: 'admin',
        role: admin.role // 'admin' or 'master'
      });
    }

    return response;
  };

  const logout = (type = 'both') => {
    if (type === 'admin' || type === 'both') {
      localStorage.removeItem('token');
    }
    if (type === 'user' || type === 'both') {
      localStorage.removeItem('userToken');
    }
    setToken(null);
    setUser(null);
  };

  // Helper function to check if user is master
  const isMaster = () => {
    return user && user._type === 'admin' && user.role === 'master';
  };

  // Helper function to check if user is admin (not master)
  const isAdmin = () => {
    return user && user._type === 'admin' && user.role === 'admin';
  };

  // Helper function to check if user is regular user
  const isUser = () => {
    return user && user._type === 'user';
  };

  // Helper function to check if user is admin or master
  const isAdminOrMaster = () => {
    return user && user._type === 'admin' && ['admin', 'master'].includes(user.role);
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isMaster,
    isAdmin,
    isUser,
    isAdminOrMaster
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
