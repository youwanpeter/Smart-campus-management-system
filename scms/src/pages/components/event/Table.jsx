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
  Upload,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";

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
      event_image: "", // New field for image
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
      event_image: "", // New field for image
    },
    // Add more rows here
  ]);

  const [image, setImage] = useState(null); // State for image upload

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
      title: "Event Image",
      key: "event_image",
      render: (text, record) =>
        record.event_image ? (
          <img
            src={record.event_image}
            alt="Event"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        ) : (
          <span>No Image</span>
        ),
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

  const handleStatusChange = (value, event_id) => {
    const updatedData = data.map((item) =>
      item.event_id === event_id ? { ...item, status: value } : item
    );
    setData(updatedData);
    message.success(`Status updated to ${value}`);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    form.setFieldsValue(event);
    setImage(event.event_image); // Set image when editing
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingEvent(null);
    setImage(null); // Reset image state on modal close
  };

  const handleCreateOrUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingEvent) {
          const updatedData = data.map((item) =>
            item.event_id === editingEvent.event_id
              ? { ...item, ...values, event_image: image }
              : item
          );
          setData(updatedData);
          message.success("Event updated successfully");
        } else {
          const newEvent = {
            ...values,
            event_id: Date.now().toString(),
            event_image: image,
          };
          setData([...data, newEvent]);
          message.success("Event created successfully");
        }

        setIsModalVisible(false);
        form.resetFields();
        setEditingEvent(null);
        setImage(null); // Reset image state after form submission
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleDelete = (event_id) => {
    const updatedData = data.filter((item) => item.event_id !== event_id);
    setData(updatedData);
    message.success("Event deleted successfully");
  };

  const handleImageUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE; // Reject file
    }

    setImage(URL.createObjectURL(file)); // Set the image locally (for preview)
    return false; // Prevent auto upload (you can implement manual upload)
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

          {/* Image Upload Field */}
          <Form.Item label="Event Image">
            <Upload
              listType="picture-card"
              showUploadList={false}
              customRequest={handleImageUpload}
            >
              {image ? (
                <img src={image} alt="event" style={{ width: "100%" }} />
              ) : (
                <div>
                  <UploadOutlined />
                  <div>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Table;
