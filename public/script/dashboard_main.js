let reparacionesCount = 0;
const reparacionesIncrement = 2; // Por ejemplo, cambiar según la cantidad deseada por página
let loadedPages = []; // Array para almacenar las páginas cargadas

document.getElementById('loadMoreBtn').addEventListener('click', function() {
    reparacionesCount += reparacionesIncrement;
    loadReparaciones(reparacionesCount);
});

function loadReparaciones(count) {
    fetch(`/dashboard/reparaciones?reparaciones=${count}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('dynamicTableBody');
            tableBody.innerHTML = ''; // Limpiar el contenido actual del tableBody

            loadedPages = []; // Limpiar las páginas cargadas

            // Construir las páginas y almacenarlas en loadedPages
            let currentPageRows = [];
            data.personas.forEach(persona => {
                const reparacionesDePersona = data.reparaciones.filter(reparacion => reparacion.persona_id === persona.id);

                if (reparacionesDePersona.length > 0) {
                    reparacionesDePersona.forEach(reparacion => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${persona.nombre}</td>
                            <td>${persona.dni}</td>
                            <td>${reparacion.tipo}</td>
                            <td>${reparacion.fecha}</td>
                            <td>${reparacion.estado}</td>
                            <td>
                                <button class="boton_editar" onclick="redirectToEditar(${persona.id})">Editar</button>
                                <button class="boton_eliminar" onclick="eliminar(${persona.id})">Eliminar</button>
                                <button class="boton_informe" onclick="redirectToInforme(${persona.id})">Informe</button>
                            </td>
                        `;
                        currentPageRows.push(row); // Agregar fila a la página actual
                    });
                } 
                else {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${persona.nombre}</td>
                        <td>${persona.dni}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>
                            <button class="boton_editar" onclick="redirectToEditar(${persona.id})">Editar</button>
                            <button class="boton_eliminar" onclick="eliminar(${persona.id})">Eliminar</button>
                            <button class="boton_informe" onclick="redirectToInforme(${persona.id})">Informe</button>
                        </td>
                    `;
                    currentPageRows.push(row); // Agregar fila a la página actual
                }
            });

            // Dividir en páginas según reparacionesIncrement
            while (currentPageRows.length > 0) {
                loadedPages.push(currentPageRows.splice(0, reparacionesIncrement));
            }

            // Mostrar la primera página por defecto
            showPage(0);

            // Actualizar la paginación
            updatePagination(loadedPages.length);

        })
        .catch(error => console.error('Error fetching reparaciones:', error));
}

function updatePagination(numPages) {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= numPages; i++) {
        const pageLink = document.createElement('button');
        pageLink.classList.add('pagination-button');
        pageLink.textContent = `Tabla ${i}`;
        pageLink.onclick = () => showPage(i - 1); // -1 porque loadedPages es 0-indexado
        paginationContainer.appendChild(pageLink);
    }
}

function showPage(pageIndex) {
    const tableBody = document.getElementById('dynamicTableBody');
    tableBody.innerHTML = ''; // Limpiar el contenido actual del tableBody

    loadedPages[pageIndex].forEach(row => {
        tableBody.appendChild(row);
    });
}