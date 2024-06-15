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

//Test
function dataOriginalGETbusqueda (dataEnviadaBuscar) {

    const encontrados = {
        personas: [],
        reparaciones: []
    };

    dataBaseOriginal.personas.forEach(persona => {

        const nombreMinusculas = dataEnviadaBuscar.nombre.toLowerCase();
        const direccionMinusculas = dataEnviadaBuscar.direccion.toLowerCase();
        const telefonoSinBarrasNiParentesis = dataEnviadaBuscar.telefono;
        const emailMinusculas = dataEnviadaBuscar.email.toLowerCase();
        const dniSinPuntos = dataEnviadaBuscar.dni;

        if (
            persona.nombre.toLowerCase().includes(nombreMinusculas) ||
            persona.direccion.toLowerCase().includes(direccionMinusculas) ||
            persona.telefono.replace(/[^+\d]+/g, '').includes(telefonoSinBarrasNiParentesis) ||
            persona.email.toLowerCase().includes(emailMinusculas) ||
            persona.dni.replace(/\./g, '').includes(dniSinPuntos)
        ) {
            encontrados.personas.push(persona);

            const reparacionesPersona = dataBaseOriginal.reparaciones.filter(reparacion => reparacion.persona_id === persona.id);
            encontrados.reparaciones.push(...reparacionesPersona);
        }
    });

    return encontrados;
}

module.exports = {
    dataOriginalPostPersona,
    dataOriginalPostReparacion,
    dataOriginalGET,
    dataOriginalGETbusqueda
}