const jwt = require('jsonwebtoken')
const Device = require('../models/device')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '')
        const decoded = jwt.verify(token, 'attendance-rfid')
        const device = await Device.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!device) {
            throw new Error()
        }
        
        req.device = device
        next()
    } catch (e) {
        res.static(401).send({  error: 'Please authenticate.'})
    }
}

module.exports = auth