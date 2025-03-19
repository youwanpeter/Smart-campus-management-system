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
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

// Base URL for the API
const API_BASE_URL = "http://localhost:5000";

const Table = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingEvent, setEditingEvent] = useState(null);
  const [data, setData] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch event data on component mount
  const fetchEvents = () => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/events/all`)
      .then((response) => {
        console.log("Fetched events:", response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        message.error("Failed to fetch events.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Table columns definition
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
      ellipsis: true,
    },
    {
      title: "Event Date",
      dataIndex: "event_date",
      key: "event_date",
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "N/A"),
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
    // Replace the event_image render function in your columns definition
    {
      title: "Event Image",
      key: "event_image",
      render: (text, record) => {
        return (
          <div
            style={{
              width: 50,
              height: 50,
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              color: "#666",
              border: "1px solid #d9d9d9",
              borderRadius: "2px",
              overflow: "hidden", // Add this to contain the image
            }}
          >
            {record.event_image ? (
              <img
                src={getImageUrl(record.event_image)}
                alt="Event"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  // Replace with text without using innerText
                  const container = e.target.parentNode;
                  e.target.style.display = "none";
                  // Create and append text node
                  const textNode = document.createTextNode("No Image");
                  if (container && !container.contains(textNode)) {
                    container.appendChild(textNode);
                  }
                }}
              />
            ) : (
              "No Image"
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          defaultValue={text || "Pending"}
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
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Function to get the complete image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If the image path is already a full URL, return it
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Otherwise, append the base URL
    return `${API_BASE_URL}/${imagePath.replace(/^\//, "")}`;
  };

  // Handle status change
  const handleStatusChange = (value, event_id) => {
    axios
      .put(`${API_BASE_URL}/api/events/update/${event_id}`, {
        status: value,
      })
      .then((response) => {
        console.log("Status update response:", response.data);
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

  // Edit event handler
  const handleEdit = (event) => {
    console.log("Editing event:", event);
    setEditingEvent(event);
    form.setFieldsValue({
      event_name: event.event_name,
      event_description: event.event_description,
      event_date: event.event_date ? dayjs(event.event_date) : null,
      event_location: event.event_location,
      organizer_name: event.organizer_name,
    });

    // If event has an image, we need to handle it differently
    // We can't set the File object, but we can store the path
    if (event.event_image) {
      setImage(event.event_image);
    } else {
      setImage(null);
    }

    setIsModalVisible(true);
  };

  // Cancel modal handler
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingEvent(null);
    setImage(null);
    form.resetFields();
  };

  const handleCreateOrUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        const eventDate = values.event_date
          ? values.event_date.toISOString()
          : null;
        if (!eventDate) {
          message.error("Invalid date selected.");
          return;
        }

        const formData = new FormData();
        formData.append("event_name", values.event_name);
        formData.append("event_description", values.event_description);
        formData.append("event_date", eventDate);
        formData.append("event_location", values.event_location);
        formData.append("organizer_name", values.organizer_name);

        // Only append image if it's a File object
        if (image && image instanceof File) {
          formData.append("event_image", image);
        }

        const requestMethod = editingEvent ? "put" : "post";
        const url = editingEvent
          ? `${API_BASE_URL}/api/events/update/${editingEvent.event_id}`
          : `${API_BASE_URL}/api/events/create`;

        axios({
          method: requestMethod,
          url: url,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
          .then((response) => {
            console.log("Form submission response:", response.data);
            message.success(
              `Event ${editingEvent ? "updated" : "created"} successfully`
            );
            // Refresh the data after successful operation
            fetchEvents();
            setIsModalVisible(false);
            form.resetFields();
            setEditingEvent(null);
            setImage(null);
          })
          .catch((error) => {
            console.error("Error during request:", error);
            if (error.response) {
              message.error(
                `Server Error: ${
                  error.response.data.message || "Failed to process the request"
                }`
              );
            } else {
              message.error("Network or request error occurred.");
            }
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Delete event handler
  const handleDelete = (event_id) => {
    console.log("Deleting event with ID:", event_id);
    axios({
      method: "delete",
      url: `${API_BASE_URL}/api/events/delete/${event_id}`,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Delete response:", response.data);
        message.success("Event deleted successfully");
        // Refresh data after deletion
        fetchEvents();
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
        message.error(`Failed to delete event: ${error.message}`);
      });
  };

  // Image upload handler
  const handleImageUpload = ({ file }) => {
    if (!file) {
      message.error("No file selected!");
      return Upload.LIST_IGNORE;
    }

    const isImage = file.type && file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }

    // Set the file object for FormData
    setImage(file);
    return false;
  };

  // Render upload button in the modal
  const renderUploadButton = () => {
    return (
      <div>
        {image ? (
          <div
            style={{ position: "relative", width: "100px", height: "100px" }}
          >
            {typeof image === "string" ? (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  border: "1px dashed #d9d9d9",
                  borderRadius: "2px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fafafa",
                }}
              >
                <img
                  src={getImageUrl(image)}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentNode.innerText = "Image Error";
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  border: "1px dashed #d9d9d9",
                  borderRadius: "2px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fafafa",
                }}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              width: "100px",
              height: "100px",
              border: "1px dashed #d9d9d9",
              borderRadius: "2px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              backgroundColor: "#fafafa",
            }}
          >
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          form.resetFields();
          setEditingEvent(null);
          setImage(null);
          setIsModalVisible(true);
        }}
        style={{ marginBottom: 20 }}
      >
        Create Event
      </Button>
      <AntTable
        columns={columns}
        dataSource={data}
        rowKey="event_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

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
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="event_date"
            label="Event Date"
            rules={[{ required: true, message: "Please select event date!" }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
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
          <Form.Item label="Event Image">
            <Upload
              listType="picture-card"
              showUploadList={false}
              customRequest={handleImageUpload}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("You can only upload image files!");
                }
                return isImage;
              }}
            >
              {renderUploadButton()}
            </Upload>
            <div style={{ marginTop: 8, fontSize: "12px", color: "#888" }}>
              Click to upload a new image
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Table;
