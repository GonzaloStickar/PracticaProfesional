//const pool = require('../database')

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

//IMPLEMENTADO
function buscarPersonaDataBaseOriginal(nombreApellido) {
    //Utilizado por dashboard_agregar.js
    return dataBaseOriginal.personas.find(persona => persona.nombre.toLowerCase() === nombreApellido.toLowerCase());
}

//IMPLEMENTADO
function dataOriginalPostPersona(nombre, direccion, telefono, email) {

    //Esta función va a ser la encargada de un INSERT INTO persona VALUES(...)
    //Va a estar conectada con la base de datos, y de personaNueva vamos a tener los 'get'
    //para poder obtener los datos de forma segura y poder asignarlos al INSERT de nuestra petición a la DB.

    //Creo una nueva persona para después añadirla a la base de datos.
    let personaNueva = new persona(idPersonaNueva, nombre, direccion, telefono, email);

    idPersonaNueva++;

    dataBaseOriginal.personas.push(personaNueva);

    return personaNueva;
}

//IMPLEMENTADO
function dataOriginalPostReparacion(persona_id, descripcion, tipo, fecha, estado) {
    //Lo mismo que la función de dataOriginalPostPersona, solo que con una reparacion.

    //Creo una nueva persona para después añadirla a la base de datos.
    let reparacionNueva = new reparacion(idReparacionNueva, persona_id, descripcion, tipo, fecha, estado);

    idReparacionNueva++;

    dataBaseOriginal.reparaciones.push(reparacionNueva);

    return reparacionNueva;
}

//IMPLEMENTADO
function dataOriginalGET(min, max) {

    //Esta función devuelve tanto personas, como reparaciones.

    //Debería consultar a la base de datos
    //por min + 1, y max queda como está
    //(Se está consultando dataOriginalGet, min + 1, max)
    console.log("Se está consultando dataOriginalGet, min: ", min, " , max: ",max);

    //let personasFiltradas = dataBaseOriginal.personas.slice(min, max);

    const resultadoConsultaSQL = [
        { persona_id: 1, nombre: 'Juan Pérez', direccion: 'Calle Falsa 123', telefono: '1234567890', email: 'juan.perez@example.com', reparacion_id: 1, descripcion: 'Cambio de pantalla', tipo: 'Televisor', fecha: '2024-06-13', estado: 'Completado' },
        { persona_id: 1, nombre: 'Juan Pérez', direccion: 'Calle Falsa 123', telefono: '1234567890', email: 'juan.perez@example.com', reparacion_id: 2, descripcion: 'Reparación de plaqueta', tipo: 'Televisor', fecha: '2024-06-14', estado: 'En progreso' },
        { persona_id: 2, nombre: 'María Gómez', direccion: 'Avenida Siempreviva 456', telefono: '0987654321', email: 'maria.gomez@example.com', reparacion_id: 3, descripcion: 'Instalación de software', tipo: 'Televisor', fecha: '2024-06-15', estado: 'Pendiente' },
        { persona_id: 3, nombre: 'Juan Díaz', direccion: 'Boulevard del Sol 789', telefono: '1112223333', email: 'carlos.diaz@example.com', reparacion_id: 4, descripcion: 'Reparación', tipo: 'Microondas', fecha: '2024-06-14', estado: 'En progreso' },
        { persona_id: 4, nombre: 'Carlos Falso', direccion: 'Calle Falsa 123', telefono: '11111111', email: 'juan.falso@example.com', reparacion_id: null, descripcion: null, tipo: null, fecha: null, estado: null }
    ];
    
    // Procesar resultado de consulta SQL
    let personasProcesadas = [];
    let reparacionesProcesadas = [];
    
    resultadoConsultaSQL.forEach(row => {
        // Verificar si la persona ya está en la lista de personas procesadas
        if (!personasProcesadas.find(p => p.id === row.persona_id)) {
            personasProcesadas.push({
                id: row.persona_id,
                nombre: row.nombre,
                direccion: row.direccion,
                telefono: row.telefono,
                email: row.email
            });
        }

        if (row.reparacion_id !== null && row.descripcion !== null && row.tipo !== null && row.fecha !== null && row.estado !== null) {
            // Agregar la reparación a la lista de reparaciones procesadas
            reparacionesProcesadas.push({
                id: row.reparacion_id,
                persona_id: row.persona_id,
                descripcion: row.descripcion,
                tipo: row.tipo,
                fecha: row.fecha,
                estado: row.estado
            });
        }
    });

    //console.log({ personas: personasProcesadas, reparaciones: reparacionesProcesadas })

    return { personas: personasProcesadas, reparaciones: reparacionesProcesadas };
}

