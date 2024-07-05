const path = require('path');

const { 
    dataOriginalPostPersona, dataOriginalPostReparacion
} = require('../../data/db');

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
                    res.send(`No se encontró una persona con ID: ${personaIdEnParams} en cache.`);
                }
            } else {
                res.send(`No se encontraron personas en cache.`);
            }
        }
    },
    agregarAmbosGET: (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'agregar', 'agregar_ambos.htm'));
    },
    agregarPersonaPOST: async (req, res) => {
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

            const personaEncontrada = await buscarPersonaDataBaseOriginal(nombre);

            //No hay una persona con ese nombre, por lo que devuelve undefined (sin filas)
            if ((Array.isArray(personaEncontrada) && personaEncontrada.length === 0) || !personaEncontrada) {

                //Subo a la base de datos Original (base de datos desplegada)
                const personaCreada = await dataOriginalPostPersona(
                    nombre, 
                    direccion, 
                    telefono, 
                    email
                );

                //console.log(`id de la nueva persona: ${personaCreada.id}`)

                // Actualizar la reparación en cachedData si existe
                if (cachedData) {
                    // Verificar si la persona ya está en el caché
                    const personaExistente = cachedData.personas.some(persona => persona.id === personaCreada.id);

                    if (!personaExistente) {
                        cachedData.personas.push(personaCreada);
                    } else {
                        console.log('La persona ya existe en el caché.');
                    }

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
    agregarReparacionPOST: async (req, res) => {
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
                const resultadoBusqueda = await buscarPersonaDataBaseOriginal(nombre);
                personaEncontrada = resultadoBusqueda[0]; // Suponiendo que buscarPersonaDataBaseOriginal devuelve un arreglo con la persona encontrada
    
                if (!personaEncontrada) {
                    return res.send(htmlFormEnviado("Añadir Reparacion", `No se encontró una persona con Nombre y Apellido: ${nombre}`, "goBack"));
                }
            }
    
            // Crear reparación
            const reparacionCreada = await dataOriginalPostReparacion(
                personaEncontrada.id,
                descripcion,
                tipo,
                fecha,
                estado
            );

            //console.log(`id de la nueva reparación: ${reparacionCreada.id}`)
    
            // Actualizar la reparación en cachedData si existe
            if (cachedData) {

                const reparacionExistente = cachedData.reparaciones.some(rep => rep.id === reparacionCreada.id);

                if (!reparacionExistente) {
                    cachedData.reparaciones.push(reparacionCreada);
                } else {
                    console.log('La reparación ya existe en el caché.');
                }

                myCache.set('dataReparaciones', cachedData); // Actualizar el caché
            }
    
            return res.send(htmlFormEnviado("Añadir Reparacion", "Se creó la reparación correctamente.", "redirectToDashboard"));

        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    agregarAmbosPOST: async (req, res) => {
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

            const personaEncontrada = await buscarPersonaDataBaseOriginal(nombre);

            // No hay una persona con ese nombre, por lo que devuelve undefined (sin filas)
            if ((Array.isArray(personaEncontrada) && personaEncontrada.length === 0) || !personaEncontrada) {
                // Subo a la base de datos Original (base de datos desplegada)
                const personaCreada = await dataOriginalPostPersona(
                    nombre, 
                    direccion, 
                    telefono, 
                    email
                );

                let reparacionCreada = null;

                if (personaCreada) {
                    //console.log("Persona creada:", personaCreada);

                    // Crear la reparación con la persona creada
                    reparacionCreada = await dataOriginalPostReparacion(
                        personaCreada.id,
                        descripcion,
                        tipo,
                        fecha,
                        estado
                    );
                    
                    //console.log("Reparación creada:", reparacionCreada);
                }

                if (cachedData) {

                        // Verificar si la persona ya existe en el caché
                        const personaExistente = cachedData.personas.some(persona => persona.id === personaCreada.id);
                        
                        if (!personaExistente) {
                            console.log("persona añadida a cache")
                            cachedData.personas.push(personaCreada);
                        } else {
                            console.log('La persona ya existe en el caché.');
                        }

                        // Verificar si la reparación ya existe en el caché
                        const reparacionExistente = cachedData.reparaciones.some(reparacion => reparacion.id === reparacionCreada.id);

                        if (!reparacionExistente) {
                            console.log("reparación añadida a cache")
                            cachedData.reparaciones.push(reparacionCreada);
                        } else {
                            console.log('La reparación ya existe en el caché.');
                        }

                    // Actualizar el caché con la nueva información de personas y reparaciones
                    myCache.set('dataReparaciones', cachedData);
                }
                
                return res.send(htmlFormEnviado("Añadir Ambos", "Se creó la persona y la reparación correctamente.", "redirectToDashboard"));
            }
            else {
                return res.send(htmlFormEnviado("Añadir Reparacion", `Ya existe una persona con Nombre y Apellido: ${nombre}`, "goBack"));
            }
        } catch (error) {
            res.json({ msg: error.msg });
        }
    }
}

//Esta función es utilizada por check_nomb_apell_persona.js y check_nomb_apell_reparacion.js
//Cuando se consulta por /verificar, se llama a esta función.
const verificarDisponibilidadNombreApellido = async (req, res) => {
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
        const personaEncontrada = await buscarPersonaDataBaseOriginal(nombre);

        //console.log(personaEncontrada)

        // Verificar que personaEncontrada no sea undefined
        if (Array.isArray(personaEncontrada) && personaEncontrada.length > 0) {
            res.send({ exists: true });
        } else {
            res.send({ exists: false });
        }
    } catch (error) {
        console.error('Error al buscar persona:', error);
        res.send({ exists: false });
    }
}

module.exports = {
    dashboardAgregar,
    verificarDisponibilidadNombreApellido
}