//Teniendo en cuenta todo lo de abajo podemos concluir que en realidad no estamos consultando /reparaciones en sí
//sino que estamos consultando personas, si consultamos por reparaciones?=3
//nos traerá 3 personas, pero mi objetivo sobre todo esto, es que pueda traerme las reparaciones de 3 personas
//Ya que el problema a todo esto es que cuando lo pensé en desarrollar, es que una persona puede traer más de 2 reparaciones
//y por ahí lo mejor sería mostrar más que 2 reparaciones solamente (veríamos solo 1 persona), en cambio, si lo paso como 2 personas
//podremos ver más información sobre otras reparaciones, lo que no cuesta mucho ya que estamos en sí consultando a la base de datos
//por ambas tablas, lo cual sí o sí tendrán que traer más información. Por ahí se puede explicar mejor :)

const path = require('path');

const { myCache } = require('../middlewares/cache');

//db "Real"
const { 
    dataOriginalPostPersona, dataOriginalPostReparacion,
    dataOriginalGET
} = require('../data/db');

let numReparacionesQueryMaxOld = 0;
let puedeSeguirConsultandoPorMas = true;

const mostrarPersonasReparacionesConCache = (req, res) => {
    const numReparacionesQueryMaxNew = parseInt(req.query.reparaciones);
    const cacheKey = `dataReparaciones`;
    const cacheOldKey = 'numReparacionesQueryMaxOld';

    //console.log(`numReparacionesQueryMaxOld: ${myCache.get(cacheOldKey)}`)

    numReparacionesQueryMaxOld = myCache.get(cacheOldKey) || 0;
    let cachedData = myCache.get(cacheKey) || { personas: [], reparaciones: [] };

    // Verifica si la consulta solicitada ya está completamente en el caché
    if (numReparacionesQueryMaxNew <= numReparacionesQueryMaxOld && cachedData.personas.length > 0) {
        //console.log(`Cache encontrado para la clave: ${cacheKey}`);
        // Devuelve directamente las propiedades personas y reparaciones
        return res.json(cachedData);
    }

    let newData = null;

    // Realiza la consulta a la base de datos solo para los datos faltantes desde numReparacionesQueryMaxOld hasta numReparacionesQueryMaxNew
    if (puedeSeguirConsultandoPorMas) {
        newData = dataOriginalGET(numReparacionesQueryMaxOld, numReparacionesQueryMaxNew);

        if (newData.personas.length > 0) {

            if (newData.personas.length < 50) {
                puedeSeguirConsultandoPorMas=false;
            }

            // Concatena las personas y reparaciones nuevas con las existentes en el caché
            cachedData.personas = [...cachedData.personas, ...newData.personas];
            cachedData.reparaciones = [...cachedData.reparaciones, ...newData.reparaciones];

            // Actualiza numReparacionesQueryMaxOld con el nuevo valor máximo consultado
            numReparacionesQueryMaxOld = numReparacionesQueryMaxNew;

            // Almacena los nuevos datos en el caché junto con el nuevo valor de numReparacionesQueryMaxOld
            myCache.set(cacheKey, cachedData);
            myCache.set(cacheOldKey, numReparacionesQueryMaxOld);

            //console.log(`Datos almacenados en cache para la clave: ${cacheKey}`);
            //console.log(`Valor almacenado en cache para la clave: ${cacheOldKey}`);

            // Devuelve directamente las propiedades personas y reparaciones
            return res.json(cachedData);

        } else if (newData.personas.length === 0) {
            puedeSeguirConsultandoPorMas=false;

            //console.log(`llegaste al tope de consultas, no hay más datos para obtener, consultas max: ${cachedData.personas.length}`)

            return res.json(cachedData);
            
        } else {
            //Puede que esté vacío.
            return res.json(cachedData);
        }
    } else {
        return res.json(cachedData);
    }
};

const dashboardPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'components', 'dashboard', 'dashboard.htm'));
}

function devolverNumReparacionesQueryMaxOld(req, res) {
    if (numReparacionesQueryMaxOld==0 || numReparacionesQueryMaxOld==null) {
        return res.json({"numReparacionesQueryMaxOld": 50});
    } else {
        return res.json({"numReparacionesQueryMaxOld": numReparacionesQueryMaxOld});
    }
}

module.exports = {
    dashboardPage,
    mostrarPersonasReparacionesConCache,
    dataOriginalPostPersona,
    dataOriginalPostReparacion,
    devolverNumReparacionesQueryMaxOld
}