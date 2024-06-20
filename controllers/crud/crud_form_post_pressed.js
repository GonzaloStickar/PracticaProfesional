const html = (titulo, mensaje, botonFuncion) => {
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

module.exports = {
    html
}