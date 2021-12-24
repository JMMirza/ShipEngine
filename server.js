const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// routes
// creating routes on the server side and imported routes file in this
app.use('/api', require('./routes/routes.js'));

//defining the port
const port = process.env.PORT  || 3000

//creating the server for node application
module.exports = app.listen(port, () => {
    console.log(`Listening at port ${port}`);
})
