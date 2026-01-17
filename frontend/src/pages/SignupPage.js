import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';
import { validatePassword } from '../utils/validations';

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    if (!validatePassword(values.password)) {
      message.error('Password must be 8-16 chars with uppercase and special char');
      return;
    }

    setLoading(true);
    try {
      await signup(values);
      message.success('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <h2 style={{ textAlign: 'center' }}>Sign Up</h2>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name" rules={[{ required: true }, { min: 20, message: 'Min 20 chars' }, { max: 60, message: 'Max 60 chars' }]}>
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="8-16 chars, uppercase, special char" />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input.TextArea placeholder="Enter your address (optional)" maxLength={400} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <p style={{ textAlign: 'center' }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </Card>
    </div>
  );
};

export default SignupPage;
