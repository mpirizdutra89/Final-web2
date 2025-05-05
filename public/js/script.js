import { reproducirSonido, redireccionar, pathInicio_juego, setLocalJugador, getLocalJugador, puntajeTiempoReal, finJuego, getLocalJugador2, setLocalJugador2, HabilitarContenedorOpciones, nuevoJugador, obtenerPreguntas, pathRanki_juego, registrarTiempo, iniciarTemporizador, removerJugador, cantPreguntas, removerPaises, limpiar, setLocalPaises, getLocalPaises, visible, creaEscribirNotificacion } from '../../funciones/funcionesComunes.js';

const contenedor = document.querySelector("#contenedor_juego")
const contenedorOpciones = document.querySelector("#opciones")

let habilitarSiguiente = false;
contenedor.addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {

        if (event.target.id == 'next' && habilitarSiguiente) {
            reproducirSonido('click')
            siguiente()

        }

        if (event.target.classList.contains('opcion')) {
            const elemento = event.target;


            evaluarRepuesta(elemento)

            HabilitarContenedorOpciones(true, contenedorOpciones)
            registrarTiempo()
            habilitarSiguiente = true


        }
    }
});



formularioInicio_view()
iniciarJuego()
Ranquer()




//para borrar , para pruebas depues sacar








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
                mostrarError("¡Mínimo 3 caracteres, *dale*!", errorNombreSpan);
                hayError = true;
            } else if (nombreIngresado.length > 8) {
                mostrarError("¡Máximo 8 caracteres, tranqui!", errorNombreSpan);
                hayError = true;
            } else if (!soloAlfanumerico) {
                mostrarError("¡Solo letras y números, *pibe*!", errorNombreSpan);
                hayError = true;
            }

            if (hayError) {
                reproducirSonido('error')
                return; // Ya prevenimos la recarga al inicio
            }

            reproducirSonido('start')
            const form = event.target;
            const jugador = nuevoJugador(form.nombre.value)
            setLocalJugador(jugador)

            setTimeout(() => {
                redireccionar(pathInicio_juego)
            }, 1350);




        });
    }
    return;


}



function Ranquer() {

    let estadoJuego = JSON.parse(getLocalJugador())


    const btnResultado = document.querySelector("#btnResultados")
    const ranquer = document.querySelector("small#Ranquer")
    const cajaFin = document.querySelector("div#viewfin")
    const btnReiniciar = document.querySelector("a.boton-reiniciar")
    const botonCollapse = document.getElementById('boton-collapse');
    const contenidoCollapse = document.getElementById('contenido-collapse');

    if (botonCollapse) {

        const jugadorActual = JSON.parse(getLocalJugador2())
        const idUnico = document.querySelector("li#idUnico")
        const ul = document.querySelector("ul.ultimo-jugador")
        if (idUnico && jugadorActual) {
            console.log(jugadorActual)

            if (idUnico.textContent !== jugadorActual.idUnico) {
                ul.innerHTML = ''
                ul.innerHTML = `
                 <li id='idUnico' style='display:none'>${jugadorActual.idUnico}</li>
                <li>Nombre: <strong>${jugadorActual.nombre}</strong></li>
                <li>Nombre: <strong>${jugadorActual.puntajeActual}</strong></li>
                <li>Correctas: <strong>${jugadorActual.respuestasCorrectas}</strong></li>
                <li>Incorrectas: <strong>${jugadorActual.respuestasIncorrectas}</strong></li>
                <li>Tiempo total: <strong>${jugadorActual.tiempo_total}</strong></li>
                <li>Tiempo promedio: <strong>${jugadorActual.tiempo_promedio}</strong></li>
                `;
            }

        }



        botonCollapse.addEventListener('click', function () {
            contenidoCollapse.classList.toggle('mostrar');
            botonCollapse.textContent = contenidoCollapse.classList.contains('mostrar') ? 'Ocultar Ranking' : 'Ver Ranking';
        });
    }





    if (btnReiniciar) {
        if (!estadoJuego) {
            reiniciarTodo()
        }
        btnReiniciar.addEventListener("click", () => {
            reiniciarTodo()
        })
    }


    if (ranquer) {


        //Nota aca acon la ayuda del id verificar que lo que vine esta correcto Conisida con el id de local storage
        //

        cajaFin.style.visibility = 'hidden';
        btnResultado.style.visibility = 'visible';

        btnResultado.addEventListener('click', () => {
            btnResultado.style.visibility = 'hidden';
            cajaFin.style.visibility = 'visible';

            const duration = 5 * 1000;
            const end = Date.now() + duration;
            let animationFrameId;

            function frame() {
                confetti({
                    particleCount: 7,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });

                confetti({
                    particleCount: 7,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });

                if (Date.now() < end) {
                    animationFrameId = requestAnimationFrame(frame);
                }
            }
            reproducirSonido('exito')
            // Inicia la animación
            frame();
        })



        /*  */
    } else {

        cajaFin ? cajaFin.style.visibility = 'visible' : "";

        btnResultado ? btnResultado.style.visibility = 'hidden' : "";

    }
}

