const path = require('path');

const { 
    dataOriginalPostPersona
} = require('../dashboard');

//db "Local"
const { 
    verificarPersonaExisteDataBaseLocal,
    dataLocalAgregar
} = require('../../data/data');

//db "Real"
const { 
    verificarPersonaExisteDataBaseOriginal
} = require('../../data/db');

const mensajeHtml = (mensaje) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Añadir</title>
        </head>
            <body>
                <div class="mensaje-box">
                    <p>${mensaje}</p>

                    <button class="boton_agregar" onclick="redirectToDashboard()">Volver</button>
                </div>

                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f0f0f0;
                    }
                    
                    .mensaje-box {
                        background-color: #fff;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        max-width: 400px;
                        width: 100%;
                        text-align: center;
                    }

                    p {
                        margin: 0 0 20px 0;
                        font-size: 18px;
                        color: #333;
                    }

                    .boton_agregar {
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    }
                    
                    .boton_agregar:hover {
                        background-color: #45a049;
                    }
                </style>

                <script>
                    function redirectToDashboard() {
                        window.location.href = "/dashboard/reparaciones?reparaciones=10";
                    }
            </script>
            </body>
        </html>
    `;
};

const dashboardAgregar = {
    agregarFormGET: (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'agregar', 'agregar_form.htm'));
    },
    agregarPersonaGET: (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'agregar', 'agregar_persona.htm'));
    },
    agregarReparacionGET: (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'agregar', 'agregar_reparacion.htm'));
    },
    agregarAmbosGET: (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'agregar', 'agregar_ambos.htm'));
    },
    agregarPersonaPOST: (req, res) => {
        try {
            const { nombre, direccion, telefono, email, dni } = req.body;

            //console.log(nombre, direccion, telefono, email, dni)

            //Primero hay que verificar si la persona no está dentro de la base de datos consultando
            //si es que su dni ya está incluido
            if (!verificarPersonaExisteDataBaseOriginal(dni)) {

                //Subo a la base de datos Original (base de datos desplegada)
                const personaCreada = dataOriginalPostPersona(
                    nombre, 
                    direccion, 
                    telefono, 
                    email, 
                    dni
                );

                //console.log(personaCreada);

                //Subo a la base de datos local
                if (!verificarPersonaExisteDataBaseLocal(dni)) {

                    dataLocalAgregar.dataLocalPostUnaPersona(personaCreada.id, 
                        personaCreada.nombre, 
                        personaCreada.direccion, 
                        personaCreada.telefono, 
                        personaCreada.email, 
                        personaCreada.dni
                    )

                    return res.send(mensajeHtml("Se creo la persona correctamente."))
                } else {
                    return res.send(mensajeHtml("Se creo la persona en la base de datos"))
                }
            } else {
                return res.send(mensajeHtml(`Ya existe una persona con DNI: ${dni}`))
            }

        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    agregarReparacionPOST: (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'agregar', 'agregar_reparacion.htm'));
    },
    agregarAmbosPOST: (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'agregar', 'agregar_ambos.htm'));
    }
}

module.exports = {
    dashboardAgregar
}