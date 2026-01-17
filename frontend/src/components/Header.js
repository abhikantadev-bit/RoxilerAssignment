import React from 'react';
import { Button, Layout } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const { Header } = Layout;

const AppHeader = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Header style={{ background: '#001529', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ color: 'white', margin: 0 }}>Roxiler Store Ratings</h2>
      {user && (
        <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Welcome, {user.name} ({user.role})</span>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      )}
    </Header>
  );
};

export default AppHeader;
