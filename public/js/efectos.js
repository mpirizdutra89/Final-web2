document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('ranking-table');
    const tbody = table.querySelector('tbody');


    let data = [
        { nombre: "Juan", puntos: 250 },
        { nombre: "Ana", puntos: 200 },
        { nombre: "Carlos", puntos: 150 },
        { nombre: "Luisa", puntos: 180 },
        { nombre: "Pedro", puntos: 220 }
    ];

    function renderTabla() {
        tbody.innerHTML = '';
        data.sort((a, b) => b.puntos - a.puntos);
        data.forEach((jugador, index) => {
            const row = tbody.insertRow();
            row.dataset.puntos = jugador.puntos;
            row.innerHTML = `
          <td class="rank">${index + 1}</td>
          <td class="nombre">${jugador.nombre}</td>
          <td class="puntos2">${jugador.puntos}</td>
        `;
        });
        actualizarRanks();
    }

    function actualizarRanks() {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.querySelector('.rank').textContent = index + 1;
        });
    }



    function agregarRanki() {
        if (nuevoNombre && !isNaN(nuevosPuntos)) {
            agregarNuevoJugador({ nombre: nuevoNombre, puntos: nuevosPuntos });
        }
    }

    function agregarNuevoJugador(nuevoJugador) {
        const nuevaFila = tbody.insertRow(0);
        nuevaFila.innerHTML = `
        <td class="rank"></td>
        <td class="nombre">${nuevoJugador.nombre}</td>
        <td class="puntos2">${nuevoJugador.puntos}</td>
      `;
        nuevaFila.style.backgroundColor = '#f0f8ff';

        let currentIndex = 0;
        const rowCount = tbody.rows.length;
        const animationSteps = 10;
        const animationDuration = 3000; // Reduje la duración para probar más rápido
        const stepDelay = animationDuration / animationSteps;

        function moveDownUpAndFindSpot() {
            if (!nuevaFila.parentNode) {
                return;
            }

            if (currentIndex < rowCount * 2 - 1) {
                const moveDown = currentIndex < rowCount;
                const indexToMoveTo = moveDown ? currentIndex : rowCount - 1 - (currentIndex - rowCount);
                if (indexToMoveTo >= 0 && indexToMoveTo < rowCount) {
                    const referenceRow = tbody.rows[indexToMoveTo];
                    if (nuevaFila !== referenceRow) {
                        tbody.insertBefore(nuevaFila, referenceRow.nextSibling);
                    }
                }
                currentIndex++;
                setTimeout(moveDownUpAndFindSpot, stepDelay / 2);
            } else {
                // Reordenar la data y la tabla
                data.push(nuevoJugador);
                data.sort((a, b) => b.puntos - a.puntos);
                renderTablaWithFinalMove(nuevoJugador);
            }
        }

        moveDownUpAndFindSpot();
    }

    function renderTablaWithFinalMove(nuevoJugador) {
        tbody.innerHTML = '';
        data.forEach((jugador, index) => {
            const row = tbody.insertRow();
            row.dataset.puntos = jugador.puntos;
            row.innerHTML = `
          <td class="rank">${index + 1}</td>
          <td class="nombre">${jugador.nombre}</td>
          <td class="puntos2">${jugador.puntos}</td>
        `;
            if (jugador === nuevoJugador) {
                row.classList.add('recien-agregado');
                animateToPosition(row, index);
            }
        });
        actualizarRanks();
    }

    function animateToPosition(row, targetIndex) {
        const currentRowIndex = Array.from(tbody.rows).indexOf(row);
        const stepDelay = 100; // Ajusta la velocidad del movimiento final

        function moveStep() {
            const currentIndex = Array.from(tbody.rows).indexOf(row);
            if (currentIndex < targetIndex) {
                if (currentIndex + 1 < tbody.rows.length) {
                    tbody.insertBefore(row, tbody.rows[currentIndex + 1]);
                    setTimeout(moveStep, stepDelay);
                }
            } else if (currentIndex > targetIndex) {
                tbody.insertBefore(row, tbody.rows[currentIndex]);
                setTimeout(moveStep, stepDelay);
            }
        }

        moveStep();
    }

    renderTabla();
});