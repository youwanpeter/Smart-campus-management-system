const express = require("express");
const Subject = require("../models/Subject");
const router = express.Router();


router.get("/", async (req, res) => {
    try {

        const subjects = await Subject.find().populate('instructors').lean();

        const subjectsWithId = subjects.map(subject => {
            return {
                id: subject._id.toString(), // Convert _id to string if needed
                ...subject,
            };
        });

        res.json(subjectsWithId);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data" });
    }
});

router.post('/', async (req, res) => {
    const { subject_name, subject_description, subject_level, instructors } = req.body;

    try {
        // Check if the subject already exists
        const existingSubject = await Subject.findOne({ subject_name });
        if (existingSubject) {
            return res.status(400).json({ message: 'Subject already exists' });
        }

        // Create the new subject
        const subject = new Subject({
            subject_name,
            subject_description,
            subject_level,
            instructors
        });

        // Save the subject to the database
        await subject.save();

        res.status(201).json({ message: 'Subject created successfully', subject });
    } catch (err) {
        console.error('Error creating subject:', err);
        res.status(500).json({ message: 'Error creating subject', error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const subject = await Subject.findById(id).populate('instructors');
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.status(200).json(subject);
    } catch (err) {
        console.error('Error fetching subject:', err);
        res.status(500).json({ message: 'Error fetching subject', error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const subjectData = req.body;

    try {
        const subject = await Subject.findByIdAndUpdate(id, subjectData, { new: true });
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.status(200).json({ message: 'Subject updated successfully', subject });
    } catch (err) {
        console.error('Error updating subject:', err);
        res.status(500).json({ message: 'Error updating subject', error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const subject = await Subject.findByIdAndDelete(id);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (err) {
        console.error('Error deleting subject:', err);
        res.status(500).json({ message: 'Error deleting subject', error: err.message });
    }
});

module.exports = router;