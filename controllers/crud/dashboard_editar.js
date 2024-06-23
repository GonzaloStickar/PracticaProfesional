const path = require('path');

const { htmlEditarForm } = require('./editar_form_editar_agregar');

const dashboardEditar = {
    editarGET: (req,res) => {
        //Si el reparacion ID es undefined, entonces que mande dos opciones
        //Si quiere modificar a la persona / Si quiere agregar una reparación.

        //Si el reparacion ID NO es undefined, entonces que mande dos opciones
        //Si quiere modificar a la persona / Si quiere modificar la reparacion

        const personaId = req.query.persona_id;
        const reparacionId = req.query.reparacion_id;

        if (reparacionId==='undefined') {
            return res.send(htmlEditarForm("/agregar/reparacion", personaId, 'undefined', "Agregar"));
        } else {
            return res.send(htmlEditarForm("/editar/reparacion", personaId, reparacionId, "Editar"));
        }
    },
    editarPersonaGET: (req,res) => {
        const personaId = req.query.persona_id;
        res.send(personaId)
    },
    editarReparacionGET: (req,res) => {
        const personaId = req.query.persona_id;
        const reparacionId = req.query.reparacion_id;
        res.send(`${personaId} y ${reparacionId}`)
    }
}

module.exports = {
    dashboardEditar
}