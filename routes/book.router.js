const express = require("express")
const router = express.Router()

const bookController = require('../controllers/book.controller')

router.get("/", bookController.getAll)
router.post("/login", bookController.create)

module.exports = router