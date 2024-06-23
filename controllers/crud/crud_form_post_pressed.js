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

const editarAgregarReparacion = (dni) => {
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
                    <div class="caja_dni">
                    <label for="dni">DNI del cliente:</label>
                    <input type="number" id="dni" name="dni" pattern="[0-9]+" value="${dni}" required>
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

module.exports = {
    htmlFormEnviado,
    editarAgregarReparacion
}