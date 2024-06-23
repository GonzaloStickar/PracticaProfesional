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

module.exports = {
    htmlEditarForm
}