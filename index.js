const path = require('path');
const express = require("express")
const cookieParser = require('cookie-parser');

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

const { isAuth } = require('./middlewares/isAuth');

const mainRouter = require('./routes/main')
const dashboardRouter = require('./routes/dashboard')

const agregarRouter = require('./routes/crud/agregar')
const buscarRouter = require('./routes/crud/buscar')
const editarRouter = require('./routes/crud/editar')

app.use("/", mainRouter);

app.use("/dashboard", isAuth, dashboardRouter);

app.use("/dashboard/agregar", isAuth, agregarRouter);
app.use("/dashboard/buscar", isAuth, buscarRouter);
app.use("/dashboard/editar", isAuth, editarRouter);


app.get("*", (req, res) => {
    res.send("Página no encontrada.");
});

app.listen(3000, () => console.log("Server is running on port 5000"))