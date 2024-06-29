const express = require("express") 
const agregarRouter = express.Router()

const { dashboardAgregar } = require('../../controllers/crud/dashboard_agregar')

//GET de agregar
agregarRouter.get("/", dashboardAgregar.agregarFormGET);

agregarRouter.get("/persona", dashboardAgregar.agregarPersonaGET);
agregarRouter.get("/reparacion", dashboardAgregar.agregarReparacionGET);
agregarRouter.get("/ambos", dashboardAgregar.agregarAmbosGET);

//POST de agregar
agregarRouter.post("/persona", dashboardAgregar.agregarPersonaPOST);
agregarRouter.post("/reparacion", dashboardAgregar.agregarReparacionPOST);
agregarRouter.post("/ambos", dashboardAgregar.agregarAmbosPOST);

module.exports = agregarRouter