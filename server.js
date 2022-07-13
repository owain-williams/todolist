const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const date = require(__dirname + "/date.js")

const app = express()
const PORT = 3000

// let tasks = ['Buy food', 'Cook food', 'Eat food']
// let workTasks = ['Do work']
mongoose.connect('mongodb://localhost:27017/todolistDB');


const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // done: Boolean
})
const Task = mongoose.model('task', taskSchema)

// Initialise some default tasks
const task1 = new Task ({ name: 'Buy Food' })
const task2 = new Task ({ name: 'Cook food' })
const task3 = new Task ({ name: 'Eat food' })
const defaultTasks = [task1, task2, task3]



let tasks = []


app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

app.get("/", (req, res) => {
    Task.find({}, (err, foundTasks) => {
        if (foundTasks.length === 0) {
            // Create default tasks in collection
            Task.insertMany(defaultTasks, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Success!')
                }
            })
            res.redirect('/')
        } else {
            tasks = foundTasks
            let day = date.getDay()
            res.render('index', {listTitle: day, tasks: tasks}) 
        }
    })  
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.post('/', (req, res) => {
    const newTaskName = req.body.newTask
    const task = new Task ({
        name: newTaskName
    })
    task.save()  
    res.redirect('/')  
})

app.listen(PORT, console.log(`The app is listening on port ${ PORT }`))
