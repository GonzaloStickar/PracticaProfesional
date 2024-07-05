const pool = require('../database')

const { persona } = require('../models/persona')
const { reparacion } = require('../models/reparacion')

async function buscarPersonaDataBaseOriginal(nombreApellido) {

    let rowsEncontrados;

    try {
        const query = `
            SELECT * 
            FROM personas 
            WHERE LOWER(nombre) = LOWER($1);
        `;
        const { rows } = await pool.query(query, [nombreApellido]);

        rowsEncontrados = rows;

    } catch (error) {
        console.error('Error al buscar persona en la base de datos:', error);
        throw error;
    } finally {
        return rowsEncontrados;
    }
}

async function dataOriginalPostPersona(nombre, direccion, telefono, email) {

    const insertQuery = `
        INSERT INTO personas (nombre, direccion, telefono, email)
        VALUES ($1, $2, $3, $4)
        RETURNING id;`;

    const insertValues = [nombre, direccion, telefono, email];
    
    try {
        const result = await pool.query(insertQuery, insertValues);
        const id = result.rows[0].id; // Accede al ID devuelto por RETURNING
        const personaNueva = new persona(id, nombre, direccion, telefono, email);
        return personaNueva;
    } catch (error) {
        throw new Error(`Error al insertar persona en la base de datos: ${error.message}`);
    }
}

async function dataOriginalPostReparacion(persona_id, descripcion, tipo, fecha, estado) {

    const insertQuery = `
        INSERT INTO reparaciones (persona_id, descripcion, tipo, fecha, estado)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;`;

    const insertValues = [persona_id, descripcion, tipo, fecha, estado];

    try {
        const result = await pool.query(insertQuery, insertValues);
        const id = result.rows[0].id; // Accede al ID devuelto por RETURNING
        const reparacionNueva = new reparacion(id, persona_id, descripcion, tipo, fecha, estado);
        return reparacionNueva;
    } catch (error) {
        throw new Error(`Error al insertar reparación en la base de datos: ${error.message}`);
    }
}

async function dataOriginalGET(min, max) {

    let personasProcesadas = [];
    let reparacionesProcesadas = [];
    
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

        const result = await pool.query(query, values);

        result.rows.forEach(row => {
            // Verificar si la persona ya existe en personasProcesadas
            const personaExistente = personasProcesadas.some(persona => persona.id === row.persona_id);
        
            if (!personaExistente) {
                personasProcesadas.push({
                    id: row.persona_id,
                    nombre: row.nombre_persona,
                    direccion: row.direccion_persona,
                    telefono: row.telefono_persona,
                    email: row.email_persona
                });
            }
        
            // Verificar si la reparación ya existe en reparacionesProcesadas
            const reparacionExistente = reparacionesProcesadas.some(reparacion => reparacion.id === row.reparacion_id);
        
            if (row.reparacion_id !== null && !reparacionExistente &&
                row.descripcion_reparacion !== null && row.tipo_reparacion !== null &&
                row.fecha_reparacion !== null && row.estado_reparacion !== null) {
                reparacionesProcesadas.push({
                    id: row.reparacion_id,
                    persona_id: row.persona_id,
                    descripcion: row.descripcion_reparacion,
                    tipo: row.tipo_reparacion,
                    fecha: row.fecha_reparacion,
                    estado: row.estado_reparacion
                });
            }
        });
    
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
    } finally {
        return { personas: personasProcesadas, reparaciones: reparacionesProcesadas };
    }
}

