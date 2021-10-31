const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
    class_id: {
        type: String,
        required: true
    },
    student_id: {
        type: String,
        required: true
    },
    device_id: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'device'
    }
})

const Attendance = mongoose.model('Attendance', attendanceSchema)
module.exports = Attendance