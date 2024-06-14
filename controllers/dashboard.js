//Teniendo en cuenta todo lo de abajo podemos concluir que en realidad no estamos consultando /reparaciones en sí
//sino que estamos consultando personas, si consultamos por reparaciones?=3
//nos traerá 3 personas, pero mi objetivo sobre todo esto, es que pueda traerme las reparaciones de 3 personas
//Ya que el problema a todo esto es que cuando lo pensé en desarrollar, es que una persona puede traer más de 2 reparaciones
//y por ahí lo mejor sería mostrar más que 2 reparaciones solamente (veríamos solo 1 persona), en cambio, si lo paso como 2 personas
//podremos ver más información sobre otras reparaciones, lo que no cuesta mucho ya que estamos en sí consultando a la base de datos
//por ambas tablas, lo cual sí o sí tendrán que traer más información. Por ahí se puede explicar mejor :)

const fs = require('fs');
const path = require('path');

//dataLocal
const { 
    dataLocalPostPersona, dataLocalPostReparacion,
    dataLocalGET
} = require('../data/data')

//db "Real"
const { 
    dataOriginalPostPersona, dataOriginalPostReparacion,
    dataOriginalGET
} = require('../data/db')

//Suponiendo que es toda nuestra DB
//Para seleccionar y cambiar todos a la vez, apretar Ctrl + D (y selecciona "agregarPersonaLocalDB" los 3 por igual y cambiamos los 3 a la vez).
dataOriginalPostPersona(1, "Juan Pérez", "Calle Falsa 123", "123-456-7890", "juan.perez@example.com", "11.222.333");
dataOriginalPostPersona(2, "María Gómez", "Avenida Siempreviva 456", "098-765-4321", "maria.gomez@example.com", "12.222.333");
dataOriginalPostPersona(3, "Carlos Díaz", "Boulevard del Sol 789", "111-222-3333", "carlos.diaz@example.com", "13.222.333");

dataOriginalPostReparacion(1, 1, "Cambio de pantalla", "Electrónica", "2024-06-13T10:00:00Z", "Completado");
dataOriginalPostReparacion(2, 1, "Reparación de plaqueta", "Electrónica", "2024-06-14T12:30:00Z", "En progreso");
dataOriginalPostReparacion(3, 2, "Instalación de software", "Informática", "2024-06-15T15:45:00Z", "Pendiente");
dataOriginalPostReparacion(4, 3, "Reparación", "Electrónica", "2024-06-14T12:30:00Z", "En progreso");

let numReparacionesQueryMaxOld = 0;

const mostrarPersonasReparaciones = (req, res) => {

    const numReparacionesQueryMaxNew = parseInt(req.query.reparaciones);

    let dataLocal = null;
    let dataObtenidaOriginalDB = null;

    if (numReparacionesQueryMaxNew>0 && numReparacionesQueryMaxNew<=50) {
        
        //Siempre va a estar vacío por primera vez
        dataLocal = dataLocalGET();

        if (dataLocal.personas.length==0) {
            
            numReparacionesQueryMaxOld = numReparacionesQueryMaxNew;

            dataObtenidaOriginalDB = dataOriginalGET(1, numReparacionesQueryMaxOld);

            dataLocalPostPersona(dataObtenidaOriginalDB.personas);
            dataLocalPostReparacion(dataObtenidaOriginalDB.reparaciones);

            dataLocal = dataLocalGET(1, numReparacionesQueryMaxOld);
        }
        else {

            //Test con 1 y 3 de numReparacionesQuery
            if (numReparacionesQueryMaxNew > numReparacionesQueryMaxOld) {

                let dataObtenidaOriginalDB = dataOriginalGET(numReparacionesQueryMaxOld + 1, numReparacionesQueryMaxNew);
                
                dataLocalPostPersona(dataObtenidaOriginalDB.personas);
                dataLocalPostReparacion(dataObtenidaOriginalDB.reparaciones);
                
                numReparacionesQueryMaxOld = numReparacionesQueryMaxNew;

                dataLocal = dataLocalGET(1, numReparacionesQueryMaxOld);
            }
            else {
                dataLocal = dataLocalGET(1, numReparacionesQueryMaxNew);
            }
        }
    }
    else {
        return res.status(401).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Dashboard</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <h1>Cuenta</h1>
                <form action="/logout" method="POST">
                    <button type="submit">Cerrar sesión</button>
                </form>

            <div id="error_message">
                No se puede consultar por 0 o más de 50
            </div>
            <style>
                #error_message {
                    text-align: center;
                    color: red;
                    margin-top: 10px;
                }
            </style>
            </body>
            </html>
        `);
    }

    let dataAniadir = '';

    dataLocal.personas.forEach(persona => {
        // Buscar las reparaciones de esta persona
        const reparacionesDePersona = dataLocal.reparaciones.filter(reparacion => reparacion.persona_id === persona.id);

        // Si la persona tiene reparaciones, agregar filas para cada una
        if (reparacionesDePersona.length > 0) {
            reparacionesDePersona.forEach((reparacion) => {
                const fila = `
                    <tr>
                        <td>${persona.nombre}</td>
                        <td>${persona.direccion}</td>
                        <td>${persona.telefono}</td>
                        <td>${persona.email}</td>
                        <td>${persona.dni}</td>
                        <td>${reparacion.descripcion}</td>
                        <td>${reparacion.tipo}</td>
                        <td>${reparacion.fecha}</td>
                        <td>${reparacion.estado}</td>
                        <td>
                            <div class="d-flex flex-column">
                                <div class="d-flex">
                                    <button class="btn btn-info mr-2" onclick="redirectToEditar(${persona.id})">Editar</button>
                                    <button class="btn btn-danger" onclick="eliminar(${persona.id})">Eliminar</button>
                                </div>
                                <button class="btn btn-primary mt-2" onclick="redirectToInforme(${persona.id})">Ver Informe</button>
                            </div>
                        </td>
                    </tr>`;

                dataAniadir += fila;
            });
        }
    });

    fs.readFile(path.join(__dirname, '..', 'components', 'dashboard.htm'), 'utf8', (err, html) => {
        if (err) {
            console.error('Error al leer el archivo HTML:', err);
            return res.status(500).send('Error interno del servidor');
        }

        const htmlWithData = html.replace('<tbody id="dynamicTableBody"></tbody>', `<tbody id="dynamicTableBody">${dataAniadir}</tbody>`);

        // Enviar el HTML modificado al cliente
        res.send(htmlWithData);
    });
}

const dashboardPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'components', 'dashboard.htm'));
}

const dashboardCRUD = {
    agregar: (req, res) => {
        //res.send("Estoy en agregar")

        res.sendFile(path.join(__dirname, '..', 'components', 'dashboard_agregar.htm'));
    },
    buscar: (req,res) => {
        res.send("buscar");
    },
    editar: (req,res) => {
        res.send("editar");
    },
    informe: (req,res) => {
        res.send("informe");
    }
}

module.exports = {
    dashboardPage,
    mostrarPersonasReparaciones,
    dashboardCRUD
}