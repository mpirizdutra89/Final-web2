//Aca la idea es manejar routas de la raiz ejemplo http://localhost:3000/   o http://localhost:3000/inicio



exports.preguntas = (req, res) => {
    const nombreRecibido = req.body.nombre;
    console.log(req.body)
    console.log('Nombre recibido por POST:', nombreRecibido);
    res.render('preguntas', { nombre: nombreRecibido, titulo: 'Incicio del juego' });
}



exports.paises = async (req, res) => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,flag,borders');
        const data = await response.json();
        console.log(data)
        res.json({
            ok: true,
            data: data
        });
    } catch (error) {
        console.error('Error al obtener datos de países:', error);
        res.status(500).json({
            ok: false,
            error: 'Error al obtener los datos de los países desde la API.'

        });
    }
};
