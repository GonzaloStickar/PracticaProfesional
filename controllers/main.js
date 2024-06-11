const path = require('path');
const fs = require('fs');
const { sessionSecret } = require('../controllers/config.js');

const isAuth = (req, res) => {
	const { cookies } = req;
	if (cookies.session_id) {
		console.log("session_id exists");
		if (cookies.session_id===sessionSecret) {
            res.sendFile(path.join(__dirname, '..', 'components', 'indexLogout.htm'));
        } else {
            res.sendFile(path.join(__dirname, '..', 'components', 'index.htm'));
        }
	} else {
        res.sendFile(path.join(__dirname, '..', 'components', 'index.htm'));
    }
};

const main = {
    getInicio: (req, res) => {
        try {
            return isAuth(req, res);
        }
        catch (e) {
            res.send({msg:e});
        }
    },
    notFound: (req,res) => {
        res.send("Página no encontrada.");
    },
    cuenta: (req, res) => {
        const reparaciones = [
            { persona: "persona1" },
            { persona: "persona2" },
            { persona: "persona3" },
            { persona: "persona4" },
            { persona: "persona5" },
            { persona: "persona6" },
            { persona: "persona7" },
            { persona: "persona8" },
            { persona: "persona9" },
            { persona: "persona10" },
            { persona: "persona11" },
            { persona: "persona12" },
            { persona: "persona13" },
            { persona: "persona14" },
            { persona: "persona15" },
            { persona: "persona16" },
            { persona: "persona17" },
            { persona: "persona18" },
            { persona: "persona19" },
            { persona: "persona20" },
            { persona: "persona21" },
            { persona: "persona22" },
            { persona: "persona23" },
            { persona: "persona24" },
            { persona: "persona25" },
            { persona: "persona26" },
            { persona: "persona27" },
            { persona: "persona28" },
            { persona: "persona29" },
            { persona: "persona30" },
            { persona: "persona31" },
            { persona: "persona32" },
            { persona: "persona33" },
            { persona: "persona34" },
            { persona: "persona35" },
            { persona: "persona36" }
        ];

        fs.readFile(path.join(__dirname, '..', 'components', 'cuenta.htm'), 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo HTML:', err);
                return res.status(500).send('Error interno del servidor');
            }
    
            // Inserta las reparaciones en el HTML como una variable JavaScript
            const htmlWithData = data.replace('const reparaciones = null;', `const reparaciones = ${JSON.stringify(reparaciones)};`);
    
            // Envía el HTML modificado al cliente
            res.send(htmlWithData);
        });


        //res.sendFile(path.join(__dirname, '..', 'components', 'cuenta.htm'));
    }
}

module.exports = main