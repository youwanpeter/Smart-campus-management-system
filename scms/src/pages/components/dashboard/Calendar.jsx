import React, { useEffect, useState } from "react";
import { Calendar as AntCalendar, Badge } from "antd";
import axios from "axios";
import moment from "moment";

const Calendar = () => {
  const [tasks, setTasks] = useState([]);

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

  const dateCellRender = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const dailyTasks = tasks.filter(
      (task) => moment(task.dueDate).format("YYYY-MM-DD") === formattedDate
    );

    return (
      <ul>
        {dailyTasks.map((task) => (
          <li key={task._id}>
            <Badge
              status={
                task.status === "Completed"
                  ? "success"
                  : task.status === "In Progress"
                  ? "processing"
                  : "warning"
              }
              text={task.title}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Task Calendar</h1>
      <AntCalendar cellRender={dateCellRender} />
    </div>
  );
};

export default Calendar;
