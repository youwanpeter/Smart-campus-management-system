import React, { useState, useEffect } from "react";
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
import axios from "axios";
import dayjs from "dayjs";

const Table = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingEvent, setEditingEvent] = useState(null);
  const [data, setData] = useState([]); // Data fetched from API
  const [image, setImage] = useState(null); // State for image upload

  // Fetch events data from the backend when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events/all")
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

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
    axios
      .put(`http://localhost:5000/api/events/update/${event_id}`, {
        status: value,
      })
      .then((response) => {
        const updatedData = data.map((item) =>
          item.event_id === event_id ? { ...item, status: value } : item
        );
        setData(updatedData);
        message.success(`Status updated to ${value}`);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        message.error("Failed to update status");
      });
  };

  const handleEdit = (event) => {
    console.log("Editing event:", event);
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
        const eventDate = values.event_date ? dayjs(values.event_date) : null;
        if (!eventDate || !eventDate.isValid()) {
          message.error("Invalid date selected.");
          return;
        }

        if (editingEvent) {
          console.log("Updating event with ID:", editingEvent.event_id);
          console.log("Request body:", { ...values, event_image: image });

          axios
            .put(
              `http://localhost:5000/api/events/update/${editingEvent.event_id}`,
              {
                ...values,
                event_image: image,
                event_date: eventDate.toISOString(), // Ensure the correct format
              }
            )
            .then((response) => {
              const updatedData = data.map((item) =>
                item.event_id === editingEvent.event_id
                  ? {
                      ...item,
                      ...values,
                      event_image: image,
                      event_date: eventDate,
                    }
                  : item
              );
              setData(updatedData);
              message.success("Event updated successfully");
            })
            .catch((error) => {
              console.error("Error updating event:", error);
              message.error("Failed to update event");
            });
        } else {
          const newEvent = {
            ...values,
            event_id: Date.now().toString(),
            event_image: image,
            event_date: eventDate.toISOString(), // Ensure the correct format
          };
          console.log("Creating new event:", newEvent);

          axios
            .post("http://localhost:5000/api/events/create", newEvent)
            .then((response) => {
              setData([...data, response.data]);
              message.success("Event created successfully");
            })
            .catch((error) => {
              console.error("Error creating event:", error);
              message.error("Failed to create event");
            });
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
    axios
      .delete(`http://localhost:5000/api/events/delete/${event_id}`)
      .then((response) => {
        const updatedData = data.filter((item) => item.event_id !== event_id);
        setData(updatedData);
        message.success("Event deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
        message.error("Failed to delete event");
      });
  };

  const handleImageUpload = ({ file }) => {
    if (!file) {
      message.error("No file selected!");
      return Upload.LIST_IGNORE; // Reject file
    }

    const isImage = file.type && file.type.startsWith("image/");
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
            <DatePicker
              style={{ width: "100%" }}
              value={editingEvent ? dayjs(editingEvent.event_date) : null} // ensure the date is in the correct format
            />
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
