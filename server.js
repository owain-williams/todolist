const express = require("express");
const bodyParser = require("body-parser");

const app = express()
const PORT = 3000

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req, res) => {
    let today = new Date()
    const dateOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }
    let day = today.toLocaleString('en-us', dateOptions)
    res.render('index', {day: day})
})

app.post('/', (req, res) => {
    newTask = req.body.newTask
    console.log(newTask)
})

app.listen(PORT, console.log(`The app is listening on port ${ PORT }`))
