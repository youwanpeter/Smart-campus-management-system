import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, message, Alert, Select, Upload, Table, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

const Communication = () => {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setStudentName(decoded.name);
      fetchStudentFiles(decoded.name);
    }
    fetchLecturers();
  }, []);

  const fetchStudentFiles = async (name) => {
    try {
      const response = await axios.get(`/api/files/student/${name}`);
      setUploadedFiles(response.data);
    } catch (err) {
      setError("Failed to load your files. Please try again later.");
    }
  };

  const fetchLecturers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("/api/lecturers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLecturers(response.data);
    } catch (err) {
      setError("Failed to load lecturer list. Please try again later.");
    }
  };

  const handleUpload = ({ file }) => {
    setFile(file);
  };

  const handleSubmit = async () => {
    if (!file || !selectedLecturer) {
      setError("Please select both a file and a lecturer");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("lecturerName", selectedLecturer);
    formData.append("studentName", studentName);
    try {
      await axios.post("/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      fetchStudentFiles(studentName);
      setShowModal(false);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
    }
    setLoading(false);
  };

  const columns = [
    { title: "Filename", dataIndex: "filename", key: "filename" },
    { title: "Sent to", dataIndex: "lecturerName", key: "lecturerName" },
    { title: "Date", dataIndex: "createdAt", key: "createdAt", render: (text) => new Date(text).toLocaleDateString() },
    { title: "Action", key: "action", render: (text, record) => <a href={`/api/files/download/${record._id}`}>Download</a> },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Communication</h1>
      <Button type="primary" onClick={() => setShowModal(true)} style={{ marginBottom: "20px" }}>
        Add File
      </Button>
      {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: "20px" }} />}
      <Table dataSource={uploadedFiles} columns={columns} rowKey="_id" pagination={{ pageSize: 5 }} />
      <Modal title="Upload File" visible={showModal} onCancel={() => setShowModal(false)} onOk={handleSubmit} confirmLoading={loading}>
        <Form layout="vertical">
          <Form.Item label="Select File">
            <Upload beforeUpload={() => false} onChange={handleUpload} showUploadList={true}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Select Lecturer">
            <Select placeholder="Choose a lecturer" onChange={setSelectedLecturer} style={{ width: "100%" }}>
              {lecturers.map((lecturer) => (
                <Select.Option key={lecturer._id} value={lecturer.name}>
                  {lecturer.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Communication;
