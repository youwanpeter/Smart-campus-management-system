const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const Subject = require("../models/Subject");
const Users = require("../models/Users");

router.get("/", async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching data", error: error.message });
    }
});

router.post("/", async (req, res) => {
        const {
            courseName,
            courseDescription,
            courseDuration,
            courseStartDate,
            courseEndDate,
            courseCategory,
            courseLevel,
            language,
            credits,
            enrollmentLimit,
            status,
            subjects,
        } = req.body;

    try {

        const course = new Course({
            course_name : courseName,
            course_description : courseDescription,
            course_duration : courseDuration,
            course_start_date : courseStartDate,
            course_end_date : courseEndDate,
            course_category : courseCategory,
            course_level : courseLevel,
            language : language,
            credits : credits,
            enrollment_limit : enrollmentLimit,
            status: status
        });

        const subjectPromises = subjects.map(async (subjectData) => {
            console.log(subjectData,"subject data")
            const { subject_name, subject_description, subject_level, instructors } = subjectData;

            // Check if subject already exists, else create it
            let subject = await Subject.findOne({ subject_name });
            if (!subject) {
                subject = new Subject({
                    subject_name,
                    subject_description,
                    subject_level
                });
                await subject.save();
            }

            // Add the subject to the course
            course.subjects.push({
                subject_id: subject._id,
                instructors: []
            });

            // Add instructors to the subject and course
            const instructorPromises = instructors.map(async (instructorId) => {
                let instructor = await Users.findById(instructorId);
                course.instructors.push(instructor._id);
                await instructor.save();
            });

            // Wait for all instructors to be added to the subject
            await Promise.all(instructorPromises);
            // Save the updated subject
            await subject.save();
        });

        // Wait for all subjects to be processed
        await Promise.all(subjectPromises);

        // Save the new course
        await course.save();

        // After course is created, update subjects with course reference
        for (const subject of course.subjects) {
            const subjectToUpdate = await Subject.findById(subject.subject_id);
            subjectToUpdate.related_courses.push(course._id);
            await subjectToUpdate.save();
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: "Error creating course", error:error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id).populate('subjects.subject_id').populate('instructors');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (err) {
        console.error('Error fetching course:', err);
        res.status(500).json({ message: 'Error fetching course', error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const courseData = req.body;

    try {
        const course = await Course.findByIdAndUpdate(id, courseData, { new: true });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course updated successfully', course });
    } catch (err) {
        console.error('Error updating course:', err);
        res.status(500).json({ message: 'Error updating course', error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findByIdAndDelete(id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err) {
        console.error('Error deleting course:', err);
        res.status(500).json({ message: 'Error deleting course', error: err.message });
    }
});


module.exports = router;