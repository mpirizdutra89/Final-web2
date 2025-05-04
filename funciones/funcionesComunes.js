/* import { json } from "express" */

/* Variables */
const itemJugador = 'InicioJuego'
const itemPreguntaPaises = 'preguntaPaises'

const pathInicio = '/'

const sonidos = {
    start: new Audio('../efectos/start.mp3'),
    click: new Audio('../efectos/level.mp3'),
    ok: new Audio('../efectos/ok.mp3'),
    error: new Audio('../efectos/error.mp3'),
    exito: new Audio('../efectos/playwing.mp3')
}
export const cantPreguntas = 10

export const pathInicio_juego = '/iniciar-juego'
export const pathRanki_juego = '/iniciar-juego/ranki'


let startTime = 0

/* Funciones */



export const inicioDelJuego = () => {
    const jugador = getLocalJugador()

    if (jugador) {
        const jugadorActual = JSON.parse(jugador);
        console.log(` Hay jugador: ${jugadorActual}`);
        return jugadorActual

    } else {
        console.log('No se encontró información de inicio de juego en localStorage.');
        redireccionar()
    }
    return
}

export const redireccionar = (url = pathInicio) => {

    window.location.replace(url);
}

export const creaEscribirNotificacion = (msj, url = pathInicio_juego) => {
    const notificacionGuardada = localStorage.getItem('notificacion');
    const notificacion = {
        mensaje: msj,
        path: url // de donde se produce el promblema
    };
    //exite y solo cambia el msj
    if (notificacionGuardada) {
        const notificacion = JSON.parse(notificacionGuardada);
        notificacion.mensaje = msj;
        notificacion.path = url;

        localStorage.setItem('notificacion', JSON.stringify(notificacion));
    } else {
        localStorage.setItem('notificacion', JSON.stringify(notificacion));
    }

}
export const leerNotificar = () => {
    const notificacionGuardada = localStorage.getItem('notificacion');

    //exite y solo cambia el msj
    if (notificacionGuardada) {
        return JSON.parse(notificacionGuardada);
    }
    return false;
}




export const removerJugador = () => {
    localStorage.removeItem(itemJugador)

}
export const removerPaises = () => {
    localStorage.removeItem(itemPreguntaPaises)
}


export const setLocalJugador = (objeto) => {
    localStorage.setItem(itemJugador, JSON.stringify(objeto));
}
export const setLocalPaises = (objeto) => {
    localStorage.setItem(itemPreguntaPaises, JSON.stringify(objeto));
}

export const getLocalJugador = () => {
    return localStorage.getItem(itemJugador)
}
export const getLocalPaises = () => {
    return localStorage.getItem(itemPreguntaPaises)
}

export const fechaHoy = () => {
    const hoy = new Date();
    return hoy.toLocaleDateString();
}


export const nuevoJugador = (name) => {
    return {
        nombre: name,
        inicio: true,// el true es que esta jugando
        finalizo: false,
        fecha: fechaHoy(),
        preguntaIndex: 0,//ni idea jajaja
        puntajeActual: 0,
        respuestasCorrectas: 0,
        respuestasIncorrectas: 0,
        tiempo_promedio: 0 //aca se va sumando el tiempo y depues lo divido por 10
    }
}

export async function obtenerPreguntas() {
    try {

        const response = await fetch('/iniciar-juego/obtener-preguntas');
        /* if (!response.ok) {
            throw new Error(`Error al cargar preguntas: ${response.status}`);
        } */

        return await response.json();
    } catch (error) {
        console.error('Error al obtener preguntas:', error);
        return [{ ok: false, data: `Ocurrio un fallo en la obtencion de datos` }];
    }
}



export const visible = (op, elemento) => {
    if (op) {
        elemento.style.visibility = 'visible'
    } else {
        elemento.style.visibility = 'hidden'
    }
}

export const limpiar = (preguntas, opciones) => {
    preguntas.innerHTML = ''
    opciones.innerHTML = ''

}



export const HabilitarContenedorOpciones = (op, contenedor) => {
    contenedor.classList.remove('contenedor-deshabilitado');
    if (op) {
        contenedor.classList.add('contenedor-deshabilitado');
    }

}

export const puntajeTiempoReal = (puntos, elemento) => {
    elemento.innerHTML = "0"

    elemento.innerHTML = puntos
}

