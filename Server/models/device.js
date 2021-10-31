const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const deviceSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    firmware_version: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

deviceSchema.methods.generateAuthToekn = async function () {
    const device = this
    const token = jwt.sign({ _id: device._id.toString() }, 'attendance-rfid')

    device.tokens = device.tokens.concat({token})
    await device.save()

    return token
}

deviceSchema.statics.findByCredentials = async function (id, password) {
    const device = await device.findOne({ id })

    if (!device) {
        throw new Error('Unable to login')
    }
    
    const isMatch = await bcrypt.compare(password, device.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return device
}

deviceSchema.pre('save', async function (next) {
    const device = this

    if (device.isModified('password')) {
        device.password = await bcrypt.hash(device.password, 8)
    }

    next()
})

const Device = mongoose.model('Device', deviceSchema)
module.exports = Device