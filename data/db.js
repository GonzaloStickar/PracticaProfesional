//IMPLEMENTAR CONSULTAS SQL:


const { persona } = require('../models/persona')
const { reparacion } = require('../models/reparacion')

//Hago de cuenta que esta es nuestra base de datos desplegada en PostgreeSQL.
//Test
let dataBaseOriginal = {
    personas: [],
    reparaciones: []
}

//Una vez hecha la base de datos, esto no va a ser necesario, ya que va a ser un autoincrement de cada persona nueva o reparacion
//por lo que no necesitaremos ver cada id o ir sumando, sino que la base de datos ya lo hará automáticamente por sí misma.
let idPersonaNueva = 0; //De la tabla personas, cada persona tiene un id
let idReparacionNueva = 0; //De la tabla reparaciones, cada persona tiene un id

//Utilizado por dashboard_agregar.js
function buscarPersonaDataBaseOriginal(nombreApellido) {
    return dataBaseOriginal.personas.find(persona => persona.nombre.toLowerCase() === nombreApellido.toLowerCase());
}

function encontrarPersonaDataBaseOriginalPorID(persona_id) {
    return dataBaseOriginal.personas.find(persona => persona.id === persona_id);
}

//Esta función va a ser la encargada de un INSERT INTO persona VALUES(...)
//Va a estar conectada con la base de datos, y de personaNueva vamos a tener los 'get'
//para poder obtener los datos de forma segura y poder asignarlos al INSERT de nuestra petición a la DB.
function dataOriginalPostPersona(nombre, direccion, telefono, email) {

    //Creo una nueva persona para después añadirla a la base de datos.
    let personaNueva = new persona(idPersonaNueva, nombre, direccion, telefono, email);

    idPersonaNueva++;

    //INSERT INTO personas VALUES(nombre, direccion, telefono, email, dni);
    dataBaseOriginal.personas.push(personaNueva);

    return personaNueva;
}

//Lo mismo que la función de dataOriginalPostPersona, solo que con una reparacion.
function dataOriginalPostReparacion(persona_id, descripcion, tipo, fecha, estado) {

    //Creo una nueva persona para después añadirla a la base de datos.
    let reparacionNueva = new reparacion(idReparacionNueva, persona_id, descripcion, tipo, fecha, estado);

    idReparacionNueva++;

    //INSERT INTO reparaciones VALUES(nombre, direccion, telefono, email, dni);
    dataBaseOriginal.reparaciones.push(reparacionNueva);

    return reparacionNueva;
}

//Traer con un límite de personas (0 mínimo (lo cual sería 1 persona), a 9 máximo (lo que sería 10 en la consulta)).
//Esta función devuelve tanto personas, como reparaciones.
function dataOriginalGET(min, max) {

    console.log("Se está consultando dataOriginalGet, min: ", min, " , max: ",max);
    
    //Debería consultarse por las últimas reparaciones, osea por fechas
    //Traer las más recientes, si en la primera consulta se traen 10 reparaciones, y después se consulta por 20
    //Se van a utilizar las 10 que ya fueron asignadas a dataLocal (explicado en data.js), y se consultará por las otras 10
    //(Se consultará de 11 a 20 ó de 10 a 19 (Hay que analizar)).

    let personasFiltradas = dataBaseOriginal.personas.slice(min, max);

    let personas = [];
    let reparaciones = [];

    personasFiltradas.forEach(persona => {
        let reparacionesDePersona = dataBaseOriginal.reparaciones.filter(reparacion => reparacion.persona_id === persona.id);
        personas.push({ ...persona });
        reparaciones.push(...reparacionesDePersona);
    });

    return { personas, reparaciones };
}

