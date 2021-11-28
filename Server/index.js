const express = require("express")
require("./db/mongoose")

const app = express()
const port = process.env.PORT || 3000

const classRouter = require("./routers/class")
const deviceRouter = require("./routers/device")
const studentRouter = require("./routers/student")
const attendanceRouter = require("./routers/attendance")

app.use(express.json())
app.use(deviceRouter)
app.use(studentRouter)
app.use(attendanceRouter)
app.use()

app.listen(port, () => {
    console.log("Server is up on port " + port)
})
