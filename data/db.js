const { persona } = require('../models/persona')
const { reparacion } = require('../models/reparacion')

//Hago de cuenta que esta es nuestra base de datos desplegada en PostgreeSQL.
//Test
let dataBaseOriginal = {
    personas: [],
    reparaciones: []
}

//Test
function dataOriginalPostPersona(id, nombre, direccion, telefono, email, dni) {
    let personaNueva = new persona(id, nombre, direccion, telefono, email, dni);
    dataBaseOriginal.personas.push(personaNueva);
}

//Test
function dataOriginalPostReparacion(id, persona_id, descripcion, tipo, fecha, estado) {
    let reparacionNueva = new reparacion(id, persona_id, descripcion, tipo, fecha, estado);
    dataBaseOriginal.reparaciones.push(reparacionNueva);
}

//Test
function dataOriginalGET(min, max) {
    let personasFiltradas = dataBaseOriginal.personas.slice(min - 1, max);

    let personas = [];
    let reparaciones = [];

    personasFiltradas.forEach(persona => {
        let reparacionesDePersona = dataBaseOriginal.reparaciones.filter(reparacion => reparacion.persona_id === persona.id);
        personas.push({ ...persona });
        reparaciones.push(...reparacionesDePersona);
    });

    return { personas, reparaciones };
}

module.exports = {
    dataOriginalPostPersona,
    dataOriginalPostReparacion,
    dataOriginalGET
}