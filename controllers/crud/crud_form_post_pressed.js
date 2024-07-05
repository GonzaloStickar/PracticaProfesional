const htmlFormEnviado = (titulo, mensaje, botonFuncion) => {
    return `
        <!DOCTYPE html>
        <html lang="es">
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
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Agregar Reparacion</title>
            <link rel="stylesheet" href="/styles/dashboard_crud_form_post.css">
        </head>
            <body>
                <form action="/dashboard/agregar/reparacion" method="POST">

                    <div class="caja_nombre">
                        <label for="nombre">Nombre y Apellido:</label>
                        <input type="text" id="nombre" name="nombre" value="${nombre}" required placeholder="${nombre}">
                        <button type="button" id="verificar-btn">Verificar</button>
                    </div>

                    <div id="mensaje-disponibilidad" class="mensaje-disponibilidad"></div>
                    
                    <label for="descripcion">Descripción de la reparación:</label>
                    <input type="text" id="descripcion" name="descripcion" required placeholder="Ingrese descripción de la reparación">
                    
                    <label for="tipo">Tipo de reparación:</label>
                    <input type="text" id="tipo" name="tipo" required placeholder="Ingrese tipo de reparación">
                    
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

                <script src="/script/check_nomb_apell_reparacion.js"></script>
            </body>
        </html>
    `;
}

const htmlEditarForm = (url_mod, persona_id, reparacion_id, mensaje) => {
    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Editar</title>
            <link rel="stylesheet" href="/styles/dashboard_crud_form.css">
        </head>
        <body>
            <div>
                <form action="/dashboard/editar/persona" method="get">
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
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Editar Persona</title>
            <link rel="stylesheet" href="/styles/dashboard_crud_form_post.css">
        </head>
        <body>
            <div>
                <form action="/dashboard/editar/persona?persona_id=${persona.id}" method="post">

                    <div class="caja_nombre">
                        <label for="nombre">Nombre y Apellido:</label>
                        <input type="text" id="nombre" name="nombre" value="${persona.nombre}" placeholder="${persona.nombre}" required>
                        <button type="button" id="verificar-btn">Verificar</button>
                    </div>

                    <div id="mensaje-disponibilidad" class="mensaje-disponibilidad"></div>

                    <label for="direccion">Dirección:</label>
                    <input type="text" id="direccion" name="direccion" value="${persona.direccion}" placeholder="${persona.direccion}" required>

                    <label for="telefono">Teléfono:</label>
                    <input type="number" id="telefono" name="telefono" value="${persona.telefono}" placeholder="${persona.telefono}" required>

                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="${persona.email}" placeholder="${persona.email}" required>
                    
                    <input type="submit" value="Guardar cambios">
                </form>
            </div>

            <script src="/script/check_nomb_apell_persona.js"></script>
        </body>
        </html>
    `;
}

const htmlEditarReparacion = (persona, reparacion) => {
    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Editar Reparación</title>
            <link rel="stylesheet" href="/styles/dashboard_crud_form_post.css">
        </head>
        <body>
            <div>
                <form action="/dashboard/editar/reparacion?persona_id=${persona.id}&reparacion_id=${reparacion.id}" method="post">

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

const htmlEliminarFormPersona = (persona) => {
    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Eliminar</title>
            <link rel="stylesheet" href="/styles/dashboard_crud_form_post.css">
        </head>
        <body>
            <div>
                <form id="eliminarForm" action="/dashboard/eliminar?persona_id=${persona.id}&reparacion_id=undefined" method="post">
                    <div class="informacion_persona">
                        <p><strong>Información de la persona:</strong></p>
                        <p><strong>ID:</strong> ${persona.id}</p>
                        <p><strong>Nombre:</strong> ${persona.nombre}</p>
                        <p><strong>Dirección:</strong> ${persona.direccion}</p>
                        <p><strong>Teléfono:</strong> ${persona.telefono}</p>
                        <p><strong>Email:</strong> ${persona.email}</p>
                    </div>

                    <h2>¿Estás seguro que deseas eliminar esta Persona?</h2>

                    <input type="submit" class="btn" value="Sí, eliminar">
                    <input type="button" class="btn" value="No, cancelar" onclick="goBack()">
                </form>
            </div>

            <script>
                function goBack() {
                    history.back();
                }
            </script>
        </body>
        </html>
    `;
}

