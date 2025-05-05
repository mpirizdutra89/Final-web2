exports.nuevoJugador = (req, res) => {


    res.render('preguntas', { titulo: 'Incicio del juego' })
}

exports.ranki = (req, res) => {
    //mandar un json con los datos que necito mostrar mas el ranki
    //leer los datos del juego que deberian estar en un json
    res.render('ranki', { titulo: 'Ranki' })
}








function generarPregunta(paises, tipoPregunta) {
    //const tipoPregunta = Math.floor(Math.random() * 3); // vine una secuncia donde solo hay dos pregunta para bandera y de las otras 4 cada una
    let preguntaData = null
    let latin = true

    //console.log(paises)
    switch (tipoPregunta) {
        case 0: // ¿Cual es el país de la siguiente ciudad capital?
            let capital = ""
            let paisCapital = {}
            while (latin) {
                paisCapital = randomPais(paises)
                capital = paisCapital.capital?.[0]
                if (esTextoLatino(capital)) {
                    latin = false // sale del while y sigue con el codigo

                }
            }


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


            let namePais = ""
            let paisBandera = {}
            while (latin) {
                paisBandera = randomPais(paises)
                namePais = paisBandera.name.common
                if (esTextoLatino(namePais)) {
                    latin = false // sale del while y sigue con el codigo

                }
            }



            preguntaData = {
                tipo: 1,
                pregunta: `¿A qué país pertenece la siguiente bandera?`,
                banderaURL: paisBandera.flags.png,
                respuestaCorrecta: namePais,
                puntos: 5,
            };
            break;

        case 2: // ¿Cuantos países limítrofes tiene el siguiente país?

            let nombrePais = ""
            let paisFronteras = {}
            while (latin) {
                paisFronteras = randomPais(paises)
                nombrePais = paisFronteras.name.common
                if (esTextoLatino(nombrePais)) {
                    latin = false // sale del while y sigue con el codigo

                }
            }


            preguntaData = {
                tipo: 2,
                pregunta: `¿Cuántos países limítrofes tiene ${nombrePais}?`,
                respuestaCorrecta: paisFronteras.borders ? paisFronteras.borders.length.toString() : '0',
                puntos: 3,
            };
            break;
    }

    if (preguntaData) {

        const opciones = generarOpciones(preguntaData, paises)
        return { ...preguntaData, opciones: opciones }
    }

    return null
}


const randomPais = (paises) => {
    return paises[Math.floor(Math.random() * paises.length)]
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
    const secuencia = [0, 0, 0, 0, 1, 1, 2, 2, 2, 2]
    for (let i = 0; i < cantidad; i++) {
        const pregunta = generarPregunta(paises, secuencia[i]);
        if (pregunta) {
            listaDePreguntas.push(pregunta);
        }
    }
    const preguntasMezcladas = mezclarArrayFisherYates(listaDePreguntas);
    console.log(`generarListaDePreguntas(paises,10) cantida: ${listaDePreguntas.length} `)
    return preguntasMezcladas;
}







exports.obtenerPreguntasJuego = async (req, res) => {
    try {
        const restcountries = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,borders');
        if (!restcountries.ok) {
            console.error(`Error al obtener datos de países: ${restcountries.status} - ${restcountries.statusText}`);
            const preguntasLocal = dataLocal();
            console.log("Sirviendo preguntas locales debido a error de API.");
            return res.json({ ok: true, data: preguntasLocal });
        }
        const data = await restcountries.json();
        if (data.length > 0) {
            const preguntasConOpciones = generarListaDePreguntas(data);
            console.log("Preguntas obtenidas de la API:", preguntasConOpciones);
            res.json({ ok: true, data: preguntasConOpciones });
        } else {
            console.error("La API devolvió un array vacío.");
            const preguntasLocal = dataLocal();
            console.log("Sirviendo preguntas locales debido a array vacío de la API.");
            return res.json({ ok: true, data: preguntasLocal });
        }
    } catch (error) {
        /*  console.error('Error al obtener datos de países:', error); */
        const preguntasLocal = dataLocal();
        console.log("Sirviendo preguntas locales debido a error de conexión.");
        return res.json({ ok: true, data: preguntasLocal });
    }
};



const esTextoLatino = (texto) => {
    if (!texto) {
        return true; // Considerar una cadena vacía como latina
    }

    for (let i = 0; i < texto.length; i++) {
        const charCode = texto.charCodeAt(i);

        // Rangos de Unicode para letras latinas (mayúsculas y minúsculas)
        const esLatina = (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);

        // Rangos de Unicode para números
        const esNumero = charCode >= 48 && charCode <= 57;

        // Símbolos de puntuación y espacios comunes
        const esSimboloComun = [32, 33, 34, 39, 44, 45, 46, 58, 59, 63].includes(charCode);

        // Caracteres latinos extendidos (con acentos, diéresis, etc.)
        const esLatinaExtendida = (charCode >= 192 && charCode <= 255);

        if (!esLatina && !esNumero && !esSimboloComun && !esLatinaExtendida) {
            return false; // Encontramos un carácter que no parece latino, número o símbolo común
        }
    }

    return true; // Todos los caracteres parecen ser latinos, números o símbolos comunes
}


