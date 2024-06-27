//db "Real"
const { 
    updateDataOriginalDatosPersona, updateDataOriginalDatosReparacionDePersona,
    buscarPersonaDataBaseOriginal
} = require('../../data/db');

const { htmlFormEnviado, htmlEditarForm, 
    htmlEditarPersona, htmlEditarReparacion 
} = require('./crud_form_post_pressed');

const { myCache } = require('../../middlewares/cache');

const dashboardEditar = {
    editarFormGET: (req,res) => {
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

        const cachedData = myCache.get('dataReparaciones');

        console.log(cachedData.personas)

        if (cachedData && cachedData.personas) {
            // Buscar persona en caché por personaId
            const personaEncontrada = cachedData.personas.find(persona => persona.id === parseInt(personaId, 10));
        
            if (personaEncontrada) {
                res.send(htmlEditarPersona(personaEncontrada))
            } else {
                res.send(htmlFormEnviado("Actualizar Persona",`No se encontró la persona con ID: ${personaId}`, "goBack()"));
            }
        } else {
            //Se podría implementar que busque a la persona por ID en una consulta a encontrarPersonaDataBaseOriginalPorID(personaId)
            //Se consulta por buscar la persona en la DB original por su ID.
            res.send(htmlFormEnviado("Actualizar Persona",`No se encontró la persona con ID: ${personaId}`, "goBack()"));
        }
    },
    editarReparacionGET: (req,res) => {
        const personaId = req.query.persona_id;
        const reparacionId = req.query.reparacion_id;

        const cachedData = myCache.get('dataReparaciones');

        if (cachedData && cachedData.reparaciones) {
            // Buscar persona en caché por personaId
            const personaEncontrada = cachedData.personas.find(persona => persona.id === parseInt(personaId,10));

            // Buscar reparación en caché por persona_id
            const reparacionEncontrada = cachedData.reparaciones.find(reparacion => reparacion.id === parseInt(reparacionId,10));

            if (personaEncontrada && reparacionEncontrada) {
                res.send(htmlEditarReparacion(personaEncontrada, reparacionEncontrada))
            } else if (!personaEncontrada) {
                res.send(htmlFormEnviado("Actualizar Reparación",`No se encontró la persona con ID: ${personaId}`, "goBack()"));
            } else {
                res.send(htmlFormEnviado("Actualizar Reparación",`No se encontró la reparación con ID: ${reparacionId}`, "goBack()"));
            }
        } else {
            //Se consulta por buscar la reparación en la DB original por su ID, que además... Coincida con el persona_id de la reparación.
            res.send(htmlFormEnviado("Actualizar Reparación",`No se encontró la reparación con ID: ${reparacionId}`, "goBack()"));
        }
    },
    editarPersonaPOST: (req, res) => {
        const personaId = req.query.persona_id;
        const { nombre, direccion, telefono, email } = req.body;

        const cachedData = myCache.get('dataReparaciones');

        if (cachedData && cachedData.personas) {
            // Buscar persona en caché por personaId
            const personaEncontrada = cachedData.personas.find(persona => persona.id === parseInt(personaId, 10));

            if (personaEncontrada) {
                if (
                    personaEncontrada.nombre === nombre &&
                    personaEncontrada.direccion === direccion &&
                    personaEncontrada.telefono === telefono &&
                    personaEncontrada.email === email
                ) {
                    return res.send(htmlFormEnviado("Actualizar Persona", `No se han ingresado nuevos valores.`, "redirectToDashboard()"));
                } else {

                    //Si no hay ninguna persona con el mismo nombre, que se actualize, sino, que muestre mensaje
                    //Que ya hay una persona con ese nombre
                    //Que busque por cacheData y dataBase si no encuentra en cacheData
                    if (!verificarDisponibilidadNombreApellido(nombre)) {
                        // Actualizar en la base de datos original
                        updateDataOriginalDatosPersona(parseInt(personaId, 10), nombre, direccion, telefono, email);

                        // Actualizar en la caché local
                        personaEncontrada.nombre = nombre;
                        personaEncontrada.direccion = direccion;
                        personaEncontrada.telefono = telefono;
                        personaEncontrada.email = email;
                        myCache.set('dataReparaciones', cachedData);

                        return res.send(htmlFormEnviado("Actualizar Persona", `Se ha actualizado la persona.`, "redirectToDashboard()"));
                    } else {
                        return res.send(htmlFormEnviado("Actualizar Persona", `Ya existe una persona con Nombre y Apellido: ${nombre}`, "redirectToDashboard()"));
                    }
                }
            } else {
                return res.send(htmlFormEnviado("Actualizar Persona", `No se encontró la persona con ID: ${personaId}`, "goBack()"));
            }
        } else {
            return res.send(htmlFormEnviado("Actualizar Persona", `No se encontró dataReparaciones en el caché o no hay personas en cachedData.`, "goBack()"));
        }
    },
    editarReparacionPOST: (req, res) => {
        const personaId = req.query.persona_id;
        const reparacionId = req.query.reparacion_id;
        const { descripcion, tipo, fecha, estado } = req.body;

        const cachedData = myCache.get('dataReparaciones');

        if (cachedData && cachedData.reparaciones) {
            // Buscar reparación en caché por reparacionId y personaId
            const reparacionEncontrada = cachedData.reparaciones.find(
                reparacion => reparacion.id === parseInt(personaId,10) && 
                reparacion.id === parseInt(reparacionId,10)
            );

            if (reparacionEncontrada) {
                if (
                    reparacionEncontrada.descripcion === descripcion &&
                    reparacionEncontrada.tipo === tipo &&
                    reparacionEncontrada.fecha === fecha &&
                    reparacionEncontrada.estado === estado
                ) {
                    return res.send(htmlFormEnviado("Actualizar Reparacion", `No se han ingresado nuevos valores.`, "redirectToDashboard()"));
                } else {
                    // Actualizar en la base de datos original
                    updateDataOriginalDatosReparacionDePersona(parseInt(personaId, 10), parseInt(reparacionId, 10), descripcion, tipo, fecha, estado);

                    // Actualizar en la caché local
                    reparacionEncontrada.descripcion = descripcion;
                    reparacionEncontrada.tipo = tipo;
                    reparacionEncontrada.fecha = fecha;
                    reparacionEncontrada.estado = estado;
                    myCache.set('dataReparaciones', cachedData);

                    return res.send(htmlFormEnviado("Actualizar Reparacion", `Se ha actualizado la reparación.`, "redirectToDashboard()"));
                }
            } else {
                return res.send(htmlFormEnviado("Actualizar Reparacion", `No se encontró la reparación con ID: ${reparacionId} asociada a la persona con ID: ${personaId}`, "goBack()"));
            }
        } else {
            return res.send(htmlFormEnviado("Actualizar Reparacion", `No se encontró dataReparaciones en el caché o no hay reparaciones en cachedData.`, "goBack()"));
        }
    }
}

const verificarDisponibilidadNombreApellido = (nombre) => {

    const cachedData = myCache.get('dataReparaciones');
    
    if (cachedData && cachedData.personas) {
        // Buscar persona en caché por nombre
        const personaEnCache = cachedData.personas.find(persona => persona.nombre.toLowerCase() === nombre.toLowerCase());

        if (personaEnCache) {
            // Persona encontrada en caché
            return true;
        }
    }

    // Si no se encontró en caché, buscar en la base de datos original
    const personaEncontrada = buscarPersonaDataBaseOriginal(nombre);

    if (personaEncontrada) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    dashboardEditar
}