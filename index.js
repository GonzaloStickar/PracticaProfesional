const { sessionSecret } = require('./controllers/config.js');

const path = require('path');
const express = require("express")
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

const router = require('./routes/router')

app.use("/", router)

app.listen(3000, () => console.log("Server is running on port 5000"))