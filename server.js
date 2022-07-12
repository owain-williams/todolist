const express = require("express");
const bodyParser = require("body-parser");

const app = express()
const PORT = 3000

app.set("view engine", "ejs")
app.use(bodyParser({urlencoded: true}))

app.get("/", (req, res) => {

})

app.listen(PORT, console.log(`The app is listening on port ${ PORT }`))
