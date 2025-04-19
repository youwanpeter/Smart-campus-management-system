import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();

  // Axios instance with correct base URL
  const api = axios.create({
    baseURL: "http://localhost:5000", // Matches backend port
    withCredentials: true,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      message.error("Failed to fetch tasks");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingTask) {
        await api.put(`/api/tasks/${editingTask._id}`, values);
        message.success("Task updated successfully");
      } else {
        await api.post("/api/tasks", values);
        message.success("Task created successfully");
      }
      fetchTasks();
      setIsModalOpen(false);
      setEditingTask(null);
      form.resetFields();
    } catch (error) {
      console.error("Save error:", error.response?.data || error.message);
      message.error("Failed to save task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      message.success("Task deleted successfully");
      fetchTasks();
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      message.error("Failed to delete task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      dueDate: moment(task.dueDate),
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={handleCreate}
        style={{ marginBottom: 16 }}
      >
        Create Task
      </Button>
      <Table dataSource={tasks} columns={columns} rowKey="_id" />

      <Modal
        title={editingTask ? "Edit Task" : "Create Task"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{ status: "Pending" }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: "Please select a due date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Task;
