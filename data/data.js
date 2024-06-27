//Toda modificación acá en este archivo data.js
//Requiere que se modifique también el archivo dashboard.js
//Y es requerido modificar dashboard.htm si es que agregamos / eliminamos o algo.

//Local
//Esta base de datos local es la cual va a ser utilizada para reutilizar datos que ya habremos consultado / obtenido.
let dataLocal = {
    personas: [],
    reparaciones: []
};

function dataLocalSearchPorPersonaIdYReparacionId(personaId, reparacionId) {
    const personaIdNum = parseInt(personaId, 10); // Convertir número a base 10
    const reparacionIdNum = parseInt(reparacionId, 10); // Convertir número a base 10
    
    // Buscar la persona en dataLocal.personas
    const persona = dataLocal.personas.find(persona => persona.id === personaIdNum);
    
    // Si no se encuentra la persona, retornar resultado vacío
    if (!persona) {
        return {
            encontrada: false,
            reparacionEncontrada: []
        };
    }

    // Buscar la reparación que coincida con persona_id y reparacion_id
    const reparacion = dataLocal.reparaciones.find(reparacion => {
        return reparacion.persona_id === personaIdNum && reparacion.id === reparacionIdNum;
    });

    const resultado = {
        encontrada: false,
        reparacionEncontrada: []
    };

    if (reparacion) {
        resultado.encontrada = true;
        resultado.reparacionEncontrada.push(reparacion);
    }

    return resultado;
}

function updateDataLocalDatosPersona (personaId, nombre, direccion, telefono, email) {
    const personaExistente = dataLocal.personas.find(persona => persona.id === personaId);

    personaExistente.nombre = nombre;
    personaExistente.direccion = direccion;
    personaExistente.telefono = telefono;
    personaExistente.email = email;
}

function updateDataLocalDatosReparacionDePersona (personaId, reparacionId, descripcion, tipo, fecha, estado) {
    const personaExistente = dataLocal.personas.find(persona => persona.id === personaId);

    if (personaExistente) {
        const reparacionEncontrada = dataLocal.reparaciones.find(reparacion => {
            return reparacion.persona_id === personaId && reparacion.id === reparacionId;
        });

        reparacionEncontrada.descripcion = descripcion;
        reparacionEncontrada.tipo = tipo;
        reparacionEncontrada.fecha = fecha;
        reparacionEncontrada.estado = estado;
    }
}

function dataLocalEliminarPersonaId(personaId) {
    dataLocal.personas = dataLocal.personas.filter(persona => persona.id !== personaId);
}

function dataLocalEliminarPersonaIdReparacionId(personaId, reparacionId) {
    dataLocal.personas = dataLocal.personas.filter(persona => persona.id !== personaId);

    // Filtrar las reparaciones diferentes a la reparación con los IDs especificados
    dataLocal.reparaciones = dataLocal.reparaciones.filter(reparacion => {
        return !(reparacion.persona_id === personaId && reparacion.id === reparacionId);
    });
}

module.exports = {
    dataLocalSearchPorPersonaIdYReparacionId,
    updateDataLocalDatosPersona, updateDataLocalDatosReparacionDePersona,
    dataLocalEliminarPersonaId, dataLocalEliminarPersonaIdReparacionId
};