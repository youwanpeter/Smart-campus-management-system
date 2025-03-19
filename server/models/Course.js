const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//
// const CourseSchema = new Schema({
//     courseName: {
//         type: String,
//         required: true
//     },
//     courseDescription: {
//         type: String
//     },
//     courseDuration: {
//         type: String
//     },
//     courseStartDate: {
//         type: Date
//     },
//     courseEndDate: {
//         type: Date
//     },
//     courseCategory: {
//         type: String
//     },
//     courseLevel: {
//         type: String,
//         enum: ['beginner', 'intermediate', 'advanced'],
//         default: 'beginner'
//     },
//     language: {
//         type: String
//     },
//     credits: {
//         type: Number,
//         default: 0
//     },
//     subjects: [SubjectSchema],
//     enrollmentLimit: {
//         type: Number,
//         default: 0
//     },
//     status: {
//         type: String,
//         enum: ['Active', 'Upcoming', 'Archived'],
//         default: 'Upcoming'
//     },
//     prerequisites: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Course'
//     }],
//     additionalRequirements: {
//         type: String
//     },
//     learningMaterials: [{
//         filename: String,
//         path: String,
//         mimetype: String,
//         size: Number,
//         uploadDate: {
//             type: Date,
//             default: Date.now
//         }
//     }],
//     externalResources: [String],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     },
//     createdBy: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     }
// });
//
// CourseSchema.pre('save', function(next) {
//     this.updatedAt = Date.now();
//     next();
// });
//


const CourseSchema = new Schema({
    course_name: { type: String, required: true },
    course_description: { type: String, required: true },
    course_duration: { type: String, required: true },
    course_start_date: { type: Date, required: true },
    course_end_date: { type: Date, required: true },
    course_category: { type: String, required: true },
    course_level: { type: String, required: true },
    language: { type: String, required: true },
    credits: { type: Number, required: true },
    enrollment_limit: { type: Number, required: true },
    status: { type: String, required: true },
    subjects: [
        {
            subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
            instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
        }
    ],
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Course', CourseSchema);
