import React, { useContext } from 'react';
import { Layout, Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const { Content } = Layout;

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (user) {
    navigate(`/${user.role}`);
  }

  return (
    <Content style={{ padding: '24px', minHeight: 'calc(100vh - 200px)' }}>
      <Result
        status="success"
        title="Welcome to Roxiler Store Ratings"
        subTitle="Please login to continue"
        extra={<Button type="primary" onClick={() => navigate('/login')}>Go to Login</Button>}
      />
    </Content>
  );
};

export default HomePage;
