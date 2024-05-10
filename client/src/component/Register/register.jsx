import React from "react";
import {  
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Button,  Form, Input, Layout, Typography } from "antd";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  ClockCircleOutlined,
} from "@ant-design/icons";
const { Title } = Typography;

const Register = () => {
  const notifyInvalidInputs = (msg) => {
    toast.error(msg, {
      theme: "colored",
      icon: false,
    });
  };
  const notifyOnSuccess = (msg) => {
    toast.success(msg, {
      theme: "colored",
      icon: false,
    });
  };
  const onFinish = async  (values) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/v1/users",
        {
          name: values.name,
          email: values.email,
          password: values.password,
          phone: values.phone,
          age: values.age,
          
        }
      );
      if (response.status === 200) {
        notifyOnSuccess("registration successfull");
        window.location.href = "http://localhost:3000";
      }
    } catch (error) {
     notifyInvalidInputs(error?.response?.data?.detail);
    }
  }

  return (
    <div>
      <ToastContainer
        style={{ width: "29.438rem", fontSize: "1rem" }}
        position="top-center"
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
            height: "600px",
            padding: "50px",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            backgroundColor: "#fff",
            alignContent: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Title level={3}>REGISTER</Title>
          <Form
            name="normal_register"
            className="register-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            style={{ marginTop: "30px" }}
          >
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Name"
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="Email"
              />
            </Form.Item>
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
                prefix={<PhoneOutlined />}
                placeholder="Phone"
              />
            </Form.Item>
            <Form.Item
              name="age"
              rules={[
                {
                  required: true,
                  message: "Please input your age!",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<ClockCircleOutlined />}
                placeholder="Age"
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
              <Input.Password
                placeholder="input password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="confirm password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="register-form-button"
                style={{ width: "100%", marginTop: "30px" }}
              >
                Register
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Layout>
    </div>
  );
};

export default Register;
