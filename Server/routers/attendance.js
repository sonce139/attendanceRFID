const express = require('express')
const Attendance = require('../models/attendance')
const router = new express.Router()

router.post('/attendaces', async (req, res) => {
    const attendace = new attendace(req.body)

    try {
        await Attendance.save
        res.status(201).send(Attendance)
    } catch (e) {
        res.send(400).send(e)
    }
})  

router.get('/attendaces/student/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const attendances = await Attendance.find({ student_id: _id})
        
        if (!attendances) {
            res.status(404).send()
        }
        res.send(attendances)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/attendaces/class/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const attendances = await Attendance.find({ class_id: _id})
        
        if (!attendances) {
            res.status(404).send()
        }
        res.send(attendances)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/attendaces/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)    

        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router