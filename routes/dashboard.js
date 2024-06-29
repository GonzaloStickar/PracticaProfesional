const express = require("express") 
const dashboardRouter = express.Router()

const { cacheMiddleware } = require('../middlewares/cache');

const { dashboardPage, mostrarPersonasReparacionesConCache } = require('../controllers/dashboard')
const { verificarDisponibilidadNombreApellido } = require('../controllers/crud/dashboard_agregar')

dashboardRouter.get("/", cacheMiddleware, dashboardPage)

dashboardRouter.get("/reparaciones", mostrarPersonasReparacionesConCache);

//Formulario de que agregar, persona, reparacion o ambos (chequea si existe o no el nombre y apellido que ingresamos)
dashboardRouter.get("/verificar/nombre_apellido", verificarDisponibilidadNombreApellido);

module.exports = dashboardRouter