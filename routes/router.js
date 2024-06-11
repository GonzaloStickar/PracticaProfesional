const express = require("express")
const router = express.Router()

const login = require('../controllers/login')


router.get("/inicio", login.get)

router.get("/login", login.get)
router.post("/login", login.post)

router.all("*", login.get)

module.exports = router