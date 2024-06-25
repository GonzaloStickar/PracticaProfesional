const express = require("express") 
const router = express.Router()

const main = require('../controllers/main')
const login = require('../controllers/login')

const { dashboardPage, mostrarPersonasReparaciones } = require('../controllers/dashboard')
const { dashboardAgregar, verificarDisponibilidadNombreApellido } = require('../controllers/crud/dashboard_agregar')
const { dashboardBuscar } = require('../controllers/crud/dashboard_buscar')
const { dashboardEditar } = require('../controllers/crud/dashboard_editar')
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

//Formulario de que agregar, persona, reparacion o ambos (chequea si existe o no el nombre y apellido que ingresamos)
router.get("/dashboard/verificar/nombre_apellido", isAuth, verificarDisponibilidadNombreApellido);

//GET de agregar
router.get("/dashboard/agregar", isAuth, dashboardAgregar.agregarFormGET);

router.get("/agregar/persona", isAuth, dashboardAgregar.agregarPersonaGET);
router.get("/agregar/reparacion", isAuth, dashboardAgregar.agregarReparacionGET);
router.get("/agregar/ambos", isAuth, dashboardAgregar.agregarAmbosGET);

//POST de agregar
router.post("/agregar/persona", isAuth, dashboardAgregar.agregarPersonaPOST);
router.post("/agregar/reparacion", isAuth, dashboardAgregar.agregarReparacionPOST);
router.post("/agregar/ambos", isAuth, dashboardAgregar.agregarAmbosPOST);

//GET de buscar
router.get("/dashboard/buscar", isAuth, dashboardBuscar.buscarFormGET);

router.get("/dashboard/buscar/persona", isAuth, dashboardBuscar.buscarPersonaGET);
router.get("/dashboard/buscar/reparacion", isAuth, dashboardBuscar.buscarReparacionGET);
router.get("/dashboard/buscar/ambos", isAuth, dashboardBuscar.buscarAmbosGET);

//POST de buscar
router.post("/dashboard/buscar/persona", isAuth, dashboardBuscar.buscarPersonaPOST);
router.post("/dashboard/buscar/reparacion", isAuth, dashboardBuscar.buscarReparacionPOST);
router.post("/dashboard/buscar/ambos", isAuth, dashboardBuscar.buscarAmbosPOST);

//GET de editar
router.get("/dashboard/editar", isAuth, dashboardEditar.editarFormGET);

router.get("/editar/persona", isAuth, dashboardEditar.editarPersonaGET);
router.get("/editar/reparacion", isAuth, dashboardEditar.editarReparacionGET);

//PUT de editar
router.post("/editar/persona", isAuth, dashboardEditar.editarPersonaPOST);
router.post("/editar/reparacion", isAuth, dashboardEditar.editarReparacionPOST);

//GET de informe
router.get("/dashboard/informe", isAuth, dashboardInforme.informe);

router.get("/", (req, res) => {
    res.redirect('/inicio');
});

router.all("*", main.notFound)

module.exports = router