function mostrarPregunta(preguntaObj, index = 0) {

    const cajaPregunta = document.querySelector("#preguntas_view")
    const opciones = document.querySelector("#opciones")
    limpiar(cajaPregunta, opciones)

    if (preguntaObj.tipo !== 1) {
        cajaPregunta.innerHTML = `<h4 class='pregunta'>${preguntaObj.pregunta}</h4>`
    } else {
        cajaPregunta.innerHTML = `<h4 class='pregunta'>${preguntaObj.pregunta}</h4>
        <img class='flag' src='${preguntaObj.banderaURL}' alt='${preguntaObj.respuestaCorrecta}' />`
    }


    preguntaObj.opciones.forEach((item, i) => {
        opciones.innerHTML += `<button class='opcion' data-id='${i}' data-index='${index}' data-name='${item}'>${item}</button>`
    });

    document.querySelector(".banner").style.visibility = 'visible';

    habilitarSiguiente = false;
    HabilitarContenedorOpciones(false, contenedorOpciones)

    iniciarTemporizador(document.querySelector("span#tiempo"))
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

        let estadoJuego = JSON.parse(getLocalJugador())
        const listaPregunta = JSON.parse(getLocalPaises())

        if (estadoJuego) {
            document.querySelector("h2.name-jugador").innerHTML = `${estadoJuego.nombre}`
            puntajeTiempoReal(estadoJuego.puntajeActual, document.querySelector("span#puntaje"))


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
                /* console.log(listaPregunta, `Pregunta: ${estadoJuego.preguntaIndex}`) */
                // setTimeout(() => { }, 100);
                loaderspiner(false)
                if (estadoJuego.preguntaIndex < cantPreguntas) {
                    /* alert(estadoJuego.preguntaIndex) */
                    mostrarPregunta(listaPregunta[estadoJuego.preguntaIndex], estadoJuego.preguntaIndex)
                } else {
                    redireccionar(pathRanki_juego)
                }

            }




        } else {

            reiniciarTodo()
        }
    }



}





function mostrarError(mensaje, errorNombreSpan) {
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


                mostrarPregunta(listaPregunta[estadoJuego.preguntaIndex], estadoJuego.preguntaIndex)

            }




        }
    }
}
/*  */
//depues de evaluar si se actualiza la pagina vulve a preguntar y los puntos ya se sumaron ojo!!!!
function evaluarRepuesta(opcion) {


    const data_id = opcion.dataset.id // 1,2,3,4 son las opciones para identificarlas
    const data_index = opcion.dataset.index// index en la lista de  paises
    const data_name = opcion.dataset.name// name de cada opcion

    const listaPregunta = JSON.parse(getLocalPaises())
    let estadoJuego = JSON.parse(getLocalJugador())

    if (listaPregunta && estadoJuego) {
        //if (data_index >= 0 && data_index < listaPregunta.length) {
        /* const correcto = listaPregunta.find(lista => lista.respuestaCorrecta === data_name); */
        if (listaPregunta[data_index].respuestaCorrecta === data_name) {

            reproducirSonido('ok')
            opcion.classList.add('correcta')
            //puntaje y cantidad de respuestas correctas
            /*  alert(listaPregunta[data_index].puntos + " " + estadoJuego.puntajeActual) */
            estadoJuego.puntajeActual = parseInt(listaPregunta[data_index].puntos) + parseInt(estadoJuego.puntajeActual)
            estadoJuego.respuestasCorrectas++

        } else {
            reproducirSonido('error')
            opcion.classList.add('incorrecta')
            const buscar = listaPregunta[data_index].respuestaCorrecta
            const encontrado = document.querySelector(`[data-name='${buscar}']`)
            if (encontrado) {
                encontrado.classList.add('correcta')
            }
            //suma las preguntas incorrectas
            estadoJuego.respuestasIncorrectas++

        }
        estadoJuego.preguntaIndex++;

        setLocalJugador(estadoJuego)
        puntajeTiempoReal(estadoJuego.puntajeActual, document.querySelector("span#puntaje"))

        if (estadoJuego.preguntaIndex >= 10) {
            loaderspiner(true);
            (async () => {

                const resultado = await enviarDatos();
                console.log(resultado.data)
                setLocalJugador2(resultado.data)
                redireccionar(pathRanki_juego)

            })();
        }

        //leerObjeto(estadoJuego)
        //console.log(listaPregunta)

    }

}


async function enviarDatos() {
    const estadoJuego = JSON.parse(getLocalJugador())

    let resultado = {}
    if (estadoJuego) {
        resultado = await finJuego(estadoJuego);
    }


    return resultado;
}


const leerObjeto = (miObjeto) => {
    const entradas = Object.entries(miObjeto);

    entradas.forEach(([clave, valor]) => {
        console.log(`Clave: ${clave}, Valor: ${valor}`);
    });
}



