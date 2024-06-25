const path = require('path');

const { 
    dataOriginalPostPersona, dataOriginalPostReparacion
} = require('../dashboard');

const { htmlFormEnviado, editarAgregarReparacion } = require('./crud_form_post_pressed');

//db "Local"
const { 
    dataLocalAgregar,
    dataLocalSearchPorPersonaId
} = require('../../data/data');

//db "Real"
const { 
    verificarPersonaExisteDataBaseOriginal, buscarPersonaDataBaseOriginal
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

        //Caso 1)
        //Debo buscar la persona por el id
        //Encontrar su DNI
        //Asignarle al editarAgregarReparacion(dni de la persona encontrada)
        //Se busca por la dataLocal ya que es por que apretamos en el botón "Editar" de una persona
        //que no tenía ninguna reparación.

        //Caso 2)
        //En caso de que no se encuentre, mostrar mensaje que no se encontró una persona con 'id' especificado
        //Este caso es muy raro que suceda, ya que no va a ser común que ingrese el 'id' de una persona por la url
        //Así que no me la complicaré mucho, en caso de que se implemente, se debería conectar a la base de datos
        //o dataOriginal para poder consultar si es que hay una persona que coincida con el id especificado

        //Ejemplo: Si en dataLocal hay personas y reparaciones, pero de las personas el máximo 'id' disponible es 4
        //Entonces, si buscamos por el número 500, obviamente no va a estar en la base de datos local (dataLocal)
        //Pero sí tendremos que consultar a la base de datos original (dataOriginal), y realizar una consulta
        //respecto a devolver la persona que coincida con el 'id' buscado.

        //Al fin y al cabo, implementaré el Caso 1)

        const personaIdEnParams = req.query.persona_id;

        if (personaIdEnParams===undefined || personaIdEnParams==='undefined') {
            res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'agregar', 'agregar_reparacion.htm'));
        } else {
            //Busco persona en dataLocal y devuelvo su dni
            const nombrePersonaBuscadaPorIdEnDataLocal = dataLocalSearchPorPersonaId(personaIdEnParams)

            if (nombrePersonaBuscadaPorIdEnDataLocal.encontrada==false) {
                res.send(`No se encontró una persona con ID: ${personaIdEnParams}`);
            } else {
                res.send(editarAgregarReparacion(nombrePersonaBuscadaPorIdEnDataLocal.personaEncontrada[0].nombre))
            }
        }
    },
    agregarAmbosGET: (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'agregar', 'agregar_ambos.htm'));
    },
    agregarPersonaPOST: (req, res) => {
        try {
            const { nombre, direccion, telefono, email } = req.body;

            //Primero hay que verificar si la persona no está dentro de la base de datos consultando
            //si es que su nombre y apellido ya está incluido
            if (!verificarPersonaExisteDataBaseOriginal(nombre)) {

                //Subo a la base de datos Original (base de datos desplegada)
                const personaCreada = dataOriginalPostPersona(
                    nombre, 
                    direccion, 
                    telefono, 
                    email
                );

                //Subo a la base de datos local
                dataLocalAgregar.dataLocalPostUnaPersona(personaCreada);

                return res.send(htmlFormEnviado("Añadir Persona", "Se creo la persona correctamente.", "redirectToDashboard"))
            } else {
                return res.send(htmlFormEnviado("Añadir Persona", `Ya existe una persona con Nombre y Apellido ${nombre}`, "goBack"))
            }

        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    agregarReparacionPOST: (req, res) => {
        try {
            const { nombre, descripcion, tipo, fecha, estado } = req.body;

            //Primero hay que verificar si la persona no está dentro de la base de datos consultando
            //si es que su dni ya está incluido

            if (verificarPersonaExisteDataBaseOriginal(nombre)) {
                const personaEncontrada = buscarPersonaDataBaseOriginal(nombre);
            
                if (personaEncontrada) {
                    const reparacionCreada = dataOriginalPostReparacion(
                        personaEncontrada.id,
                        descripcion,
                        tipo,
                        fecha,
                        estado
                    );
            
                    // Subo a la base de datos local
                    dataLocalAgregar.dataLocalPostUnaReparacion(reparacionCreada);
            
                    return res.send(htmlFormEnviado("Añadir Reparacion", "Se creó la reparación correctamente.", "redirectToDashboard"));
                } else {
                    return res.send(htmlFormEnviado("Añadir Reparacion", `No se encontró una persona con Nombre y Apellido: ${nombre}`, "goBack"));
                }
            } else {
                return res.send(htmlFormEnviado("Añadir Reparacion", `No se encontró una persona con Nombre y Apellido: ${nombre}`, "goBack"));
            }

        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    agregarAmbosPOST: (req, res) => {
        try {
            const { descripcion, tipo, fecha, estado, nombre, direccion, telefono, email } = req.body;
    
            // Verificar si la persona NO existe en la base de datos original
            if (!verificarPersonaExisteDataBaseOriginal(nombre)) {
                // Si la persona NO existe, crearla y obtener el objeto persona creado
                //Subo a la base de datos Original (base de datos desplegada)
                const personaCreada = dataOriginalPostPersona(
                    nombre, 
                    direccion, 
                    telefono, 
                    email
                );

                dataLocalAgregar.dataLocalPostUnaPersona(personaCreada);

                const reparacionCreada = dataOriginalPostReparacion(
                    personaCreada.id,
                    descripcion,
                    tipo,
                    fecha,
                    estado
                );

                dataLocalAgregar.dataLocalPostUnaReparacion(reparacionCreada);

                return res.send(htmlFormEnviado("Añadir Ambos", "Se creó la persona y la reparación correctamente.", "redirectToDashboard"));

            } else {
                return res.send(htmlFormEnviado("Añadir Ambos", `No se pudo encontrar ni crear una persona con Nombre y Apellido: ${nombre}`, "goBack"));
            }
    
        } catch (error) {
            res.json({ msg: error.msg });
        }
    }
}

const verificarDisponibilidadNombreApellido = (req, res) => {
    const nombreApellido = req.query.nombre;

    if (!nombreApellido) {
        return res.status(400).send({ error: 'Nombre y Apellido son requeridos' });
    }

    try {
        const exists = verificarPersonaExisteDataBaseOriginal(nombreApellido);
        
        res.send({ exists });
    } catch (error) {
        res.status(500).send({ error: 'Error al verificar el nombre y apellido' });
    }
}

module.exports = {
    dashboardAgregar,
    verificarDisponibilidadNombreApellido
}