const express = require('express')
const router = express.Router();
const { nuevoJugador } = require('../controllers/preguntaController');




//router.post('/obtener-preguntas', obtenerPreguntasJuego)// ruta /iniciar-juego/ aca no hay nada
router.get('/', nuevoJugador)
//aca puede aver otroas que sean de tipo raiz o estaticas que no nesesite un tratamiento  como usuarios

module.exports = router