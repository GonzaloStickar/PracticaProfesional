//Toda modificación acá en este archivo data.js
//Requiere que se modifique también el archivo dashboard.js
//Y es requerido modificar dashboard.htm si es que agregamos / eliminamos o algo.

//Local
//Esta base de datos local es la cual va a ser utilizada para reutilizar datos que ya habremos consultado / obtenido.
let dataLocal = {
    personas: [],
    reparaciones: []
};

//Local
function dataLocalGET(min, max) {
    let personasFiltradas = dataLocal.personas.slice(min - 1, max);

    let personas = [];
    let reparaciones = [];

    personasFiltradas.forEach(persona => {
        let reparacionesDePersona = dataLocal.reparaciones.filter(reparacion => reparacion.persona_id === persona.id);
        personas.push({ ...persona });
        reparaciones.push(...reparacionesDePersona);
    });

    return { personas, reparaciones };
}

//Local
function dataLocalPostPersona(personas) {
    dataLocal.personas.push(...personas);
}

//Local
function dataLocalPostReparacion(reparaciones) {
    dataLocal.reparaciones.push(...reparaciones);
}

function dataLocalGETbusqueda (dataEnviadaBuscar) {

    const encontrados = {
        personas: [],
        reparaciones: []
    };

    dataLocal.personas.forEach(persona => {

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

            const reparacionesPersona = dataLocal.reparaciones.filter(reparacion => reparacion.persona_id === persona.id);
            encontrados.reparaciones.push(...reparacionesPersona);
        }
    });

    return encontrados;
}

module.exports = {
    dataLocalGET,
    dataLocalPostPersona,
    dataLocalPostReparacion,
    dataLocalGETbusqueda
};