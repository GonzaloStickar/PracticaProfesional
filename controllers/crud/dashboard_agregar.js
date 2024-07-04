const path = require('path');

const { 
    dataOriginalPostPersona, dataOriginalPostReparacion
} = require('../dashboard');

const { myCache } = require('../../middlewares/cache');

const { htmlFormEnviado, editarAgregarReparacion } = require('./crud_form_post_pressed');

//db "Real"
const { 
    buscarPersonaDataBaseOriginal
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



        //Todo lo de acá abajo está utilizado para cuando se edita la persona y no tiene reparación
        //En caso de que no tenga reparación, se le puede agregar una reparación
        //A partir del botón Editar
        const personaIdEnParams = req.query.persona_id;

        if (personaIdEnParams === undefined || personaIdEnParams === 'undefined') {
            res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'agregar', 'agregar_reparacion.htm'));
        } else {
            // Buscar persona en cachedData y devolver su nombre
            const cachedData = myCache.get('dataReparaciones'); // Asegúrate de ajustar la clave según tu implementación

            if (cachedData && cachedData.personas) {
                const personaEncontrada = cachedData.personas.find(persona => persona.id === parseInt(personaIdEnParams, 10));

                if (personaEncontrada) {
                    res.send(editarAgregarReparacion(personaEncontrada.nombre));
                } else {
                    res.send(`No se encontró una persona con ID: ${personaIdEnParams}`);
                }
            } else {
                res.send(`No se encontró una persona con ID: ${personaIdEnParams}`);
            }
        }
    },
    agregarAmbosGET: (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'agregar', 'agregar_ambos.htm'));
    },
    agregarPersonaPOST: (req, res) => {
        try {
            const { nombre, direccion, telefono, email } = req.body;

            const cachedData = myCache.get('dataReparaciones');
            if (cachedData && cachedData.personas) {
                const personaEnCache = cachedData.personas.find(persona => persona.nombre.toLowerCase() === nombre.toLowerCase());

                if (personaEnCache) {
                    // Persona encontrada en caché, no se agrega nuevamente
                    return res.send(htmlFormEnviado("Añadir Persona", `Ya existe una persona con Nombre y Apellido ${nombre}`, "goBack"));
                }
            }

            const personaEncontrada = buscarPersonaDataBaseOriginal(nombre);

            //Hay que cambiarlo por
            //if (personaEncontrada.length===0 || !personaEncontrada){}
            //una vez implementada la DB
            if (!personaEncontrada) {

                //Subo a la base de datos Original (base de datos desplegada)
                const personaCreada = dataOriginalPostPersona(
                    nombre, 
                    direccion, 
                    telefono, 
                    email
                );

                // Actualizar la reparación en cachedData si existe
                if (cachedData) {
                    cachedData.personas.push(personaCreada);
                    myCache.set('dataReparaciones', cachedData); // Actualizar el caché con la nueva información de personas
                }

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

            const cachedData = myCache.get('dataReparaciones');
            let personaEncontrada = null;

            if (cachedData && cachedData.personas) {
                // Buscar persona en caché
                const personaEnCache = cachedData.personas.find(persona => persona.nombre.toLowerCase() === nombre.toLowerCase());

                if (personaEnCache) {
                    // Persona encontrada en caché
                    personaEncontrada = personaEnCache;
                }
            }

            if (!personaEncontrada) {
                // Si no se encontró en caché, buscar en la base de datos original
                personaEncontrada = buscarPersonaDataBaseOriginal(nombre);
            }

            //Hay que cambiarlo por
            //if (personaEncontrada.length > 0 || personaEncontrada){}
            //una vez implementada la DB
            if (personaEncontrada) {
                const reparacionCreada = dataOriginalPostReparacion(
                    personaEncontrada.id,
                    descripcion,
                    tipo,
                    fecha,
                    estado
                );

                // Actualizar la reparación en cachedData si existe
                const cachedData = myCache.get('dataReparaciones');
                if (cachedData) {
                    cachedData.reparaciones.push(reparacionCreada);
                    myCache.set('dataReparaciones', cachedData); // Actualizar el caché
                }

                return res.send(htmlFormEnviado("Añadir Reparacion", "Se creó la reparación correctamente.", "redirectToDashboard"));
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
    
            const cachedData = myCache.get('dataReparaciones');
            if (cachedData && cachedData.personas) {
                const personaEnCache = cachedData.personas.find(persona => persona.nombre.toLowerCase() === nombre.toLowerCase());

                if (personaEnCache) {
                    // Persona encontrada en caché, no se agrega nuevamente
                    return res.send(htmlFormEnviado("Añadir Ambos", `La persona con Nombre y Apellido ${nombre} ya existe.`, "goBack"));
                }
            }
            
            const personaEncontrada = buscarPersonaDataBaseOriginal(nombre);

            //Hay que cambiarlo por
            //if (personaEncontrada.length===0 || !personaEncontrada){}
            //una vez implementada la DB
            if (!personaEncontrada) {
                // Si la persona NO existe, crearla y obtener el objeto persona creado
                //Subo a la base de datos Original (base de datos desplegada)
                const personaCreada = dataOriginalPostPersona(
                    nombre, 
                    direccion, 
                    telefono, 
                    email
                );

                const reparacionCreada = dataOriginalPostReparacion(
                    personaCreada.id,
                    descripcion,
                    tipo,
                    fecha,
                    estado
                );

                const cachedData = myCache.get('dataReparaciones');
                if (cachedData) {
                    cachedData.personas.push(personaCreada);
                    cachedData.reparaciones.push(reparacionCreada);
                    myCache.set('dataReparaciones', cachedData); // Actualizar el caché con la nueva información de personas y reparaciones
                }
                return res.send(htmlFormEnviado("Añadir Ambos", "Se creó la persona y la reparación correctamente.", "redirectToDashboard"));
            }
            else {
                return res.send(htmlFormEnviado("Añadir Reparacion", `No se encontró una persona con Nombre y Apellido: ${nombre}`, "goBack"));
            }
        } catch (error) {
            res.json({ msg: error.msg });
        }
    }
}

//Esta función es utilizada por check_nomb_apell_persona.js y check_nomb_apell_reparacion.js
//Cuando se consulta por /verificar, se llama a esta función.
const verificarDisponibilidadNombreApellido = (req, res) => {
    try {
        const nombre = req.query.nombre;

        const cachedData = myCache.get('dataReparaciones');

        if (cachedData && cachedData.personas) {
            // Buscar persona en caché por nombre
            const personaEnCache = cachedData.personas.find(persona => persona.nombre.toLowerCase() === nombre.toLowerCase());

            if (personaEnCache) {
                // Persona encontrada en caché
                return res.send({ exists: true });
            }
        }

        // Si no se encontró en caché, buscar en la base de datos original
        const personaEncontrada = buscarPersonaDataBaseOriginal(nombre);

        //Hay que cambiarlo por
        //if (personaEncontrada.length > 0 || personaEncontrada){}
        //una vez implementada la DB
        if (personaEncontrada) {
            res.send({ exists: true });
        } else {
            res.send({ exists: false });
        }
    } catch (error) {
        console.error('Error al buscar persona:', error);
        res.status(500).send({ error: 'Error al verificar el nombre y apellido' });
    }
}

module.exports = {
    dashboardAgregar,
    verificarDisponibilidadNombreApellido
}