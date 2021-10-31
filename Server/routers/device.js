const express = require('express')
const Device = require('../models/device')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/devices', async function (req, res) {
    const device = new Device(req.body)

    try {
        await device.save
        const token = await device.generateAuthToken()
        res.status(201).send({ device, token })
    } catch (e) {
        res.send(400).send(e)
    }
})

router.post('/devices/login', async function (req, res) {
    try {
        const device = await Device.findByCredentials(req.body.id, req.body.password)
        const token = await device.generateAuthToken()
        res.send({device, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/devices/logout', auth, async function (req, res) {
    try {
        req.device.tokens = req.device.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.device.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router