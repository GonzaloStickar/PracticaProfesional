const fs = require('fs');
const path = require('path');

//db "Real"
const { 
    dataOriginalGETbusqueda
} = require('../../data/db');

const { myCache } = require('../../middlewares/cache');

const { htmlFormEnviado } = require('./crud_form_post_pressed');

const { 
    formatDateString
} = require('../../helpers/dateHelper');

function armarTablaInformacion(req, res, dataTrabajar)  {

    let dataAniadir = '';

    if (dataTrabajar.personas.length > 0) {
        dataTrabajar.personas.forEach(persona => {

            // Buscar las reparaciones de esta persona
            const reparacionesDePersona = dataTrabajar.reparaciones.filter(reparacion => reparacion.persona_id === persona.id);
    
            // Si la persona tiene reparaciones, agregar filas para cada una
            if (reparacionesDePersona.length > 0) {
                reparacionesDePersona.forEach((reparacion) => {
                    const fila = `
                        <tr>
                            <td>${persona.nombre}</td>
                            <td>${reparacion.tipo}</td>
                            <td>${formatDateString(reparacion.fecha)}</td>
                            <td>${reparacion.estado}</td>
                            <td>
                                <div class="container_botones_tabla">
                                    <button class="boton_editar" onclick="redirectToEditar(${persona.id}, ${reparacion.id})">Editar</button>
                                    <button class="boton_eliminar" onclick="redirectToEliminar(${persona.id}, ${reparacion.id})">Eliminar</button>
                                    <button class="boton_informe" onclick="redirectToInforme(${persona.id}, ${reparacion.id})">Informe</button>
                                </div>
                            </td>
                        </tr>`;
    
                    dataAniadir += fila;
                });
            } else {
                const fila = `
                    <tr>
                        <td>${persona.nombre}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>
                            <div class="container_botones_tabla">
                                <button class="boton_editar" onclick="redirectToEditar(${persona.id}, 'undefined')">Editar</button>
                                <button class="boton_eliminar" onclick="redirectToEliminar(${persona.id}, 'undefined')">Eliminar</button>
                                <button class="boton_informe" onclick="redirectToInforme(${persona.id}, 'undefined')">Informe</button>
                            </div>
                        </td>
                    </tr>`;
                dataAniadir += fila;
            }
        });
    
        fs.readFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'buscar', 'dashboard_buscar.htm'), 'utf8', (err, html) => {
            if (err) {
                console.error('Error al leer el archivo HTML:', err);
                return res.status(500).send('Error interno del servidor');
            }
            const htmlWithData = html.replace('<tbody id="dynamicTableBody"></tbody>', `<tbody id="dynamicTableBody">${dataAniadir}</tbody>`);
            return res.send(htmlWithData);
        });
    } else if (dataTrabajar.reparaciones.length > 0 && dataTrabajar.personas.length === 0) {
        dataTrabajar.reparaciones.forEach(reparacion => {
            const fila = `
                <tr>
                    <td>-</td>
                    <td>${reparacion.tipo}</td>
                    <td>${formatDateString(reparacion.fecha)}</td>
                    <td>${reparacion.estado}</td>
                    <td>
                        -
                    </td>
                </tr>`;
            dataAniadir += fila;
        });

        fs.readFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'buscar', 'dashboard_buscar.htm'), 'utf8', (err, html) => {
            if (err) {
                console.error('Error al leer el archivo HTML:', err);
                return res.status(500).send('Error interno del servidor');
            }
            
            const htmlWithData = html.replace('<tbody id="dynamicTableBody"></tbody>', `<tbody id="dynamicTableBody">${dataAniadir}</tbody>`);
            return res.send(htmlWithData);
        });
    } else {
        return res.send(htmlFormEnviado("Sin Resultados", "No se encontraron resultados", "goBack"))
    }
}

