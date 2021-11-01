const mongoose = require('mongoose')
const crypto = require('crypto')

const studentSchema = new mongoose.Schema({
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
        minlength: 7
    }
})

// studentSchema.methods.generateAuthToekn = async function () {
//     const student = this
//     const token = jwt.sign({ _id = user._id.toString() }, 'attendance-rfid')

//     student.tokens = student.tokens.concat({token})
//     await student.save()

//     return token
// }

// studentSchema.statics.findByCredentials = async (id, password) => {
//     const student = await Student.findOne({ id })

//     if (!student) {
//         throw new Error('Unable to login')
//     }
    
//     const isMatch = await bcrypt.compare(password, student.password)
    // ar .hash = crypto.pbkdf2Sync(password, 
    // this.salt, 1000, 64, `sha512`).toString(`hex`);
    // return this.hash === hash;
//     if (!isMatch) {
//         throw new Error('Unable to login')
//     }

//     return student
// }

studentSchema.pre('save', (next) => {
    const student = this
    
    if (student.isModified('password')) {
        const salt = crypto.randomBytes(16).toString("hex")
        student.password = crypto.pbkdf2Sync(student.password, salt, 1000, 64, `sha512`).toString(`hex`);
        console.log(student.password)
    }
    
    next()
})

const Student = mongoose.model('Student', studentSchema)
module.exports = Student