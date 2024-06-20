const path = require('path');

const { 
    dataOriginalPostPersona, dataOriginalPostReparacion
} = require('../dashboard');

const { html } = require('./crud_form_post_pressed');

//db "Local"
const { 
    dataLocalAgregar
} = require('../../data/data');

//db "Real"
const { 
    verificarPersonaExisteDataBaseOriginal, encontrarPersonaDataBaseOriginalPorDNI
} = require('../../data/db');

//La función agregar Persona, agregar Reparacion, agregar Ambos
//Lo que hace es que a la dataOriginal, se asigna una nueva persona / reparacion / ambos a la base de datos
//Mientras que al mismo tiempo, se asigna la persona nueva a dataLocal solo sí es que no está asignada
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

                //Subo a la base de datos local
                dataLocalAgregar.dataLocalPostUnaPersona(
                    personaCreada.id, 
                    personaCreada.nombre, 
                    personaCreada.direccion, 
                    personaCreada.telefono, 
                    personaCreada.email, 
                    personaCreada.dni
                );

                return res.send(html("Añadir Persona", "Se creo la persona correctamente.", "redirectToDashboard"))
            } else {
                return res.send(html("Añadir Persona", `Ya existe una persona con DNI: ${dni}`, "goBack"))
            }

        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    agregarReparacionPOST: (req, res) => {
        try {
            const { dni, descripcion, tipo, fecha, estado } = req.body;

            //console.log(dni, descripcion, tipo, fecha, estado)

            //Primero hay que verificar si la persona no está dentro de la base de datos consultando
            //si es que su dni ya está incluido
            if (verificarPersonaExisteDataBaseOriginal(dni)) {

                //Primero tengo que buscar la persona por su dni en la base de datos (dataOriginal)
                //Una vez obtenga esa persona por el dni, ya que se que existe, tendré que obtener su 'id', y asignarlo
                //a la reparación nueva que realizaré
                const personaEncontrada = encontrarPersonaDataBaseOriginalPorDNI(dni);

                const reparacionCreada = dataOriginalPostReparacion(
                    personaEncontrada.id, 
                    descripcion, 
                    tipo, 
                    fecha, 
                    estado
                );

                //Subo a la base de datos local
                dataLocalAgregar.dataLocalPostUnaReparacion(
                    reparacionCreada.id,
                    personaEncontrada.id, 
                    descripcion, 
                    tipo, 
                    fecha, 
                    estado
                );

                return res.send(html("Añadir Reparacion", "Se creo la reparacion correctamente.", "redirectToDashboard"))

            } else {
                return res.send(html("Añadir Reparacion", `No existe una persona con DNI: ${dni}`, "goBack"))
            }

        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    agregarAmbosPOST: (req, res) => {
        try {
            const { dni, descripcion, tipo, fecha, estado, nombre, direccion, telefono, email } = req.body;
    
            // Verificar si la persona NO existe en la base de datos original
            if (!verificarPersonaExisteDataBaseOriginal(dni)) {
                // Si la persona NO existe, crearla y obtener el objeto persona creado
                const personaCreada = dataOriginalPostPersona(
                    nombre, 
                    direccion, 
                    telefono, 
                    email, 
                    dni
                );
    
                // Subir a la base de datos local la persona creada
                dataLocalAgregar.dataLocalPostUnaPersona(
                    personaCreada.id,
                    personaCreada.nombre,
                    personaCreada.direccion,
                    personaCreada.telefono,
                    personaCreada.email,
                    personaCreada.dni
                );

                if (personaCreada) {
                    // Crear la reparación utilizando el ID de la persona encontrada
                    const reparacionCreada = dataOriginalPostReparacion(
                        personaCreada.id,
                        descripcion,
                        tipo,
                        fecha,
                        estado
                    );
        
                    // Subir a la base de datos local la reparación creada
                    dataLocalAgregar.dataLocalPostUnaReparacion(
                        reparacionCreada.id,
                        personaCreada.id,
                        descripcion,
                        tipo,
                        fecha,
                        estado
                    );
        
                    return res.send(html("Añadir Ambos", "Se creó la persona y la reparación correctamente.", "redirectToDashboard"));
                } else {
                    return res.send(html("Añadir Ambos", `No se pudo encontrar ni crear una persona con DNI: ${dni}`, "goBack"));
                }
            }
    
        } catch (error) {
            res.json({ msg: error.msg });
        }
    }
}

function verificarPersonaExisteDataBaseOriginalDNI(dni) {
    return new Promise((resolve, reject) => {
        const dniExists = verificarPersonaExisteDataBaseOriginal(dni);
        resolve(dniExists);
    });
}

const verificarDisponibilidadDNI = async (req, res) => {
    const dni = req.query.dni;
    if (!dni) {
        return res.status(400).send({ error: 'DNI es requerido' });
    }

    try {
        const exists = await verificarPersonaExisteDataBaseOriginalDNI(dni);
        res.send({ exists });
    } catch (error) {
        res.status(500).send({ error: 'Error al verificar el DNI' });
    }
}

module.exports = {
    dashboardAgregar,
    verificarDisponibilidadDNI
}