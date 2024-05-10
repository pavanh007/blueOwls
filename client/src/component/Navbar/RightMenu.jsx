import React from "react";
import { Menu, Avatar } from "antd";
import { UserOutlined, CodeOutlined, LogoutOutlined } from "@ant-design/icons";

const RightMenu = ({ mode }) => {
const Logout = () => {
  const aToken = localStorage.getItem("st-a");
  if (aToken) {
    localStorage.removeItem("st-a");
    window.location.href = "http://localhost:3000/";
  }
};
  return (
    <Menu mode={mode}>
      <Menu.SubMenu
        title={
          <>
            <Avatar icon={<UserOutlined />} />
            <span className="username">John Doe</span>
          </>
        }
      >
        <Menu.Item key="about-us">
          <UserOutlined /> Profile
        </Menu.Item>
        <Menu.Item key="settings">
          <CodeOutlined /> Settings
        </Menu.Item>
        <Menu.Item key="log-out" onClick={Logout}>
          <LogoutOutlined /> Logout
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export default RightMenu;
