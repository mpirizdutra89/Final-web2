
//leer el ranki del json
exports.inicio = (req, res) => {
    let data = [
        { nombre: "Juan", puntos: 250 },
        { nombre: "Ana", puntos: 200 },
        { nombre: "Carlos", puntos: 150 },
        { nombre: "Luisa", puntos: 180 },
        { nombre: "Pedro", puntos: 220 }
    ];
    //console.log(data)
    // console.log(req.originalUrl)
    res.render('inicio', {
        ranking: data
    });
}