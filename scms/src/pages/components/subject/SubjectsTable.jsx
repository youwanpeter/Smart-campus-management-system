import React, { useState, useEffect } from "react";
import {
  Table as AntTable,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
  Space,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const SubjectsTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingSubject, setEditingSubject] = useState(null);
  const [data, setData] = useState();

  const [subjects, setSubjects] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/subjects");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Fetch subjects
  // const fetchSubjects = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch('api/subjects');
  //     const data = await response.json();
  //     setSubjects(data);
  //   } catch (error) {
  //     console.error('Error fetching subjects:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Fetch instructors

  const fetchInstructors = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/instructors"
      );
      const data = await response.json();
      console.log(data);
      setInstructors(data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  // Handle create or update
  const handleCreateOrUpdate = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,
        subject_id: editingSubject ? editingSubject.id : undefined,
      };

      let url = "http://localhost:5000/api/subjects";
      const method = editingSubject ? "PUT" : "POST";
      if (editingSubject) {
        url += "/" + editingSubject.id;
      }

      setLoading(true);
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Refresh the subjects list
        const refreshResponse = await fetch(
          "http://localhost:5000/api/subjects"
        );
        const refreshData = await refreshResponse.json();
        setData(refreshData);

        setIsModalVisible(false);
        setEditingSubject(null);
        form.resetFields();
      } else {
        console.error("Error saving subject:", await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete subject
  const handleDelete = async (subjectId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/subjects/${subjectId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove the deleted subject from the local state
        const refreshResponse = await fetch(
          "http://localhost:5000/api/subjects"
        );
        const refreshData = await refreshResponse.json();
        setData(refreshData);
        message.success("Subject deleted successfully");
      } else {
        Modal.error({
          title: "Delete Failed",
          content: "Failed to delete the subject. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      Modal.error({
        title: "Delete Failed",
        content: "An error occurred while deleting the subject.",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "subject_name",
      key: "subject_name",
      sorter: (a, b) => a.subject_name.localeCompare(b.subject_name),
    },
    {
      title: "Description",
      dataIndex: "subject_description",
      key: "subject_description",
      ellipsis: true,
    },
    {
      title: "Level",
      dataIndex: "subject_level",
      key: "subject_level",
      render: (level) => {
        let color = "blue";
        if (level === "beginner") color = "green";
        if (level === "advanced") color = "red";
        return (
          <Tag color={color}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: "Instructors",
      dataIndex: "instructors",
      key: "instructors",
      render: (instructors) => (
        <>
          {instructors &&
            instructors.map((instructor) => (
              <Tag key={instructor._id}>{instructor.name}</Tag>
            ))}
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this subject?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const { Option } = Select;

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    form.setFieldsValue(subject);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingSubject(null);
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 20 }}
      >
        Create Subject
      </Button>
      <AntTable columns={columns} dataSource={data} rowKey="id" />

      {/* Modal for creating or editing a subject */}
      <Modal
        title={editingSubject ? "Edit Subject" : "Create Subject"}
        open={isModalVisible}
        onOk={handleCreateOrUpdate}
        onCancel={handleCancel}
        okText={editingSubject ? "Update" : "Create"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="subject_form">
          <Form.Item
            name="subject_name"
            label="Subject Name"
            rules={[{ required: true, message: "Please input subject name." }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="subject_description"
            label="Subject Description"
            rules={[
              { required: true, message: "Please input subject description." },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="subject_level"
            label="Subject Level"
            rules={[{ required: true, message: "Please input subject level." }]}
          >
            <Select>
              <Option value="beginner">Beginner</Option>
              <Option value="intermediate">Intermediate</Option>
              <Option value="advanced">Advanced</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="instructors"
            label="Instructors"
            rules={[
              {
                required: true,
                message: "Please select at least one instructor.",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select instructors"
              optionFilterProp="children"
            >
              {instructors.map((instructor) => (
                <Option key={`option-${instructor._id}`} value={instructor._id}>
                  {instructor.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubjectsTable;