//IMPLEMENTADO
const dataOriginalGETbusqueda = {

    //Esta función está encargada de realizar la consulta (y primero armar dicha consulta)
    //Lo que va a ser importante para armar la consulta está dentro de esta función, y se realizará la consulta a la DB
    //para poder traer aquellas personas, reparaciones, o ambos que hayamos consultado.
    
    //Lo que vamos a hacer en esta función es ver si se asignó la busqueda a cada uno
    //Ejemplo: Si nosotros en dataEnviadaBuscar, recibimos nombre == '', direccion == ''
    //Entonces, no añadiremos eso a nuestra consulta, pero por lo contrario... si recibimos
    //telefono == '123', entonces armaremos nuestra consulta para que se busque respecto
    //a si están incluidos o empiezan con esos términos ('123', o otros que asignemos...)

    buscarPersona: (dataEnviadaBuscar) => {

        let resultados = {
            personas:[],
            reparaciones:[]
        };

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
            baseConsultaBusqueda += " " + condiciones.join(" AND ");
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
            condiciones.push(`LOWER(tipo) LIKE '%${dataEnviadaBuscar.tipo}%'`);
        }
        if (dataEnviadaBuscar.fecha !== 'undefined') {
            condiciones.push(`TO_CHAR(fecha, 'YYYY-MM-DD') LIKE '%${dataEnviadaBuscar.fecha}%'`);
        }

        // Construir la consulta final añadiendo las condiciones
        if (condiciones.length > 0) {
            baseConsultaBusqueda += " " + condiciones.join(" AND ");
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
    
        // Construcción de la consulta SQL combinada
        // Funcionaría como un FULL OUTER JOIN, para traer a todos.
        let baseConsultaBusqueda = `SELECT * FROM personas FULL OUTER JOIN reparaciones ON personas.id = reparaciones.persona_id WHERE`;

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
            condiciones.push(`LOWER(reparaciones.tipo) LIKE '%${dataEnviadaBuscarReparacion.tipo}%'`);
        }
        if (dataEnviadaBuscarReparacion.fecha !== 'undefined') {
            condiciones.push(`TO_CHAR(reparaciones.fecha, 'YYYY-MM-DD') LIKE '%${dataEnviadaBuscarReparacion.fecha}%'`);
        }

        // Agregar todas las condiciones a la consulta SQL
        if (condiciones.length > 0) {
            baseConsultaBusqueda += " " + condiciones.join(" AND ");
        }

        baseConsultaBusqueda += ";";

        //console.log(baseConsultaBusqueda);
    
        return resultados;
    }
}

//IMPLEMENTADO
function updateDataOriginalDatosPersona (personaId, nombre, direccion, telefono, email) {
    const personaExistente = dataBaseOriginal.personas.find(persona => persona.id === personaId);

    personaExistente.nombre = nombre;
    personaExistente.direccion = direccion;
    personaExistente.telefono = telefono;
    personaExistente.email = email;
}

//IMPLEMENTADO
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

//IMPLEMENTADO
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

//IMPLEMENTADO
function dataOriginalEliminarReparacionId(reparacionId) {
    console.log(`Se está eliminando Reparacion ID: ${reparacionId}`)
    dataBaseOriginal.reparaciones = dataBaseOriginal.reparaciones.filter(reparacion => reparacion.id !== reparacionId);
}

//IMPLEMENTADO
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



//CONSULTAS SQL

