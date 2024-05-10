import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button,  Form, Input, Layout, Typography } from "antd";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { Title } = Typography;

const Login = () => {

  const notifyInvalidInputs = (msg) => {
    toast.error(msg, {
      theme: "colored",
      icon: false,
    });
    
  };
  const notifyOnSuccess = () => {
    toast.success("logging in", {
      theme: "colored",
      icon: false,
    });
  }

  const onFinish = async (values) => {
    try {
      
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/v1/token",
        {
          phone: values.phone,
          password: values.password,
        }
      );
      if (response.status === 200) {
        localStorage.setItem("st-a", response.data.access_token);
        localStorage.setItem("st-r", response.data.refresh_token);
        localStorage.setItem("st-u", response.data.phone);
      }
      
      if (response.data.phone) {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/user/v1/users/${response.data.phone}`
        );
        if (!res) {
          console.log("res", res);
          notifyInvalidInputs("res");
        }
        notifyOnSuccess();
        const role = res.data.role;
        window.location.href = `http://localhost:3000/${role}`;
      }
    } catch (error) {
      notifyInvalidInputs(error.response.data.detail);
    }
  };

  return (
    <div>
      <ToastContainer
        style={{ width: "29.438rem", fontSize: "1rem" }} 
        position="top-right"
        autoClose={1000}
        closeOnClick={true}
        rtl={false}
        hideProgressBar={true}
      />

      <Layout
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            width: "500px",
            height: "400px",
            padding: "50px",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            backgroundColor: "#fff",
            alignContent: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Title level={3}>LOGIN</Title>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            style={{ marginTop: "30px" }}
          >
            <Form.Item
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please input your phone!",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="phone"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{ width: "100%", marginTop: "30px" }}
              >
                Log in
              </Button>
            </Form.Item>
            <Form.Item>
              <a href="http://localhost:3000/register">register now!</a>
            </Form.Item>
          </Form>
        </div>
      </Layout>
    </div>
  );
};

export default Login;
