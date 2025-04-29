const express = require('express')
const router = express.Router();
const { nuevoJugador, obtenerPreguntasJuego, ranki } = require('../controllers/preguntaController');



router.get('/ranki', ranki)
router.get('/obtener-preguntas', obtenerPreguntasJuego)// ruta /iniciar-juego/ aca no hay nada
router.get('/', nuevoJugador)
//aca puede aver otroas que sean de tipo raiz o estaticas que no nesesite un tratamiento  como usuarios

module.exports = router