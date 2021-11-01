const express = require('express')
const Student = require('../models/student')
const router = new express.Router()

router.post('/students', async (req, res) => {
    const student = new Student(req.body)
    
    try {
        await student.save()
        res.status(201).send(student)
    } catch (e) {
        console.log(e)
        res.sendStatus(400)
    }
})

router.get('/students', async (req, res) => {
    try {
        const student = await Student.find({})
        res.send(student)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/students/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const student = await Student.find({ 'id': _id })
        
        if (!student) {
            res.status(404).send()
        }
        res.send(student)
    } catch (e) {
        res.sendStatus(500)
    }
})

// router.patch('/students/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         const user = await User.findById(req.params.id)
//         updates.forEach((update) => user[update] = req.body[update])
//         await user.save()

//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(400).send()
//     }
// })

// router.delete('/students/:id', async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)    

//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

module.exports = router