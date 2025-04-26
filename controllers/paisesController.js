exports.obtenerPaises = async (req, res) => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,borders');
        const data = await response.json();
        res.json({ ok: true, data: data });
    } catch (error) {
        console.error('Error al obtener datos de países:', error);
        res.status(500).json({ ok: false, error: 'Error al obtener los datos de los países desde la API.' });
    }
};

