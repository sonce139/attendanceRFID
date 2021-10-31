const mongoose = require('mongoose')

const classSchema = mongoose.Schema('Class', {
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    lecturer_id: {
        type: String,
        required: true
    },
    studentsEnrolled: [{
        studnet_id: {
            type: String,
            required: true,
            unique: true
        }
    }]
})

const Class = mongoose.model('Class', classSchema)
module.exports = Class