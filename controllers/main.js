const path = require('path');
const { sessionSecret } = require('../controllers/config.js');

const isAuthV2 = (req, res) => {
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
            return isAuthV2(req, res);
        }
        catch (e) {
            res.send({msg:e});
        }
    },
    notFound: (req,res) => {
        res.send("Página no encontrada.");
    }
}

module.exports = main