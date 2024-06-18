const path = require('path');

//db "Real"
const { 
    dataOriginalGETbusqueda
} = require('../../data/db');

const { 
    armarTablaInformacionPersonasReparacion
} = require('../dashboard');

const dashboardBuscar = {
    buscarGET: (req,res) => {
        try {
            res.sendFile(path.join(__dirname, '..', '..', 'components', 'dashboard', 'buscar', 'buscar_form.htm'));
        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    buscarPOST: (req,res) => {
        try {
            const { nombre, direccion, telefono, email, dni } = req.body;

            const dataRecibida = {
                nombre: nombre === '' ? 'undefined' : nombre,
                direccion: direccion === '' ? 'undefined' : direccion,
                telefono: telefono === '' ? 'undefined' : telefono,
                email: email === '' ? 'undefined' : email,
                dni: dni === '' ? 'undefined' : dni
            };

            const dataOriginalBusqueda = dataOriginalGETbusqueda(dataRecibida);

            armarTablaInformacionPersonasReparacion(req, res, dataOriginalBusqueda);

        } catch (error) {
            res.json({msg: error.msg})
        }
    }
}

module.exports = {
    dashboardBuscar
}