const mezclarArrayFisherYates = (array) => {
    const nuevoArray = [...array];
    let currentIndex = nuevoArray.length;


    while (currentIndex !== 0) {

        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;


        [nuevoArray[currentIndex], nuevoArray[randomIndex]] = [
            nuevoArray[randomIndex],
            nuevoArray[currentIndex],
        ];
    }

    return nuevoArray;
}


//si se cae la pagina de la api
function dataLocal() {
    const key = Math.floor(Math.random() * 3);
    let preguntas = []
    switch (key) {
        case 0:
            preguntas = [{ "tipo": 0, "pregunta": "¿Cuál es el país de la capital: Kinshasa?", "respuestaCorrecta": "DR Congo", "puntos": 3, "opciones": ["United States Minor Outlying Islands", "Pakistan", "South Georgia", "DR Congo"] }, { "tipo": 2, "pregunta": "¿Cuántos países limítrofes tiene Laos?", "respuestaCorrecta": "5", "puntos": 3, "opciones": ["3", "1", "5", "2"] }, { "tipo": 1, "pregunta": "¿A qué país pertenece la siguiente bandera?", "banderaURL": "https://flagcdn.com/w320/io.png", "respuestaCorrecta": "British Indian Ocean Territory", "puntos": 5, "opciones": ["British Indian Ocean Territory", "Luxembourg", "DR Congo", "British Virgin Islands"] }, { "tipo": 2, "pregunta": "¿Cuántos países limítrofes tiene Réunion?", "respuestaCorrecta": "0", "puntos": 3, "opciones": ["5", "0", "1", "2"] }, { "tipo": 0, "pregunta": "¿Cuál es el país de la capital: Bamako?", "respuestaCorrecta": "Mali", "puntos": 3, "opciones": ["Mali", "Martinique", "Jordan", "Belarus"] }, { "tipo": 1, "pregunta": "¿A qué país pertenece la siguiente bandera?", "banderaURL": "https://flagcdn.com/w320/ru.png", "respuestaCorrecta": "Russia", "puntos": 5, "opciones": ["Namibia", "Turks and Caicos Islands", "Bangladesh", "Russia"] }, { "tipo": 0, "pregunta": "¿Cuál es el país de la capital: Luxembourg?", "respuestaCorrecta": "Luxembourg", "puntos": 3, "opciones": ["Luxembourg", "Peru", "Latvia", "Burundi"] }, { "tipo": 0, "pregunta": "¿Cuál es el país de la capital: Tegucigalpa?", "respuestaCorrecta": "Honduras", "puntos": 3, "opciones": ["Honduras", "Uruguay", "Austria", "Dominica"] }, { "tipo": 1, "pregunta": "¿A qué país pertenece la siguiente bandera?", "banderaURL": "https://flagcdn.com/w320/cd.png", "respuestaCorrecta": "DR Congo", "puntos": 5, "opciones": ["Cape Verde", "Cambodia", "Togo", "DR Congo"] }, { "tipo": 2, "pregunta": "¿Cuántos países limítrofes tiene Kyrgyzstan?", "respuestaCorrecta": "4", "puntos": 3, "opciones": ["5", "1", "2", "4"] }]
            break;
        case 1:
            preguntas = [
                {
                    tipo: 2,
                    pregunta: '¿Cuántos países limítrofes tiene Mayotte?',
                    respuestaCorrecta: '0',
                    puntos: 3,
                    opciones: ['3', '5', '4', '0']
                },
                {
                    tipo: 1,
                    pregunta: '¿A qué país pertenece la siguiente bandera?',
                    banderaURL: 'https://flagcdn.com/w320/ph.png',
                    respuestaCorrecta: 'Philippines',
                    puntos: 5,
                    opciones: [
                        'British Indian Ocean Territory',
                        'Philippines',
                        'Dominican Republic',
                        'Republic of the Congo'
                    ]
                },
                {
                    tipo: 2,
                    pregunta: '¿Cuántos países limítrofes tiene Canada?',
                    respuestaCorrecta: '1',
                    puntos: 3,
                    opciones: ['6', '0', '1', '7']
                },
                {
                    tipo: 1,
                    pregunta: '¿A qué país pertenece la siguiente bandera?',
                    banderaURL: 'https://flagcdn.com/w320/mc.png',
                    respuestaCorrecta: 'Monaco',
                    puntos: 5,
                    opciones: ['Curaçao', 'Namibia', 'Guyana', 'Monaco']
                },
                {
                    tipo: 2,
                    pregunta: '¿Cuántos países limítrofes tiene Croatia?',
                    respuestaCorrecta: '5',
                    puntos: 3,
                    opciones: ['2', '0', '4', '5']
                },
                {
                    tipo: 0,
                    pregunta: '¿Cuál es el país de la capital: Plymouth?',
                    respuestaCorrecta: 'Montserrat',
                    puntos: 3,
                    opciones: [
                        'Turks and Caicos Islands',
                        'Angola',
                        'Montserrat',
                        'British Indian Ocean Territory'
                    ]
                },
                {
                    tipo: 1,
                    pregunta: '¿A qué país pertenece la siguiente bandera?',
                    banderaURL: 'https://flagcdn.com/w320/bi.png',
                    respuestaCorrecta: 'Burundi',
                    puntos: 5,
                    opciones: ['Lebanon', 'Mexico', 'Armenia', 'Burundi']
                },
                {
                    tipo: 0,
                    pregunta: '¿Cuál es el país de la capital: City of San Marino?',
                    respuestaCorrecta: 'San Marino',
                    puntos: 3,
                    opciones: [
                        'San Marino',
                        'Eritrea',
                        'Northern Mariana Islands',
                        'Caribbean Netherlands'
                    ]
                },
                {
                    tipo: 1,
                    pregunta: '¿A qué país pertenece la siguiente bandera?',
                    banderaURL: 'https://flagcdn.com/w320/gd.png',
                    respuestaCorrecta: 'Grenada',
                    puntos: 5,
                    opciones: ['Palestine', 'Montenegro', 'Namibia', 'Grenada']
                },
                {
                    tipo: 1,
                    pregunta: '¿A qué país pertenece la siguiente bandera?',
                    banderaURL: 'https://flagcdn.com/w320/ph.png',
                    respuestaCorrecta: 'Philippines',
                    puntos: 5,
                    opciones: ['Monaco', 'United States', 'Philippines', 'Bouvet Island']
                }
            ]
            break;
        case 2:
            preguntas = [{ "tipo": 0, "pregunta": "¿Cuál es el país de la capital: Kinshasa?", "respuestaCorrecta": "DR Congo", "puntos": 3, "opciones": ["United States Minor Outlying Islands", "Pakistan", "South Georgia", "DR Congo"] }, { "tipo": 2, "pregunta": "¿Cuántos países limítrofes tiene Laos?", "respuestaCorrecta": "5", "puntos": 3, "opciones": ["3", "1", "5", "2"] }, { "tipo": 1, "pregunta": "¿A qué país pertenece la siguiente bandera?", "banderaURL": "https://flagcdn.com/w320/io.png", "respuestaCorrecta": "British Indian Ocean Territory", "puntos": 5, "opciones": ["British Indian Ocean Territory", "Luxembourg", "DR Congo", "British Virgin Islands"] }, { "tipo": 2, "pregunta": "¿Cuántos países limítrofes tiene Réunion?", "respuestaCorrecta": "0", "puntos": 3, "opciones": ["5", "0", "1", "2"] }, { "tipo": 0, "pregunta": "¿Cuál es el país de la capital: Bamako?", "respuestaCorrecta": "Mali", "puntos": 3, "opciones": ["Mali", "Martinique", "Jordan", "Belarus"] }, { "tipo": 1, "pregunta": "¿A qué país pertenece la siguiente bandera?", "banderaURL": "https://flagcdn.com/w320/ru.png", "respuestaCorrecta": "Russia", "puntos": 5, "opciones": ["Namibia", "Turks and Caicos Islands", "Bangladesh", "Russia"] }, { "tipo": 0, "pregunta": "¿Cuál es el país de la capital: Luxembourg?", "respuestaCorrecta": "Luxembourg", "puntos": 3, "opciones": ["Luxembourg", "Peru", "Latvia", "Burundi"] }, { "tipo": 0, "pregunta": "¿Cuál es el país de la capital: Tegucigalpa?", "respuestaCorrecta": "Honduras", "puntos": 3, "opciones": ["Honduras", "Uruguay", "Austria", "Dominica"] }, { "tipo": 1, "pregunta": "¿A qué país pertenece la siguiente bandera?", "banderaURL": "https://flagcdn.com/w320/cd.png", "respuestaCorrecta": "DR Congo", "puntos": 5, "opciones": ["Cape Verde", "Cambodia", "Togo", "DR Congo"] }, { "tipo": 2, "pregunta": "¿Cuántos países limítrofes tiene Kyrgyzstan?", "respuestaCorrecta": "4", "puntos": 3, "opciones": ["5", "1", "2", "4"] }]
            break;

    }

    return preguntas
}


