const express = require('express')
const Class = require('../models/class')
const router = new express.Router()

router.post('/classes', async (req, res) => {
    const Classes = new Class(req.body)

    try {
        await Classes.save
        res.status(201).send({user, token})
    } catch (e) {
        res.send(400).send(e)
    }
})  

router.get('/classes/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        
        if (!user) {
            res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/classes/:id', async (req, res) => {
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