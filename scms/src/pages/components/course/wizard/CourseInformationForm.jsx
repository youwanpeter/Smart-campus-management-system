import React from "react";
import { Form, Input, DatePicker, Select, InputNumber, Typography } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const CourseInformationForm = ({ courseData, setCourseData, errors }) => {
    const handleChange = (field, value) => {
        setCourseData({
            ...courseData,
            [field]: value
        });
    };

    return (

        <div className="course-info-form">
            <Title level={4}>Basic Course Information</Title>
            <Form layout="vertical">
                <Form.Item
                    label="Course Name"
                    required
                    tooltip="The name of your course"
                    validateStatus={errors?.courseName ? 'error' : ''}
                    help={errors?.courseName}
                >
                    <Input
                        value={courseData.courseName}
                        onChange={(e) => handleChange('courseName', e.target.value)}
                        placeholder="Enter course name"
                    />
                </Form.Item>

                <Form.Item
                    label="Course Description"
                    required
                    tooltip="Provide a detailed description of your course"
                    validateStatus={errors?.courseDescription ? 'error' : ''}
                    help={errors?.courseDescription}
                >
                    <TextArea
                        value={courseData.courseDescription}
                        onChange={(e) => handleChange('courseDescription', e.target.value)}
                        rows={4}
                        placeholder="Enter course description"
                    />
                </Form.Item>

                <Form.Item label="Course Duration" required validateStatus={errors?.courseDuration ? 'error' : ''}
                           help={errors?.courseDuration}>
                    <Input
                        value={courseData.courseDuration}
                        onChange={(e) => handleChange('courseDuration', e.target.value)}
                        placeholder="e.g., 12 weeks"
                    />
                </Form.Item>

                <Form.Item label="Course Start Date" required validateStatus={errors?.courseStartDate ? 'error' : ''}
                           help={errors?.courseStartDate}>
                    <DatePicker
                        value={courseData.courseStartDate ? moment(courseData.courseStartDate) : null}
                        onChange={(date) => handleChange('courseStartDate', date ? date.toDate() : null)}
                        style={{width: '100%'}}
                    />
                </Form.Item>

                <Form.Item label="Course End Date" required validateStatus={errors?.courseEndDate ? 'error' : ''}
                           help={errors?.courseEndDate}>
                    <DatePicker
                        value={courseData.courseEndDate ? moment(courseData.courseEndDate) : null}
                        onChange={(date) => handleChange('courseEndDate', date ? date.toDate() : null)}
                        style={{width: '100%'}}
                    />
                </Form.Item>

                <Form.Item label="Course Category" required validateStatus={errors?.courseCategory ? 'error' : ''}
                           help={errors?.courseCategory}>
                    <Select
                        value={courseData.courseCategory}
                        onChange={(value) => handleChange('courseCategory', value)}
                        placeholder="Select a category"
                    >
                        <Option value="computer-science">Computer Science</Option>
                        <Option value="engineering">Engineering</Option>
                        <Option value="business">Business</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Course Level" required validateStatus={errors?.courseLevel ? 'error' : ''}
                           help={errors?.courseLevel}>
                    <Select
                        value={courseData.courseLevel}
                        onChange={(value) => handleChange('courseLevel', value)}
                        placeholder="Select course level"
                    >
                        <Option value="beginner">Beginner</Option>
                        <Option value="intermediate">Intermediate</Option>
                        <Option value="advanced">Advanced</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Language" required validateStatus={errors?.language ? 'error' : ''}
                           help={errors?.language}>
                    <Select
                        value={courseData.language}
                        onChange={(value) => handleChange('language', value)}
                        placeholder="Select language"
                    >
                        <Option value="english">English</Option>
                        <Option value="sinhala">Sinhala</Option>
                        <Option value="tamil">Tamil</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Credits">
                    <InputNumber
                        value={courseData.credits}
                        onChange={(value) => handleChange('credits', value)}
                        min={0}
                        placeholder="Enter credits"
                        style={{width: '100%'}}
                    />
                </Form.Item>
            </Form>
        </div>
    );

};

export default CourseInformationForm;
