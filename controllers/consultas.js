const fs = require('fs');
const path = require('path');

//db "Real"
const { 
    realizarConsultaReparacionCliente
} = require('../data/db');

const { htmlFormEnviado } = require('./crud/crud_form_post_pressed');

function armarTablaInformacionConsultaCliente(req, res, dataTrabajar)  {

    let dataAniadir = '';

    if (dataTrabajar.personas.length > 0 && dataTrabajar.reparaciones.length > 0) {
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
                            <td>${reparacion.fecha}</td>
                            <td>${reparacion.estado}</td>
                        </tr>`;
    
                    dataAniadir += fila;
                });
            }
        });
    
        fs.readFile(path.join(__dirname, '..', 'components', 'consulta_reparacion.htm'), 'utf8', (err, html) => {
            if (err) {
                console.error('Error al leer el archivo HTML:', err);
                return res.status(500).send('Error interno del servidor');
            }
            const htmlFinal = html.replace('<tbody id="dynamicTableBody"></tbody>', `<tbody id="dynamicTableBody">${dataAniadir}</tbody>`);

            return res.send(htmlFinal);
        });
    } else {
        return res.send(htmlFormEnviado("Sin Resultados", "No se encontraron resultados", "goBack"))
    }
}

async function consultaReparacion(req, res) {

    const { nombre_apellido_consulta } = req.body;

    const dataOriginalPersonaReparacionRecibidaBusqueda = await realizarConsultaReparacionCliente(nombre_apellido_consulta)

    armarTablaInformacionConsultaCliente(req, res, dataOriginalPersonaReparacionRecibidaBusqueda);
}

module.exports = { 
    consultaReparacion 
}