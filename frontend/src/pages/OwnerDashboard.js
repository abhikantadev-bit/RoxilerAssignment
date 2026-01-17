import React, { useState, useEffect } from 'react';
import { Layout, Card, Spin } from 'antd';
import { getOwnerDashboard } from '../services/authService';

const { Content } = Layout;

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getOwnerDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching owner dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin />;

  return (
    <Content style={{ padding: '24px' }}>
      <h2>Owner Dashboard</h2>
      <Card style={{ marginTop: '24px' }}>
        <p>Average Rating: {data?.averageRating || 'N/A'}</p>
        <p>Number of Raters: {data?.raters?.length || 0}</p>
      </Card>
    </Content>
  );
};

export default OwnerDashboard;
