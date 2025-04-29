/* import { json } from "express" */

/* Variables */
const itemJugador = 'InicioJuego'
const itemPreguntaPaises = 'preguntaPaises'

const pathInicio = '/'
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
        tiempo_rpomedio: 0 //aca se va sumando el tiempo y depues lo divido por 10
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

export const iniciarTemporizadorPregunta = () => {
    startTime = performance.now();
}


export const registrarTiempoRespuest = () => {
    if (startTime) {
        const endTime = performance.now();
        const tiempoRespuesta = endTime - startTime;
        startTime = null; // Reinicia para la siguiente pregunta
        const estadoJuego = JSON.parse(getLocalJugador())
        estadoJuego.tiempo_rpomedio += tiempoRespuesta
    }
}

