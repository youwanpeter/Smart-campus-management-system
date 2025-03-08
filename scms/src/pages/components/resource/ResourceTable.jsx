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

const ResourceTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingEvent, setEditingEvent] = useState(null);
  
  const [data, setData] = useState([
    {
      key: "001",
      resource_name: "Microphones",
      resource_acq_date: "2025-03-01",
      resource_ret_date: "2025-03-06",
      resource_person: "Youwan Peter",
      resource_dep: "Finance",
      resource_purpose: "Annual CEO Forum",
      resource_status: "Returned",
      resource_remarks: "Was borrowed for the event",
    }
  ]);

  // Table Columns
  const Resourcecolumns = [
    { title: "Resource Name", dataIndex: "resource_name", key: "resource_name" },
    { title: "Acquired Date", dataIndex: "resource_acq_date", key: "resource_acq_date" },
    { title: "Return Date", dataIndex: "resource_ret_date", key: "resource_ret_date" },
    { title: "Acquired By", dataIndex: "resource_person", key: "resource_person" },
    { title: "Department", dataIndex: "resource_dep", key: "resource_dep" },
    { title: "Purpose", dataIndex: "resource_purpose", key: "resource_purpose" },
    { title: "Status", dataIndex: "resource_status", key: "resource_status" },
    { title: "Remarks", dataIndex: "resource_remarks", key: "resource_remarks" },
  ];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
        Add Resource
      </Button>

      <AntTable columns={columns} dataSource={data} />

      <Modal
        title="Add Resource"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="resource_name" label="Resource Name">
            <Input />
          </Form.Item>
          <Form.Item name="resource_acq_date" label="Acquired Date">
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ResourceTable;