//Esta función está encargada de realizar la consulta (y primero armar dicha consulta)
//Lo que va a ser importante para armar la consulta está dentro de esta función, y se realizará la consulta a la DB
//para poder traer aquellas personas, reparaciones, o ambos que hayamos consultado.
const dataOriginalGETbusqueda = {
    
    //Lo que vamos a hacer en esta función es ver si se asignó la busqueda a cada uno
    //Ejemplo: Si nosotros en dataEnviadaBuscar, recibimos nombre == '', direccion == ''
    //Entonces, no añadiremos eso a nuestra consulta, pero por lo contrario... si recibimos
    //telefono == '123', dni == '11', entonces armaremos nuestra consulta para que se busque respecto
    //a si están incluidos o empiezan con esos términos ('123', '11', entre otros que asignemos...)

    buscarPersona: (dataEnviadaBuscar) => {

        let resultados = {
            personas:[],
            reparaciones:[]
        };

        dataBaseOriginal.personas.forEach(persona => {
            let match = true;
            
            if (dataEnviadaBuscar.nombre !== 'undefined' && !persona.nombre.toLowerCase().includes(dataEnviadaBuscar.nombre.toLowerCase())) {
                match = false;
            }
            if (dataEnviadaBuscar.direccion !== 'undefined' && !persona.direccion.toLowerCase().includes(dataEnviadaBuscar.direccion.toLowerCase())) {
                match = false;
            }
            if (dataEnviadaBuscar.telefono !== 'undefined' && !persona.telefono.includes(dataEnviadaBuscar.telefono)) {
                match = false;
            }
            if (dataEnviadaBuscar.email !== 'undefined' && !persona.email.toLowerCase().includes(dataEnviadaBuscar.email.toLowerCase())) {
                match = false;
            }

            if (match) {
                resultados.personas.push(persona);
            }
        });

        //Consulta SQL
        let baseConsultaBusqueda = "SELECT * FROM personas WHERE";
        let condiciones = [];

        if (dataEnviadaBuscar.nombre !== 'undefined') {
            condiciones.push(`LOWER(nombre) LIKE '%${dataEnviadaBuscar.nombre}%'`);
        }
        if (dataEnviadaBuscar.direccion !== 'undefined') {
            condiciones.push(`LOWER(direccion) LIKE '%${dataEnviadaBuscar.direccion}%'`);
        }
        if (dataEnviadaBuscar.telefono !== 'undefined') {
            condiciones.push(`telefono LIKE '%${dataEnviadaBuscar.telefono}%'`);
        }
        if (dataEnviadaBuscar.email !== 'undefined') {
            condiciones.push(`LOWER(email) LIKE '%${dataEnviadaBuscar.email}%'`);
        }

        // Construir la consulta final añadiendo las condiciones
        if (condiciones.length > 0) {
            baseConsultaBusqueda += " AND " + condiciones.join(" AND ");
        }

        baseConsultaBusqueda+=";"

        //console.log(baseConsultaBusqueda)

        return resultados;
    },
    buscarReparacion: (dataEnviadaBuscar) => {
        
        let resultados = {
            personas:[],
            reparaciones:[]
        };

        dataBaseOriginal.reparaciones.forEach(reparacion => {

            let match = true;
            
            if (dataEnviadaBuscar.estado !== 'undefined' && !reparacion.estado.toLowerCase().includes(dataEnviadaBuscar.estado.toLowerCase())) {
                match = false;
            }
            if (dataEnviadaBuscar.descripcion !== 'undefined' && !reparacion.descripcion.toLowerCase().includes(dataEnviadaBuscar.descripcion.toLowerCase())) {
                match = false;
            }
            if (dataEnviadaBuscar.tipo !== 'undefined' && !reparacion.tipo.toLowerCase().includes(dataEnviadaBuscar.tipo.toLowerCase())) {
                match = false;
            }
            if (dataEnviadaBuscar.fecha !== 'undefined' && !reparacion.fecha.includes(dataEnviadaBuscar.fecha)) {
                match = false;
            }

            if (match) {
                resultados.reparaciones.push(reparacion);

                const persona = encontrarPersonaDataBaseOriginalPorID(reparacion.persona_id);
                if (persona && !resultados.personas.some(p => p.id === persona.id)) {
                    resultados.personas.push(persona);
                }
            }
        });

        //Consulta SQL
        let baseConsultaBusqueda = "SELECT * FROM reparaciones WHERE";
        let condiciones = [];

        if (dataEnviadaBuscar.estado !== 'undefined') {
            condiciones.push(`LOWER(estado) LIKE '%${dataEnviadaBuscar.estado}%'`);
        }
        if (dataEnviadaBuscar.descripcion !== 'undefined') {
            condiciones.push(`LOWER(descripcion) LIKE '%${dataEnviadaBuscar.descripcion}%'`);
        }
        if (dataEnviadaBuscar.tipo !== 'undefined') {
            condiciones.push(`tipo LIKE '%${dataEnviadaBuscar.tipo}%'`);
        }
        if (dataEnviadaBuscar.fecha !== 'undefined') {
            condiciones.push(`LOWER(fecha) LIKE '%${dataEnviadaBuscar.fecha}%'`);
        }

        // Construir la consulta final añadiendo las condiciones
        if (condiciones.length > 0) {
            baseConsultaBusqueda += " AND " + condiciones.join(" AND ");
        }

        baseConsultaBusqueda+=";"

        //console.log(baseConsultaBusqueda)

        return resultados;
    },
    buscarAmbos: (dataEnviadaBuscarPersona, dataEnviadaBuscarReparacion) => {

        let resultados = {
            personas: [],
            reparaciones: []
        };
    
        // Búsqueda en personas
        dataBaseOriginal.personas.forEach(persona => {
            let match = true;
    
            // Aplicar filtros de búsqueda para personas
            if (dataEnviadaBuscarPersona.nombre !== 'undefined' && !persona.nombre.toLowerCase().includes(dataEnviadaBuscarPersona.nombre.toLowerCase())) {
                match = false;
            }
            if (dataEnviadaBuscarPersona.direccion !== 'undefined' && !persona.direccion.toLowerCase().includes(dataEnviadaBuscarPersona.direccion.toLowerCase())) {
                match = false;
            }
            if (dataEnviadaBuscarPersona.telefono !== 'undefined' && !persona.telefono.includes(dataEnviadaBuscarPersona.telefono)) {
                match = false;
            }
            if (dataEnviadaBuscarPersona.email !== 'undefined' && !persona.email.toLowerCase().includes(dataEnviadaBuscarPersona.email.toLowerCase())) {
                match = false;
            }
    
            if (match) {
                resultados.personas.push(persona);
            }
        });
    
        // Búsqueda en reparaciones
        dataBaseOriginal.reparaciones.forEach(reparacion => {
            let match = true;
    
            // Aplicar filtros de búsqueda para reparaciones
            if (dataEnviadaBuscarReparacion.estado !== 'undefined' && !reparacion.estado.toLowerCase().includes(dataEnviadaBuscarReparacion.estado.toLowerCase())) {
                match = false;
            }
            if (dataEnviadaBuscarReparacion.descripcion !== 'undefined' && !reparacion.descripcion.toLowerCase().includes(dataEnviadaBuscarReparacion.descripcion.toLowerCase())) {
                match = false;
            }
            if (dataEnviadaBuscarReparacion.tipo !== 'undefined' && !reparacion.tipo.toLowerCase().includes(dataEnviadaBuscarReparacion.tipo.toLowerCase())) {
                match = false;
            }
            if (dataEnviadaBuscarReparacion.fecha !== 'undefined' && !reparacion.fecha.includes(dataEnviadaBuscarReparacion.fecha)) {
                match = false;
            }
    
            if (match) {
                resultados.reparaciones.push(reparacion);
    
                // Buscar y agregar la persona asociada a la reparación si no está ya en la lista
                const persona = encontrarPersonaDataBaseOriginalPorID(reparacion.persona_id);
                if (persona && !resultados.personas.some(p => p.id === persona.id)) {
                    resultados.personas.push(persona);
                }
            }
        });
    
        // Construcción de la consulta SQL combinada
        // Funcionaría como un FULL OUTER JOIN, para traer a todos.
        let baseConsultaBusqueda = `
            SELECT personas.*, reparaciones.*
            FROM personas
            LEFT JOIN reparaciones ON personas.id = reparaciones.persona_id
            UNION
            SELECT personas.*, reparaciones.*
            FROM personas
            RIGHT JOIN reparaciones ON personas.id = reparaciones.persona_id
            WHERE personas.id IS NULL OR reparaciones.persona_id IS NULL;
        `;
        let condiciones = [];
    
        // Aplicar condiciones de búsqueda para tabla personas
        if (dataEnviadaBuscarPersona.nombre !== 'undefined') {
            condiciones.push(`LOWER(personas.nombre) LIKE '%${dataEnviadaBuscarPersona.nombre}%'`);
        }
        if (dataEnviadaBuscarPersona.direccion !== 'undefined') {
            condiciones.push(`LOWER(personas.direccion) LIKE '%${dataEnviadaBuscarPersona.direccion}%'`);
        }
        if (dataEnviadaBuscarPersona.telefono !== 'undefined') {
            condiciones.push(`personas.telefono LIKE '%${dataEnviadaBuscarPersona.telefono}%'`);
        }
        if (dataEnviadaBuscarPersona.email !== 'undefined') {
            condiciones.push(`LOWER(personas.email) LIKE '%${dataEnviadaBuscarPersona.email}%'`);
        }
    
        // Aplicar condiciones de búsqueda para tabla reparaciones
        if (dataEnviadaBuscarReparacion.estado !== 'undefined') {
            condiciones.push(`LOWER(reparaciones.estado) LIKE '%${dataEnviadaBuscarReparacion.estado}%'`);
        }
        if (dataEnviadaBuscarReparacion.descripcion !== 'undefined') {
            condiciones.push(`LOWER(reparaciones.descripcion) LIKE '%${dataEnviadaBuscarReparacion.descripcion}%'`);
        }
        if (dataEnviadaBuscarReparacion.tipo !== 'undefined') {
            condiciones.push(`reparaciones.tipo LIKE '%${dataEnviadaBuscarReparacion.tipo}%'`);
        }
        if (dataEnviadaBuscarReparacion.fecha !== 'undefined') {
            condiciones.push(`LOWER(reparaciones.fecha) LIKE '%${dataEnviadaBuscarReparacion.fecha}%'`);
        }
    
        // Construir la consulta final añadiendo las condiciones
        if (condiciones.length > 0) {
            baseConsultaBusqueda += " AND " + condiciones.join(" AND ");
        }
    
        baseConsultaBusqueda += ";";
    
        //console.log(baseConsultaBusqueda);
    
        return resultados;
    }
}

