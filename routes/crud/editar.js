const express = require("express") 
const editarRouter = express.Router()

const { dashboardEditar } = require('../../controllers/crud/dashboard_editar')

//GET de editar
editarRouter.get("/", dashboardEditar.editarFormGET);

editarRouter.get("/persona", dashboardEditar.editarPersonaGET);
editarRouter.get("/reparacion", dashboardEditar.editarReparacionGET);

//PUT de editar
editarRouter.post("/persona", dashboardEditar.editarPersonaPOST);
editarRouter.post("/reparacion", dashboardEditar.editarReparacionPOST);

module.exports = editarRouter