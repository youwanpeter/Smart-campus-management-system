import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Table, Button, Modal, Form, Input, DatePicker, Select, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const ResourceTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingResource, setEditingResource] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const response = await axios.get("http://localhost:5000/api/resources");
    setData(response.data);
  };

  const handleAddOrUpdateResource = async (values) => {
    console.log("Form values:", values); 
    const formattedValues = {
      ...values,
      acquired_date: values.acquired_date.format("YYYY-MM-DD"),
      return_date: values.return_date.format("YYYY-MM-DD"),
    };

    try {
      if (isEditMode && editingResource) {
        await axios.put(`http://localhost:5000/api/resources/${editingResource.id}`, formattedValues);
        message.success("Resource updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/resources", formattedValues);
        message.success("Resource added successfully!");
      }
      fetchResources(); 
      setIsModalVisible(false); 
      form.resetFields(); 
      setIsEditMode(false); 
      setEditingResource(null); 
    } catch (error) {
      message.error("Error adding/updating resource.");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/resources/${id}`);
    fetchResources();
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setIsEditMode(true);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...resource,
      acquired_date: moment(resource.acquired_date),
      return_date: moment(resource.return_date),
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Hall No.", dataIndex: "resource_name", key: "resource_name" },
    { title: "Acquired Date", dataIndex: "acquired_date", key: "acquired_date" },
    { title: "Return Date", dataIndex: "return_date", key: "return_date" },
    { title: "Acquired By", dataIndex: "acquired_person", key: "acquired_person" },
    { title: "Department", dataIndex: "resource_dep", key: "resource_dep" },
    { title: "Purpose", dataIndex: "resource_purpose", key: "resource_purpose" },
    { title: "Return Status", dataIndex: "resource_status", key: "resource_status" },
    { title: "Remarks", dataIndex: "resource_remarks", key: "resource_remarks" },
    {
      title: "Actions",
      key: "actions",
      render: (_, resource) => (
        <div>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(resource)} />
          <Popconfirm title="Delete this resource?" onConfirm={() => handleDelete(resource.id)}>
            <Button type="link" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          form.resetFields();
          setEditingResource(null);
          setIsModalVisible(true);
        }}
        style={{ marginBottom: 20 }}
      >
        Add Resource
      </Button>

      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        title={editingResource ? "Edit Resource" : "Add Resource"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrUpdateResource}>
          <Form.Item name="resource_name" label="Hall No." rules={[{ required: true }]}>
            <Select>
              <Option value="Hall A">Hall A</Option>
              <Option value="Hall B">Hall B</Option>
              <Option value="Hall C">Hall C</Option>
            </Select>
          </Form.Item>
          <Form.Item name="acquired_date" label="Acquired Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="return_date" label="Return Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="acquired_person" label="Acquired By" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="resource_dep" label="Department" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="resource_purpose" label="Purpose" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="resource_remarks" label="Remarks">
            <Input />
          </Form.Item>
          <Form.Item name="resource_status" label="Return Status" rules={[{ required: true }]}>
            <Select>
              <Option value="Borrowed">Borrowed</Option>
              <Option value="Returned">Returned</Option>
            </Select>
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

export default ResourceTable;
