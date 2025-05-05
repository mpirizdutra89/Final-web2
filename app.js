const express = require('express')
const path = require('path')
const app = express()
const DEFAULT_PORT = 3000;
const DEFAULT_IP = 'localhost';
const alwaysdataPort = process.env.ALWAYSDATA_HTTPD_PORT;
const alwaysdataIP = process.env.ALWAYSDATA_HTTPD_IP;
const HOST = alwaysdataIP || DEFAULT_IP;
const PORT = alwaysdataPort || DEFAULT_PORT;
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const inicio = require('./routes/inicio')
const iniciarJuego = require('./routes/iniciarJuego')
// Public : archivos estáticos accesibles desde el navegador
app.use(express.static(path.join(__dirname, 'public')))
/* app.use(express.urlencoded({ extended: true })); */
app.use(express.json());//para que funcione console.log con console.log(req.body); si no da undefined



//configuro pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


/* app.use('/usuarios', acaRouterNuevos) Rutas mas espesificas van arriba de las generales para evitar problemas */
app.use('/iniciar-juego', iniciarJuego)

app.use('/', inicio)

//servir archivos
app.use('/funciones', express.static(path.join(__dirname, 'funciones')));

// Middleware 404 Maneja ruta que no exiten por eso va abajo
app.use(notFound);

// Middleware de errores generales 
app.use(errorHandler);
/* ALWAYSDATA_HTTPD_ PORT
ALWAYSDATA_HTTPD_IP */
app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

