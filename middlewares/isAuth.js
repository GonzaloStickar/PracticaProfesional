const { sessionSecret } = require('../controllers/config.js');

const main = require('../controllers/main')

const isAuth = (req, res, next) => {
	const { cookies } = req;
	if (cookies.session_id) {
		if (cookies.session_id===sessionSecret) {
            next();
        } else {
            return main.notFound(req, res);
        }
	} else {
        return main.notFound(req, res);
    }
};

module.exports = {
    isAuth
}