const dataOriginalGETbusqueda = {
    
    //Lo que vamos a hacer en esta función es ver si se asignó la busqueda a cada uno
    //Ejemplo: Si nosotros en dataEnviadaBuscar, recibimos nombre == '', direccion == ''
    //Entonces, no añadiremos eso a nuestra consulta, pero por lo contrario... si recibimos
    //telefono == '123', entonces armaremos nuestra consulta para que se busque respecto
    //a si están incluidos o empiezan con esos términos ('123', o otros que asignemos...)

    buscarPersona: async (dataEnviadaBuscar) => {

        const client = await pool.connect();

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
            client.release();
        }
    },
    buscarReparacion: async (dataEnviadaBuscar) => {

        const client = await pool.connect();
        
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
            client.release();
        }
    },
    buscarAmbos: async (dataEnviadaBuscarPersona, dataEnviadaBuscarReparacion) => {

        const client = await pool.connect();

        let resultados = {
            personas: [],
            reparaciones: []
        };
    
        try {
            // Construcción de la consulta SQL combinada
            let baseConsultaBusqueda = `
                SELECT 
                    personas.id AS persona_id,
                    personas.nombre,
                    personas.direccion,
                    personas.telefono,
                    personas.email,
                    reparaciones.id AS reparacion_id,
                    reparaciones.persona_id AS persona_id_reparacion,
                    reparaciones.descripcion,
                    reparaciones.tipo,
                    reparaciones.fecha,
                    reparaciones.estado
                FROM personas
                LEFT JOIN reparaciones ON personas.id = reparaciones.persona_id
                WHERE`;
    
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
    
            // Ejecutar la consulta a la base de datos
            const { rows } = await client.query(baseConsultaBusqueda);
    
            // Procesar resultados y separar personas y reparaciones
            rows.forEach(row => {
                // Agregar persona si no existe previamente
                if (!resultados.personas.some(persona => persona.id === row.persona_id)) {
                    let persona = {
                        id: row.persona_id,
                        nombre: row.nombre,
                        direccion: row.direccion,
                        telefono: row.telefono,
                        email: row.email
                    };
                    resultados.personas.push(persona);
                }
    
                // Agregar reparación si no existe previamente
                if (row.reparacion_id && !resultados.reparaciones.some(reparacion => reparacion.id === row.reparacion_id)) {
                    let reparacion = {
                        id: row.reparacion_id,
                        persona_id: row.persona_id_reparacion,
                        descripcion: row.descripcion,
                        tipo: row.tipo,
                        fecha: row.fecha,
                        estado: row.estado
                    };
                    resultados.reparaciones.push(reparacion);
                }
            });
    
            return resultados;
    
        } catch (error) {
            console.error('Error al consultar personas y reparaciones:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}

async function updateDataOriginalDatosPersona(personaId, nombre, direccion, telefono, email) {

    const client = await pool.connect();

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
        client.release();
    }
}

async function updateDataOriginalDatosReparacionDePersona(personaId, reparacionId, descripcion, tipo, fecha, estado) {

    const client = await pool.connect();

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
        client.release();
    }
}

async function dataOriginalEliminarPersonaId(personaId) {

    const client = await pool.connect();

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
        client.release();
    }
}

async function dataOriginalEliminarReparacionId(reparacionId) {

    const client = await pool.connect();

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
        client.release();
    }
}

async function realizarConsultaReparacionCliente(nombreBusqueda) {

    const client = await pool.connect();

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

        console.log(result)

        // Procesar los resultados
        let personasProcesadas = [];
        let reparacionesProcesadas = [];

        result.rows.forEach(row => {
            // Verificar si la persona ya existe en personasProcesadas
            const personaExistente = personasProcesadas.some(persona => persona.id === row.persona_id);
        
            if (!personaExistente) {
                personasProcesadas.push({
                    id: row.persona_id,
                    nombre: row.nombre_persona,
                    direccion: row.direccion_persona,
                    telefono: row.telefono_persona,
                    email: row.email_persona
                });
            }
        
            // Verificar si la reparación ya existe en reparacionesProcesadas
            const reparacionExistente = reparacionesProcesadas.some(reparacion => reparacion.id === row.reparacion_id);
        
            if (row.reparacion_id !== null && !reparacionExistente &&
                row.descripcion_reparacion !== null && row.tipo_reparacion !== null &&
                row.fecha_reparacion !== null && row.estado_reparacion !== null) {
                reparacionesProcesadas.push({
                    id: row.reparacion_id,
                    persona_id: row.persona_id,
                    descripcion: row.descripcion_reparacion,
                    tipo: row.tipo_reparacion,
                    fecha: row.fecha_reparacion,
                    estado: row.estado_reparacion
                });
            }
        });

        return { personas: personasProcesadas, reparaciones: reparacionesProcesadas };
    } catch (error) {
        console.error('Error al realizar consulta de personas y reparaciones:', error);
        throw error;
    } finally {
        client.release();
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