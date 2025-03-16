import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Input, Select, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:5000/api/users");
    setUsers(response.data);
  };

  const handleAddUser = async (values) => {
    if (isEditMode && editingUser) {
      await axios.put(`http://localhost:5000/api/users/${editingUser.id}`, values);
    } else {
      await axios.post("http://localhost:5000/api/users", values);
    }
    fetchUsers();
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

  const handleDeleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    fetchUsers();
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
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
          <Button icon={<EditOutlined />} onClick={() => handleEditUser(record)} style={{ marginRight: 8 }} />
          <Popconfirm title="Delete this user?" onConfirm={() => handleDeleteUser(record.id)} okText="Yes" cancelText="No">
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
        Add User
      </Button>
      <Table columns={columns} dataSource={users} rowKey="id" style={{ marginTop: 20 }} />
      <Modal title={isEditMode ? "Edit User" : "Add User"} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAddUser}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}><Select><Option value="Admin">Admin</Option><Option value="Lecturer">Lecturer</Option><Option value="Student">Student</Option></Select></Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit">{isEditMode ? "Update" : "Add"}</Button></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
