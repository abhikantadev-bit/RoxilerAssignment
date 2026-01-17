import React, { useState, useContext } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/authService';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login: contextLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await login(values);
      const { token, user } = response.data;
      contextLogin(token, user);
      message.success('Login successful!');
      navigate(`/${user.role}`);
    } catch (error) {
      message.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
        <p style={{ textAlign: 'center' }}>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
