//Toda modificación acá en este archivo data.js
//Requiere que se modifique también el archivo dashboard.js
//Y es requerido modificar dashboard.htm si es que agregamos / eliminamos o algo.

//Local
//Esta base de datos local es la cual va a ser utilizada para reutilizar datos que ya habremos consultado / obtenido.
let dataLocal = {
    personas: [],
    reparaciones: []
};

//Traer de la base de datos local, las personas y reparaciones que ya están pre-cargadas
//De lo contrario que no estén cargadas, se traen las que YA lo están, y las que no, se suman consultando a la base de datos
//Ejemplo: Por defecto (default), dataLocal... Siempre va a estar vacío
//Si nosotros verificamos eso, entonces decimos que hay que consultar a la base de datos, para poder asignar los nuevos valores
//o mejor dicho: Traer los datos necesarios y solicitados (he consultado para ver las últimas 10 reparaciones).
//Una vez que se asignaron esas 10 reparaciones que solicité... dataLocalPostPersonas (En plural) y dataLocalPostReparaciones (En plural)
//se van a encargar de asignar las nuevas personas y reparaciones que se acaban de recibir de la base de datos 
//Original / base de datos desplegada
//
//Teniendo eso en cuenta... Podemos reutilizar nuestra base de datos para que no sea necesario consultar de nuevo.
//Quiero decir, en el ejemplo de arriba asigné una consulta de las últimas 10 reparaciones, pero una vez que ya están asignadas a dataLocal
//no necesitaré consultar a la base de datos por 10 reparaciones, ya que están disponibles en la dataLocal 
//(o base de datos local - reutilizable)
//Esto me permite también, que si se realiza una consulta, de por ejemplo: 20 reparaciones, no se tenga que consultar a la base de datos
//o la base de datos Original (dataOriginal (Test)), por 20 reparaciones en sí, sino que consulte por 10 (20 - 10 = 10)
//Una vez tenga las nuevas 10 reparaciones (por que consulté por 20 pero ya 10 estaban asignadas en dataLocal), se le asignará a dataLocal
//las 10 nuevas reparaciones que se trajo de la consulta a partir del 10 hasta el 20
//Todo esto, es para evitar que se consulte de 0 a 20, y que se logre consultar de 10 a 20, lo cual ahorra tiempo y consumo de memoria
//por parte del servidor / base de datos concluyentemente.
function dataLocalGET(min, max) {
    let personasFiltradas = dataLocal.personas.slice(min, max);

    let personas = [];
    let reparaciones = [];

    personasFiltradas.forEach(persona => {
        let reparacionesDePersona = dataLocal.reparaciones.filter(reparacion => reparacion.persona_id === persona.id);
        personas.push({ ...persona });
        reparaciones.push(...reparacionesDePersona);
    });

    return { personas, reparaciones };
}

// Función para verificar si una persona ya existe en dataLocal
function verificarPersonaExisteDataBaseLocalPorId(id) {
    return dataLocal.personas.some(persona => persona.id === id);
}

// Función para agregar nuevas personas a dataLocal sin duplicados
function dataLocalPostPersonas(personas) {
    personas.forEach(persona => {
        if (!verificarPersonaExisteDataBaseLocalPorId(persona.id)) {
            dataLocal.personas.push(persona);
        }
    });
}

// Función para agregar nuevas reparaciones a dataLocal sin duplicados
function dataLocalPostReparaciones(reparaciones) {
    reparaciones.forEach(reparacion => {
        // Verificar si ya existe una reparación con el mismo ID en dataLocal.reparaciones
        const existeReparacion = dataLocal.reparaciones.some(rep => rep.id === reparacion.id);

        // Si no existe, agregar la reparación a dataLocal.reparaciones
        if (!existeReparacion) {
            dataLocal.reparaciones.push(reparacion);
        }
    });
}

function dataLocalSearchPorPersonaId(personaId) {
    const personaIdNum = parseInt(personaId, 10); // Convertir número a base 10
    const persona = dataLocal.personas.find(persona => persona.id === personaIdNum);

    const resultado = {
        encontrada: false,
        personaEncontrada: []
    };

    if (persona) {
        resultado.encontrada = true;
        resultado.personaEncontrada.push(persona);
    }

    return resultado;
}

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

const dataLocalAgregar = {
    //Cuando se agrega UNA persona (por el botón agregar persona o ambos), se activa esta función
    //1) Se le asigna a dataOriginal la nueva persona (encargado en db.js)
    //2) Se le asigna a dataLocal la nueva persona (encargado en data.js)
    dataLocalPostUnaPersona: (personaNueva) => {
        dataLocal.personas.push(personaNueva);
    },
    //Cuando se agrega UNA reparacion (por el botón agregar reparacion o ambos), se activa esta función
    //1) Se le asigna a dataOriginal la nueva reparacion (encargado en db.js)
    //2) Se le asigna a dataLocal la nueva reparacion (encargado en data.js)
    dataLocalPostUnaReparacion: (reparacionNueva) => {
        dataLocal.reparaciones.push(reparacionNueva);
    }
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
    dataLocalGET,
    dataLocalPostPersonas,
    dataLocalPostReparaciones,
    dataLocalSearchPorPersonaId,
    dataLocalSearchPorPersonaIdYReparacionId,
    dataLocalAgregar,
    updateDataLocalDatosPersona, updateDataLocalDatosReparacionDePersona,
    dataLocalEliminarPersonaId, dataLocalEliminarPersonaIdReparacionId
};