const { sessionSecret } = require('../controllers/config.js');

const isAuth = (req, res, next) => {
	const { cookies } = req;
	if (cookies.session_id) {
		if (cookies.session_id===sessionSecret) {
            next();
        } else {
            return res.send("Página no encontrada.");
        }
	} else {
        return res.send("Página no encontrada.");
    }
};

module.exports = {
    isAuth
}