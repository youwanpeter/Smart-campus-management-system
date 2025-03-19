import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Table, Button, Modal, Form, Input, DatePicker, Select, message, Popconfirm, Tabs } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

const { Option } = Select;
const { TabPane } = Tabs;

const ResourceTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingResource, setEditingResource] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [resources, setResources] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [actionType, setActionType] = useState("add");

  //User authentication state
  const [userData, setUserData] = useState({ username: "", role: "" });
  const [isLoading, setIsLoading] = useState(true);

  //Determine role based on user data
  const isLecturer = userData.role === "Lecturer";
  const isAdmin = userData.role === "Admin";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        console.log("Token from localStorage:", token); 
        
        if (!token) {
          console.warn("No authentication token found");
          setIsLoading(false);
          return;
        }
        
        try {
          const decoded = jwtDecode(token);
          console.log("Decoded token:", decoded); 
          
          // Make sure the decoded token has the expected structure
          if (decoded && decoded.username && decoded.role) {
            setUserData({
              username: decoded.username,
              role: decoded.role
            });
          } else {
            console.error("Token decoded but missing expected fields:", decoded);
            message.error("Invalid authentication token format");
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
          message.error("Authentication error: Invalid token format");
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error in fetchUserData:", error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  useEffect(() => {
    if (userData.username) {
      fetchResources();
      if (isAdmin) {
        fetchPendingReviews();
      }
    }
  }, [userData, isAdmin]);

  const fetchResources = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/resources");
      setResources(response.data);
    } catch (error) {
      console.error("Error fetching resources:", error);
      message.error("Failed to fetch resources");
    }
  };

  const fetchPendingReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/resources/pending");
      setPendingReviews(response.data);
    } catch (error) {
      console.error("Error fetching pending reviews:", error);
      message.error("Failed to fetch pending reviews");
    }
  };

  //Submit resource review request (for lecturers)
  const handleSubmitReview = async (values) => {
    try {
      const formattedValues = {
        ...values,
        acquired_date: values.acquired_date.format("YYYY-MM-DD"),
        return_date: values.return_date.format("YYYY-MM-DD"),
        action_type: actionType,
        requested_by: userData.username,
        status: "Pending"
      };

      //If editing or deleting, include original ID
      if (actionType !== "add" && editingResource) {
        formattedValues.original_id = editingResource.id;
      }

      await axios.post("http://localhost:5000/api/resources/review", formattedValues);

      message.success("Resource change request submitted for review!");
      fetchResources();
      setIsModalVisible(false);
      form.resetFields();
      setIsEditMode(false);
      setEditingResource(null);
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Failed to submit review request");
    }
  };

  //Direct resource operations (for admin)
  const handleAddOrUpdateResource = async (values) => {
    try {
      const formattedValues = {
        ...values,
        acquired_date: values.acquired_date.format("YYYY-MM-DD"),
        return_date: values.return_date.format("YYYY-MM-DD")
      };

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
      console.error("Error managing resource:", error);
      message.error("Failed to manage resource");
    }
  };

  //Handle form submission based on role
  const handleFormSubmit = (values) => {
    if (isAdmin) {
      handleAddOrUpdateResource(values);
    } else {
      handleSubmitReview(values);
    }
  };

  //Delete resource (admin only)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/resources/${id}`);
      message.success("Resource deleted successfully!");
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
      message.error("Failed to delete resource");
    }
  };

  //Request delete (lecturer only)
  const handleRequestDelete = async (resource) => {
    try {
      const reviewData = {
        resource_name: resource.resource_name,
        acquired_date: resource.acquired_date,
        return_date: resource.return_date,
        acquired_person: resource.acquired_person,
        resource_dep: resource.resource_dep,
        resource_purpose: resource.resource_purpose,
        resource_status: resource.resource_status,
        resource_remarks: resource.resource_remarks,
        action_type: "delete",
        original_id: resource.id,
        requested_by: userData.username
      };

      await axios.post("http://localhost:5000/api/resources/review", reviewData);
      message.success("Delete request submitted for review!");
      fetchResources();
    } catch (error) {
      console.error("Error requesting delete:", error);
      message.error("Failed to submit delete request");
    }
  };

  //Edit resource
  const handleEdit = (resource) => {
    setEditingResource(resource);
    setIsEditMode(true);
    setActionType("edit");
    setIsModalVisible(true);
    form.setFieldsValue({
      ...resource,
      acquired_date: moment(resource.acquired_date),
      return_date: moment(resource.return_date)
    });
  };

  //Handle review approval
  const handleApproveReview = async (reviewId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/resources/review/${reviewId}/approve`);
      message.success("Review approved successfully!");
      fetchPendingReviews();
      fetchResources();
    } catch (error) {
      console.error("Error approving review:", error);
      message.error(`Failed to approve review: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  //Handle review rejection
  const handleRejectReview = async (reviewId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/resources/review/${reviewId}/reject`);
      message.success("Review rejected successfully!");
      fetchPendingReviews();
      fetchResources();
    } catch (error) {
      console.error("Error rejecting review:", error);
      message.error(`Failed to reject review: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  //Resource table columns
  const resourceColumns = [
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
      title: "Status", 
      dataIndex: "status", 
      key: "status",
      render: (text) => text === "Pending" ? <span style={{ color: 'orange' }}>Pending</span> : text
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, resource) => (
        <div>
          {isAdmin && (
            <>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(resource)}
              />
              <Popconfirm
                title="Delete this resource?"
                onConfirm={() => handleDelete(resource.id)}
              >
                <Button type="link" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          )}
          {isLecturer && (
            <>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(resource)}
              />
              <Popconfirm
                title="Request to delete this resource?"
                onConfirm={() => handleRequestDelete(resource)}
              >
                <Button type="link" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          )}
        </div>
      ),
    },
  ];

  //Pending review columns for admin
  const pendingReviewColumns = [
    {
      title: "Action",
      dataIndex: "action_type",
      key: "action_type",
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1)
    },
    { title: "Resource ID", dataIndex: "id", key: "id" },
    { title: "Original ID", dataIndex: "original_id", key: "original_id" },
    { title: "Hall No.", dataIndex: "resource_name", key: "resource_name" },
    { title: "Acquired Date", dataIndex: "acquired_date", key: "acquired_date" },
    { title: "Return Date", dataIndex: "return_date", key: "return_date" },
    { title: "Acquired By", dataIndex: "acquired_person", key: "acquired_person" },
    { title: "Department", dataIndex: "resource_dep", key: "resource_dep" },
    { title: "Purpose", dataIndex: "resource_purpose", key: "resource_purpose" },
    { title: "Requested By", dataIndex: "requested_by_name", key: "requested_by_name" },
    { title: "Requested On", key: "created_at", render: (_, record) => moment(record.created_at).format("YYYY-MM-DD HH:mm") },
    {
      title: "Actions",
      key: "review_actions",
      render: (_, review) => (
        <div>
          <Button
            type="link"
            icon={<CheckOutlined />}
            style={{ color: 'green' }}
            onClick={() => handleApproveReview(review._id)}
          >
            Approve
          </Button>
          <Button
            type="link"
            icon={<CloseOutlined />}
            danger
            onClick={() => handleRejectReview(review._id)}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  //Show all resources for better debugging (including pending ones)
  const allResources = resources;

  //For debugging - manually set user role
  const setUserRole = (role) => {
    setUserData(prev => ({ ...prev, username: "testuser", role: role }));
    setIsLoading(false);
  };

  //Show loading indicator
  if (isLoading) {
    return (
      <div>
        <div>Loading user data...</div>
        {/* Debug buttons for development - remove in production */}
        <div style={{ marginTop: 20 }}>
          <Button onClick={() => setUserRole("Admin")}>Debug: Set Admin Role</Button>
          <Button onClick={() => setUserRole("Lecturer")} style={{ marginLeft: 10 }}>Debug: Set Lecturer Role</Button>
        </div>
      </div>
    );
  }

  //Don't show anything to students
  if (userData.role !== "Admin" && userData.role !== "Lecturer") {
    return (
      <div>
        <div>You do not have permission to access resource management.</div>
        {/* Debug buttons for development - remove in production */}
        <div style={{ marginTop: 20 }}>
          <Button onClick={() => setUserRole("Admin")}>Debug: Set Admin Role</Button>
          <Button onClick={() => setUserRole("Lecturer")} style={{ marginLeft: 10 }}>Debug: Set Lecturer Role</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isAdmin ? (
        <Tabs defaultActiveKey="resources">
          <TabPane tab="Resources" key="resources">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                setEditingResource(null);
                setIsEditMode(false);
                setActionType("add");
                setIsModalVisible(true);
              }}
              style={{ marginBottom: 20 }}
            >
              Add Resource
            </Button>
            <Table
              columns={resourceColumns}
              dataSource={allResources}
              rowKey="id"
            />
          </TabPane>
          <TabPane tab={`Pending Reviews (${pendingReviews.length})`} key="pending">
            <Table
              columns={pendingReviewColumns}
              dataSource={pendingReviews}
              rowKey="_id"
            />
          </TabPane>
        </Tabs>
      ) : (
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setEditingResource(null);
              setIsEditMode(false);
              setActionType("add");
              setIsModalVisible(true);
            }}
            style={{ marginBottom: 20 }}
          >
            Request Resource
          </Button>
          <Table
            columns={resourceColumns}
            dataSource={allResources}
            rowKey="id"
          />
        </div>
      )}

      <Modal
        title={
          isEditMode
            ? isAdmin
              ? "Edit Resource"
              : "Request Edit Resource"
            : isAdmin
              ? "Add Resource"
              : "Request New Resource"
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
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
              {isAdmin
                ? isEditMode ? "Update" : "Add"
                : isEditMode ? "Submit Edit Request" : "Submit Request"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ResourceTable;