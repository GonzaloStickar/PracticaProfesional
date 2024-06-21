const fs = require('fs');
const path = require('path');

//db "Real"
const { 
    dataOriginalGETbusqueda
} = require('../../data/db');

function armarTablaInformacionPersonasReparacion(req, res, dataTrabajar)  {

    let dataAniadir = '';

    dataTrabajar.personas.forEach(persona => {

        // Buscar las reparaciones de esta persona
        const reparacionesDePersona = dataTrabajar.reparaciones.filter(reparacion => reparacion.persona_id === persona.id);

        // Si la persona tiene reparaciones, agregar filas para cada una
        if (reparacionesDePersona.length > 0) {
            reparacionesDePersona.forEach((reparacion) => {
                const fila = `
                    <tr>
                        <td>${persona.nombre}</td>
                        <td>${persona.dni}</td>
                        <!--<td>${persona.direccion}</td>
                        <td>${persona.telefono}</td>
                        <td>${persona.email}</td>
                        <td>${reparacion.descripcion}</td>-->
                        <td>${reparacion.tipo}</td>
                        <td>${reparacion.fecha}</td>
                        <td>${reparacion.estado}</td>
                        <td>
                            <div class="container_botones_tabla">
                                <button class="boton_editar" onclick="redirectToEditar(${persona.id})">Editar</button>
                                <button class="boton_eliminar" onclick="eliminar(${persona.id})">Eliminar</button>
                                <button class="boton_informe" onclick="redirectToInforme(${persona.id})">Informe</button>
                            </div>
                        </td>
                    </tr>`;

                dataAniadir += fila;
            });
        } else {
            const fila = `
                <tr>
                    <td>${persona.nombre}</td>
                    <td>${persona.dni}</td>
                    
                    <!--<td>${persona.direccion}</td>
                    <td>${persona.telefono}</td>
                    <td>${persona.email}</td>-->
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>
                        <div class="container_botones_tabla">
                            <button class="boton_editar" onclick="redirectToEditar(${persona.id})">Editar</button>
                            <button class="boton_eliminar" onclick="eliminar(${persona.id})">Eliminar</button>
                            <button class="boton_informe" onclick="redirectToInforme(${persona.id})">Informe</button>
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
}

const dashboardBuscar = {
    buscarFormGET: (req,res) => {
        try {
            res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'buscar', 'buscar_form.htm'));
        } catch (error) {
            res.json({msg: error.msg})
        }
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
    buscarPersonaPOST: (req, res) => {
        try {
            const { nombre, direccion, telefono, email, dni } = req.body;

            const dataRecibida = {
                nombre: nombre === '' ? 'undefined' : nombre,
                direccion: direccion === '' ? 'undefined' : direccion,
                telefono: telefono === '' ? 'undefined' : telefono,
                email: email === '' ? 'undefined' : email,
                dni: dni === '' ? 'undefined' : dni
            };

            dataRecibida.id = 1;

            const dataOriginalBusqueda = dataOriginalGETbusqueda(dataRecibida);

            //return res.json(dataOriginalBusqueda);

            
            //console.log(dataOriginalBusqueda);

            const dataTrabajarBusquedaConseguida = {
                personas:[],
                reparaciones:[]
            }

            dataTrabajarBusquedaConseguida.personas.push(dataOriginalBusqueda);

            console.log(dataTrabajarBusquedaConseguida)

            //res.send(dataTrabajarBusquedaConseguida)
            armarTablaInformacionPersonasReparacion(req, res, dataTrabajarBusquedaConseguida)

        } catch (error) {
            res.json({msg: error.msg})
        }
        //res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'buscar', 'buscar_persona.htm'));
    },
    buscarReparacionPOST: (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'buscar', 'buscar_reparacion.htm'));
    },
    buscarAmbosPOST: (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'buscar', 'buscar_ambos.htm'));
    },
}

const dashboardPageBuscar = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'components', 'dashboard', 'dashboard.htm'));
}

module.exports = {
    dashboardBuscar
}