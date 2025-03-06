import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Admin User", role: "Admin" },
    { id: 2, name: "John Doe", role: "Lecturer" },
    { id: 3, name: "Jane Smith", role: "Student" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddUser = (values) => {
    const newUser = { id: Date.now(), ...values };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => handleDeleteUser(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
        Add User
      </Button>
      <Table columns={columns} dataSource={users} rowKey="id" style={{ marginTop: 20 }} />
      
      <Modal
        title="Add User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddUser}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter a name" }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: "Please select a role" }]}> 
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="Lecturer">Lecturer</Option>
              <Option value="Student">Student</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};


export default Users;
