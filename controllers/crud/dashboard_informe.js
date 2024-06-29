const path = require('path');

const dashboardInforme = {
    informe: (req,res) => {
        const personaId = req.query.persona_id;
        const reparacionId = req.query.reparacion_id;

        res.send(`${personaId}, ${reparacionId}`)
    }
}

module.exports = {
    dashboardInforme
}