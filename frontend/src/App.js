import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AppHeader from './components/Header';
import AppFooter from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';
import './App.css';

const { Content } = Layout;

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to={`/${user.role}`} /> : <SignupPage />} />
      <Route path="/admin" element={<ProtectedRoute requiredRole={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/user" element={<ProtectedRoute requiredRole={['user']}><UserDashboard /></ProtectedRoute>} />
      <Route path="/owner" element={<ProtectedRoute requiredRole={['owner']}><OwnerDashboard /></ProtectedRoute>} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <AppHeader />
          <Content style={{ background: '#f0f2f5', minHeight: 'calc(100vh - 128px)' }}>
            <AppRoutes />
          </Content>
          <AppFooter />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
