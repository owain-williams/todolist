const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")

const app = express()
const PORT = 3000

let tasks = ['Buy food', 'Cook food', 'Eat food']
let workTasks = ['Do work']

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

app.get("/", (req, res) => {
    let day = date.getDay()
    res.render('index', {listTitle: day, tasks: tasks})
})

app.get('/work', (req, res) => {
    res.render('index', {listTitle: 'Work', tasks: workTasks})
})

app.get('/about', (req, res) => {
    res.render('about')
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
