const express = require("express") 
const mainRouter = express.Router()

const main = require('../controllers/main')

const login = require('../controllers/login')
const { isAuth } = require('../middlewares/isAuth');

mainRouter.get("/inicio", main.getInicio)

mainRouter.get("/login", login.getLogin)
mainRouter.post("/login", login.postLogin)

mainRouter.get("/logout", isAuth, login.logout)

mainRouter.get("/", (req, res) => {
    res.redirect('/inicio');
});

module.exports = mainRouter