//Requiere modificación en dashboard_agregar.js en 
async function buscarPersonaDataBaseOriginalV2(nombreApellido) {
    try {
        const query = `
            SELECT * 
            FROM personas 
            WHERE LOWER(nombre) LIKE $1;
        `;
        const searchTerm = `%${nombreApellido.toLowerCase()}%`;
        const { rows } = await pool.query(query, [searchTerm]);

        return rows[0];

    } catch (error) {
        console.error('Error al buscar persona en la base de datos:', error);
        throw error;
    } finally {
        await client.end();
    }
}

async function dataOriginalPostPersonaV2(nombre, direccion, telefono, email) {
    const insertQuery = `INSERT INTO personas (nombre, direccion, telefono, email) VALUES ($1, $2, $3, $4) RETURNING id;`;

    const insertValues = [nombre, direccion, telefono, email];

    try {
    const result = await pool.query(insertQuery, insertValues);
    const personaId = result.rows[0].id;

        //Crear la persona nueva utilizando el id devuelto por RETURNING
        let personaNueva = new persona(personaId, nombre, direccion, telefono, email);

    return personaNueva;

    } catch (error) {
        throw new Error(`Error al insertar persona en la base de datos: ${error.message}`);
    } finally {
        await client.end();
    }
}

async function dataOriginalPostReparacionV2(persona_id, descripcion, tipo, fecha, estado) {
    const insertQuery = `INSERT INTO reparaciones (persona_id, descripcion, tipo, fecha, estado) VALUES($1, $2, $3, $4) RETURNING id;`;

    const insertValues = [persona_id, descripcion, tipo, fecha, estado];

    try {
        const result = await pool.query(insertQuery, insertValues);
        const reparacion_id = result.rows[0].id;

        //Crear la persona nueva utilizando el id devuelto por RETURNING
        let reparacionNueva = new persona(reparacion_id, persona_id, descripcion, tipo, fecha, estado);

        return reparacionNueva;

    } catch (error) {
        throw new Error(`Error al insertar reparación en la base de datos: ${error.message}`);
    } finally {
        await client.end();
    }
}

async function dataOriginalGETV2(min, max) {
    try {
        //Consulta SQL con parámetros min y max
        const query = `
            SELECT p.id AS persona_id, p.nombre AS nombre_persona, p.direccion AS direccion_persona,
                   p.telefono AS telefono_persona, p.email AS email_persona,
                   r.id AS reparacion_id, r.descripcion AS descripcion_reparacion, r.tipo AS tipo_reparacion,
                   r.fecha AS fecha_reparacion, r.estado AS estado_reparacion
            FROM personas p
            LEFT JOIN reparaciones r ON p.id = r.persona_id
            WHERE p.id BETWEEN $1 AND $2
            ORDER BY r.fecha DESC;
        `;

        const values = [min+1, max];  //Valores para los parámetros $1 y $2

        const result = await client.query(query, values);

        let personasProcesadas = [];
        let reparacionesProcesadas = [];
        
        result.forEach(row => {
            
            personasProcesadas.push({
                id: row.persona_id,
                nombre: row.nombre,
                direccion: row.direccion,
                telefono: row.telefono,
                email: row.email
            });

            if (row.reparacion_id !== null && row.descripcion !== null && row.tipo !== null && row.fecha !== null && row.estado !== null) {
                // Agregar la reparación a la lista de reparaciones procesadas
                reparacionesProcesadas.push({
                    id: row.reparacion_id,
                    persona_id: row.persona_id,
                    descripcion: row.descripcion,
                    tipo: row.tipo,
                    fecha: row.fecha,
                    estado: row.estado
                });
            }
        });

        //console.log({ personas: personasProcesadas, reparaciones: reparacionesProcesadas })

        return { personas: personasProcesadas, reparaciones: reparacionesProcesadas };

    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
    } finally {
        await client.end();
    }
}

