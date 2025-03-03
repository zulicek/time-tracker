import React from "react";
import { Card } from "antd";
import LoginForm from "../components/LoginForm";
import { FieldTimeOutlined } from "@ant-design/icons";

const LoginPage: React.FC = () => (
  <div className="flex flex-col bg-gray-100 min-h-screen justify-center items-center">
   <h1 className="text-2xl font-semibold mb-4">
        <FieldTimeOutlined className="mr-2" style={{ color: "#5d0ec0" }} /> Time Tracker
      </h1>

    <div className="w-full max-w-md">
      <Card title="Login" className="shadow-lg p-6">
        <LoginForm />
      </Card>
    </div>
  </div>
);

export default LoginPage;
