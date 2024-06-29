const express = require("express") 
const buscarRouter = express.Router()

const { dashboardBuscar, obtenerUltimaBusquedaDesdeCache } = require('../../controllers/crud/dashboard_buscar')

//GET de buscar
buscarRouter.get("", dashboardBuscar.buscarFormGET);

buscarRouter.get("/persona", dashboardBuscar.buscarPersonaGET);
buscarRouter.get("/reparacion", dashboardBuscar.buscarReparacionGET);
buscarRouter.get("/ambos", dashboardBuscar.buscarAmbosGET);

//Implementar
buscarRouter.get("/ultima_busqueda", obtenerUltimaBusquedaDesdeCache);

//POST de buscar
buscarRouter.post("/persona", dashboardBuscar.buscarPersonaPOST);
buscarRouter.post("/reparacion", dashboardBuscar.buscarReparacionPOST);
buscarRouter.post("/ambos", dashboardBuscar.buscarAmbosPOST);

module.exports = buscarRouter