const dataOriginalGETbusquedaV2 = {
    
    //Lo que vamos a hacer en esta función es ver si se asignó la busqueda a cada uno
    //Ejemplo: Si nosotros en dataEnviadaBuscar, recibimos nombre == '', direccion == ''
    //Entonces, no añadiremos eso a nuestra consulta, pero por lo contrario... si recibimos
    //telefono == '123', entonces armaremos nuestra consulta para que se busque respecto
    //a si están incluidos o empiezan con esos términos ('123', o otros que asignemos...)

    buscarPersona: async (dataEnviadaBuscar) => {

        let resultados = {
            personas:[],
            reparaciones:[]
        };

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
            baseConsultaBusqueda += " " + condiciones.join(" AND ");
        }

        baseConsultaBusqueda+=";"

        //console.log(baseConsultaBusqueda)

        try {
            // Ejecutar la consulta a la base de datos
            const { rows } = await pool.query(baseConsultaBusqueda);
            resultados.personas = rows;
            return resultados;

        } catch (error) {
            console.error('Error al consultar personas:', error);
            throw error;
        } finally {
            await client.end();
        }
    },
    buscarReparacion: async (dataEnviadaBuscar) => {
        
        let resultados = {
            personas:[],
            reparaciones:[]
        };

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
            condiciones.push(`LOWER(tipo) LIKE '%${dataEnviadaBuscar.tipo}%'`);
        }
        if (dataEnviadaBuscar.fecha !== 'undefined') {
            condiciones.push(`TO_CHAR(fecha, 'YYYY-MM-DD') LIKE '%${dataEnviadaBuscar.fecha}%'`);
        }

        // Construir la consulta final añadiendo las condiciones
        if (condiciones.length > 0) {
            baseConsultaBusqueda += " " + condiciones.join(" AND ");
        }

        baseConsultaBusqueda+=";"

        //console.log(baseConsultaBusqueda)

        try {
            // Ejecutar la consulta a la base de datos
            const { rows } = await pool.query(baseConsultaBusqueda);
            resultados.reparaciones = rows;
            return resultados;

        } catch (error) {
            console.error('Error al consultar reparaciones:', error);
            throw error;
        } finally {
            await client.end();
        }
    },
    buscarAmbos: async (dataEnviadaBuscarPersona, dataEnviadaBuscarReparacion) => {

        let resultados = {
            personas: [],
            reparaciones: []
        };
    
        // Construcción de la consulta SQL combinada
        // Funcionaría como un FULL OUTER JOIN, para traer a todos.
        let baseConsultaBusqueda = `SELECT * FROM personas FULL OUTER JOIN reparaciones ON personas.id = reparaciones.persona_id WHERE`;

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
            condiciones.push(`LOWER(reparaciones.tipo) LIKE '%${dataEnviadaBuscarReparacion.tipo}%'`);
        }
        if (dataEnviadaBuscarReparacion.fecha !== 'undefined') {
            condiciones.push(`TO_CHAR(reparaciones.fecha, 'YYYY-MM-DD') LIKE '%${dataEnviadaBuscarReparacion.fecha}%'`);
        }

        // Agregar todas las condiciones a la consulta SQL
        if (condiciones.length > 0) {
            baseConsultaBusqueda += " " + condiciones.join(" AND ");
        }

        baseConsultaBusqueda += ";";

        //console.log(baseConsultaBusqueda);
    
        try {
            // Ejecutar la consulta a la base de datos
            const { rows } = await pool.query(baseConsultaBusqueda);

            resultados.personas = rows.filter(row => row.id !== null && row.id !== undefined);
            resultados.reparaciones = rows.filter(row => row.persona_id !== null && row.persona_id !== undefined);

            return resultados;

        } catch (error) {
            console.error('Error al consultar personas y reparaciones:', error);
            throw error;
        } finally {
            await client.end();
        }
    }
}

//Requiere modificación de dashboard_editar.js en editarPersonaPOST
async function updateDataOriginalDatosPersonaV2(personaId, nombre, direccion, telefono, email) {
    try {
        // Construir la consulta SQL parametrizada
        const query = `
            UPDATE personas
            SET nombre = $2, direccion = $3, telefono = $4, email = $5
            WHERE id = $1;
        `;

        // Ejecutar la consulta con los parámetros
        await pool.query(query, [personaId, nombre, direccion, telefono, email]);
    } catch (error) {
        console.error('Error al actualizar persona:', error);
        throw error;
    } finally {
        // Cerrar la conexión del pool cuando hayas terminado
        await pool.end();
    }
}

