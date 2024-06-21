function redirectToAgregar() {
    window.location.href = `/dashboard/agregar`;
}

function redirectToBuscar() {
    window.location.href = `/dashboard/buscar`;
}

function redirectToEditar(personaId) {
    window.location.href = `/dashboard/editar?persona_id=${personaId}`;
}

//El de eliminar, seguramente sea un cartel de advertencia / alert
//que diga si realmente quiere eliminar la persona tal, con reparaciones tal, datos tal...

function redirectToInforme(personaId) {
    window.location.href = `/dashboard/informe?persona_id=${personaId}`;
}