const express = require("express")
const Class = require("../models/class")
const router = new express.Router()

router.post("/classes", async function (req, res) {
    const Classes = new Class(req.body)

    try {
        await Classes.save()
        res.status(201).send(Classes)
    } catch (err) {
        res.send(400).send(err)
    }
})

router.patch("/classes/:class_id/:student_id", async function (req, res) {
    const class_id = req.params.class_id
    const student_id = req.params.student_id

    try {
        const Classes = Class.findOne({ "id": class_id })
        Classes["studentEnrolled"].push(student_id)

        await Classes.save()
    } catch (err) {
        res.send(400).send(err)
    }
})

router.get("/classes/", async function (req, res) {
    try {
        const Classes = await Class.find({})
        res.send(Classes)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get("/classes/:id", async function (req, res) {
    const _id = req.params.id

    try {
        const Classes = await Class.findOne({ "id": _id })
        
        if (!Classes) {
            res.status(404).send()
        }
        res.send(Classes)
    } catch (err) {
        res.status(500).send(err)
    }
})

// router.delete("/classes/:id", async function (req, res) {
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