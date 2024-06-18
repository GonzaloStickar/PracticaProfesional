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
let idPersonaNueva = 0;
let idReparacionNueva = 0;

//Esta función va a estar encargada de consultar a la base de datos, si es que se encuentra una persona con el mismo DNI
//Hay que implementar la consulta de sql
function verificarPersonaExisteDataBaseOriginal(dni) {
    return dataBaseOriginal.personas.some(persona => persona.dni === dni);
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


    let reparacionNueva = new reparacion(idReparacionNueva, persona_id, descripcion, tipo, fecha, estado);

    idPersonaNueva++;


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
function dataOriginalGETbusqueda (dataEnviadaBuscar) {

    //Lo que vamos a hacer en esta función es ver si se asignó la busqueda a cada uno
    //Ejemplo: Si nosotros en dataEnviadaBuscar, recibimos nombre == '', direccion == ''
    //Entonces, no añadiremos eso a nuestra consulta, pero por lo contrario... si recibimos
    //telefono == '123', dni == '11', entonces armaremos nuestra consulta para que se busque respecto
    //a si están incluidos o empiezan con esos términos ('123', '11', entre otros que asignemos...)

    return dataEnviadaBuscar;

    ```
    const encontrados = {
        personas: [],
        reparaciones: []
    };

    dataBaseOriginal.personas.forEach(persona => {

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

            const reparacionesPersona = dataBaseOriginal.reparaciones.filter(reparacion => reparacion.persona_id === persona.id);
            encontrados.reparaciones.push(...reparacionesPersona);
        }
    });

    return encontrados;
    ```
}

module.exports = {
    dataOriginalPostPersona,
    dataOriginalPostReparacion,
    dataOriginalGET,
    dataOriginalGETbusqueda,
    verificarPersonaExisteDataBaseOriginal
}