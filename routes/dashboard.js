const express = require("express") 
const dashboardRouter = express.Router()

const { dashboardPage, mostrarPersonasReparacionesConCache, devolverNumReparacionesQueryMaxOld } = require('../controllers/dashboard')
const { verificarDisponibilidadNombreApellido } = require('../controllers/crud/dashboard_agregar')

dashboardRouter.get("/", dashboardPage)

dashboardRouter.get("/reparaciones", mostrarPersonasReparacionesConCache);

dashboardRouter.get("/numReparacionesQueryMaxOld", devolverNumReparacionesQueryMaxOld);

//Formulario de que agregar, persona, reparacion o ambos (chequea si existe o no el nombre y apellido que ingresamos)
dashboardRouter.get("/verificar/nombre_apellido", verificarDisponibilidadNombreApellido);

module.exports = dashboardRouter