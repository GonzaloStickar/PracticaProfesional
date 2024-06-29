const express = require("express") 
const informeRouter = express.Router()

const { dashboardInforme } = require('../../controllers/crud/dashboard_informe')

//GET de informe
informeRouter.get("/dashboard/informe", dashboardInforme.informe);

module.exports = informeRouter