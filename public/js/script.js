document.addEventListener('DOMContentLoaded', () => {

    // https://restcountries.com/v3.1/all?fields=name,capital,flag,borders

    /* Formulario de inicio.... */
    const formulario = document.querySelector('form#iniciarJuego');
    const inputNombre = document.querySelector('#nombreJugador');
    const errorNombreSpan = document.getElementById('errorNombre');

    if (formulario) {
        formulario.addEventListener('submit', async (event) => {
            //Nota importante: mejor vamos a mandar el nombre por fech y lo guardamos en un json juntos con sus puntos tiempo ,etc todo en cero, es decir es un json de jugadore
            //se agrega al judaor a ese jeson y el servidor responde que el juego va a iniciar y redirecciona la pagina al apartado de pregunta donde se carga lo necesario


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
                event.preventDefault();
                return;
            }

            const form = event.target;
            const data = new FormData(form);

            try {
                const respuesta = await fetch('./preguntas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)

                });
                const resultado = await respuesta.json();
                console.log('Respuesta del servidor:', resultado);

                document.querySelector("p#info").innerHTML = resultado.msj



            } catch (error) {
                console.error('Error al enviar el formulario:', error.ok);
                document.querySelector("p#info").innerHTML = error.msj

            }


        });
    }

});//Load documnet las llamada cuando este cargado el dom , la funcione afuera


function mostrarError(mensaje) {
    errorNombreSpan.textContent = mensaje;
    errorNombreSpan.classList.remove('oculto');
}


