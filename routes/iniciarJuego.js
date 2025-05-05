const express = require('express')
const router = express.Router();
const { nuevoJugador, obtenerPreguntasJuego, gurdarEstado, finJuego } = require('../controllers/preguntaController');




router.post('/gurdar-estado', gurdarEstado)
router.get('/fin-juego', finJuego)
router.get('/obtener-preguntas', obtenerPreguntasJuego)// ruta /iniciar-juego/ aca no hay nada
router.get('/', nuevoJugador)
//aca puede aver otroas que sean de tipo raiz o estaticas que no nesesite un tratamiento  como usuarios

module.exports = router