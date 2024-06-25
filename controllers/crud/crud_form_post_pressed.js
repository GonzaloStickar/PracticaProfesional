const htmlFormEnviado = (titulo, mensaje, botonFuncion) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${titulo}</title>
            <link rel="stylesheet" href="/styles/crud_form_post_pressed.css">
        </head>
            <body>
                <div class="mensaje-box">
                    <p>${mensaje}</p>

                    <button class="boton" onclick="${botonFuncion}()">Volver</button>
                </div>

                <script>
                    function redirectToDashboard() {
                        window.location.href = "/dashboard";
                    }

                    function goBack() {
                        history.back();
                    }
                </script>
            </body>
        </html>
    `;
};

const editarAgregarReparacion = (nombre) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Agregar Reparacion</title>
            <link rel="stylesheet" href="/styles/dashboard_crud_form_post.css">
        </head>
            <body>
                <form action="/agregar/reparacion" method="POST">

                    <div class="caja_nombre">
                        <label for="nombre">Nombre y Apellido:</label>
                        <input type="text" id="nombre" name="nombre" value="${nombre}" required>
                        <button type="button" id="verificar-btn">Verificar</button>
                    </div>

                    <div id="mensaje-disponibilidad" class="mensaje-disponibilidad"></div>

                    <label for="descripcion">Descripción de la reparación:</label>
                    <input type="text" id="descripcion" name="descripcion" required>

                    <label for="tipo">Tipo de reparación:</label>
                    <input type="text" id="tipo" name="tipo" required>

                    <label for="fecha">Fecha de ingreso:</label>
                    <input type="date" id="fecha" name="fecha" required>

                    <label for="estado">Estado de la reparación:</label>
                    <select id="estado" name="estado" required>
                        <option value="">Seleccionar estado...</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Finalizado">Finalizado</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                    </select>

                    <input type="submit" value="Crear Reparación">
                </form>

                <script src="/script/check_DNI_reparacion.js"></script>
            </body>
        </html>
    `;
}

const htmlEditarForm = (url_mod, persona_id, reparacion_id, mensaje) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Editar</title>
            <link rel="stylesheet" href="/styles/dashboard_crud_form.css">
        </head>
        <body>
            <div>
                <form action="/editar/persona" method="get">
                    <input type="hidden" name="persona_id" value="${persona_id}">
                    <button type="submit">Editar Persona</button>
                </form>
                <form action="${url_mod}" method="get">
                    <input type="hidden" name="persona_id" value="${persona_id}">
                    <input type="hidden" name="reparacion_id" value="${reparacion_id}">
                    <button type="submit">${mensaje} Reparación</button>
                </form>
            </div>
        </body>
        </html>
    `;
};

const htmlEditarPersona = (persona) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Editar</title>
            <link rel="stylesheet" href="/styles/dashboard_crud_form_post.css">
        </head>
        <body>
            <div>
                <form action="/editar/persona?persona_id=${persona.id}" method="post">
                    
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" value="${persona.nombre}" placeholder="${persona.nombre}" required>

                    <label for="direccion">Dirección:</label>
                    <input type="text" id="direccion" name="direccion" value="${persona.direccion}" placeholder="${persona.direccion}" required>

                    <label for="telefono">Teléfono:</label>
                    <input type="text" id="telefono" name="telefono" value="${persona.telefono}" placeholder="${persona.telefono}" required>

                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="${persona.email}" placeholder="${persona.email}" required>
                    
                    <input type="submit" value="Guardar cambios">
                </form>
            </div>
        </body>
        </html>
    `;
}

const htmlEditarReparacion = (persona, reparacion) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Editar</title>
            <link rel="stylesheet" href="/styles/dashboard_crud_form_post.css">
        </head>
        <body>
            <div>
                <form action="/editar/reparacion?persona_id=${persona.id}&reparacion_id=${reparacion.id}" method="post">

                    <label for="descripcion">Descripción:</label>
                    <input type="text" id="descripcion" name="descripcion" value="${reparacion.descripcion}" placeholder="${reparacion.descripcion}" required>

                    <label for="tipo">Tipo:</label>
                    <input type="text" id="tipo" name="tipo" value="${reparacion.tipo}" placeholder="${reparacion.tipo}" required>

                    <label for="fecha">Fecha:</label>
                    <input type="date" id="fecha" name="fecha" value="${reparacion.fecha}" placeholder="${reparacion.fecha}" required>
                    
                    <label for="estado">Estado de la reparación:</label>
                    <select id="estado" name="estado" required>
                        <option value="">Seleccionar estado...</option>
                        <option value="Pendiente" ${reparacion.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="En Proceso" ${reparacion.estado === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
                        <option value="Finalizado" ${reparacion.estado === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
                        <option value="Entregado" ${reparacion.estado === 'Entregado' ? 'selected' : ''}>Entregado</option>
                        <option value="Cancelado" ${reparacion.estado === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                    
                    <input type="submit" value="Guardar cambios">
                </form>
            </div>
        </body>
        </html>
    `;
}

module.exports = {
    htmlFormEnviado,
    editarAgregarReparacion,
    htmlEditarForm,
    htmlEditarPersona,
    htmlEditarReparacion
}