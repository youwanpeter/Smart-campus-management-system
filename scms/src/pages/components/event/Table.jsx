import React, { useState } from "react";
import {
  Table as AntTable,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const Table = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingEvent, setEditingEvent] = useState(null);
  const [data, setData] = useState([
    {
      event_id: "001",
      event_name: "Tech Conference",
      event_description: "A tech conference about AI advancements.",
      event_date: "2025-04-10",
      event_location: "London",
      organizer_name: "Tech Inc.",
      created_at: "2025-01-01",
      updated_at: "2025-01-10",
      status: "Pending",
    },
    {
      event_id: "002",
      event_name: "Startup Pitch",
      event_description: "A pitch event for startups.",
      event_date: "2025-05-15",
      event_location: "New York",
      organizer_name: "Venture Capitalists",
      created_at: "2025-02-01",
      updated_at: "2025-02-05",
      status: "Pending",
    },
    // Add more rows here
  ]);

  const columns = [
    {
      title: "Event ID",
      dataIndex: "event_id",
      key: "event_id",
    },
    {
      title: "Event Name",
      dataIndex: "event_name",
      key: "event_name",
    },
    {
      title: "Event Description",
      dataIndex: "event_description",
      key: "event_description",
    },
    {
      title: "Event Date",
      dataIndex: "event_date",
      key: "event_date",
    },
    {
      title: "Event Location",
      dataIndex: "event_location",
      key: "event_location",
    },
    {
      title: "Organizer Name",
      dataIndex: "organizer_name",
      key: "organizer_name",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          defaultValue={text}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(value, record.event_id)}
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Published">Published</Select.Option>
          <Select.Option value="Unpublished">Unpublished</Select.Option>
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this event?"
            onConfirm={() => handleDelete(record.event_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Handle the status change
  const handleStatusChange = (value, event_id) => {
    const updatedData = data.map((item) =>
      item.event_id === event_id ? { ...item, status: value } : item
    );
    setData(updatedData);
    message.success(`Status updated to ${value}`);
  };

  // Handle edit action
  const handleEdit = (event) => {
    setEditingEvent(event);
    form.setFieldsValue(event); // Pre-fill the form with event details
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingEvent(null); // Reset the editing event
  };

  // Handle form submission (creating or updating an event)
  const handleCreateOrUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingEvent) {
          // Update the event
          const updatedData = data.map((item) =>
            item.event_id === editingEvent.event_id
              ? { ...item, ...values }
              : item
          );
          setData(updatedData);
          message.success("Event updated successfully");
        } else {
          // Create a new event
          const newEvent = { ...values, event_id: Date.now().toString() }; // Generate a new event ID
          setData([...data, newEvent]);
          message.success("Event created successfully");
        }

        setIsModalVisible(false);
        form.resetFields(); // Reset form fields
        setEditingEvent(null); // Clear editing state
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Handle delete action
  const handleDelete = (event_id) => {
    const updatedData = data.filter((item) => item.event_id !== event_id);
    setData(updatedData);
    message.success("Event deleted successfully");
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 20 }}
      >
        Create Event
      </Button>
      <AntTable columns={columns} dataSource={data} rowKey="event_id" />

      {/* Modal for creating or editing an event */}
      <Modal
        title={editingEvent ? "Edit Event" : "Create Event"}
        open={isModalVisible}
        onOk={handleCreateOrUpdate}
        onCancel={handleCancel}
        okText={editingEvent ? "Update" : "Create"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="event_form">
          <Form.Item
            name="event_name"
            label="Event Name"
            rules={[{ required: true, message: "Please input event name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="event_description"
            label="Event Description"
            rules={[
              { required: true, message: "Please input event description!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="event_date"
            label="Event Date"
            rules={[{ required: true, message: "Please select event date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="event_location"
            label="Event Location"
            rules={[
              { required: true, message: "Please input event location!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="organizer_name"
            label="Organizer Name"
            rules={[
              { required: true, message: "Please input organizer name!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Table;
