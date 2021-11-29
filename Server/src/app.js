const hbs = require("hbs")
const path = require("path")
const express = require("express")
require("../db/mongoose")

const app = express()
const port = process.env.PORT || 3000

// routers
const classRouter = require("../routers/class")
const deviceRouter = require("../routers/device")
const studentRouter = require("../routers/student")
const attendanceRouter = require("../routers/attendance")

// Define path for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up handlebar engine
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

// Set statis directory to serve
app.use(express.static(publicDirectoryPath))

app.use(express.json())
app.use(deviceRouter)
app.use(studentRouter)
app.use(attendanceRouter)
app.use(classRouter)

app.get("", function (req, res) {
    res.render("index", {
        title: "RFID Attendance System"
    })
})

app.listen(port, () => {
    console.log("Server is up on port " + port)
})
