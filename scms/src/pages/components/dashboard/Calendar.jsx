import React, { useEffect, useState } from "react";
import { Calendar as AntCalendar, Badge, Modal, Typography, Row, Col, Tag } from "antd";
import axios from "axios";
import moment from "moment";

const { Title, Paragraph, Text } = Typography;

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const dateCellRender = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const dailyTasks = tasks.filter(
        (task) => moment(task.dueDate).format("YYYY-MM-DD") === formattedDate
    );

    return (
        <ul className="events" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {dailyTasks.map((task) => (
              <li key={task._id} style={{ marginBottom: 3 }}>
                <Badge
                    status={
                      task.status === "Completed"
                          ? "success"
                          : task.status === "In Progress"
                              ? "processing"
                              : "warning"
                    }
                    text={
                      <span
                          onClick={() => handleTaskClick(task)}
                          style={{ cursor: "pointer", color: "#1890ff" }}
                      >
                  {task.title}
                </span>
                    }
                />
              </li>
          ))}
        </ul>
    );
  };

  // Map status to tag color
  const getStatusTagColor = (status) => {
    switch(status) {
      case "Completed": return "success";
      case "In Progress": return "processing";
      case "Pending": return "warning";
      default: return "default";
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    return moment(dateString).format("MMMM D, YYYY");
  };

  return (
      <div style={{ background: "#fff", padding: 20, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>
        <Title level={3} style={{ marginBottom: 20 }}>Task Calendar</Title>
        <AntCalendar cellRender={dateCellRender} />

        {/* Task Detail Modal */}
        <Modal
            title="Task Details"
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            width={600}
        >
          {selectedTask && (
              <div>
                <Row gutter={[0, 16]}>
                  <Col span={24}>
                    <Title level={4}>{selectedTask.title}</Title>
                    <Tag color={getStatusTagColor(selectedTask.status)}>
                      {selectedTask.status}
                    </Tag>
                  </Col>

                  <Col span={24}>
                    <Paragraph>
                      <Text strong>Due Date: </Text>
                      {formatDate(selectedTask.dueDate)}
                    </Paragraph>
                  </Col>

                  {selectedTask.priority && (
                      <Col span={24}>
                        <Paragraph>
                          <Text strong>Priority: </Text>
                          <Tag color={selectedTask.priority === "High" ? "red" : selectedTask.priority === "Medium" ? "orange" : "green"}>
                            {selectedTask.priority}
                          </Tag>
                        </Paragraph>
                      </Col>
                  )}

                  <Col span={24}>
                    <Paragraph>
                      <Text strong>Description: </Text>
                    </Paragraph>
                    <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 8, marginTop: 8 }}>
                      <Paragraph>{selectedTask.description || "No description provided."}</Paragraph>
                    </div>
                  </Col>

                  {selectedTask.assignedTo && (
                      <Col span={24}>
                        <Paragraph>
                          <Text strong>Assigned To: </Text>
                          {selectedTask.assignedTo}
                        </Paragraph>
                      </Col>
                  )}
                </Row>
              </div>
          )}
        </Modal>
      </div>
  );
};

export default Calendar;