//Requiere modificación de dashboard_editar.js en editarPersonaPOST
async function updateDataOriginalDatosReparacionDePersonaV2(personaId, reparacionId, descripcion, tipo, fecha, estado) {
    try {
        const query = `
            UPDATE reparaciones
            SET descripcion = $1, tipo = $2, fecha = $3, estado = $4
            WHERE persona_id = $5 AND id = $6;
        `;

        // Ejecutar la consulta con los parámetros
        await pool.query(query, [descripcion, tipo, fecha, estado, personaId, reparacionId]);
    } catch (error) {
        console.error('Error al actualizar reparación:', error);
        throw error;
    } finally {
        // Cerrar la conexión del pool cuando hayas terminado
        await pool.end();
    }
}

async function dataOriginalEliminarPersonaIdV2(personaId) {
    try {
        // Consulta para verificar si la persona tiene reparaciones asociadas
        const query = `
            DELETE FROM personas
            WHERE id = $1
            AND NOT EXISTS (
                SELECT 1
                FROM reparaciones
                WHERE persona_id = $1
            );
        `;
        
        await pool.query(query, [personaId]);
    } catch (error) {
        console.error('Error al eliminar persona:', error);
        throw error;
    } finally {
        // Cerrar la conexión del pool cuando hayas terminado
        await pool.end();
    }
}

async function dataOriginalEliminarReparacionIdV2(reparacionId) {
    try {
        // Construir la consulta SQL parametrizada
        const query = `
            DELETE FROM reparaciones
            WHERE id = $1;
        `;

        // Ejecutar la consulta con el parámetro reparacionId
        await pool.query(query, [reparacionId]);
    } catch (error) {
        console.error('Error al eliminar reparación:', error);
        throw error;

    } finally {
        // Cerrar la conexión del pool cuando hayas terminado
        await pool.end();
    }
}

async function realizarConsultaReparacionClienteV2(nombreBusqueda) {
    try {
        // Construir la consulta SQL parametrizada
        const query = `
            SELECT p.id AS persona_id, p.nombre AS nombre_persona, p.direccion AS direccion_persona,
                   p.telefono AS telefono_persona, p.email AS email_persona,
                   r.id AS reparacion_id, r.descripcion AS descripcion_reparacion, r.tipo AS tipo_reparacion,
                   r.fecha AS fecha_reparacion, r.estado AS estado_reparacion
            FROM personas p
            LEFT JOIN reparaciones r ON p.id = r.persona_id
            WHERE LOWER(p.nombre) LIKE $1
            ORDER BY r.fecha DESC;
        `;

        // Ejecutar la consulta con los parámetros
        const searchTerm = `%${nombreBusqueda.toLowerCase()}%`;
        const result = await pool.query(query, [searchTerm]);

        // Procesar los resultados
        let personasProcesadas = [];
        let reparacionesProcesadas = [];

        result.forEach(row => {
            
            personasProcesadas.push({
                id: row.persona_id,
                nombre: row.nombre,
                direccion: row.direccion,
                telefono: row.telefono,
                email: row.email
            });

            if (row.reparacion_id !== null && row.descripcion !== null && row.tipo !== null && row.fecha !== null && row.estado !== null) {
                // Agregar la reparación a la lista de reparaciones procesadas
                reparacionesProcesadas.push({
                    id: row.reparacion_id,
                    persona_id: row.persona_id,
                    descripcion: row.descripcion,
                    tipo: row.tipo,
                    fecha: row.fecha,
                    estado: row.estado
                });
            }
        });

        return { personas: personasProcesadas, reparaciones: reparacionesProcesadas };
    } catch (error) {
        console.error('Error al realizar consulta de personas y reparaciones:', error);
        throw error;
    } finally {
        await pool.end();
    }
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