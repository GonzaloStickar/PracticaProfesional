//mi objetivo es que cuando se realiza la consulta
//por ejemplo
//primera consulta es de 3 reparaciones
//entonces me va a mostrar 3 reparaciones
//pero yo necesito guardar ese número 3, ya que los datos que YA RECIBÍ, los voy a guardar también
//una vez que realice una consulta nueva, por ejemplo, consulte respecto a 5
//use los 3 que ya estaban y agarre los datos entre el 3 y el 5

//Paso 1)
//Para realizar el objetivo
//Primero agarro el número, supongamos que es 3, entonces lo guardo
//Una vez guardado, miro mi data y chequeo si el lenght de data es menor a ese número
//Si es menor, significa que en data (nuestra base de datos "física" va a tener menos datos de los que deseamos obtener)
//Entonces, resumiendo esto:
//Tengo "dataBaseReutilizable.lenght=0" (siempre va a ser así, no va a compartirse la base de datos), "numReparacionesQueryMax=3"
//Una vez hecho eso, si dataBaseReutilizable.lenght es menor a 3, entonces se realiza la consulta
//GUARDO LA INFORMACIÓN QUE OBTENGO ---> en dataBaseReutilizable

//Paso 2)
//Una vez que tengo la información en dataBaseReutilizable
//Viene la segunda parte:
//nueva consulta con "numReparacionesQueryMax=2",
//Entonces con esa nueva consulta, puedo decir que
//Si dataBaseReutilizable.lenght >= numReparacionesQueryMax, entonces que devuelva del dato 0 (el principio) hasta el numReparacionesQueryMax
//que en ese caso es 2

//Paso 3)
//En caso de que se haga lo mismo que el paso 2) pero con una consulta diferente (mayor)
//nueva consulta con "numReparacionesQueryMax=5",
//Entonces en este caso hay que repetir lo que hicimos en el paso 1) pero DIFERENTE consulta
//La diferencia va a estar en:
//Hacer la consulta completa y hacer una consulta cerrada, ejemplo:
//Si nosotros en dataBaseReutilizable tenemos ya 3 datos, entonces, que haga la consulta entre el dato 4 y 5
//Que traiga de la consulta el dato 4 y 5
//GUARDO LA INFORMACIÓN QUE OBTENGO ---> en dataBaseReutilizable (en este caso, añado la información nueva que se consultó)
//Se guarda los nuevos datos (4 y 5),
//Así sucesivamente con datos más grandes de consulta (si tenemos ya 300 en dataBaseReutilizable y consultamos 500)
//Entonces va a suceder lo mismo, se van a consultar para que traiga entre el 301 y el 500 y se agreguen a la dataBaseReutilizable
//que está localmente para poder ser reutilizada y no tener que consultar una y otra vez y no gastar la memoria disponible de DB.

//Paso 4)
//Modularizar las distribuciónes de las consultas si es que se van a hacer nuevas consultas / diferentes
//Modularizar base de datos locales si es que vamos a trabajar sobre personas y reparaciones
//Me refiero a que, haya una base de datos local reutilizable para Personas, y otra base de datos local reutilizable para reparaciones.

const fs = require('fs');
const path = require('path');

const { dataLocal } = require('../data/data')
const { agregarPersonaLocalDB, agregarReparacionLocalDB } = require('../data/data')

//Suponiendo que es toda nuestra DB
agregarPersonaLocalDB(1, "Juan Pérez", "Calle Falsa 123", "123-456-7890", "juan.perez@example.com", "11.222.333");
agregarPersonaLocalDB(2, "María Gómez", "Avenida Siempreviva 456", "098-765-4321", "maria.gomez@example.com", "12.222.333");
agregarPersonaLocalDB(3, "Carlos Díaz", "Boulevard del Sol 789", "111-222-3333", "carlos.diaz@example.com", "13.222.333");

agregarReparacionLocalDB(1, 1, "Cambio de pantalla", "Electrónica", "2024-06-13T10:00:00Z", "Completado");
agregarReparacionLocalDB(2, 2, "Reparación de plaqueta", "Electrónica", "2024-06-14T12:30:00Z", "En progreso");
agregarReparacionLocalDB(3, 3, "Instalación de software", "Informática", "2024-06-15T15:45:00Z", "Pendiente");

let numReparacionesQueryMaxOld = 0;

const mostrarPersonasReparaciones = (req, res) => {
    const numReparacionesQueryMaxNew = parseInt(req.query.reparaciones);

    //console.log(dataLocal.reparaciones.length);

    if (numReparacionesQueryMaxNew>0 && numReparacionesQueryMaxNew<=50) {
        numReparacionesQueryMaxOld = numReparacionesQueryMaxNew;
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

    //console.log(numReparacionesQueryMaxOld);

    //Primero chequear que 'numReparacionesQueryMaxNew' sea mayor a '1' (o '0') y sea menor a '50' (o '49').
    //Quiero decir, que la consulta sea de mínimo 1, y que no sea mayor a 50.
    
        //if (dataLocal.length) == 0 {
            //Set nuevo numero Máximo de query
            //numReparacionesQueryMaxOld = numReparacionesQueryMaxNew;

            //Conseguir data
            //const dataObtenida = dataGetMinMax(0, numReparacionesQueryMaxOld);
            //Hay que ver si es 0 o 1, y si hay que poner 50 o 49 (Si resto -1 o no)

            //Separar personas y reparaciones
            //const personas = [];
            //const reparaciones = [];
            
            //añadir a dataLocal personas y reparaciones
            //dataLocalPostPersona();
            //dataLocalPostReparacion();
        //} else {
            //if (numReparacionesQueryMaxNew>numReparacionesQueryMaxOld) {
                //numReparacionesQueryMaxOld=numReparacionesQueryMaxNew;

                //Conseguir data entre rango de data.lenght y numReparacionesQueryMaxOld
                //const dataObtenida = dataGetMinMax(data.length, numReparacionesQueryMaxOld);
                //Hay que ver si es data.length o "- 1", y si hay que poner numReparacionesQueryMaxOld o "- 1" (Si resto -1 o no)

                //Separar personas y reparaciones
                //const personas = [];
                //const reparaciones = [];
                
                //añadir a dataLocal personas y reparaciones
                //dataLocalPostPersona();
                //dataLocalPostReparacion();
            //} else {
                //Mostrar dataLocal;
                //Ya está disponible (no hace falta hacer ninguna nueva consulta, ya que el tamaño de la consulta
                //es equivalente al tamaño de dataLocal)
            //}
        //} else {
        //mostrar mensaje de intervalo entre 1 consulta y 50.
    //}

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
                                    <button class="btn btn-info mr-2" onclick="editar(${persona.id})">Editar</button>
                                    <button class="btn btn-danger" onclick="eliminar(${persona.id})">Eliminar</button>
                                </div>
                                <button class="btn btn-primary mt-2" onclick="redirectToInforme(${persona.id})">Ver Informe</button>
                            </div>
                        </td>
                    </tr>`;
                
                // Agregar la fila al bloque de HTML dinámico
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


module.exports = {
    mostrarPersonasReparaciones
}