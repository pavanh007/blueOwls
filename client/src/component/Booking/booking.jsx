import React, { useState } from "react";
import { Button, Form, Input, TimePicker, DatePicker } from "antd";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Booking = ({ sendDataToParent }) => {
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

  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState("horizontal");
  const practitioner_id = localStorage.getItem("st-u");

  const onFinish = async (values) => {
    let responseObj = {};
    const regexTogetDate =
      /(Sun|Mon|Tue|Wed|Thu|Fri|Sat) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{2} \d{4}/;
    const regexPatternToGetTime = /\d{2}:\d{2}:\d{2}/;

    const dateOfAppointment = values.date._d.toString();
    const dateMatch = dateOfAppointment.match(regexTogetDate);
    const appointments = {};

    values.interval.forEach((val, index) => {
      const intervalDate = val._d.toString();
      const timeMatch = intervalDate.match(regexPatternToGetTime);
      const time = timeMatch[0];

      if (index === 0) {
        appointments.start = time;
      } else if (index === 1) {
        appointments.end = time;
      }
    });

    appointments.date = dateMatch[0];
    
    try {
      const [appointmentsResponse, createAppointmentResponse] =
        await Promise.all([
          axios.get("http://127.0.0.1:8000/api/appointment/v1/", {
            params: {
              practitioner_id: practitioner_id,
            },
          }),
          axios.post("http://127.0.0.1:8000/api/appointment/v1/create", {
            ...appointments,
            practitioner_id: practitioner_id,
            note: values.note,
            patient_phone_no: values.phone,
          }),
        ]);

      
      const filteredAppointments = appointmentsResponse.data.filter((res) => {
        const existingAppointmentDate = new Date(appointments.date);
        const newAppointmentDate = new Date(res.date);
        if ( existingAppointmentDate &&
          existingAppointmentDate.getTime() === newAppointmentDate.getTime() &&
          res.start >= appointments.start &&
          res.start <= appointments.end
        ) {
          return true;
        }
      });

      if (filteredAppointments.length > 0) {
        notifyInvalidInputs("slot is not available");
        return;
      }

      if (createAppointmentResponse.status === 200) {
        notifyOnSuccess("appointment created");
        await axios.post("http://127.0.0.1:8000/api/user/v1/users", {
          phone: values.phone,
          name: values.name,
        });
        sendDataToParent(false);
      }
    } catch (error) {
      console.error(error);
      notifyInvalidInputs(error.data);
    }
  };

  const formItemLayout =
    formLayout === "horizontal"
      ? {
          labelCol: {
            span: 6,
          },
          wrapperCol: {
            span: 14,
          },
        }
      : null;

  const buttonItemLayout =
    formLayout === "horizontal"
      ? {
          wrapperCol: {
            span: 14,
            offset: 4,
          },
        }
      : null;

  return (
    <>
      <ToastContainer
        style={{ width: "29.438rem", fontSize: "1rem", zIndex: 4 }}
        position="top-center"
        autoClose={3000}
        closeOnClick={true}
        rtl={false}
        hideProgressBar={true}
      />
      <Form
        {...formItemLayout}
        layout="horizontal"
        form={form}
        initialValues={{
          layout: formLayout,
        }}
        onFinish={onFinish}
      >
       
        <Form.Item
          label="New Patient"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
            },
          ]}
        >
          <Input placeholder="new patient" />
        </Form.Item>
        <Form.Item label="Interval" name="interval">
          <TimePicker.RangePicker />
        </Form.Item>
        <Form.Item
          label="Phone no"
          name="phone"
          rules={[
            {
              required: true,
              message: "Please input your phone!",
            },
          ]}
        >
          <Input placeholder="Phone" />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Please input your date!",
            },
          ]}
          label="Date"
          name="date"
          style={{ textAlign: "center", width: "100%" }}
        >
          <DatePicker style={{ textAlign: "center", width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Note"
          name="note"
          rules={[
            {
              required: true,
              message: "Please input your note!",
            },
          ]}
        >
          <Input.TextArea placeholder="Enter any additional notes" />
        </Form.Item>
        <Form.Item
          style={{
            textAlign: "center",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            className="register-form-button"
          >
            Book Appointment
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Booking;
