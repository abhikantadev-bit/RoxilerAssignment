import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Spin />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
