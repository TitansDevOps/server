export const resetPasswordTemplate = (
  fullName: string,
  resetUrl: string,
): string => `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecimiento de Contraseña</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f8f9fa;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .logo {
                width: 100px;
                margin-bottom: 15px;
            }
            .header {
                font-size: 22px;
                color: #333;
                font-weight: bold;
            }
            .message {
                font-size: 16px;
                color: #666;
                margin: 15px 0;
            }
            .button {
                display: inline-block;
                background-color: #ff7b00;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 25px;
                border-radius: 8px;
                font-size: 18px;
                font-weight: bold;
                margin-top: 20px;
            }
            .button:hover {
                background-color: #e66b00;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #999;
            }
            .footer a {
                color: #ff7b00;
                text-decoration: none;
            }
            .footer a:hover {
                text-decoration: underline;
            }
            .image {
                width: 100%;
                max-width: 400px;
                border-radius: 10px;
                margin-top: 15px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://thumbs.dreamstime.com/z/logo-de-adopci%C3%B3n-perro-adoptar-no-comprar-cartel-la-organizaci%C3%B3n-perros-cachorros-solitarios-esperando-al-due%C3%B1o-rescatar-169252687.jpg?ct=jpeg" alt="Logo Adopta" class="logo">
            <h1 class="header">¿Olvidaste tu contraseña? 🐾</h1>
            <p class="message">Hola ${fullName},</p>
            <p class="message">Parece que solicitaste restablecer tu contraseña. No te preocupes, te ayudaremos a recuperarla. 🐶💙</p>
            <p class="message">Haz clic en el botón de abajo para crear una nueva contraseña:</p>
            <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
            <p class="footer">Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
            <p class="footer"><a href="${resetUrl}">${resetUrl}</a></p>
            <p class="footer">Si no solicitaste este cambio, puedes ignorar este mensaje. 🐾</p>
            <img src= "https://media.istockphoto.com/id/543600370/es/foto/peque%C3%B1os-cachorros-en-el.jpg?s=1024x1024&w=is&k=20&c=kvEb-1JXtrkrwqUGtjmy-FPqkcTB6EfpPFc3NUHMLV4=" alt="Perrito" class="image">
            <p class="footer">Gracias por confiar en <strong>Adopta & Cuida</strong>. <br> Nos preocupamos por el bienestar de todas las mascotas. 🐶🐱</p>
        </div>
    </body>
    </html>
`;
