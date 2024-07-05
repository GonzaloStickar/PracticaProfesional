const { myCache } = require('../../middlewares/cache');

const { 
    dataOriginalEliminarPersonaId, dataOriginalEliminarReparacionId
} = require('../../data/db');

const { 
    htmlFormEnviado,
    htmlEliminarFormPersona,
    htmlEliminarFormPersonaReparacion
} = require('./crud_form_post_pressed');

const dashboardEliminar = {
    eliminarFormGET: (req,res) => {
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
                    res.send(htmlEliminarFormPersonaReparacion(personaEncontrada, reparacionEncontrada));
                } else {
                    res.send(htmlFormEnviado("Eliminar Reparación",`No se encontró la reparación con ID: ${reparacionId}`, "goBack()"));
                }

            //Si su reparación es undefined (significa que no tiene reparación o no se le asignó, solo muestro form con persona)
            } else {
                res.send(htmlEliminarFormPersona(personaEncontrada))
            }
        } else {
            //Se puede buscar a la persona por DB original y buscarla por su nombre, pero ahorramos esto.
            res.send(htmlFormEnviado("Eliminar Persona",`No se encontró la persona con ID: ${personaId}`, "goBack()"));
        }
    },
    eliminarFormPOST: async (req,res) => {

        //yo pongo eliminar
        //y primero que me elimine la reparación
        //si es que tiene
        //pero si la persona tiene más reparaciones
        //entonces que no elimine a la persona
        //si la persona está vacía, sin más reparaciones asociadas a ella, entonces que elimine la persona

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
            // Buscar reparación si reparacionId está definido
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
                    // Llamar a la función para eliminar la reparación del original
                    dataOriginalEliminarReparacionId(reparacionEncontrada.id);

                    // Eliminar reparación del caché
                    cachedData.reparaciones = cachedData.reparaciones.filter(reparacion => reparacion.id !== parseInt(reparacionId, 10));
                    myCache.set('dataReparaciones', cachedData);

                    // Verificar si quedan otras reparaciones asociadas a la misma persona
                    const otrasReparaciones = cachedData.reparaciones.some(reparacion => reparacion.persona_id === personaEncontrada.id);
                    if (!otrasReparaciones) {
                        // No hay más reparaciones asociadas, eliminar también la persona
                        await dataOriginalEliminarPersonaId(personaEncontrada.id);

                        // Eliminar persona del caché
                        cachedData.personas = cachedData.personas.filter(persona => persona.id !== parseInt(personaId, 10));
                        myCache.set('dataReparaciones', cachedData);

                        res.send(htmlFormEnviado("Eliminar", `Se ha eliminado correctamente la Persona ya que no estaba asociada a otra reparación.`, "redirectToDashboard()"));
                    } else {
                        res.send(htmlFormEnviado("Eliminar", `Se ha eliminado correctamente la Reparación.`, "redirectToDashboard()"));
                    }
                } else {
                    res.send(htmlFormEnviado("Eliminar", `No se encontró la reparación con ID: ${reparacionId}`, "goBack()"));
                }
            } else {
                // No se especificó reparaciónId, eliminar solo la persona si no tiene reparaciones asociadas
                const otrasReparaciones = cachedData.reparaciones.some(reparacion => reparacion.persona_id === personaEncontrada.id);
                if (!otrasReparaciones) {
                    // No hay más reparaciones asociadas, eliminar la persona
                    await dataOriginalEliminarPersonaId(personaEncontrada.id);

                    // Eliminar persona del caché
                    cachedData.personas = cachedData.personas.filter(persona => persona.id !== parseInt(personaId, 10));
                    myCache.set('dataReparaciones', cachedData);

                    res.send(htmlFormEnviado("Eliminar", `Se ha eliminado correctamente la Persona ya que no estaba asociada a otra reparación.`, "redirectToDashboard()"));
                } else {
                    res.send(htmlFormEnviado("Eliminar", `La persona tiene otras reparaciones asociadas. No se puede eliminar.`, "goBack()"));
                }
            }
        } else {
            res.send(htmlFormEnviado("Eliminar Persona", `No se encontró la persona con ID: ${personaId}`, "goBack()"));
        }
    }
};

module.exports = {
    dashboardEliminar
}