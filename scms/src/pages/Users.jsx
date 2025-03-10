import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin User",
      role: "Admin",
      email: "admin@example.com",
      phone: "1234567890",
      username: "admin",
      password: "********",
    },
    {
      id: 2,
      name: "John Doe",
      role: "Lecturer",
      email: "john@example.com",
      phone: "9876543210",
      username: "johndoe",
      password: "********",
    },
    {
      id: 3,
      name: "Jane Smith",
      role: "Student",
      email: "jane@example.com",
      phone: "5678901234",
      username: "janesmith",
      password: "********",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const handleAddUser = (values) => {
    if (isEditMode && editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...editingUser, ...values } : user
        )
      );
    } else {
      const newUser = { id: Date.now(), ...values, password: "********" };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
    form.resetFields();
    setIsEditMode(false);
    setEditingUser(null);
  };

  const handleEditUser = (user) => {
    setIsEditMode(true);
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Password", dataIndex: "password", key: "password" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setIsEditMode(false);
          setEditingUser(null);
          form.resetFields();
          setIsModalOpen(true);
        }}
      >
        {isEditMode ? "Edit User" : "Add User"}
      </Button>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        style={{ marginTop: 20 }}
      />

      <Modal
        title={isEditMode ? "Edit User" : "Add User"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddUser}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="Lecturer">Lecturer</Option>
              <Option value="Student">Student</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter a phone number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter a username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
