import React, {useEffect, useState} from "react";
import { Descriptions, Typography, Card, Space, Tag, List, Avatar } from 'antd';
import { UserOutlined, BookOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';

const { Title } = Typography;
const CourseReviewForm = ({ courseData }) => {

    const [availableCourses, setAvailableCourses] = useState([]);
    const [availableInstructors, setAvailableInstructors] = useState([]); // State to store instructors fetched from API

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
        fetchCourses();
        fetchInstructors();
    }, []);

    const getInstructorName = (id) => {
        const instructor = availableInstructors.find(i => i._id === id);
        return instructor ? instructor.name : 'Unknown';
    };

    return (

        <div className="review-form">
            <Title level={4}>Review Course Details</Title>
            <Space direction="vertical" size="large" style={{width: '100%'}}>
                <Card title="Basic Information" bordered={false}>
                    <Descriptions column={1}>
                        <Descriptions.Item
                            label="Course Name">{courseData.courseName || 'Not specified'}</Descriptions.Item>
                        <Descriptions.Item
                            label="Description">{courseData.courseDescription || 'Not specified'}</Descriptions.Item>
                        <Descriptions.Item
                            label="Duration">{courseData.courseDuration || 'Not specified'}</Descriptions.Item>
                        <Descriptions.Item label="Start Date">
                            {courseData.courseStartDate ? courseData.courseStartDate.toLocaleDateString() : 'Not specified'}
                        </Descriptions.Item>
                        <Descriptions.Item label="End Date">
                            {courseData.courseEndDate ? courseData.courseEndDate.toLocaleDateString() : 'Not specified'}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Category">{courseData.courseCategory || 'Not specified'}</Descriptions.Item>
                        <Descriptions.Item label="Level">{courseData.courseLevel || 'Not specified'}</Descriptions.Item>
                        <Descriptions.Item label="Language">{courseData.language || 'Not specified'}</Descriptions.Item>
                        <Descriptions.Item label="Credits">{courseData.credits || 'Not specified'}</Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card title="Subjects" bordered={false} extra={<BookOutlined/>}>
                    <List
                        itemLayout="horizontal"
                        dataSource={courseData.subjects || []}
                        renderItem={subject => (
                            <List.Item>
                                <List.Item.Meta
                                    title={subject.subject_name}
                                    description={
                                        <Space direction="vertical">
                                            <div>Level: <Tag color={subject.subject_level === 'beginner' ? 'green' :
                                                subject.subject_level === 'intermediate' ? 'blue' : 'red'}>
                                                {subject.subject_level?.toUpperCase() || 'Not specified'}
                                            </Tag></div>
                                            <div>
                                                Instructors: {subject.instructors?.length > 0 ?
                                                subject.instructors.map(_id => (
                                                    <Tag key={_id} color="blue">{getInstructorName(_id)}</Tag>
                                                )) : 'None assigned'}
                                            </div>
                                        </Space>
                                    }
                                />
                            </List.Item>
                        )}
                        locale={{emptyText: 'No subjects added'}}
                    />
                </Card>

                <Card title="Instructors" bordered={false} extra={<UserOutlined/>}>
                    <List
                        itemLayout="horizontal"
                        dataSource={(() => {
                            // Get all unique instructors
                            const uniqueInstructorIds = new Set();
                            courseData.subjects?.forEach(subject => {
                                subject.instructors?.forEach(_id => uniqueInstructorIds.add(_id));
                            });
                            return Array.from(uniqueInstructorIds).map(id => {
                                const instructor = availableInstructors.find(i => i._id === id);
                                return instructor || {id, name: 'Unknown Instructor'};
                            });
                        })()}
                        renderItem={instructor => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined/>}/>}
                                    title={instructor.name}
                                    description={instructor.email || 'No email provided'}
                                />
                            </List.Item>
                        )}
                        locale={{emptyText: 'No instructors assigned'}}
                    />
                </Card>

                <Card title="Enrollment Details" bordered={false} extra={<TeamOutlined/>}>
                    <Descriptions column={1}>
                        <Descriptions.Item
                            label="Enrollment Limit">{courseData.enrollmentLimit || 'Not specified'}</Descriptions.Item>
                        <Descriptions.Item label="Status">
                            <Tag color={courseData.status === 'Active' ? 'green' :
                                courseData.status === 'Upcoming' ? 'blue' : 'gray'}>
                                {courseData.status || 'Not specified'}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Space>
        </div>
    );

};

export default CourseReviewForm;
