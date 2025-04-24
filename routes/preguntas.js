const express = require('express')
const router = express.Router();
const { preguntas, paises } = require('../controllers/preguntaController');



router.post('/paises', paises)
router.post('/', preguntas)

//aca puede aver otroas que sean de tipo raiz o estaticas que no nesesite un tratamiento  como usuarios

module.exports = router