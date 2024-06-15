const express = require("express") 
const router = express.Router()

const main = require('../controllers/main')
const login = require('../controllers/login')
const { dashboardPage, mostrarPersonasReparaciones, dashboardCRUD } = require('../controllers/dashboard')
const { sessionSecret } = require('../controllers/config.js');

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

router.get("/inicio", main.getInicio)

router.get("/login", login.getLogin)
router.post("/login", login.postLogin)

router.post("/logout", isAuth, login.logout)

router.get("/dashboard", isAuth, dashboardPage)

router.get("/dashboard/reparaciones", isAuth, mostrarPersonasReparaciones);

router.get("/dashboard/agregar", isAuth, dashboardCRUD.agregarGET);

router.get("/agregar/persona", isAuth, dashboardCRUD.agregarPersonaGET);
router.get("/agregar/reparacion", isAuth, dashboardCRUD.agregarReparacionGET);
router.get("/agregar/ambos", isAuth, dashboardCRUD.agregarPersonaReparacionGET);

router.post("/agregar/persona", isAuth, dashboardCRUD.agregarPersonaPOST);
router.post("/agregar/reparacion", isAuth, dashboardCRUD.agregarReparacionPOST);
router.post("/agregar/ambos", isAuth, dashboardCRUD.agregarPersonaReparacionPOST);

router.get("/dashboard/buscar", isAuth, dashboardCRUD.buscarGET);
router.post("/dashboard/buscar", isAuth, dashboardCRUD.buscarPOST);

router.get("/dashboard/editar", isAuth, dashboardCRUD.editar);
router.get("/dashboard/informe", isAuth, dashboardCRUD.informe);

router.get("/", (req, res) => {
    res.redirect('/inicio');
});

router.all("*", main.notFound)

module.exports = router