function updateDataOriginalDatosPersona (personaId, nombre, direccion, telefono, email) {
    const personaExistente = dataBaseOriginal.personas.find(persona => persona.id === personaId);

    personaExistente.nombre = nombre;
    personaExistente.direccion = direccion;
    personaExistente.telefono = telefono;
    personaExistente.email = email;
}

function updateDataOriginalDatosReparacionDePersona (personaId, reparacionId, descripcion, tipo, fecha, estado) {
    const personaExistente = dataBaseOriginal.personas.find(persona => persona.id === personaId);

    if (personaExistente) {
        const reparacionEncontrada = dataBaseOriginal.reparaciones.find(reparacion => {
            return reparacion.persona_id === personaId && reparacion.id === reparacionId;
        });

        reparacionEncontrada.descripcion = descripcion;
        reparacionEncontrada.tipo = tipo;
        reparacionEncontrada.fecha = fecha;
        reparacionEncontrada.estado = estado;
    }
}

function dataOriginalEliminarPersonaId(personaId) {
    console.log(`Se está eliminando Persona ID: ${personaId} (No se eliminó todavía)`)
    const tieneOtrasReparaciones = dataBaseOriginal.reparaciones.some(reparacion => reparacion.persona_id === personaId);

    console.log(`Tiene otras reparaciones Persona ID: ${personaId} - ${tieneOtrasReparaciones}`)

    if (!tieneOtrasReparaciones) {
        console.log(`NO tiene otras reparaciones Persona ID: ${personaId} - ${tieneOtrasReparaciones} - Eliminar Persona`)
        dataBaseOriginal.personas = dataBaseOriginal.personas.filter(persona => persona.id !== personaId);
    }
    else {
        console.log("Tiene otras reparaciones, no se elimina la reparación.")
    }
}

