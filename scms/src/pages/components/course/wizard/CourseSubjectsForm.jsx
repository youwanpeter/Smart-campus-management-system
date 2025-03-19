import React, { useState, useEffect  } from "react";
import { Form, Select, Button, Input, Space, Table, Tag, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const CourseSubjectForm = ({courseData, setCourseData, errors }) => {

    const [existingSubjects, setExistingSubjects] = useState([]);
    const [availableInstructors, setAvailableInstructors] = useState([]);

    const fetchSubjects = async () => {
        try {
            const response = await fetch('/api/subjects');
            const data = await response.json();
            setExistingSubjects(data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
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

    useEffect(() => {
        fetchSubjects();
        fetchInstructors();
    }, []);


    const handleSelectExistingSubject = (subject) => {
        // Check if subject is already added
        const exists = courseData.subjects.some(s => s.id === subject.id);
        if (!exists) {
            setCourseData({
                ...courseData,
                subjects: [...courseData.subjects, { ...subject, instructors: [] }]
            });
        }
    };

    const handleRemoveSubject = (subjectId) => {
        setCourseData({
            ...courseData,
            subjects: courseData.subjects.filter(subject => subject.id !== subjectId)
        });
    };

    const handleAssignInstructors = (subjectId, instructorIds) => {
        setCourseData({
            ...courseData,
            subjects: courseData.subjects.map(subject =>
                subject.id === subjectId ? { ...subject, instructors: instructorIds } : subject
            )
        });
    };

    const columns = [
        {
            title: 'Subject Name',
            dataIndex: 'subject_name',
            key: 'subject_name',
        },
        {
            title: 'Level',
            dataIndex: 'subject_level',
            key: 'subject_level',
            render: (level) => {
                let color = 'green';
                if (level === 'intermediate') color = 'blue';
                if (level === 'advanced') color = 'red';
                return <Tag color={color}>{level.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Instructors',
            dataIndex: 'instructors',
            key: 'instructors',
            render: (instructors, record) => (
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Select instructors"
                    value={instructors || []}
                    onChange={(value) => handleAssignInstructors(record._id, value)}
                >
                    {availableInstructors.map(instructor => (
                        <Option key={instructor._id} value={instructor._id}>
                            {instructor.name}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveSubject(record._id)}
                />
            ),
        },
    ];

    return (
        <div className="subjects-form">
            <Title level={4}>Add Subjects to Course</Title>
            {errors?.subjects && (
                <div className="ant-form-item-explain ant-form-item-explain-error">
                    {errors.subjects}
                </div>
            )}
            <Space direction="vertical" style={{width: '100%'}}>
                <Form layout="vertical">
                    <Form.Item label="Add Existing Subject">
                        <Select
                            placeholder="Select existing subjects"
                            style={{width: '100%'}}
                            onChange={(value) => {
                                const subject = existingSubjects.find(s => s.id === value);
                                if (subject) handleSelectExistingSubject(subject);
                            }}
                        >
                            {existingSubjects.map(subject => (
                                <Option key={subject.id} value={subject.id}>
                                    {subject.subject_name} - {subject.subject_level}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/*<Form.Item>*/}
                    {/*    <Button type="dashed" onClick={showModal} block icon={<PlusOutlined/>}>*/}
                    {/*        Create New Subject*/}
                    {/*    </Button>*/}
                    {/*</Form.Item>*/}
                </Form>

                <Title level={5}>Selected Subjects</Title>
                <Table
                    dataSource={courseData.subjects}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                />
            </Space>
        </div>
    );

};

export default CourseSubjectForm;
