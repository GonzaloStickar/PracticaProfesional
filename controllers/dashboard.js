//Teniendo en cuenta todo lo de abajo podemos concluir que en realidad no estamos consultando /reparaciones en sí
//sino que estamos consultando personas, si consultamos por reparaciones?=3
//nos traerá 3 personas, pero mi objetivo sobre todo esto, es que pueda traerme las reparaciones de 3 personas
//Ya que el problema a todo esto es que cuando lo pensé en desarrollar, es que una persona puede traer más de 2 reparaciones
//y por ahí lo mejor sería mostrar más que 2 reparaciones solamente (veríamos solo 1 persona), en cambio, si lo paso como 2 personas
//podremos ver más información sobre otras reparaciones, lo que no cuesta mucho ya que estamos en sí consultando a la base de datos
//por ambas tablas, lo cual sí o sí tendrán que traer más información. Por ahí se puede explicar mejor :)

const path = require('path');

//dataLocal
const { 
    dataLocalPostPersonas, dataLocalPostReparaciones,
    dataLocalGET
} = require('../data/data')

const { myCache } = require('../middlewares/cache');



//db "Real"
const { 
    dataOriginalPostPersona, dataOriginalPostReparacion,
    dataOriginalGET
} = require('../data/db');

//Suponiendo que es toda nuestra DB
//Para seleccionar y cambiar todos a la vez, apretar Ctrl + D (y selecciona "agregarPersonaLocalDB" los 3 por igual y cambiamos los 3 a la vez).
dataOriginalPostPersona("Juan Pérez", "Calle Falsa 123", "1234567890", "juan.perez@example.com", "11222333");
dataOriginalPostPersona("María Gómez", "Avenida Siempreviva 456", "0987654321", "maria.gomez@example.com", "12222333");
dataOriginalPostPersona("Juan Díaz", "Boulevard del Sol 789", "1112223333", "carlos.diaz@example.com", "13222333");
dataOriginalPostPersona("Carlos Falso", "Calle Falsa 123", "11111111", "juan.falso@example.com", "12122122");

dataOriginalPostReparacion(0, "Cambio de pantalla", "Televisor", "2024-06-13", "Finalizado");
dataOriginalPostReparacion(0, "Reparación de plaqueta", "Televisor", "2024-06-14", "Finalizado");
dataOriginalPostReparacion(1, "Instalación de software", "Televisor", "2024-06-15", "Finalizado");
dataOriginalPostReparacion(2, "Reparación", "Microondas", "2024-06-14", "Finalizado");

let numReparacionesQueryMaxOld = 0;

const mostrarPersonasReparacionesConCache = (req, res) => {
    const numReparacionesQueryMaxNew = parseInt(req.query.reparaciones);
    const cacheKey = `dataReparaciones-${numReparacionesQueryMaxNew}`;
    const cacheOldKey = 'numReparacionesQueryMaxOld';

    // Obtener el valor de numReparacionesQueryMaxOld del caché
    let cachedOldValue = myCache.get(cacheOldKey);
    if (cachedOldValue === undefined) {
        cachedOldValue = 2;
        myCache.set(cacheOldKey, cachedOldValue);
    }
    numReparacionesQueryMaxOld = cachedOldValue;

    // Intenta obtener los datos del caché usando la clave
    const cachedData = myCache.get(cacheKey);

    if (cachedData) {
        console.log(`Cache encontrado para la clave: ${cacheKey}`);
        return res.json(cachedData);
    }

    console.log(`Cache no encontrado para la clave: ${cacheKey}`);
    // Si no hay datos en el caché, realiza tu lógica normal para obtener los datos
    let dataObtenidaOriginalDB;

    if (dataLocalGET().personas.length === 0) {
        numReparacionesQueryMaxOld = numReparacionesQueryMaxNew;
        dataObtenidaOriginalDB = dataOriginalGET(0, numReparacionesQueryMaxOld);

        myCache.set(cacheKey, dataObtenidaOriginalDB); // Almacena los datos en el caché
        myCache.set(cacheOldKey, numReparacionesQueryMaxOld); // Almacena el valor de numReparacionesQueryMaxOld en el caché
        console.log(`Datos almacenados en cache para la clave: ${cacheKey}`);
        console.log(`Valor almacenado en cache para la clave: ${cacheOldKey}`);
        return res.json(dataObtenidaOriginalDB);
    } else {
        if (numReparacionesQueryMaxNew > numReparacionesQueryMaxOld) {
            dataObtenidaOriginalDB = dataOriginalGET(0, numReparacionesQueryMaxNew);

            numReparacionesQueryMaxOld = numReparacionesQueryMaxNew;

            myCache.set(cacheKey, dataObtenidaOriginalDB); // Almacena los datos en el caché
            myCache.set(cacheOldKey, numReparacionesQueryMaxOld); // Almacena el valor de numReparacionesQueryMaxOld en el caché
            console.log(`Datos almacenados en cache para la clave: ${cacheKey}`);
            console.log(`Valor almacenado en cache para la clave: ${cacheOldKey}`);
            return res.json(dataObtenidaOriginalDB);
        } else {
            myCache.set(cacheKey, dataObtenidaOriginalDB); // Almacena los datos en el caché
            myCache.set(cacheOldKey, numReparacionesQueryMaxOld); // Almacena el valor de numReparacionesQueryMaxOld en el caché
            console.log(`Datos almacenados en cache para la clave: ${cacheKey}`);
            console.log(`Valor almacenado en cache para la clave: ${cacheOldKey}`);
            return res.json(dataObtenidaOriginalDB);
        }
    }
};

const dashboardPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'components', 'dashboard', 'dashboard.htm'));
}

const getNumReparacionesQueryMaxOld = (req, res) => {
    const cacheKey = 'numReparacionesQueryMaxOld';
    const cachedValue = myCache.get(cacheKey);

    if (cachedValue !== undefined) {
        console.log(`Cache encontrado para la clave: ${cacheKey}`);
        return res.json({ numReparacionesQueryMaxOld: cachedValue });
    } else {
        console.log(`Cache no encontrado para la clave: ${cacheKey}`);
        myCache.set(cacheKey, numReparacionesQueryMaxOld);
        return res.json({ numReparacionesQueryMaxOld });
    }
};

module.exports = {
    dashboardPage,
    mostrarPersonasReparacionesConCache,
    dataOriginalPostPersona,
    dataOriginalPostReparacion,
    getNumReparacionesQueryMaxOld
}