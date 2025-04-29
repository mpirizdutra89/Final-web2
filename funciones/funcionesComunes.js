/* import { json } from "express" */

/* Variables */
const itemJugador = 'InicioJuego'
const itemPreguntaPaises = 'preguntaPaises'
const pathInicio = '/'


export const pathInicio_juego = '/iniciar-juego'


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

export const redireccionar = (url = pathInicio, parametros) => {

    window.location.replace(url);
}

export const creaEscribirNotificacion = (msj, url) => {
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
        preguntaIndex: 0,
        puntajeActual: 0,
        respuestasCorrectas: 0,
        respuestasIncorrectas: 0,
        tiempo_rpomedio: 0
    }
}

export async function obtenerPreguntas() {
    try {

        const response = await fetch('/iniciar-juego/obtener-preguntas');
        if (!response.ok) {
            throw new Error(`Error al cargar preguntas: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener preguntas:', error);
        return [];
    }
}

