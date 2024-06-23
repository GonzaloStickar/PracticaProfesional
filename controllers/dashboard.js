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

dataOriginalPostReparacion(0, "Cambio de pantalla", "Televisor", "2024-06-13T10:00:00Z", "Finalizado");
dataOriginalPostReparacion(0, "Reparación de plaqueta", "Televisor", "2024-06-14T12:30:00Z", "Finalizado");
dataOriginalPostReparacion(1, "Instalación de software", "Televisor", "2024-06-15T15:45:00Z", "Finalizado");
dataOriginalPostReparacion(2, "Reparación", "Microondas", "2024-06-14T12:30:00Z", "Finalizado");

let numReparacionesQueryMaxOld = 0;
let dataObtenidaOriginalDB = null;

const mostrarPersonasReparaciones = (req, res) => {

    const numReparacionesQueryMaxNew = parseInt(req.query.reparaciones);

    if (dataLocalGET().personas.length==0) {
        
        numReparacionesQueryMaxOld = numReparacionesQueryMaxNew;

        dataObtenidaOriginalDB = dataOriginalGET(1, numReparacionesQueryMaxOld);

        dataLocalPostPersonas(dataObtenidaOriginalDB.personas);
        dataLocalPostReparaciones(dataObtenidaOriginalDB.reparaciones);

        return res.json(dataLocalGET(1, numReparacionesQueryMaxOld));
    }
    else {

        //Test con 1 y 3 de numReparacionesQuery
        if (numReparacionesQueryMaxNew > numReparacionesQueryMaxOld) {

            dataObtenidaOriginalDB = dataOriginalGET(numReparacionesQueryMaxOld + 1, numReparacionesQueryMaxNew);
            
            dataLocalPostPersonas(dataObtenidaOriginalDB.personas);
            dataLocalPostReparaciones(dataObtenidaOriginalDB.reparaciones);
            
            numReparacionesQueryMaxOld = numReparacionesQueryMaxNew;

            return res.json(dataLocalGET(1, numReparacionesQueryMaxOld));
        }
        else {
            return res.json(dataLocalGET(1, numReparacionesQueryMaxNew));
        }
    }
}

const dashboardPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'components', 'dashboard', 'dashboard.htm'));
}

module.exports = {
    dashboardPage,
    mostrarPersonasReparaciones,
    dataOriginalPostPersona,
    dataOriginalPostReparacion
}