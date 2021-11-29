const mongoose = require('mongoose')

const url = process.env.MONGODB_URL
// const url = 'mongodb+srv://minh_19520158:19520158@cluster0.ckmh2.mongodb.net/attendanceRFID-api?retryWrites=true&w=majority'

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(function () {
    console.log('Connected to database ')
})
.catch(function (err) {
    console.error(`Error connecting to the database. \n${err}`);
})
