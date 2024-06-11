const express = require("express")
const router = express.Router()

const main = require('../controllers/main')
const login = require('../controllers/login')
const data = require('../data/data')
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

router.get("/cuenta", isAuth, main.cuenta)



//Suponiendo que es toda nuestra DB
data.push(
    { id: 1, nombre: "Juan"},
    { id: 2, nombre: "María"},
    { id: 3, nombre: "Pedro"},
    { id: 4, nombre: "Ana"},
    { id: 5, nombre: "Luis"},
    { id: 6, nombre: "Laura"},
    { id: 7, nombre: "Carlos"},
    { id: 8, nombre: "Sofía"},
    { id: 9, nombre: "Miguel"},
    { id: 10, nombre: "Elena"}
);

let numReparacionesQueryMax = 0;

router.get("/cuenta/reparaciones", isAuth, (req, res) => {

    //mi objetivo es que cuando se realiza la consulta
    //por ejemplo
    //primera consulta es de 3 reparaciones
    //entonces me va a mostrar 3 reparaciones
    //pero yo necesito guardar ese número 3, ya que los datos que YA RECIBÍ, los voy a guardar también
    //una vez que realice una consulta nueva, por ejemplo, consulte respecto a 5
    //use los 3 que ya estaban y agarre los datos entre el 3 y el 5

    //Paso 1)
    //Para realizar el objetivo
    //Primero agarro el número, supongamos que es 3, entonces lo guardo
    //Una vez guardado, miro mi data y chequeo si el lenght de data es menor a ese número
    //Si es menor, significa que en data (nuestra base de datos "física" va a tener menos datos de los que deseamos obtener)
    //Entonces, resumiendo esto:
    //Tengo "dataBaseReutilizable.lenght=0" (siempre va a ser así, no va a compartirse la base de datos), "numReparacionesQueryMax=3"
    //Una vez hecho eso, si dataBaseReutilizable.lenght es menor a 3, entonces se realiza la consulta
    //GUARDO LA INFORMACIÓN QUE OBTENGO ---> en dataBaseReutilizable

    //Paso 2)
    //Una vez que tengo la información en dataBaseReutilizable
    //Viene la segunda parte:
    //nueva consulta con "numReparacionesQueryMax=2",
    //Entonces con esa nueva consulta, puedo decir que
    //Si dataBaseReutilizable.lenght >= numReparacionesQueryMax, entonces que devuelva del dato 0 (el principio) hasta el numReparacionesQueryMax
    //que en ese caso es 2

    //Paso 3)
    //En caso de que se haga lo mismo que el paso 2) pero con una consulta diferente (mayor)
    //nueva consulta con "numReparacionesQueryMax=5",
    //Entonces en este caso hay que repetir lo que hicimos en el paso 1) pero DIFERENTE consulta
    //La diferencia va a estar en:
    //Hacer la consulta completa y hacer una consulta cerrada, ejemplo:
    //Si nosotros en dataBaseReutilizable tenemos ya 3 datos, entonces, que haga la consulta entre el dato 4 y 5
    //Que traiga de la consulta el dato 4 y 5
    //GUARDO LA INFORMACIÓN QUE OBTENGO ---> en dataBaseReutilizable (en este caso, añado la información nueva que se consultó)
    //Se guarda los nuevos datos (4 y 5),
    //Así sucesivamente con datos más grandes de consulta (si tenemos ya 300 en dataBaseReutilizable y consultamos 500)
    //Entonces va a suceder lo mismo, se van a consultar para que traiga entre el 301 y el 500 y se agreguen a la dataBaseReutilizable
    //que está localmente para poder ser reutilizada y no tener que consultar una y otra vez y no gastar la memoria disponible de DB.
    
    //Paso 4)
    //Modularizar las distribuciónes de las consultas si es que se van a hacer nuevas consultas / diferentes
    //Modularizar base de datos locales si es que vamos a trabajar sobre personas y reparaciones
    //Me refiero a que, haya una base de datos local reutilizable para Personas, y otra base de datos local reutilizable para reparaciones. 

    const numReparacionesQueryMax = parseInt(req.query.reparaciones);
    console.log(numReparacionesQueryMax)
    
    res.send(data);

});

router.get("/", (req, res) => {
    res.redirect('/inicio');
});

router.all("*", main.notFound)

module.exports = router