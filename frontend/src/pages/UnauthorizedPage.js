import React from 'react';
import { Layout, Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Content style={{ padding: '24px', minHeight: 'calc(100vh - 200px)' }}>
      <Result
        status="403"
        title="Unauthorized"
        subTitle="You do not have permission to access this page."
        extra={<Button type="primary" onClick={() => navigate('/')}>Go Home</Button>}
      />
    </Content>
  );
};

export default UnauthorizedPage;
