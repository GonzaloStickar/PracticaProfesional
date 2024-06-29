function redirectToAgregar() {
    window.location.href = `/dashboard/agregar`;
}

function redirectToBuscar() {
    window.location.href = `/dashboard/buscar`;
}

function redirectToEditar(personaId, reparacionId) {
    window.location.href = `/dashboard/editar?persona_id=${personaId}&reparacion_id=${reparacionId}`;
}

function redirectToEliminar(personaId, reparacionId) {
    window.location.href = `/dashboard/eliminar?persona_id=${personaId}&reparacion_id=${reparacionId}`;
}

function redirectToInforme(personaId) {
    window.location.href = `/dashboard/informe?persona_id=${personaId}`;
}

function redirectToClientes() {
    window.location.href = `/dashboard/clientes`;
}

function redirectToUltimaBusqueda() {
    window.location.href = `/dashboard/ultima_busqueda`;
}