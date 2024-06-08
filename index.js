const express = require("express")
const app = express()

require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const bookRouter = require('./routes/book.router')

app.use("/", bookRouter)

app.listen(3000, () => console.log("Server is running on port 5000"))