const mongoose = require('mongoose')

const lecturerSchema = mongoose.Schema('Lecturer', {
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    classesEnrolled: [{
        class_id: {
            type: String,
            required: true,
            unique: true
        }
    }],
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate (value){
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

const Lecturer = mongoose.model('Lecturer', lecturerSchema)
module.exports = Lecturer