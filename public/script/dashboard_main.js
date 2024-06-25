let reparacionesCount = 0;
const reparacionesIncrement = 2; // Por ejemplo, cambiar según la cantidad deseada por página
let loadedPages = []; // Array para almacenar las páginas cargadas

document.addEventListener('DOMContentLoaded', function() {
    reparacionesCount += reparacionesIncrement;
    loadReparaciones(reparacionesCount);
});

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
                            <td>${reparacion.tipo}</td>
                            <td>${reparacion.fecha}</td>
                            <td>${reparacion.estado}</td>
                            <td>
                                <button class="boton_editar" onclick="redirectToEditar(${persona.id}, ${reparacion.id})">Editar</button>
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
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>
                            <button class="boton_editar" onclick="redirectToEditar(${persona.id}, 'undefined')">Editar</button>
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
        pageLink.textContent = `${i}`; // Tabla ${i}
        pageLink.onclick = () => {
            showPage(i - 1); // -1 porque loadedPages es 0-indexado
            selectPage(i);
        };
        paginationContainer.appendChild(pageLink);
    }

    //Cada vez que se apreta el botón Cargar Más, redirige a showPage(0) y selectPage(1)
    //showPage(0) es para mostrar la tabla (en este caso la tabla 0 o tabla primaria)
    //selectPage(1) tiene una única funcionalidad que es solamente añadir y sacar estilos (estilo 'selected')
    showPage(0);
    selectPage(1);
}

function selectPage(pageNumber) {
    // Eliminar 'selected de todos los botones'
    const buttons = document.querySelectorAll('.pagination-button');
    buttons.forEach(button => button.classList.remove('selected'));

    // Añadir selected a la clase button seleccionada
    const button = buttons[pageNumber - 1]; // pageNumber - 1 porque buttons es 0-indexado
    if (button) {
        button.classList.add('selected');
    } else {
        console.error(`Button for page ${pageNumber} not found.`);
    }

    const selectedButtons = document.querySelectorAll('.pagination-button.selected');
    if (selectedButtons.length === 0) {
        const firstButton = buttons[0];
        if (firstButton) {
            firstButton.classList.add('selected');
        }
    }
}

function showPage(pageIndex) {
    const tableBody = document.getElementById('dynamicTableBody');
    tableBody.innerHTML = ''; // Limpiar el contenido actual del tableBody

    loadedPages[pageIndex].forEach(row => {
        tableBody.appendChild(row);
    });
}