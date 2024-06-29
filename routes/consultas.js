const express = require("express") 
const consultasRouter = express.Router()

const { consultaReparacion } = require('../controllers/consultas')

consultasRouter.post("/", consultaReparacion);

module.exports = consultasRouter