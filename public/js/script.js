import { redireccionar, pathInicio_juego, setLocalJugador, getLocalJugador, nuevoJugador, obtenerPreguntas, pathRanki_juego, registrarTiempo, iniciarTemporizador, removerJugador, cantPreguntas, removerPaises, limpiar, setLocalPaises, getLocalPaises, visible, creaEscribirNotificacion } from '../../funciones/funcionesComunes.js';

const contenedor = document.querySelector("#contenedor_juego")
contenedor.addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
        if (event.target.id == 'next') {
            siguiente()

        }

        if (event.target.classList.contains('opcion')) {
            const elemento = event.target;
            let estadoJuego = JSON.parse(getLocalJugador())
            if (evaluarRepuesta(elemento)) {
                //sumos puntos etc

                estadoJuego.puntajeActual = parseInt(listaPregunta[data_index].puntos) + parseInt(estadoJuego.puntaje)
                estadoJuego.respuestasCorrectas++
                setLocalJugador(estadoJuego)
            } else {
                //incorrectas
                estadoJuego.respuestasIncorrectas++
                setLocalJugador(estadoJuego)
            }
            registrarTiempo()//detiene el reloj depues de responder


        }
    }
});



formularioInicio_view()
iniciarJuego()





//para borrar , para pruebas depues sacar
const btnPruebas = document.querySelector("#btnPruebas")
btnPruebas.addEventListener("click", function () {
    reiniciarTodo()
})







/* Vista de inicio carga */

/* Control de preguntas */



//});//Load documnet las llamada cuando este cargado el dom , la funcione afuera


/* Funciones */

function formularioInicio_view() {
    /* Formulario de inicio.... */

    const formulario = document.querySelector('form#iniciarJuego');
    //permite verificar si el formulario esta
    if (formulario) {
        const estadoActual = getLocalJugador()
        //sale
        if (estadoActual) {
            !estadoActual.finalizo ? redireccionar(pathInicio_juego) : redireccionar(pathRanki_juego)//lo ejecuta solo en el inicio y si ya hay un judaor en la memoria del navegador

        }



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
    ]// miBoton.dataset.id;
  }, */



function mostrarPregunta(preguntaObj, index = 0) {

    const cajaPregunta = document.querySelector("#preguntas_view")
    const opciones = document.querySelector("#opciones")
    limpiar(cajaPregunta, opciones)

    if (preguntaObj.tipo !== 1) {
        cajaPregunta.innerHTML = `<h4 class='pregunta'>${preguntaObj.pregunta}</h4>`
    } else {
        cajaPregunta.innerHTML = `<img src='${preguntaObj.banderaURL}' alt='${preguntaObj.respuestaCorrecta}' />`
    }


    preguntaObj.opciones.forEach((item, i) => {
        opciones.innerHTML += `<button class='opcion' data-id='${i}' data-index='${index}' data-name='${item}'>${item}</button>`
    })

    iniciarTemporizador()
    //inicio el reloj
    //REspodo lo de tiene
    //le da siguiente , entra de nuevo aca y se inicia el ciclo
    //la idea sume los milisegundos

}



async function iniciarJuego() {
    // 
    const contenedor = document.querySelector('#preguntas_view')
    let index = 0
    if (contenedor) {

        loaderspiner(true)

        const estadoJuego = JSON.parse(getLocalJugador())
        const listaPregunta = JSON.parse(getLocalPaises())

        if (estadoJuego) {


            if (!listaPregunta) {
                const preguntaPaises = await obtenerPreguntas();
                if (preguntaPaises.ok) {
                    console.log(preguntaPaises.data)
                    loaderspiner(false)
                    setLocalPaises(preguntaPaises.data)
                    mostrarPregunta(preguntaPaises.data[estadoJuego.preguntaIndex], estadoJuego.preguntaIndex)
                    estadoJuego.preguntaIndex++;
                    setLocalJugador(estadoJuego)

                } else {
                    //fallo la peticion
                    creaEscribirNotificacion("No hay preguntas disponibles, se callo el servicio")
                    reiniciarTodo()

                    //
                }
            } else {
                console.log(listaPregunta, `Pregunta: ${estadoJuego.preguntaIndex}`)
                // setTimeout(() => { }, 100);
                loaderspiner(false)
                if (estadoJuego.preguntaIndex < cantPreguntas) {
                    /* alert(estadoJuego.preguntaIndex) */
                    mostrarPregunta(listaPregunta[estadoJuego.preguntaIndex], estadoJuego.preguntaIndex)
                } else {
                    //ir al ranki
                    // redireccionar()
                }

            }




        } else {

            reiniciarTodo()
        }
    }



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



function reiniciarTodo() {
    removerJugador()
    removerPaises()
    redireccionar()
}

function siguiente() {
    const listaPregunta = JSON.parse(getLocalPaises())
    let estadoJuego = JSON.parse(getLocalJugador())
    let index = estadoJuego.preguntaIndex
    if (listaPregunta) {

        if (listaPregunta.length > 0) {
            if (index < cantPreguntas) {

                estadoJuego.preguntaIndex++;
                mostrarPregunta(listaPregunta[estadoJuego.preguntaIndex], estadoJuego.preguntaIndex)
                setLocalJugador(estadoJuego)
            }




        }
    }
}
/*  */
//Nota FAlta controlar que una vez se evalue la repsueta sea como sea, ya no se puede tocar esos botones y activar el boton sigueinte para seguir
//falta sumar puntajes y
function evaluarRepuesta(opcion) {
    const evaluar = false;

    const data_id = opcion.dataset.id // 1,2,3,4 son las opciones para identificarlas
    const data_index = opcion.dataset.index// index en la lista de  paises
    const data_name = opcion.dataset.name// name de cada opcion

    const listaPregunta = JSON.parse(getLocalPaises())


    if (listaPregunta) {
        //if (data_index >= 0 && data_index < listaPregunta.length) {
        /* const correcto = listaPregunta.find(lista => lista.respuestaCorrecta === data_name); */
        if (listaPregunta[data_index].respuestaCorrecta === data_name) {

            evaluar = true;
            opcion.classList.add('correcta')
        } else {

            opcion.classList.add('incorrecta')
            const buscar = listaPregunta[data_index].respuestaCorrecta
            const encontrado = document.querySelector(`[data-name='${buscar}']`)
            if (encontrado) {
                encontrado.classList.add('correcta')
            }
        }
        // }
    }
    return false;
}



