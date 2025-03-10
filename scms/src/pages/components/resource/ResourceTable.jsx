import React, { useState } from "react";
import moment from "moment";
import {
  Table as AntTable,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ResourceTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingResource, setEditingResource] = useState(null);
  const [data, setData] = useState([
    {
      key: "001",
      resource_name: "Microphones",
      resource_acq_date: "2025-03-01",
      resource_ret_date: "2025-03-06",
      resource_person: "Youwan Peter",
      resource_dep: "Finance",
      resource_purpose: "Annual CEO Forum",
      resource_status: "Returned",
      resource_remarks: "Was borrowed for the event",
    },
  ]);

  const handleAddOrUpdateResource = (values) => {
    const formattedValues = {
      ...values,
      resource_acq_date: values.resource_acq_date.format("YYYY-MM-DD"),
      resource_ret_date: values.resource_ret_date.format("YYYY-MM-DD"),
    };

    if (editingResource) {
      setData(
        data.map((item) =>
          item.key === editingResource.key
            ? { ...item, ...formattedValues }
            : item
        )
      );
      message.success("Resource updated successfully!");
    } else {
      const newResource = {
        ...formattedValues,
        key: Date.now().toString(),
        resource_status: "Borrowed",
      };
      setData([...data, newResource]);
      message.success("Resource added successfully!");
    }

    setIsModalVisible(false);
    form.resetFields();
    setEditingResource(null);
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
    message.success("Resource deleted successfully");
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    form.setFieldsValue({
      ...resource,
      resource_acq_date: moment(resource.resource_acq_date),
      resource_ret_date: moment(resource.resource_ret_date),
    });
    setIsModalVisible(true);
  };

  const Resourcecolumns = [
    { title: "Resource ID", dataIndex: "key", key: "key" },
    { title: "Resource Name", dataIndex: "resource_name", key: "Name" },
    {
      title: "Acquired Date",
      dataIndex: "resource_acq_date",
      key: "Acquired data",
    },
    {
      title: "Return Date",
      dataIndex: "resource_ret_date",
      key: "Returned date",
    },
    { title: "Acquired By", dataIndex: "resource_person", key: "Acquired by" },
    { title: "Department", dataIndex: "resource_dep", key: "Department" },
    { title: "Purpose", dataIndex: "resource_purpose", key: "Purpose" },
    { title: "Remarks", dataIndex: "resource_remarks", key: "Remarks" },
    {
      title: "Actions",
      key: "actions",
      render: (_, resource) => (
        <div>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(resource)}
          />
          <Popconfirm
            title="Delete this resource?"
            onConfirm={() => handleDelete(resource.key)}
          >
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

      <AntTable columns={Resourcecolumns} dataSource={data} rowKey="key" />

      <Modal
        title={editingResource ? "Edit Resource" : "Add Resource"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {editingResource ? "Update" : "Submit"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrUpdateResource}
        >
          <Form.Item
            name="resource_name"
            label="Resource Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="resource_acq_date"
            label="Acquired Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="resource_ret_date"
            label="Return Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="resource_person"
            label="Acquired By"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="resource_dep"
            label="Department"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="resource_purpose"
            label="Purpose"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="resource_remarks" label="Remarks">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ResourceTable;
