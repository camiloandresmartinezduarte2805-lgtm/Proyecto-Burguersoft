document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const correoIngresado = document.getElementById('email').value;
            const passIngresada = document.getElementById('password').value;

            console.log("Enviando datos:", correoIngresado, passIngresada);

            // Dentro de tu evento submit en login.js
            fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    correo: correoIngresado, // Debe llamarse 'correo'
                    password: passIngresada  // Debe llamarse 'password'
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log("Respuesta servidor:", data);
                if (data.success) {
                    alert("¡Bienvenido!");
                    localStorage.setItem("usuarioActual", JSON.stringify(data.usuario));
                    window.location.href = "inicio_admin.html"; 
                } else {
                    alert("Error: " + (data.mensaje || "Credenciales incorrectas"));
                }
            })
            .catch(err => {
                console.error("Error de conexión:", err);
                alert("No se pudo conectar con el servidor. Verifica que el CMD diga 'Servidor corriendo'.");
            });
        });
    } else {
        console.error("No se encontró el formulario loginForm");
    }
});