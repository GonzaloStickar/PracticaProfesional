const express = require("express")
const router = express.Router()

const main = require('../controllers/main')
const login = require('../controllers/login')
const { mostrarPersonasReparaciones } = require('../controllers/dashboard')
const { sessionSecret } = require('../controllers/config.js');

const isAuth = (req, res, next) => {
	const { cookies } = req;
	if (cookies.session_id) {
		console.log("session_id exists");
		if (cookies.session_id===sessionSecret) {
            next();
        } else {
            return main.notFound(req, res);
        }
	} else {
        return main.notFound(req, res);
    }
};

router.get("/inicio", main.getInicio)

router.get("/login", login.getLogin)
router.post("/login", login.postLogin)

router.post("/logout", isAuth, login.logout)

router.get("/dashboard", isAuth, main.dashboard)


const { agregarPersonaLocalDB, agregarReparacionLocalDB } = require('../data/data')

//Suponiendo que es toda nuestra DB
agregarPersonaLocalDB(1, "Juan Pérez", "Calle Falsa 123", "123-456-7890", "juan.perez@example.com", "11.222.333");
agregarPersonaLocalDB(2, "María Gómez", "Avenida Siempreviva 456", "098-765-4321", "maria.gomez@example.com", "12.222.333");
agregarPersonaLocalDB(3, "Carlos Díaz", "Boulevard del Sol 789", "111-222-3333", "carlos.diaz@example.com", "13.222.333");

agregarReparacionLocalDB(1, 1, "Cambio de pantalla", "Electrónica", "2024-06-13T10:00:00Z", "Completado");
agregarReparacionLocalDB(2, 2, "Reparación de plaqueta", "Electrónica", "2024-06-14T12:30:00Z", "En progreso");
agregarReparacionLocalDB(3, 3, "Instalación de software", "Informática", "2024-06-15T15:45:00Z", "Pendiente");


router.get("/dashboard/reparaciones", isAuth, mostrarPersonasReparaciones);

router.get("/", (req, res) => {
    res.redirect('/inicio');
});

router.all("*", main.notFound)

module.exports = router