import React, { useState } from "react";
import { Typography, Button, Modal } from "antd";
import Booking from "../Booking/booking";

const { Title } = Typography;

const RenderTitle = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const receiveDataFromChild = (data) => {
    console.log("data", data);
    setIsModalOpen(data);
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Title level={3}>Appointments</Title>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Book Appointment
      </Button>
      <Modal
        title={<Title level={3}>Book Appointment</Title>}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Booking sendDataToParent={receiveDataFromChild} />
      </Modal>
    </div>
  );
};

export default RenderTitle;
