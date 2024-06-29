const express = require("express") 
const eliminarRouter = express.Router()

const { dashboardEliminar } = require('../../controllers/crud/dashboard_eliminar')

//GET de eliminar
eliminarRouter.get("/", dashboardEliminar.eliminarFormGET);

//POST de eliminar
eliminarRouter.post("/", dashboardEliminar.eliminarFormPOST);

module.exports = eliminarRouter