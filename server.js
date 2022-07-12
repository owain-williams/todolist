const express = require("express");
const bodyParser = require("body-parser");

const app = express()
const PORT = 3000

let tasks = ['Buy food', 'Cook food', 'Eat food']

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

app.get("/", (req, res) => {
    let today = new Date()
    const dateOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }
    let day = today.toLocaleString('en-us', dateOptions)
    res.render('index', {day: day, tasks: tasks})
})

app.post('/', (req, res) => {
    tasks.push(req.body.newTask)
    res.redirect('/')
})

app.listen(PORT, console.log(`The app is listening on port ${ PORT }`))
