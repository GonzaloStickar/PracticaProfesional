//Hago de cuenta que esta es nuestra base de datos desplegada en PostgreeSQL.
//Test
let dataBaseOriginal = {
    personas: [],
    reparaciones: []
}

//Test
function dataOriginalPostPersona(id, nombre, direccion, telefono, email, dni) {
    const nuevaPersona = {
        id: id,
        nombre: nombre,
        direccion: direccion,
        telefono: telefono,
        email: email,
        dni: dni
    };
    dataBaseOriginal.personas.push(nuevaPersona);
}

//Test
function dataOriginalPostReparacion(id, persona_id, descripcion, tipo, fecha, estado) {
    const nuevaReparacion = {
        id: id,
        persona_id: persona_id,
        descripcion: descripcion,
        tipo: tipo,
        fecha: fecha,
        estado: estado
    };
    dataBaseOriginal.reparaciones.push(nuevaReparacion);
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