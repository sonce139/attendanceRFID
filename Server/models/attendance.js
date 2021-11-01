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
    time: {
        type: String,
        required: true
    }
})

// attendanceSchema.pre('save', (next) => {
//     const attendance = this
//     const anotherAttendance = Attendance.find({ class_id: attendance.class_id, student_id: attendance.studen_id})
    
    
//     next()
// })

const Attendance = mongoose.model('Attendance', attendanceSchema)
module.exports = Attendance