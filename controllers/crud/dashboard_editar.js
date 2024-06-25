const path = require('path');

//db "Local"
const { 
    dataLocalSearchPorPersonaId,
    dataLocalSearchPorPersonaIdYReparacionId,
    updateDataLocalDatosPersona, updateDataLocalDatosReparacionDePersona
} = require('../../data/data');

//db "Real"
const { 
    updateDataOriginalDatosPersona, updateDataOriginalDatosReparacionDePersona
} = require('../../data/db');

const { htmlFormEnviado, htmlEditarForm, 
    htmlEditarPersona, htmlEditarReparacion 
} = require('./crud_form_post_pressed');

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

        const personaBuscada = dataLocalSearchPorPersonaId(personaId);

        if (personaBuscada.encontrada==false) {
            res.send(htmlFormEnviado("Actualizar Persona",`No se encontró la persona con ID: ${personaId}`, "goBack()"));
        } else {
            res.send(htmlEditarPersona(personaBuscada.personaEncontrada[0]))
        }
    },
    editarReparacionGET: (req,res) => {
        const personaId = req.query.persona_id;

        const reparacionId = req.query.reparacion_id;

        const personaBuscada = dataLocalSearchPorPersonaId(personaId);

        if (personaBuscada.encontrada==false) {
            res.send(htmlFormEnviado("Actualizar Persona",`No se encontró la persona con ID: ${personaId}`, "goBack()"));
        } else {
            const reparacionEncontrada = dataLocalSearchPorPersonaIdYReparacionId(personaId, reparacionId);

            if (reparacionEncontrada.encontrada==false) {
                res.send(htmlFormEnviado("Actualizar Reparación",`No se encontró la reparación con ID: ${reparacionId}`, "goBack()"));
            } else {
                res.send(htmlEditarReparacion(personaBuscada.personaEncontrada[0], reparacionEncontrada.reparacionEncontrada[0]))
            }
        }
    },
    editarPersonaPOST: (req, res) => {
        const personaId = req.query.persona_id;

        const personaBuscada = dataLocalSearchPorPersonaId(personaId);

        const { nombre, direccion, telefono, email } = req.body;

        if (personaBuscada.personaEncontrada[0].nombre===nombre &&
            personaBuscada.personaEncontrada[0].direccion===direccion &&
            personaBuscada.personaEncontrada[0].telefono===telefono &&
            personaBuscada.personaEncontrada[0].email===email
        ) {
            res.send(htmlFormEnviado("Actualizar Persona",`No se han ingresados nuevos valores.`, "redirectToDashboard()"));
        } else {
            
            updateDataOriginalDatosPersona(
                personaBuscada.personaEncontrada[0].id, 
                nombre, direccion, telefono, email
            )

            updateDataLocalDatosPersona(
                personaBuscada.personaEncontrada[0].id,
                nombre, direccion, telefono, email
            )

            res.send(htmlFormEnviado("Actualizar Persona",`Se ha actualizado la persona.`, "redirectToDashboard()"));
        }
    },
    editarReparacionPOST: (req, res) => {
        const personaId = req.query.persona_id;
        const reparacionId = req.query.reparacion_id;

        const reparacionEncontrada = dataLocalSearchPorPersonaIdYReparacionId(personaId, reparacionId);

        const { descripcion, tipo, fecha, estado } = req.body;

        if (reparacionEncontrada.reparacionEncontrada[0].descripcion===descripcion &&
            reparacionEncontrada.reparacionEncontrada[0].tipo===tipo &&
            reparacionEncontrada.reparacionEncontrada[0].fecha===fecha &&
            reparacionEncontrada.reparacionEncontrada[0].estado===estado
        ) {
            res.send(htmlFormEnviado("Actualizar Reparacion",`No se han ingresados nuevos valores.`, "redirectToDashboard()"));
        } else {

            updateDataOriginalDatosReparacionDePersona(
                reparacionEncontrada.reparacionEncontrada[0].persona_id,
                reparacionEncontrada.reparacionEncontrada[0].id,
                descripcion, tipo, fecha, estado
            )

            updateDataLocalDatosReparacionDePersona(
                reparacionEncontrada.reparacionEncontrada[0].persona_id,
                reparacionEncontrada.reparacionEncontrada[0].id,
                descripcion, tipo, fecha, estado
            )

            res.send(htmlFormEnviado("Actualizar Reparación",`Se ha actualizado la reparación.`, "redirectToDashboard()"));
        }
    }
}

module.exports = {
    dashboardEditar
}