var mongoose = require('mongoose');

var studentSchema = mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    studentID: String,
    homeroom: String,
    grade: Number
});

module.exports = mongoose.model('User', studentSchema);