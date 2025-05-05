/* A notador:
    comandos (la consola deve estar en el mismo lugar o agregar la ruta a mano)
            node ruta/tu_script.js --agregar //El script te pedirá que ingreses la nota y le asignará un ID.
            node ruta/tu_script.js --leer //Se mostrarán todas las notas con sus respectivos IDs.
            node ruta/tu_script.js --borrar //node tu_script.js --borrar
    Modificar su package.json
      "scripts": {
            "start": "node app.js",
            "dev": "nodemon app.js",
            "notas-agregar": "node .notas_dev/notas.js --agregar",
            "notas-leer": "node .notas_dev/notas.js --leer",
            "notas-borrar": "node .notas_dev/notas.js --borrar"
    }

    lo usas
        npm run notas-agregar


*/

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});


const archivoNotas = path.join(__dirname, 'notas.json');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
/* async function leerNotasDesdeArchivo() {
    try {
        const contenido = await fs.readFile(archivoNotas, 'utf8');
        return JSON.parse(contenido);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error('Error al leer las notas:', error);
        return [];
    }
} */

async function leerNotasDesdeArchivo() {
    try {
        const contenido = await fs.readFile(archivoNotas, 'utf8');
        return JSON.parse(contenido);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // El archivo no existe, devolvemos un array vacío
            return [];
        } else if (error instanceof SyntaxError && error.message.includes('Unexpected end of JSON input')) {
            // El archivo está vacío o tiene JSON inválido, devolvemos un array vacío
            return [];
        }
        console.error('Error al leer las notas:', error);
        return [];
    }
}

async function guardarNotasEnArchivo(notas) {
    try {
        await fs.writeFile(archivoNotas, JSON.stringify(notas, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al guardar las notas:', error);
    }
}

async function agregarNotaConsola() {
    readline.question('Ingrese la nueva nota: ', async (nota) => {
        const notas = await leerNotasDesdeArchivo();
        const nuevoId = notas.length > 0 ? Math.max(...notas.map(n => n.id)) + 1 : 1;
        notas.push({ id: nuevoId, texto: nota });
        await guardarNotasEnArchivo(notas);
        console.log(`Nota con ID ${nuevoId} agregada.`);
        readline.close();
    });
}

async function leerNotasConsola() {
    const notas = await leerNotasDesdeArchivo();
    if (notas.length > 0) {
        console.log('\n--- Notas ---\n');
        notas.forEach(nota => {
            console.log(`ID: ${nota.id} - ${nota.texto}`);
        });
        console.log('\n--- Fin de Notas ---\n');
    } else {
        console.log('No hay notas guardadas.');
    }
    readline.close();
}

async function borrarNotaConsola() {
    readline.question('Ingrese el ID de la nota que desea borrar: ', async (idParaBorrar) => {
        const notas = await leerNotasDesdeArchivo();
        const idABorrar = parseInt(idParaBorrar);
        if (isNaN(idABorrar)) {
            console.log('Por favor, ingrese un ID válido.');
            readline.close();
            return;
        }

        const notasFiltradas = notas.filter(nota => nota.id !== idABorrar);

        if (notas.length === notasFiltradas.length) {
            console.log(`No se encontró ninguna nota con el ID ${idABorrar}.`);
        } else {
            await guardarNotasEnArchivo(notasFiltradas);
            console.log(`Nota con ID ${idABorrar} borrada.`);
        }
        readline.close();
    });
}

/* const argumento = process.argv[2];

if (argumento === '--agregar') {
    agregarNotaConsola();
} else if (argumento === '--leer') {
    leerNotasConsola();
} else if (argumento === '--borrar') {
    borrarNotaConsola();
} else {
    console.log('Uso: node tu_script.js --agregar | --leer | --borrar');
    readline.close();
} */

async function listarComandosConsola() {
    try {
        const contenidoPackageJson = await fs.readFile(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(contenidoPackageJson);
        if (packageJson && packageJson.scripts) {
            console.log('\n--- Comandos Disponibles (npm run ...) ---\n');
            for (const comando in packageJson.scripts) {
                console.log(`${comando}: ${packageJson.scripts[comando]}`);
            }
            console.log('\n--- Fin de Comandos ---\n');
        } else {
            console.log('No se encontraron scripts definidos en package.json.');
        }
    } catch (error) {
        console.error('Error al leer package.json:', error);
    }
    readline.close();
}

const argumento = process.argv[2];

if (argumento === '--agregar') {
    agregarNotaConsola();
} else if (argumento === '--leer') {
    leerNotasConsola();
} else if (argumento === '--borrar') {
    borrarNotaConsola();
} else if (argumento === '--comandos' || argumento === '--ayuda') {
    listarComandosConsola();
} else {
    console.log('Uso: node tu_script.js --agregar | --leer | --borrar | --comandos');
    readline.close();
}