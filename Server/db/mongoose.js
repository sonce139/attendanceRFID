const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(function () {
    console.log('Connected to database ')
})
.catch(function (err) {
    console.error(`Error connecting to the database. \n${err}`);
})
