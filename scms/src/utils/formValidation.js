// Validate email format
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate URL format
export const isValidUrl = (url) => {
    if (!url) return true; // Optional field
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
};

// Check if end date is after start date
export const isValidDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    return endDate.isAfter(startDate);
};

// Validate name/title fields (non-empty and has reasonable length)
export const isValidName = (name) => {
    return name && name.trim().length > 0 && name.trim().length <= 100;
};

// Validate description fields (has reasonable length if provided)
export const isValidDescription = (description) => {
    if (!description) return true; // Optional field
    return description.trim().length <= 5000;
};

// Validate that number fields are positive
export const isPositiveNumber = (num) => {
    return num !== null && num !== undefined && num > 0;
};

// Enhanced course info validation
export const validateCourseInfoEnhanced = (courseData) => {
    const errors = {};

    if (!isValidName(courseData.courseName)) {
        errors.courseName = 'Course name is required and must be under 100 characters';
    }

    if (!isValidDescription(courseData.courseDescription)) {
        errors.courseDescription = 'Course description must be under 5000 characters';
    } else if (!courseData.courseDescription) {
        errors.courseDescription = 'Course description is required';
    }

    if (!courseData.courseDuration) {
        errors.courseDuration = 'Course duration is required';
    }

    if (!courseData.courseStartDate) {
        errors.courseStartDate = 'Start date is required';
    }

    if (!courseData.courseEndDate) {
        errors.courseEndDate = 'End date is required';
    }

    if (!courseData.courseCategory) {
        errors.courseCategory = 'Category is required';
    }

    if (!courseData.courseLevel) {
        errors.courseLevel = 'Level is required';
    }

    if (!courseData.language) {
        errors.language = 'Language is required';
    }

    return errors;
};

// Enhanced subjects validation
export const validateSubjectsEnhanced = (courseData) => {
    const errors = {};

    if (courseData.subjects.length === 0) {
        errors.subjects = 'At least one subject is required';
    } else {
        // Check if all subjects have valid titles
        const invalidSubjects = courseData.subjects.filter(subject => subject.instructors.length === 0);
        if (invalidSubjects.length > 0) {
            errors.subjects = 'Subject must have an instructor';
        }
    }

    return errors;
};

// Enhanced enrollment validation
export const validateEnrollmentEnhanced = (courseData) => {
    const errors = {};

    if (!isPositiveNumber(courseData.enrollmentLimit)) {
        errors.enrollmentLimit = 'Enrollment limit must be a positive number';
    }

    if (!courseData.status) {
        errors.status = 'Status is required';
    }
    return errors;
};

// Full course validation (all steps)
export const validateFullCourse = (courseData) => {
    return {
        ...validateCourseInfoEnhanced(courseData),
        ...validateSubjectsEnhanced(courseData),
        ...validateEnrollmentEnhanced(courseData)
    };
};