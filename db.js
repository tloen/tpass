var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//defining schemata
var UserDetail = new Schema(
    {
        name: String,
        username: String, 
        password: String,
        studentId: Number,

        isTeacher: Boolean,

        //student specific
        requestActive: Boolean,
        homeroom: { type: Schema.Types.ObjectId, ref: 'User' },
        studentRequestId: { type: Schema.Types.ObjectId, ref: 'Request' },
        
        //teacher specific
        teacherRequestIds: [{ type: Schema.Types.ObjectId, ref: 'Request' }]
    },
    { collection: 'users' });
var RequestDetail = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User' },
        teacher_id: { type: Schema.Types.ObjectId, ref: 'User' },
        date: Date
    },
    { collection: 'requests' }
);

module.exports = {
    'url' : 'mongodb://bearcatprime:196884@ds031271.mongolab.com:31271/tpassdb',
    'User' : mongoose.model('User', UserDetail),
    'Request': mongoose.model('Request', RequestDetail)
}