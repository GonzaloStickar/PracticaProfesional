const express = require("express") 
const consultasRouter = express.Router()

const { consultaReparacion, terminos_de_uso, politica_de_privacidad } = require('../controllers/consultas')

consultasRouter.post("/", consultaReparacion);

consultasRouter.get("/terminos_de_uso", terminos_de_uso)
consultasRouter.get("/politica_de_privacidad", politica_de_privacidad)

module.exports = consultasRouter