document.getElementById('verificar-btn').addEventListener('click', function() {
    const dni = document.getElementById('dni').value;
    const mensajeDisponibilidad = document.getElementById('mensaje-disponibilidad');
    
    if (dni) {
        fetch(`/dashboard/verificar/dni?dni=${dni}`)
            .then(response => response.json())
            .then(data => {
                if (!data.exists) {
                    mensajeDisponibilidad.textContent = 'El DNI no está disponible.';
                    mensajeDisponibilidad.classList.remove('disponible');
                    mensajeDisponibilidad.classList.add('no-disponible');
                } else {
                    mensajeDisponibilidad.textContent = 'El DNI está disponible.';
                    mensajeDisponibilidad.classList.remove('no-disponible');
                    mensajeDisponibilidad.classList.add('disponible');
                }
            })
            .catch(error => {
                console.error('Error al verificar el DNI:', error);
                mensajeDisponibilidad.textContent = 'Ocurrió un error al verificar el DNI.';
                mensajeDisponibilidad.classList.remove('disponible');
                mensajeDisponibilidad.classList.add('no-disponible');
            });
    } else {
        mensajeDisponibilidad.textContent = 'Por favor ingrese un DNI';
        mensajeDisponibilidad.classList.remove('disponible');
        mensajeDisponibilidad.classList.add('no-disponible');
    }
});