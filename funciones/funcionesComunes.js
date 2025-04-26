export const inicioDelJuego = () => {
    const inicioDelJuego = localStorage.getItem('InicioJuego');

    if (inicioDelJuego) {
        const jugadorActual = JSON.parse(inicioJuegoGuardado);
        console.log(` Hay jugador`);
        return jugadorActual

    } else {
        console.log('No se encontró información de inicio de juego en localStorage.');
        redireccionar(pathInicio)
    }
    return
}

export const redireccionar = (url) => {
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


