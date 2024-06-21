//IMPLEMENTAR CONSULTAS SQL:
//verificarPersonaExisteDataBaseOriginal, 
//encontrarPersonaDataBaseOriginalPorDNI,
//dataOriginalPostPersona, 
//dataOriginalPostReparacion,
//dataOriginalGET (Esta consulta va a estar entre rangos min y max),


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

//Esta función va a estar encargada de consultar a la base de datos, si es que se encuentra una persona con el mismo DNI
//Hay que implementar la consulta de sql
function verificarPersonaExisteDataBaseOriginal(dni) {


    return dataBaseOriginal.personas.some(persona => persona.dni === dni);
}

//Utilizada para crear una reparación y poder asignarle el persona_id el id de la persona que existe.
//Ejemplo, si yo creo una reparación, le asigno un DNI, una vez verificado que existe la persona
//por la función 'verificarPersonaExisteDataBaseOriginal', entonces podré buscar la persona, a partir de 
//'encontrarPersonaDataBaseOriginalPorDNI' y poder traer a esa persona, con la persona que me devuelva (1 sola)
//ya que el DNI es único... Podré obtener el id de la persona y así asignarle a la reparación (persona_id), el id de la persona
//que recién encontré en esta función 'encontrarPersonaDataBaseOriginalPorDNI'.
function encontrarPersonaDataBaseOriginalPorDNI(dni) {


    return dataBaseOriginal.personas.find(persona => persona.dni === dni);
}

//Esta función va a ser la encargada de un INSERT INTO persona VALUES(...)
//Va a estar conectada con la base de datos, y de personaNueva vamos a tener los 'get'
//para poder obtener los datos de forma segura y poder asignarlos al INSERT de nuestra petición a la DB.
function dataOriginalPostPersona(nombre, direccion, telefono, email, dni) {

    //Creo una nueva persona para después añadirla a la base de datos.
    let personaNueva = new persona(idPersonaNueva, nombre, direccion, telefono, email, dni);

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

    //console.log("Se está consultando dataOriginalGet, min: ", min, " , max: ",max);
    
    //Debería consultarse por las últimas reparaciones, osea por fechas
    //Traer las más recientes, si en la primera consulta se traen 10 reparaciones, y después se consulta por 20
    //Se van a utilizar las 10 que ya fueron asignadas a dataLocal (explicado en data.js), y se consultará por las otras 10
    //(Se consultará de 11 a 20 ó de 10 a 19 (Hay que analizar)).

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
            if (dataEnviadaBuscar.dni !== 'undefined' && !persona.dni.includes(dataEnviadaBuscar.dni)) {
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
        if (dataEnviadaBuscar.dni !== 'undefined') {
            condiciones.push(`dni LIKE '%${dataEnviadaBuscar.dni}%'`);
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

        console.log(dataEnviadaBuscar);

        return resultados;
    },
    buscarAmbos: (dataEnviadaBuscar) => {
        return dataEnviadaBuscar;
    }
}

module.exports = {
    dataOriginalPostPersona,
    dataOriginalPostReparacion,
    dataOriginalGET,
    dataOriginalGETbusqueda,
    verificarPersonaExisteDataBaseOriginal, encontrarPersonaDataBaseOriginalPorDNI
}