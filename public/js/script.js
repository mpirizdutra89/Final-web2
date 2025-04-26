const pathInicio = './'
const pathInicio_juego = '/iniciar-juego'
import { inicioDelJuego, creaEscribirNotificacion, leerNotificar, redireccionar } from '../../funciones/funcionesComunes.js';


document.addEventListener('DOMContentLoaded', () => {
    /* Vista de inicio carga */
    formularioInicio()

    /* Vista de pregunta*/



});//Load documnet las llamada cuando este cargado el dom , la funcione afuera


/* Funciones */

function formularioInicio() {
    /* Formulario de inicio.... */
    const formulario = document.querySelector('form#iniciarJuego');

    if (formulario) {

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
            const jugador = {
                nombre: form.nombre.value, // Accede al valor del input aquí
                inicio: true
            };
            localStorage.setItem('InicioJuego', JSON.stringify(jugador));

            redireccionar(pathInicio_juego)

        });
    }

    const preguntas_view = document.querySelector('#preguntas_view')

    if (preguntas_view) {
        inicioDelJuego()
    }

}

function mostrarError(mensaje) {
    errorNombreSpan.textContent = mensaje;
    errorNombreSpan.classList.remove('oculto');
}

