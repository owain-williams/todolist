const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const _ = require('lodash')
const date = require(__dirname + "/date.js")

const app = express()
const PORT = process.env.PORT || 3000;

// let tasks = ['Buy food', 'Cook food', 'Eat food']
// let workTasks = ['Do work']
mongoose.connect('mongodb+srv://andersdigital:AndersD!g!tal1405@todolist-ow.xipgpyc.mongodb.net/?retryWrites=true&w=majority');


const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // done: Boolean
})
const listSchema = new mongoose.Schema({
    name: String,
    items: [taskSchema]
})
const Task = mongoose.model('task', taskSchema)
const List = mongoose.model('list', listSchema)

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
            res.render('index', {listTitle: "Todo", tasks: tasks}) 
        }
    })  
})

app.get('/about', (req, res) => {
    res.render('about')
})

// Make dynamic lists, depending on route
app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName)
    List.findOne({name: customListName}, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                // Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultTasks
                })
                list.save()
                res.redirect(`/${customListName}`)
            } else {
                // Show an existing list
                res.render('index', {listTitle: foundList.name, tasks: foundList.items})
            }
        }
    })
})

app.post('/', (req, res) => {
    const newTaskName = req.body.newTask
    const listName = req.body.list
    const task = new Task ({
        name: newTaskName
    })
    if (listName === 'Today') {
        task.save()  
        res.redirect('/') 
    } else {
        List.findOne({name: listName}, (err, foundList) => {
            foundList.items.push(task)
            foundList.save()
            res.redirect(`/${listName}`)
        })
    }

     
})

app.post('/delete', (req, res) => {
    const idToDelete = req.body.checkbox
    const listName = req.body.listName

    if (listName === 'Today') {
        Task.findByIdAndDelete(idToDelete, (err) => {
            if (err) {
                console.log(err)
            } else {
                res.redirect('/')
            }
        })
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: idToDelete}}}, (err) => {
            res.redirect(`/${listName}`)
        })
        
    }

    
})

app.listen(PORT, console.log(`The app is listening on port ${ PORT }`))
