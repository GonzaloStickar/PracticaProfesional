const { 
    dataLocalSearchPorPersonaId,
    dataLocalSearchPorPersonaIdYReparacionId,
    dataLocalEliminarPersonaId,
    dataLocalEliminarPersonaIdReparacionId
} = require('../../data/data');

const { 
    htmlFormEnviado,
    htmlEliminarFormPersona,
    htmlEliminarFormPersonaReparacion
} = require('./crud_form_post_pressed');

const dashboardEliminar = {
    eliminarFormGET: (req,res) => {
        const personaId = req.query.persona_id;
        const reparacionId = req.query.reparacion_id;

        const personaBuscada = dataLocalSearchPorPersonaId(personaId);

        if (personaBuscada.encontrada==false) {
            res.send(htmlFormEnviado("Eliminar Persona",`No se encontró la persona con ID: ${personaId}`, "goBack()"));
        } else {
            if (reparacionId !== undefined && reparacionId !== 'undefined') {
                const reparacionEncontrada = dataLocalSearchPorPersonaIdYReparacionId(personaId, reparacionId);

                if (reparacionEncontrada.encontrada==false) {
                    res.send(htmlFormEnviado("Actualizar Reparación",`No se encontró la reparación con ID: ${reparacionId}`, "goBack()"));
                } else {
                    res.send(htmlEliminarFormPersonaReparacion(personaBuscada.personaEncontrada[0], reparacionEncontrada.reparacionEncontrada[0]))
                }
            } else {
                res.send(htmlEliminarFormPersona(personaBuscada.personaEncontrada[0]))
            }
        }
    },
    eliminarFormPOST: (req,res) => {
        const personaId = req.query.persona_id;
        const reparacionId = req.query.reparacion_id;

        const personaBuscada = dataLocalSearchPorPersonaId(personaId);

        dataLocalEliminarPersonaId(personaBuscada.personaEncontrada[0].id)

        if (reparacionId !== undefined && reparacionId !== 'undefined') {
            //const reparacionEncontrada = dataLocalSearchPorPersonaIdYReparacionId(personaId, reparacionId);
        }

        res.send(htmlFormEnviado("Eliminar",`Se ha eliminado correctamente.`, "redirectToDashboard()"));
    }
};

module.exports = {
    dashboardEliminar
}