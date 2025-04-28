exports.nuevoJugador = (req, res) => {


    res.render('preguntas', { titulo: 'Incicio del juego' });
}

/* const { obtenerPaises } = require('./paisesController'); */





function generarPregunta(paises) {
    const tipoPregunta = Math.floor(Math.random() * 3);
    let preguntaData = null;

    switch (tipoPregunta) {
        case 0: // ¿Cual es el país de la siguiente ciudad capital?
            const paisCapital = paises[Math.floor(Math.random() * paises.length)];
            const capital = paisCapital.capital?.[0];
            if (capital) {
                preguntaData = {
                    tipo: 0,
                    pregunta: `¿Cuál es el país de la capital: ${capital}?`,
                    respuestaCorrecta: paisCapital.name.common,
                    puntos: 3,
                };
            }
            break;

        case 1: // El país xx esta representado por la siguiente bandera ¿?
            const paisBandera = paises[Math.floor(Math.random() * paises.length)];
            preguntaData = {
                tipo: 1,
                pregunta: `¿A qué país pertenece la siguiente bandera?`,
                banderaURL: paisBandera.flags.png,
                respuestaCorrecta: paisBandera.name.common,
                puntos: 5,
            };
            break;

        case 2: // ¿Cuantos países limítrofes tiene el siguiente país?
            const paisFronteras = paises[Math.floor(Math.random() * paises.length)];
            const nombrePais = paisFronteras.name.common;
            preguntaData = {
                tipo: 2,
                pregunta: `¿Cuántos países limítrofes tiene ${nombrePais}?`,
                respuestaCorrecta: paisFronteras.borders ? paisFronteras.borders.length.toString() : '0',
                puntos: 3,
            };
            break;
    }

    if (preguntaData) {

        const opciones = generarOpciones(preguntaData, paises);
        return { ...preguntaData, opciones: opciones };
    }

    return null;
}


function generarOpciones(pregunta, paises) {
    const opciones = new Set([pregunta.respuestaCorrecta]);
    while (opciones.size < 4) {
        let opcionIncorrecta = '';
        switch (pregunta.tipo) {
            case 0: // Capital
                const paisIncorrectoCapital = paises[Math.floor(Math.random() * paises.length)];
                opcionIncorrecta = paisIncorrectoCapital.name.common;
                break;
            case 1: // Bandera
                const paisIncorrectoBandera = paises[Math.floor(Math.random() * paises.length)];
                opcionIncorrecta = paisIncorrectoBandera.name.common;
                break;
            case 2: // Fronteras
                const numFronterasAleatorio = Math.floor(Math.random() * 10);
                const paisAleatorio = paises[Math.floor(Math.random() * paises.length)];
                const numFronterasPaisAleatorio = paisAleatorio.borders ? paisAleatorio.borders.length.toString() : numFronterasAleatorio.toString();
                opcionIncorrecta = numFronterasPaisAleatorio;
                break;
        }
        if (opcionIncorrecta && !opciones.has(opcionIncorrecta)) {
            opciones.add(opcionIncorrecta);
        }
    }
    return Array.from(opciones).sort(() => Math.random() - 0.5);
}


function generarListaDePreguntas(paises, cantidad = 10) {
    const listaDePreguntas = [];
    for (let i = 0; i < cantidad; i++) {
        const preguntaConOpciones = generarPregunta(paises);
        preguntaConOpciones.id = i + 1;
        if (preguntaConOpciones) {
            listaDePreguntas.push(preguntaConOpciones);
        }
    }
    return listaDePreguntas;
}



function generarListaDePreguntas(paises, cantidad = 10) {
    const listaDePreguntas = [];
    for (let i = 0; i < cantidad; i++) {
        const pregunta = generarPregunta(paises);
        if (pregunta) {
            listaDePreguntas.push(pregunta);
        }
    }
    return listaDePreguntas;
}




/* exports.obtenerPreguntasJuego = async (req, res) => {
    const respuestaPaises = await obtenerPaises(req, {
        json: (data) => data,
        status: (code) => ({ json: (error) => ({ ok: false, error: error.error }) })
    });
    console.log(respuestaPaises)
    if (respuestaPaises.ok) {
        const paises = respuestaPaises.data;
        const preguntasConOpciones = generarListaDePreguntas(paises);
        res.json({ ok: true, preguntas: preguntasConOpciones });
    } else {
        res.status(500).json(respuestaPaises);
    }
}; */

exports.obtenerPreguntasJuego = async (req, res) => {


    try {
        const restcountries = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,borders');
        const data = await restcountries.json();
        //  setTimeout(() => {
        if (data.length > 0) {
            const preguntasConOpciones = generarListaDePreguntas(data);
            // console.log(preguntasConOpciones)
            res.json({ ok: true, data: preguntasConOpciones });
        } else {
            res.status(500).json({ ok: false, data: `falla funcion obtnerPregunraJuego() Error HTTP: ${restcountries.status}` });
        }


        // }, 5000);


    } catch (error) {
        console.error('Error al obtener datos de países:', error);
        res.status(500).json({ ok: false, error: 'Error al obtener los datos de los países desde la API.' });
    }



};


