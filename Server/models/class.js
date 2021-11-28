const mongoose = require("mongoose")

const classSchema = mongoose.Schema("Class", {
    id: {
        type: String,
        required: true,
        unique: true
    },
    subject: {
        type: String,
        required: true
    },
    // lecturer_id: {
    //     type: String,
    //     required: true
    // },
    studentsEnrolled: {
        type: Array,
        required: true,
        default: []
    }
})

const Class = mongoose.model("Class", classSchema)
module.exports = Class