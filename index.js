require('dotenv').config()

const express = require("express")
const session = require('express-session');

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));

const bookRouter = require('./routes/book.router')

app.use("/", bookRouter)


app.listen(3000, () => console.log("Server is running on port 5000"))