const htmlEliminarFormPersonaReparacion = (persona, reparacion) => {
    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Eliminar</title>
            <link rel="stylesheet" href="/styles/dashboard_crud_form_post.css">
        </head>
        <body>
            <div>
                <form id="eliminarForm" action="/dashboard/eliminar?persona_id=${persona.id}&reparacion_id=${reparacion.id}" method="post">
                    <div class="informacion_persona">    
                        <p><strong>Información de la persona:</strong></p>
                        <p><strong>ID:</strong> ${persona.id}</p>
                        <p><strong>Nombre:</strong> ${persona.nombre}</p>
                        <p><strong>Dirección:</strong> ${persona.direccion}</p>
                        <p><strong>Teléfono:</strong> ${persona.telefono}</p>
                        <p><strong>Email:</strong> ${persona.email}</p>
                    </div>

                    <hr>

                    <div class="informacion_reparacion">
                        <p><strong>Información de la reparación:</strong></p>
                        <p><strong>ID:</strong> ${reparacion.id}</p>
                        <p><strong>Descripción:</strong> ${reparacion.descripcion}</p>
                        <p><strong>Tipo:</strong> ${reparacion.tipo}</p>
                        <p><strong>Fecha:</strong> ${reparacion.fecha}</p>
                        <p><strong>Estado:</strong> ${reparacion.estado}</p>
                    </div>

                    <h2>¿Estás seguro que deseas eliminar esta Reparación?</h2>

                    <input type="submit" class="btn" value="Sí, eliminar">
                    <input type="button" class="btn" value="No, cancelar" onclick="goBack()">
                </form>
            </div>

            <script>
                function goBack() {
                    history.back();
                }
            </script>
        </body>
        </html>
    `;
}

const htmlInformeFormPersona = (persona) => {
    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Eliminar</title>
            <link rel="stylesheet" href="/styles/crud_form_post_pressed.css">
        </head>
        <body>
            <div class="mensaje-box">
                <div class="informacion_persona">
                    <p><strong>Información de la persona:</strong></p>
                    <p><strong>ID:</strong> ${persona.id}</p>
                    <p><strong>Nombre:</strong> ${persona.nombre}</p>
                    <p><strong>Dirección:</strong> ${persona.direccion}</p>
                    <p><strong>Teléfono:</strong> ${persona.telefono}</p>
                    <p><strong>Email:</strong> ${persona.email}</p>
                </div>

                <button class="boton" onclick="goBack()">Volver</button>
            </div>

            <script>
                function goBack() {
                    history.back();
                }
            </script>
        </body>
        </html>
    `;
}

const htmlInformeFormPersonaReparacion = (persona, reparacion) => {
    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Eliminar</title>
            <link rel="stylesheet" href="/styles/crud_form_post_pressed.css">
        </head>
        <body>
            <div class="mensaje-box">
                <div class="informacion_persona">    
                    <p><strong>Información de la persona:</strong></p>
                    <p><strong>ID:</strong> ${persona.id}</p>
                    <p><strong>Nombre:</strong> ${persona.nombre}</p>
                    <p><strong>Dirección:</strong> ${persona.direccion}</p>
                    <p><strong>Teléfono:</strong> ${persona.telefono}</p>
                    <p><strong>Email:</strong> ${persona.email}</p>
                </div>

                <hr>

                <div class="informacion_reparacion">
                    <p><strong>Información de la reparación:</strong></p>
                    <p><strong>ID:</strong> ${reparacion.id}</p>
                    <p><strong>Descripción:</strong> ${reparacion.descripcion}</p>
                    <p><strong>Tipo:</strong> ${reparacion.tipo}</p>
                    <p><strong>Fecha:</strong> ${reparacion.fecha}</p>
                    <p><strong>Estado:</strong> ${reparacion.estado}</p>
                </div>

                <button class="boton" onclick="goBack()">Volver</button>
            </div>

            <script>
                function goBack() {
                    history.back();
                }
            </script>
        </body>
        </html>
    `;
}

module.exports = {
    htmlFormEnviado,
    editarAgregarReparacion,
    htmlEditarForm,
    htmlEditarPersona,
    htmlEditarReparacion,
    htmlEliminarFormPersona,
    htmlEliminarFormPersonaReparacion,
    htmlInformeFormPersona,
    htmlInformeFormPersonaReparacion
}