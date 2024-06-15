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

module.exports = {
    dataLocalGET,
    dataLocalPostPersona,
    dataLocalPostReparacion
};