const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const date = require(__dirname + "/date.js")

const app = express()
const PORT = 3000

// let tasks = ['Buy food', 'Cook food', 'Eat food']
// let workTasks = ['Do work']
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/todolistDB');
}

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // done: Boolean
})
const Task = mongoose.model('task', taskSchema)

// // Initialise some default tasks
// const task1 = new Task ({ name: 'Buy Food' })
// const task2 = new Task ({ name: 'Cook food' })
// const task3 = new Task ({ name: 'Eat food' })
// const defaultTasks = [task1, task2, task3]

// // Create default tasks in collection
// Task.insertMany(defaultTasks, (err) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log('Success!')
//     }
// })

let tasks = []
Task.find({}, (err, foundTasks) => {
    if (err) {
        console.log(err)
    } else {
        tasks = foundTasks
        console.log(tasks)
    }
})

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
