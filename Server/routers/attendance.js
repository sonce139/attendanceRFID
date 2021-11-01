const express = require('express')
const Attendance = require('../models/attendance')
const router = new express.Router()

router.post('/attendances', async (req, res) => {
    const attendance = new Attendance(req.body)
    
    try {
        await attendance.save()
        res.status(201).send(attendance)
    } catch (err) {
        res.status(400).send(err)
        console.log(err)
    }
})  

router.get('/attendances/student/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const attendances = await Attendance.find({ student_id: _id})
        
        if (!attendances) {
            res.status(404).send()
        }
        res.send(attendances)
    } catch (err) {
        res.status(500).send()
    }
})

router.get('/attendances/class/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const attendances = await Attendance.find({ class_id: _id})
        
        if (!attendances) {
            res.status(404).send()
        }
        res.send(attendances)
    } catch (err) {
        res.status(500).send()
    }
})

router.delete('/attendanes/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)    

        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (err) {
        res.status(500).send()
    }
})

module.exports = router