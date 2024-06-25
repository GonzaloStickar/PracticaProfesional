document.getElementById('verificar-btn').addEventListener('click', function() {
    const nombre = document.getElementById('nombre').value;
    const mensajeDisponibilidad = document.getElementById('mensaje-disponibilidad');
    
    if (nombre) {
        fetch(`/dashboard/verificar/nombre_apellido?nombre=${encodeURIComponent(nombre)}`)
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    mensajeDisponibilidad.textContent = 'El nombre y apellido no están disponibles.';
                    mensajeDisponibilidad.classList.remove('disponible');
                    mensajeDisponibilidad.classList.add('no-disponible');
                } else {
                    mensajeDisponibilidad.textContent = 'El nombre y apellido están disponibles.';
                    mensajeDisponibilidad.classList.remove('no-disponible');
                    mensajeDisponibilidad.classList.add('disponible');
                }
            })
            .catch(error => {
                console.error('Error al verificar el nombre y apellido:', error);
                mensajeDisponibilidad.textContent = 'Ocurrió un error al verificar el nombre y apellido.';
                mensajeDisponibilidad.classList.remove('disponible');
                mensajeDisponibilidad.classList.add('no-disponible');
            });
    } else {
        mensajeDisponibilidad.textContent = 'Por favor ingrese un nombre y apellido';
        mensajeDisponibilidad.classList.remove('disponible');
        mensajeDisponibilidad.classList.add('no-disponible');
    }
});