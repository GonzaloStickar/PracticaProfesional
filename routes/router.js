const express = require("express") 
const router = express.Router()

const main = require('../controllers/main')
const login = require('../controllers/login')

const { dashboardPage, mostrarPersonasReparaciones } = require('../controllers/dashboard')
const { dashboardAgregar } = require('../controllers/crud/dashboard_agregar')
const { dashboardBuscar } = require('../controllers/crud/dashboard_buscar')
const { dashboardInforme } = require('../controllers/crud/dashboard_informe')

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

router.get("/logout", isAuth, login.logout)

router.get("/dashboard", isAuth, dashboardPage)

router.get("/dashboard/reparaciones", isAuth, mostrarPersonasReparaciones);

//Formulario de que agregar, persona, reparacion o ambos
router.get("/dashboard/agregar", isAuth, dashboardAgregar.agregarFormGET);
//GET de agregar
router.get("/agregar/persona", isAuth, dashboardAgregar.agregarPersonaGET);
router.get("/agregar/reparacion", isAuth, dashboardAgregar.agregarReparacionGET);
router.get("/agregar/ambos", isAuth, dashboardAgregar.agregarAmbosGET);
//POST de agregar
router.post("/agregar/persona", isAuth, dashboardAgregar.agregarPersonaPOST);
router.post("/agregar/reparacion", isAuth, dashboardAgregar.agregarReparacionPOST);
router.post("/agregar/ambos", isAuth, dashboardAgregar.agregarAmbosPOST);

//GET de buscar
router.get("/dashboard/buscar", isAuth, dashboardBuscar.buscarGET);
router.post("/dashboard/buscar", isAuth, dashboardBuscar.buscarPOST);

//GET de editar
//router.get("/dashboard/editar", isAuth, dashboardEditar.editarGET);

//GET de informe
router.get("/dashboard/informe", isAuth, dashboardInforme.informe);

router.get("/", (req, res) => {
    res.redirect('/inicio');
});

router.all("*", main.notFound)

module.exports = router