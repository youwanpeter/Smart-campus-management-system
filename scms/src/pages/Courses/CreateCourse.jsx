import React, { useState } from "react";
import { Steps, Button, message, Row, Col, Card, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import CourseInformationForm from '../components/course/wizard/CourseInformationForm';
import CourseSubjectsForm from '../components/course/wizard/CourseSubjectsForm';
import CourseInstructorsForm from '../components/course/wizard/CourseInstructorsForm';
import CourseEnrollmentInfoForm from '../components/course/wizard/CourseEnrollmentInfoForm';
import CourseReviewForm from '../components/course/wizard/CourseReviewForm';
import '../../Course.css';
import { validateCourseInfoEnhanced, validateSubjectsEnhanced, validateFullCourse, validateEnrollmentEnhanced } from '../../utils/formValidation';

const CreateCourse = () => {
    const [current, setCurrent] = useState(0);
    const [courseData, setCourseData] = useState({
        // Basic course info
        courseName: '',
        courseDescription: '',
        courseDuration: '',
        courseStartDate: null,
        courseEndDate: null,
        courseCategory: '',
        courseLevel: '',
        language: '',
        credits: 0,

        // Subjects
        subjects: [],

        // Instructors
        instructors: [],

        // Enrollment and other details
        enrollmentLimit: 1,
        status: 'Upcoming',
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const validateCurrentStep = () => {
        switch (current) {
            case 0:
                return validateCourseInfoEnhanced(courseData);
            case 1:
                return validateSubjectsEnhanced(courseData);
            case 2:
                return {};
            case 3:
                return validateEnrollmentEnhanced(courseData);
            case 4:
                return {}; // No validation needed on review step
            default:
                return {};
        }
    };

    const steps = [
        {
            title: 'Course Information',
            content: <CourseInformationForm courseData={courseData} setCourseData={setCourseData} errors={formErrors} />
        },
        {
            title: 'Subjects',
            content: <CourseSubjectsForm courseData={courseData} setCourseData={setCourseData} errors={formErrors} />
        },
        {
            title: 'Instructors',
            content: <CourseInstructorsForm courseData={courseData} setCourseData={setCourseData} errors={formErrors} />
        },
        {
            title: 'Enrollment Details',
            content: <CourseEnrollmentInfoForm courseData={courseData} setCourseData={setCourseData} errors={formErrors} />
        },
        {
            title: 'Review',
            content: <CourseReviewForm courseData={courseData} />
        }
    ];

    const next = () => {
        const errors = validateCurrentStep();
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            setCurrent(current + 1);
        } else {
            // Provide more specific error messages
            let errorMessage = 'Please correct the following errors:';
            Object.values(errors).forEach(error => {
                errorMessage += `\n- ${error}`;
            });
            message.error(errorMessage);
        }
    };
    const prev = () => {
        setCurrent(current - 1);
        setFormErrors({});
    };

    const confirmSubmit = () => {
        // Perform a final validation of all fields
        const allErrors = validateFullCourse(courseData);

        if (Object.keys(allErrors).length > 0) {
            Modal.error({
                title: 'Cannot Submit Course',
                content: (
                    <div>
                        <p>Please correct the following errors before submitting:</p>
                        <ul>
                            {Object.values(allErrors).map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )
            });
            return;
        }

        Modal.confirm({
            title: 'Confirm Course Creation',
            content: 'Are you sure you want to create this course?',
            okText: 'Create Course',
            cancelText: 'Review Again',
            onOk: handleSubmit
        });
    }

    const handleSubmit = async () => {
        try {
            let url = 'http://localhost:5000/api/courses';
            setIsSubmitting(true);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData),
            });

            if (response.ok) {
                // Refresh the subjects list
                setCourseData({
                    courseName: '',
                    courseDescription: '',
                    courseDuration: '',
                    courseStartDate: null,
                    courseEndDate: null,
                    courseCategory: '',
                    courseLevel: '',
                    language: '',
                    credits: 0,
                    subjects: [],
                    instructors: [],
                    enrollmentLimit: 0,
                    status: 'Upcoming',
                });
                message.success('Course created successfully!');
                navigate('/courses');
            } else {
                console.error('Error saving subject:', await response.text());
            }
        } catch (error) {
            message.error('Failed to create course. Please try again.');
            console.error('Error creating course:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (

        <div className="course-wizard">
            <Row justify="center">
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Card title="Create New Course" className="wizard-card">
                        <Steps current={current} className="wizard-steps">
                            {steps.map(item => (
                                <Steps.Step key={item.title} title={item.title}/>
                            ))}
                        </Steps>

                        <div className="steps-content">
                            {steps[current].content}
                        </div>

                        <div className="steps-action">
                            {current > 0 && (
                                <Button style={{margin: '0 8px'}} onClick={prev} disabled={isSubmitting}>
                                    Previous
                                </Button>
                            )}

                            {current < steps.length - 1 && (
                                <Button type="primary" onClick={next} disabled={isSubmitting}>
                                    Next
                                </Button>
                            )}

                            {current === steps.length - 1 && (
                                <Button type="primary" onClick={confirmSubmit} loading={isSubmitting} disabled={isSubmitting}>
                                    Create Course
                                </Button>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );

};

export default CreateCourse;
