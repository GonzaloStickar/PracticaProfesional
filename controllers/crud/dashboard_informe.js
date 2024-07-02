const { myCache } = require('../../middlewares/cache');

const { 
    htmlFormEnviado,
    htmlInformeFormPersona,
    htmlInformeFormPersonaReparacion
} = require('./crud_form_post_pressed');

const dashboardInforme = {
    informe: (req,res) => {
        const personaId = req.query.persona_id;
        const reparacionId = req.query.reparacion_id;

        const cachedData = myCache.get('dataReparaciones');
        let personaEncontrada = null;

        if (cachedData && cachedData.personas) {
            // Buscar persona en caché
            const personaEnCache = cachedData.personas.find(persona => persona.id === parseInt(personaId, 10));

            if (personaEnCache) {
                // Persona encontrada en caché
                personaEncontrada = personaEnCache;
            }
        }

        if (personaEncontrada) {

            //Busco la reparación si es diferente a undefined
            if (reparacionId !== undefined && reparacionId !== 'undefined') {

                let reparacionEncontrada = null;

                if (cachedData && cachedData.reparaciones) {
                    // Buscar reparación en caché por ID
                    const reparacionEnCache = cachedData.reparaciones.find(reparacion => reparacion.id === parseInt(reparacionId, 10));

                    if (reparacionEnCache) {
                        // Reparación encontrada en caché
                        reparacionEncontrada = reparacionEnCache;
                    }
                }

                if (reparacionEncontrada) {
                    res.send(htmlInformeFormPersonaReparacion(personaEncontrada, reparacionEncontrada));
                } else {
                    res.send(htmlFormEnviado("Actualizar Reparación",`No se encontró la reparación con ID: ${reparacionId}`, "goBack()"));
                }

            //Si su reparación es undefined (significa que no tiene reparación o no se le asignó, solo muestro form con persona)
            } else {
                res.send(htmlInformeFormPersona(personaEncontrada))
            }
        } else {
            //Se puede buscar a la persona por DB original y buscarla por su nombre, pero ahorramos esto.
            res.send(htmlFormEnviado("Eliminar Persona",`No se encontró la persona con ID: ${personaId}`, "goBack()"));
        }
    }
}

module.exports = {
    dashboardInforme
}