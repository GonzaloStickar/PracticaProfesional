const express = require("express") 
const eliminarRouter = express.Router()

const { dashboardEliminar } = require('../../controllers/crud/dashboard_eliminar')

//GET de eliminar
eliminarRouter.get("/dashboard/eliminar", dashboardEliminar.eliminarFormGET);

//POST de eliminar
eliminarRouter.post("/dashboard/eliminar", dashboardEliminar.eliminarFormPOST);