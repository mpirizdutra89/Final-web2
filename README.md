# 🎮 Preguntados - Juego de Preguntas y Respuestas

Este es un proyecto web desarrollado con **Node.js**, **Express** y **Pug**, que simula un juego tipo _Preguntados_, donde el usuario pone a prueba su conocimiento respondiendo preguntas de distintas categorías.

El diseño visual está hecho completamente con **CSS personalizado**, sin frameworks externos.

Además, el juego se alimenta de datos en tiempo real desde la API pública de **[REST Countries](https://restcountries.com/)** para generar algunas de las preguntas relacionadas con países del mundo.

## 🌟 Características principales

- 🎯 **3 tipos de preguntas**:
  - ¿Cuál es el país de esta capital?
  - ¿A qué país pertenece esta bandera?
  - ¿Cuántos países limítrofes tiene este país?
- 🧠 Cada pregunta tiene **4 opciones posibles**, de las cuales solo una es correcta.
- ✅ Al responder:
  - Si la respuesta es correcta, el sistema lo indica y permite avanzar.
  - Si es incorrecta, muestra la respuesta correcta y permite continuar.
- ⏱️ El juego tiene un total de **10 preguntas por partida**.
- 📊 Al finalizar, se muestra un resumen con:
  - Cantidad de respuestas correctas e incorrectas
  - Tiempo total de la partida
  - Tiempo promedio por pregunta
- 🏆 Incluye un **ranking con las 20 mejores partidas**, ordenadas por puntaje, cantidad de respuestas y tiempo.

## 🚀 Tecnologías utilizadas

- [Node.js](https://nodejs.org/) – entorno de ejecución JavaScript
- [Express](https://expressjs.com/) – framework para servidores web
- [Pug](https://pugjs.org/) – motor de plantillas para HTML
- [REST Countries API](https://restcountries.com/) – para obtener datos de países
- **CSS puro** – diseño y estilos hechos a mano

## 📁 Estructura basica del proyecto

preguntados/<br/>
├── public/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# CSS personalizado <br/>
├── routes/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Rutas del servidor Express<br/>
&nbsp;|── controllers/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Logica del juego<br/>
├── views/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Vistas en Pug<br/>
├── app.js &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Lógica principal del juego<br/>
└── README.md&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Descripcion y detalles importantes del sistema<br/>

Nota:EL directorio puede diferi, pero esta es, la estructura basica.<br/>

## ▶️ Cómo ejecutar el proyecto

1. Cloná el repositorio:

   ```bash
   git clone https://github.com/mpirizdutra89/Final-web2.git
   cd Final-web2 (ir al directorio de la clonacion)
   ```
