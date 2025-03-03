import React, { useState } from "react";
import { Form, Input, Button, Spin } from "antd";
import { loginUser } from "../store/authSlice";
import { useAppSelector, useAppDispatch } from "../store/store";

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState<string>("test@test.com");
  const [password, setPassword] = useState<string>("123456");

  const handleSubmit = () => {
    if (email && password) {
      dispatch(loginUser());
    }
  };

  return (
    <Form
      name="login"
      initialValues={{ email, password }}
      onFinish={handleSubmit}
      layout="vertical"
      style={{ maxWidth: 400 }}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Item>

      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

      <Form.Item style={{ textAlign: "center", width: "100%" }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          {loading ? <Spin /> : "Login"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
