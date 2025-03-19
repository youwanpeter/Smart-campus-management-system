import React, {useEffect, useState} from "react";
import { Table, Typography, Tag, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CourseInstructorsForm = ({ courseData, setCourseData }) => {

    const [availableInstructors, setAvailableInstructors] = useState([]); // State to store instructors fetched from API

    // Function to fetch instructors from the API
    const fetchInstructors = async () => {
        try {
            const response = await fetch('/api/users/instructors');
            const data = await response.json();
            setAvailableInstructors(data);
        } catch (error) {
            console.error('Error fetching instructors:', error);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchInstructors();
    }, []);

    const getInstructorSubjects = (instructorId) => {
        return courseData.subjects
            .filter(subject => subject.instructors && subject.instructors.includes(instructorId))
            .map(subject => subject.subject_name);
    };

    // Get all unique instructors assigned to subjects
    const getAssignedInstructors = () => {
        const instructorIds = new Set();
        courseData.subjects.forEach(subject => {
            if (subject.instructors) {
                subject.instructors.forEach(_id => instructorIds.add(_id));
            }
        });

        return Array.from(instructorIds)
            .map(id => {
                const instructor = availableInstructors.find(i => i._id === id);
                return {
                    ...instructor,
                    subjects: getInstructorSubjects(id)
                };
            });
    };

    const columns = [
        {
            title: 'Instructor Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => (
                <Space>
                    <UserOutlined />
                    {text}
                </Space>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Assigned Subjects',
            dataIndex: 'subjects',
            key: 'subjects',
            render: (subjects) => (
                <>
                    {subjects.map(subject => (
                        <Tag color="blue" key={subject}>
                            {subject}
                        </Tag>
                    ))}
                </>
            ),
        },
    ];

    return (

        <div className="instructors-form">
            <Title level={4}>Instructors Assignment</Title>
            <p>Instructors are assigned to specific subjects. You can modify these assignments in the Subjects tab.</p>

            <Table
                dataSource={getAssignedInstructors()}
                columns={columns}
                rowKey="id"
                pagination={false}
            />

            {getAssignedInstructors().length === 0 && (
                <div style={{textAlign: 'center', margin: '20px 0'}}>
                    <p>No instructors assigned yet. Go back to the Subjects tab to assign instructors.</p>
                </div>
            )}
        </div>
    );

};

export default CourseInstructorsForm;