const leerObjeto = (miObjeto) => {
    const entradas = Object.entries(miObjeto);

    entradas.forEach(([clave, valor]) => {
        console.log(`Clave: ${clave}, Valor: ${valor}`);
    });
}

/* export function iniciarReloj(elementoId) {
    function actualizarReloj() {
      const ahora = new Date();
      const horas = ahora.getHours().toString().padStart(2, '0');
      const minutos = ahora.getMinutes().toString().padStart(2, '0');
      const segundos = ahora.getSeconds().toString().padStart(2, '0');
      const horaActual = `<span class="math-inline">\{horas\}\:</span>{minutos}:${segundos}`;
      const elementoReloj = document.getElementById(elementoId);
      if (elementoReloj) {
        elementoReloj.textContent = horaActual;
      } else {
        console.error(`Elemento con ID '${elementoId}' no encontrado para el reloj.`);
      }
    }
  
    actualizarReloj();
    setInterval(actualizarReloj, 1000);
  } */


/* Temporizador */
/* export const iniciarTemporizador = () => {
    startTime = performance.now();
} */


/* export const registrarTiempo = () => {
    if (startTime) {
        const endTime = performance.now();
        const tiempoRespuesta = endTime - startTime;
        startTime = null; // Reinicia para la siguiente pregunta
        let estadoJuego = JSON.parse(getLocalJugador())

        estadoJuego.tiempo_promedio += tiempoRespuesta
        setLocalJugador(estadoJuego)

    }
} */

//______________

/* export let startTime = 0; */
let intervaloTiempo; // Para almacenar el ID del intervalo

// Inicia el temporizador guardando el tiempo de inicio
export const iniciarTemporizador = (elementoTiempo) => {
    startTime = performance.now();
    // Opcional: Iniciar la visualización del tiempo transcurrido inmediatamente
    iniciarVisualizacionTiempo(elementoTiempo);
};

// Detiene el temporizador y calcula el tiempo transcurrido Gaurdo los datos
export const registrarTiempo = () => {
    const endTime = performance.now();
    const tiempoTranscurridoMs = endTime - startTime;
    const tiempoTranscurrido = formatearTiempo(tiempoTranscurridoMs);

    let estadoJuego = JSON.parse(getLocalJugador())

    estadoJuego.tiempo_promedio += Math.floor((tiempoTranscurridoMs % (1000 * 60)) / 1000);
    setLocalJugador(estadoJuego)

    detenerVisualizacionTiempo();

    // return tiempoTranscurridoMs;
};





/**
 * Reproduce un sonido basado en el nombre proporcionado.
 *
 * @param {string} nombreSonido - El nombre del sonido a reproducir.
 * Las opciones válidas son las claves del
 * objeto 'sonidos' (ej: 'click', 'ok', 'error', 'exito').
 */
export const reproducirSonido = (nombreSonido) => {
    if (sonidos.hasOwnProperty(nombreSonido)) {
        sonidos[nombreSonido].play();
    } /* else {
        console.warn(`El sonido "${nombreSonido}" no está definido en el objeto 'sonidos'.`);
    } */
}

// Formatea el tiempo en milisegundos a un formato legible (MM:SS o similar)
const formatearTiempo = (ms) => {
    const minutos = Math.floor(ms / (1000 * 60));
    const segundos = Math.floor((ms % (1000 * 60)) / 1000);
    const segundosStr = segundos.toString().padStart(2, '0');
    return `${minutos}:${segundosStr}`;
    // O puedes agregar milisegundos si necesitas más precisión:
    // const milisegundos = Math.floor(ms % 1000).toString().padStart(3, '0');
    // return `${minutos}:${segundosStr}:${milisegundos}`;
};

// Opcional: Función para visualizar el tiempo transcurrido en tiempo real (mientras corre) = "span#tiempo"
const iniciarVisualizacionTiempo = (elementoTiempo) => {


    intervaloTiempo = setInterval(() => {
        const tiempoActualMs = performance.now() - startTime;
        elementoTiempo.textContent = formatearTiempo(tiempoActualMs);
    }, 100); // Actualiza cada 100 milisegundos para una sensación más fluida
};

// Opcional: Función para detener la visualización continua del tiempo
const detenerVisualizacionTiempo = () => {
    clearInterval(intervaloTiempo);
};