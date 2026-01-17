import React, { useState, useEffect } from 'react';
import { Layout, Card, Spin, Input, Button, Table, Rate, Modal, Form, message } from 'antd';
import { getStoresForUser, submitRating } from '../services/authService';

const { Content } = Layout;

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await getStoresForUser({ search: searchText });
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateClick = (store) => {
    setSelectedStore(store);
    setRating(store.userRating || 0);
    setModalVisible(true);
  };

  const handleSubmitRating = async () => {
    try {
      await submitRating({ store_id: selectedStore.id, rating });
      message.success('Rating submitted successfully!');
      setModalVisible(false);
      fetchStores();
    } catch (error) {
      message.error('Failed to submit rating');
    }
  };

  const columns = [
    { title: 'Store Name', dataIndex: 'name', key: 'name' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { title: 'Average Rating', dataIndex: 'averageRating', key: 'averageRating', render: (text) => text ? `${text}/5` : 'No ratings' },
    {
      title: 'Your Rating',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleRateClick(record)}>
          {record.userRating ? `${record.userRating}/5` : 'Rate'}
        </Button>
      )
    }
  ];

  if (loading) return <Spin />;

  return (
    <Content style={{ padding: '24px' }}>
      <h2>User Dashboard - Stores</h2>
      <div style={{ marginBottom: '16px' }}>
        <Input
          placeholder="Search stores by name or address"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={fetchStores}
          style={{ marginBottom: '8px' }}
        />
        <Button type="primary" onClick={fetchStores}>Search</Button>
      </div>
      <Table columns={columns} dataSource={stores} rowKey="id" />

      <Modal
        title={`Rate ${selectedStore?.name}`}
        open={modalVisible}
        onOk={handleSubmitRating}
        onCancel={() => setModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Rating">
            <Rate value={rating} onChange={setRating} />
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default UserDashboard;
