import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Spin } from 'antd';
import { getAdminDashboard } from '../services/authService';

const { Content } = Layout;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getAdminDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin />;

  return (
    <Content style={{ padding: '24px' }}>
      <h2>Admin Dashboard</h2>
      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h3>{stats?.usersCount || 0}</h3>
              <p>Total Users</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h3>{stats?.storesCount || 0}</h3>
              <p>Total Stores</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h3>{stats?.ratingsCount || 0}</h3>
              <p>Total Ratings</p>
            </div>
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default AdminDashboard;
