const express = require("express")
const app = express()

require('dotenv').config()

app.use(express.json())


const bookRouter = require('./routes/book.router')

app.use("/api", bookRouter)

app.listen(3000, () => console.log("Server is running on port 5000"))