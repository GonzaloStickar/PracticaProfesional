const path = require('path');
const fs = require('fs');
const { sessionSecret } = require('../controllers/config.js');

const isAuth = (req, res) => {
	const { cookies } = req;
	if (cookies.session_id) {
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
        res.sendFile(path.join(__dirname, '..', 'components', 'cuenta.htm'));
    }
}

module.exports = main