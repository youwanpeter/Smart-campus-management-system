import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Table, Spin, Alert, Typography, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const LecturerView = () => {
  const [files, setFiles] = useState([]);
  const [lecturerName, setLecturerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setLecturerName(decoded.name);
      fetchLecturerFiles(decoded.name);
    }
  }, []);

  const fetchLecturerFiles = async (name) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/files/lecturer/${name}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setFiles(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to load files. Please try again later.");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "File Name",
      dataIndex: "originalFilename",
      key: "originalFilename",
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Uploaded Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          href={`/api/files/download/${record._id}`}
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <Title level={2}>Communication - Files from Students</Title>
      {loading ? (
        <Spin size="large" className="block mt-6" />
      ) : error ? (
        <Alert message={error} type="error" showIcon className="mt-4" />
      ) : (
        <Table
          dataSource={files}
          columns={columns}
          rowKey="_id"
          bordered
          pagination={{ pageSize: 5 }}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default LecturerView;