function dataOriginalEliminarReparacionId(reparacionId) {
    console.log(`Se está eliminando Reparacion ID: ${reparacionId}`)
    dataBaseOriginal.reparaciones = dataBaseOriginal.reparaciones.filter(reparacion => reparacion.id !== reparacionId);
}

function realizarConsultaReparacionCliente(nombreBusqueda) {
    let resultados = {
        personas: [],
        reparaciones: []
    };

    // Filtrar personas cuyo nombre coincida con el nombre de búsqueda
    const personasFiltradas = dataBaseOriginal.personas.filter(persona => 
        persona.nombre.toLowerCase().includes(nombreBusqueda.toLowerCase())
    );

    // Agregar las personas filtradas a los resultados
    resultados.personas = personasFiltradas;

    // Buscar y agregar las reparaciones asociadas con las personas filtradas
    resultados.reparaciones = dataBaseOriginal.reparaciones.filter(reparacion => 
        personasFiltradas.some(persona => persona.id === reparacion.persona_id)
    );

    return resultados;
}

module.exports = {
    dataOriginalPostPersona,
    dataOriginalPostReparacion,
    dataOriginalGET,
    dataOriginalGETbusqueda,
    buscarPersonaDataBaseOriginal,
    updateDataOriginalDatosPersona, updateDataOriginalDatosReparacionDePersona,
    dataOriginalEliminarPersonaId, dataOriginalEliminarReparacionId,
    realizarConsultaReparacionCliente
}