const dashboardBuscar = {
    buscarFormGET: (req,res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'buscar', 'buscar_form.htm'));
    },
    buscarPersonaGET: (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'buscar', 'buscar_persona.htm'));
    },
    buscarReparacionGET: (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'buscar', 'buscar_reparacion.htm'));
    },
    buscarAmbosGET: (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'buscar', 'buscar_ambos.htm'));
    },
    buscarPersonaPOST: async (req, res) => {
        try {
            const { nombre, direccion, telefono, email } = req.body;

            if (nombre === '' && direccion === '' && telefono === '' && email === '') {
                return res.send(htmlFormEnviado("Buscar Ambos", "Ingrese datos para realizar una busqueda", "goBack"))
            }

            const dataRecibida = {
                nombre: nombre === '' ? 'undefined' : nombre,
                direccion: direccion === '' ? 'undefined' : direccion,
                telefono: telefono === '' ? 'undefined' : telefono,
                email: email === '' ? 'undefined' : email
            };

            const dataOriginalPersonaRecibidaBusqueda = await dataOriginalGETbusqueda.buscarPersona(dataRecibida)

            myCache.set('ultimaBusqueda', dataOriginalPersonaRecibidaBusqueda);

            const cachedData = myCache.get('dataReparaciones');

            if (cachedData) {
                // Iterar sobre todas las personas encontradas
                dataOriginalPersonaRecibidaBusqueda.personas.forEach(persona => {
                    // Verificar si la persona ya está en el caché
                    const personaExistente = cachedData.personas.some(p => p.id === persona.id);
                    if (!personaExistente) {
                        cachedData.personas.push(persona);
                    } else {
                        console.log(`La persona con ID ${persona.id} ya existe en el caché.`);
                    }
                });
            
                myCache.set('dataReparaciones', cachedData); // Actualizar el caché con la nueva información de personas
            }

            armarTablaInformacion(req, res, dataOriginalPersonaRecibidaBusqueda)

        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    buscarReparacionPOST: async (req, res) => {
        try {
            const { estado, descripcion, tipo, fecha } = req.body;

            if (estado === '' && descripcion === '' && tipo === '' && fecha === '') {
                return res.send(htmlFormEnviado("Buscar Ambos", "Ingrese datos para realizar una busqueda", "goBack"))
            }

            const dataRecibida = {
                estado: estado === '' ? 'undefined' : estado,
                descripcion: descripcion === '' ? 'undefined' : descripcion,
                tipo: tipo === '' ? 'undefined' : tipo,
                fecha: fecha === '' ? 'undefined' : fecha
            };

            const dataOriginalReparacionRecibidaBusqueda = await dataOriginalGETbusqueda.buscarReparacion(dataRecibida)

            myCache.set('ultimaBusqueda', dataOriginalReparacionRecibidaBusqueda);

            const cachedData = myCache.get('dataReparaciones');

            if (cachedData) {
                // Iterar sobre todas las reparaciones encontradas
                dataOriginalReparacionRecibidaBusqueda.reparaciones.forEach(reparacion => {
                    // Verificar si la reparación ya está en el caché
                    const reparacionExistente = cachedData.reparaciones.some(r => r.id === reparacion.id);
                    if (!reparacionExistente) {
                        cachedData.reparaciones.push(reparacion);
                    } else {
                        console.log(`La reparación con ID ${reparacion.id} ya existe en el caché.`);
                    }
                });
            
                myCache.set('dataReparaciones', cachedData); // Actualizar el caché con la nueva información de reparaciones
            }

            armarTablaInformacion(req, res, dataOriginalReparacionRecibidaBusqueda)

        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    buscarAmbosPOST: async (req, res) => {
        try {
            const { nombre, direccion, telefono, email, estado, descripcion, tipo, fecha, dni } = req.body;

            if (nombre === '' && direccion === '' && telefono === '' && email === '' && nombre === '' && direccion === '' && telefono === '' && email === '') {
                return res.send(htmlFormEnviado("Buscar Ambos", "Ingrese datos para realizar una busqueda", "goBack"))
            }
            
            const dataRecibidaPersona = {
                nombre: nombre === '' ? 'undefined' : nombre,
                direccion: direccion === '' ? 'undefined' : direccion,
                telefono: telefono === '' ? 'undefined' : telefono,
                email: email === '' ? 'undefined' : email,
                dni: dni === '' ? 'undefined' : dni
            };

            const dataRecibidaReparacion = {
                estado: estado === '' ? 'undefined' : estado,
                descripcion: descripcion === '' ? 'undefined' : descripcion,
                tipo: tipo === '' ? 'undefined' : tipo,
                fecha: fecha === '' ? 'undefined' : fecha,
                dni: dni === '' ? 'undefined' : dni
            };

            const dataOriginalPersonaReparacionRecibidaBusqueda = await dataOriginalGETbusqueda.buscarAmbos(dataRecibidaPersona, dataRecibidaReparacion)

            myCache.set('ultimaBusqueda', dataOriginalPersonaReparacionRecibidaBusqueda);

            console.log(dataOriginalPersonaReparacionRecibidaBusqueda)

            const cachedData = myCache.get('dataReparaciones');

            if (cachedData) {
                // Iterar sobre todas las reparaciones encontradas
                dataOriginalPersonaReparacionRecibidaBusqueda.reparaciones.forEach(reparacion => {
                    // Verificar si la reparación ya está en el caché
                    const reparacionExistente = cachedData.reparaciones.some(r => r.id === reparacion.id);
                    if (!reparacionExistente) {
                        cachedData.reparaciones.push(reparacion);
                    } else {
                        console.log(`La reparación con ID ${reparacion.id} ya existe en el caché.`);
                    }
                });

                // Iterar sobre todas las personas encontradas
                dataOriginalPersonaReparacionRecibidaBusqueda.personas.forEach(persona => {
                    // Verificar si la persona ya está en el caché
                    const personaExistente = cachedData.personas.some(p => p.id === persona.id);
                    if (!personaExistente) {
                        cachedData.personas.push(persona);
                    } else {
                        console.log(`La persona con ID ${persona.id} ya existe en el caché.`);
                    }
                });

                myCache.set('dataReparaciones', cachedData); // Actualizar el caché con la nueva información de reparaciones y personas
            }

            armarTablaInformacion(req, res, dataOriginalPersonaReparacionRecibidaBusqueda)

        } catch (error) {
            res.json({msg: error.msg})
        }
    },
}

const obtenerUltimaBusquedaDesdeCache = (req, res) => {
    const ultimaBusqueda = myCache.get('ultimaBusqueda');
    if (ultimaBusqueda === undefined) {
        // No se encontró el valor en la caché
        return res.send(htmlFormEnviado("Ultima Busqueda", "No se han realizado búsquedas recientes.", "goBack"))
    }
    return armarTablaInformacion(req, res, ultimaBusqueda);
};

module.exports = {
    dashboardBuscar,
    obtenerUltimaBusquedaDesdeCache
}