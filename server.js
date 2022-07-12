const express = require("express");
const bodyParser = require("body-parser");
const { isReadable } = require("stream");

const app = express()
const PORT = 3000

let tasks = ['Buy food', 'Cook food', 'Eat food']
let workTasks = ['Do work']

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
    res.render('index', {listTitle: day, tasks: tasks})
})

app.get('/work', (req, res) => {
    res.render('index', {listTitle: 'Work', tasks: workTasks})
})

app.post('/', (req, res) => {
    let task = req.body.newTask
    if(req.body.list === 'Work') {
        workTasks.push(task)
        res.redirect('/work')
    } else {
        tasks.push(task)
        res.redirect('/')
    }
    
})

app.post('/work', (req, res) => {
    workTasks.push(req.body.newTask)
    res.redirect('/work')
})

app.listen(PORT, console.log(`The app is listening on port ${ PORT }`))
