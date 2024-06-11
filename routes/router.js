const express = require("express")
const router = express.Router()

const main = require('../controllers/main')
const login = require('../controllers/login')


router.get("/inicio", main.getInicio)

router.get("/login", login.getLogin)
router.post("/login", login.postLogin)

router.get("/", (req, res) => {
    res.redirect('/inicio');
});

router.all("*", main.notFound)

module.exports = router