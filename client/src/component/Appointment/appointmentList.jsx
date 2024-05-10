import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Tag,
  Typography,
  Button,
  Drawer,
  Layout,
  Input,
  Form,
} from "antd";
import RenderTitle from "./appointment.jsx";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../Navbar/index.jsx";


const handleJoin = () => {};

const Appointment = () => {
  const [app, setApp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [address, setAddress] = useState(""); 
  const [gmail, setGmail] = useState(""); 
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState("")
  const [age, setAge] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {

  })

  const showDrawer = (patient) => {
    setSelectedPatient(patient);
    setPhone(patient.phone);
    setOpen(true); 
  };

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
  

  const onClose = () => {
    setOpen(false);
    setEditing(false);
  };

  const handleUpdate =async () => {
    
    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/api/user/v1/users/${phone}`,
        {
          email: gmail,
          address: address,
          age: age,
        }
      );
      if (res.status === 200) {
        notifyOnSuccess("user updated");
      }
    } catch (error) {
      notifyInvalidInputs("user not updated")
    }
    setEditing(false); 
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <a onClick={() => showDrawer(record)}>{text}</a>{" "}
        </Space>
      ),
    },
    {
      title: "age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "phone",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Status",
      key: "Status",
      dataIndex: "Status",
      render: (_, { tags }) => (
        <>
          {tags &&
            Array.isArray(tags) &&
            tags.map((tag) => {
              let color;
              if (tag === "COMPELETED") {
                color = "green";
              }
              if (tag === "MISSED") {
                color = "volcano";
              }
              if (tag === "UPCOMING") {
                color = "geekblue";
              }

              return (
                <Tag color={color} key={tag}>
                  {(tag && tag.toUpperCase()) || "NA"}
                </Tag>
              );
            })}
        </>
      ),
    },
    {
      title: "Description",
      key: "Description",
      render: () => (
        <Space size="middle">
          <ul>
            <li>Invite</li>
            <li>Hypertension</li>
          </ul>
        </Space>
      ),
    },
    {
      title: "payment",
      dataIndex: "payment",
      key: "payment",
      render: (text, record) => (
        <Space>
          <a href={text}>PAY NOW</a>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleJoin(record)}>
            Join
          </Button>
        </Space>
      ),
    },
  ];

 useEffect(() => {
   const fetchAppointments = async () => {
     try {
       const phoneNo = localStorage.getItem("st-u");
       let response;
       let transformedAppointments;

       const checkRole = await axios.get(
         `http://127.0.0.1:8000/api/user/v1/users/${phoneNo}`
       );
       setUserRole(checkRole.data.role);
       if (checkRole.data.role === "patient") {
         response = await axios.get(
           `http://127.0.0.1:8000/api/appointment/v1/`,
           {
             params: {
               id: phoneNo,
             },
           }
         );
         transformedAppointments = response.data.map((record) => {
           if (record.patient_phone_no === phoneNo) {
             const tags =
               record.start < Date.now() ? ["NOT_ATTENDED"] : ["UPCOMING"];
             return {
               key: record.appointment_id,
               time: record.start,
               date: record.date,
               address: record.address,
               name: checkRole.data.name,
               tags,
               age: checkRole.data.age,
               phone: checkRole.data.phone,
               email: checkRole.data.email,
               payment: record.payment_link,
             };
           }
           return null;
         });
       } else if (checkRole.data.role === "doctor") {
         response = await axios.get(
           `http://127.0.0.1:8000/api/appointment/v1/`,
           {
             params: {
               id: phoneNo,
             },
           }
         );
         const appointments = response?.data;
         transformedAppointments = await Promise.all(
           appointments.map(async (appointment) => {
             try {
               if (
                 !appointment ||
                 !appointment.start ||
                 !appointment.patient_phone_no
               ) {
                 return null;
               }
               const { data: patient } = await axios.get(
                 `http://127.0.0.1:8000/api/user/v1/users/${appointment.patient_phone_no}`
               );

               if (!patient || !patient.name || !patient.phone) {
                 return null;
               }

               const tags =
                 appointment.start < Date.now()
                   ? ["NOT_ATTENDED"]
                   : ["UPCOMING"];
               return {
                 key: appointment.appointment_id,
                 time: appointment.start,
                 date: appointment.date,
                 address: patient.address,
                 name: patient.name,
                 tags,
                 age: patient.age,
                 phone: patient.phone,
                 email: patient.email,
               };
             } catch (error) {
               console.error("Error fetching patient details:", error);
               return null;
             }
           })
         );
       }
       const filteredAppointments = transformedAppointments.filter(
         (appointment) => appointment !== null
       );
       setApp(filteredAppointments);
       setLoading(false);
     } catch (error) {
       console.error("Error fetching appointments:", error);
       setError(error);
       setLoading(false);
     }
   };

   fetchAppointments();
 }, []);


  if (loading) {
    return <Typography.Text>Loading...</Typography.Text>;
  }

  if (error) {
    return (
      <Typography.Text type="danger">
        Error fetching appointments. Please try again later.
      </Typography.Text>
    );
  }
  let filteredColumns = columns;

  if (userRole === "doctor") {
    filteredColumns = columns.filter((column) => column.key !== "payment");
  }

  const column = filteredColumns;
  return (
    <>
      <ToastContainer
        style={{ width: "29.438rem", fontSize: "1rem" }}
        position="top-right"
        autoClose={1000}
        closeOnClick={true}
        rtl={false}
        hideProgressBar={true}
      />
      <Navbar role={userRole} />
      <Table
        columns={column}
        dataSource={app}
        title={RenderTitle}
        
      />

      <Drawer title="Patient Details" onClose={onClose} visible={open}>
        <Layout style={{ padding: "20px" }}>
          <Form
            className="update-form"
            initialValues={{
              remember: true,
            }}
          >
            {selectedPatient && (
              <>
                <Form.Item label="Name">
                  <Typography.Text level={5}>
                    {selectedPatient.name}
                  </Typography.Text>
                </Form.Item>
                <Form.Item label="Address" name="address">
                  {editing ? (
                    <Input
                      value={address}
                      onChange={(e) => {
                        const inputAddress = e.target.value;
                        if (inputAddress.trim() !== "") {
                          setAddress(inputAddress);
                        } else {
                          setAddress("");
                          notifyInvalidInputs("Invalid address");
                        }
                      }}
                    />
                  ) : (
                    <Typography.Text level={5}>
                      {selectedPatient.address}
                    </Typography.Text>
                  )}
                </Form.Item>
                <Form.Item label="Gmail" name="gmail">
                  {editing ? (
                    <Input
                      value={gmail}
                      onChange={(e) => {
                        const inputEmail = e.target.value;
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (emailRegex.test(inputEmail)) {
                          setGmail(inputEmail);
                        } else {
                          setGmail("");
                          notifyInvalidInputs("Invalid gmail input");
                        }
                      }}
                    />
                  ) : (
                    <Typography.Text level={5}>
                      {selectedPatient.gmail}
                    </Typography.Text>
                  )}
                </Form.Item>
                <Form.Item label="Age" name="age">
                  {editing ? (
                    <Input
                      value={age}
                      onChange={(e) => {
                        const inputAge = e.target.value;
                        if (
                          !isNaN(inputAge) &&
                          inputAge >= 0 &&
                          inputAge <= 150
                        ) {
                          setAge(inputAge);
                        } else {
                          setAge("");
                          notifyInvalidInputs("Invalid age input");
                        }
                      }}
                    />
                  ) : (
                    <Typography.Text level={5}>
                      {selectedPatient.age}
                    </Typography.Text>
                  )}
                </Form.Item>
                <Form.Item label="Phone">
                  <Typography.Text level={5}>{phone}</Typography.Text>
                </Form.Item>
                <Form.Item>
                  {editing ? (
                    <Button type="primary" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  ) : (
                    <Button type="primary" onClick={() => setEditing(true)}>
                      Edit
                    </Button>
                  )}
                </Form.Item>
                {editing && (
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%", marginTop: "30px" }}
                      onClick={handleUpdate}
                    >
                      Save
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form>
        </Layout>
      </Drawer>
    </>
  );
};

export default Appointment;
