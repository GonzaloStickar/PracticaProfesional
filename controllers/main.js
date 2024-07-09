const path = require('path');
const { sessionSecret } = require('../controllers/config.js');

const main = {
    getInicio: (req, res) => {
        try {
            const { cookies } = req;
	if (cookies.session_id) {
		if (cookies.session_id===sessionSecret) {
            res.setHeader('Cache-Control', 'no-store');
            return res.sendFile(path.join(__dirname, '..', 'components', 'indexLogout.htm'));
        } else {
            res.setHeader('Cache-Control', 'no-store');
            return res.sendFile(path.join(__dirname, '..', 'components', 'index.htm'));
        }
	} else {
        res.setHeader('Cache-Control', 'no-store');
        return res.sendFile(path.join(__dirname, '..', 'components', 'index.htm'));
    }
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