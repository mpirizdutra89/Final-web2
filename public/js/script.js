
import { redireccionar, pathInicio_juego, setLocalJugador, getLocalJugador, nuevoJugador, obtenerPreguntas, removerJugador, removerPaises, setLocalPaises, getLocalPaises } from '../../funciones/funcionesComunes.js';


document.addEventListener('DOMContentLoaded', () => {
    /* Vista de inicio carga */

    /*  removerJugador()
     removerPaises() */
    formularioInicio_view()



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
function mostrarPregunta(preguntaObj, index = 0) {

    const preguntaActual = document.querySelector("#preguntaActual")
    const preguntaImg = document.querySelector("#preguntaImg")
    const opciones = document.querySelector("#opciones")
    // miBoton.dataset.id;
    const tipo = parseInt(preguntaObj.tipo)

    if (tipo != 1) {
        preguntaActual.innerHTML = preguntaObj.pregunta
    } else {
        preguntaImg.src = preguntaObj.banderaURL
    }


    preguntaObj.opciones.forEach(item => {
        opciones.innerHTML += `<button class='opcion' data-id='${index}'>${item}</button>`
    });//

}



async function iniciarJuego() {
    loaderspiner(true)
    const contenedor = document.querySelector('#preguntas_view')

    if (contenedor) {
        //hay que verificar el estado
        const estadoJuego = JSON.parse(getLocalJugador())
        const listaPregunta = JSON.parse(getLocalPaises())

        if (estadoJuego && estadoJuego?.inicio) {

            if (!listaPregunta) {// entra cuando no esta en local storage
                const preguntaPaises = await obtenerPreguntas();
                if (preguntaPaises.ok) {
                    setLocalPaises(preguntaPaises.data)
                }
            }
            console.log("Datos directos de obtnerPreguntas()", listaPregunta)
            //cada vez que se actualiza muestra la ultima pregunta
            const index = parseInt(estadoJuego.preguntaIndex)
            mostrarPregunta(listaPregunta[4])


        } else {
            //el estado del juego no esta o esta en false, de cualquier manera no se puede jugar volve al inicio
            //redireccionar juego
            redireccionar()// por defecto vulve al inicio
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

function siguientePregunta(index = 0) {
    const listaPregunta = JSON.parse(getLocalPaises())
    /* const estadoJuego = JSON.parse(getLocalJugador()) */
    if (listaPregunta && listaPregunta?.ok) {
        if (listaPregunta.data.length > 0) {
            mostrarPregunta(listaPregunta.data[estadoJuego?.preguntaIndex])
        }
    }
}

function ControlPreguntas() {
    const next = document.querySelector("button#next")

}


/* Nota, cada vez que se actualiza vuelve a cargar las preguntas la idea es que no */