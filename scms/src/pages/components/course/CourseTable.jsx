import React, {useEffect, useState} from "react";
import {
  Table as AntTable,
  Button,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CourseTable = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();

  const columns = [
    {
      title: "Name",
      dataIndex: "course_name",
      key: "course_name",
    },
    {
      title: "Description",
      dataIndex: "course_description",
      key: "course_description",
    },
    {
      title: "Start Date",
      dataIndex: "course_start_date",
      key: "course_start_date",
    },
    {
      title: "End Date",
      dataIndex: "course_end_date",
      key: "course_end_date",
    },
    {
      title: "Category",
      dataIndex: "course_category",
      key: "course_category",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  const [loading, setLoading] = useState(false);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/courses');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);


  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => navigate("/courses/create")}
        style={{ marginBottom: 20 }}
      >
        Create Course
      </Button>
      <AntTable columns={columns} dataSource={data} rowKey="_id" />

    </div>
  );
};

export default CourseTable;
