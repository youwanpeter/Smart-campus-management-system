// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
//
// const SubjectSchema = new Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String
//     },
//     level: {
//         type: String,
//         enum: ['beginner', 'intermediate', 'advanced'],
//         default: 'beginner'
//     },
//     instructors: [{
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     }]
// });
//
//
// module.exports = mongoose.model('Subject', SubjectSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    subject_name: { type: String, required: true },
    subject_description: { type: String, required: true },
    subject_level: { type: String, required: true },
    related_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Subject', SubjectSchema);
