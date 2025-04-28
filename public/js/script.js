
import { redireccionar, pathInicio_juego, setLocalJugador, getLocalJugador, nuevoJugador, obtenerPreguntas, removerJugador } from '../../funciones/funcionesComunes.js';


document.addEventListener('DOMContentLoaded', () => {
    /* Vista de inicio carga */
    /* removerJugador() para prbar */
    // console.log(`Jugador: ${JSON.parse(getLocalJugador())?.fecha}`)//? es para evitar errores si no esxite la propiedad
    formularioInicio_view()




    /* Vista de pregunta*/



});//Load documnet las llamada cuando este cargado el dom , la funcione afuera

iniciarJuego()
/* Funciones */

function formularioInicio_view() {
    /* Formulario de inicio.... */

    const formulario = document.querySelector('form#iniciarJuego');
    //permite verificar si el formulario esta
    if (formulario) {
        if (getLocalJugador()) { redireccionar(pathInicio_juego) }//lo ejecuta solo en el inicio y si ya hay un judaor en la memoria del navegador
        const inputNombre = document.querySelector('#nombreJugador');
        const errorNombreSpan = document.getElementById('errorNombre');

        formulario.addEventListener('submit', async (event) => {
            event.preventDefault(); // <--- ¡Mueve esto al principio!

            errorNombreSpan.classList.add('oculto');
            const nombreIngresado = inputNombre.value.trim();
            const soloAlfanumerico = /^[a-zA-Z0-9]+$/.test(nombreIngresado);
            let hayError = false;

            if (nombreIngresado.length < 3) {
                mostrarError("¡Mínimo 3 caracteres, *dale*!");
                hayError = true;
            } else if (nombreIngresado.length > 8) {
                mostrarError("¡Máximo 8 caracteres, tranqui!");
                hayError = true;
            } else if (!soloAlfanumerico) {
                mostrarError("¡Solo letras y números, *pibe*!");
                hayError = true;
            }

            if (hayError) {
                return; // Ya prevenimos la recarga al inicio
            }

            const form = event.target;
            const jugador = nuevoJugador(form.nombre.value)
            setLocalJugador(jugador)


            redireccionar(pathInicio_juego)

        });
    }
    return;
    /*    
   
       if (preguntas_view) {
           inicioDelJuego()
       } */

}

/*  tipo: 1,
    pregunta: '¿A qué país pertenece la siguiente bandera?',
    banderaURL: 'https://flagcdn.com/w320/ky.png',
    respuestaCorrecta: 'Cayman Islands',
    puntos: 5,
    opciones: [
      'Cayman Islands',
      'Ivory Coast',
      'South Georgia',
      'Marshall Islands'
    ]
  }, */
function mostrarPregunta(preguntaObj, index) {

    const preguntaActual = document.querySelector("#preguntaActual")
    const opciones = document.querySelector("#opciones")
    // miBoton.dataset.id;
    preguntaActual.innerHTML = preguntaObj.pregunta
    preguntaObj.opciones.forEach(item => {
        opciones.innerHTML += `<button class='opcion' data-id='${index}'>${item}</button>`
    });//

}



async function iniciarJuego() {
    loaderspiner(true)
    const preguntas = document.querySelector('#preguntas_view')

    if (preguntas) {
        //hay que verificar el estado
        const estadoJuego = JSON.parse(getLocalJugador())
        if (estadoJuego) {
            if (estadoJuego.inicio) {

                const preguntas = await obtenerPreguntas();

                console.log(preguntas.data)
                siguientePregunta(preguntas, estadoJuego)



            }
        }
    }
    loaderspiner(false)


}





function mostrarError(mensaje) {
    errorNombreSpan.textContent = mensaje;
    errorNombreSpan.classList.remove('oculto');
}


function loaderspiner(activo) {
    const contenedorJuego = document.querySelector(".contenedor-juego")
    const contenedorSpiner = document.querySelector(".sk-folding-cube-container")
    if (activo) {
        contenedorJuego.style.display = 'none';
        contenedorSpiner.style.display = 'block'
    } else {
        contenedorSpiner.style.display = 'none'
        contenedorJuego.style.display = 'flex';
    }

}

function siguientePregunta(preguntas, estadoJuego) {
    if (preguntas.ok) {
        if (preguntas.data.length > 0) {
            const data = preguntas.data[0]
            mostrarPregunta(data, 0) //para prueba rapida el cero serial los index del array


        }
    }
}


/* Nota, cada vez que se actualiza vuelve a cargar las preguntas la idea es que no */