import React, { useState, useEffect } from "react";
import { Form, InputNumber, Select, Input, Typography } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const CourseEnrollmentInfoForm = ({ courseData, setCourseData, errors }) => {

    const [availableCourses, setAvailableCourses] = useState([]);

    // Function to fetch courses from the API
    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/courses');
            const data = await response.json();
            setAvailableCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchCourses();
    }, []);

    const handleChange = (field, value) => {
        setCourseData({
            ...courseData,
            [field]: value
        });
    };

    return (

        <div className="enrollment-form">
            <Title level={4}>Enrollment Limits & Other Details</Title>

            <Form layout="vertical">
                <Form.Item
                    label="Enrollment Limit"
                    required
                    tooltip="Maximum number of students allowed in this course" validateStatus={errors?.enrollmentLimit ? 'error' : ''}
                    help={errors?.enrollmentLimit}
                >
                    <InputNumber
                        min={1}
                        value={courseData.enrollmentLimit}
                        onChange={(value) => handleChange('enrollmentLimit', value)}
                        placeholder="Enter enrollment limit"
                        style={{width: '100%'}}
                    />
                </Form.Item>

                <Form.Item label="Status" required validateStatus={errors?.status ? 'error' : ''}
                           help={errors?.status}>
                    <Select
                        value={courseData.status}
                        onChange={(value) => handleChange('status', value)}
                        placeholder="Select course status"
                    >
                        <Option value="Active">Active</Option>
                        <Option value="Upcoming">Upcoming</Option>
                        <Option value="Archived">Archived</Option>
                    </Select>
                </Form.Item>
            </Form>
        </div>
    );

};

export default CourseEnrollmentInfoForm;
