const path = require('path');
const express = require("express")
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

const { isAuth } = require('./middlewares/isAuth');

const mainRouter = require('./routes/main')
const dashboardRouter = require('./routes/dashboard')
const consultasRouter = require('./routes/consultas')

const agregarRouter = require('./routes/crud/agregar')
const buscarRouter = require('./routes/crud/buscar')
const editarRouter = require('./routes/crud/editar')
const eliminarRouter = require('./routes/crud/eliminar')
const informeRouter = require('./routes/crud/informe')

app.use("/", mainRouter);

app.use("/consulta", consultasRouter);

app.use("/dashboard", isAuth, dashboardRouter);

app.use("/dashboard/agregar", isAuth, agregarRouter);
app.use("/dashboard/buscar", isAuth, buscarRouter);
app.use("/dashboard/editar", isAuth, editarRouter);
app.use("/dashboard/eliminar", isAuth, eliminarRouter);
app.use("/dashboard/informe", isAuth, informeRouter);

app.get("*", (req, res) => {
    res.send("Página no encontrada.");
});

app.listen(process.env.PORT, () => console.log("Server is running on port 5000"))
