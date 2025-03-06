import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker } from "antd";
import dayjs from "dayjs";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingIndex, setEditingIndex] = useState(null);

  const showModal = (index = null) => {
    setEditingIndex(index);
    if (index !== null) {
      form.setFieldsValue({ ...schedules[index], date: dayjs(schedules[index].date) });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleSubmit = (values) => {
    const newSchedule = { 
      id: Date.now(), // Generates a unique timestamp-based ID
      ...values, 
      date: values.date.format("YYYY-MM-DD") 
    };
    if (editingIndex !== null) {
      const updatedSchedules = [...schedules];
      updatedSchedules[editingIndex] = newSchedule;
      setSchedules(updatedSchedules);
    } else {
      setSchedules([...schedules, newSchedule]);
    }
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const columns = [
    { title: "Class Name", dataIndex: "className", key: "className" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "time", key: "time" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record, index) => (
        <>
          <Button type="link" onClick={() => showModal(index)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(index)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={() => showModal()}>Add Schedule</Button>
      <Table 
        columns={columns} 
        dataSource={schedules} 
        rowKey={(record) => record.id || record.className} 
        style={{ marginTop: 20 }} 
      />
      
      <Modal
        title={editingIndex !== null ? "Edit Schedule" : "Add Schedule"}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="className" label="Class Name" rules={[{ required: true, message: "Please enter class name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please select a date" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="time" label="Time" rules={[{ required: true, message: "Please enter time" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Schedule;





