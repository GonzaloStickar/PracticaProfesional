//Toda modificación acá en este archivo data.js
//Requiere que se modifique también el archivo dashboard.js
//Y es requerido modificar dashboard.htm si es que agregamos / eliminamos o algo.

let dataLocal = {
    personas: [],
    reparaciones: []
};

function agregarPersonaLocalDB(id, nombre, direccion, telefono, email, dni) {
    const nuevaPersona = {
        id: id,
        nombre: nombre,
        direccion: direccion,
        telefono: telefono,
        email: email,
        dni: dni
    };
    dataLocal.personas.push(nuevaPersona);
}

function agregarReparacionLocalDB(id, persona_id, descripcion, tipo, fecha, estado) {
    const nuevaReparacion = {
        id: id,
        persona_id: persona_id,
        descripcion: descripcion,
        tipo: tipo,
        fecha: fecha,
        estado: estado
    };
    dataLocal.reparaciones.push(nuevaReparacion);
}

module.exports = {
    dataLocal,
    agregarPersonaLocalDB,
    agregarReparacionLocalDB
};