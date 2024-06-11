require('dotenv').config()

const express = require("express")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const router = require('./routes/router')

app.use("/", router)

app.listen(3000, () => console.log("Server is running on port 5000"))