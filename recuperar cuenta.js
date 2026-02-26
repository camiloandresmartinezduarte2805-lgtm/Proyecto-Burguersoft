document.addEventListener('DOMContentLoaded', function() {
    const btnEnviar = document.querySelector('.btn-primario');
    const inputEmail = document.querySelector('#rec-email');

    btnEnviar.addEventListener('click', async function(e) {
        e.preventDefault();
        const emailVal = inputEmail.value.trim();

        if (!emailVal) {
            alert('Por favor ingresa tu correo electrónico');
            return;
        }

        // 1. Preguntar al servidor si el correo existe en MySQL
        try {
            const response = await fetch('http://localhost:3000/verificar-correo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo: emailVal })
            });

            const data = await response.json();

            if (data.success) {
                // 2. Si existe, generar código y guardar temporalmente en el navegador
                const codigo = Math.floor(100000 + Math.random() * 900000).toString();
                localStorage.setItem('recuperoEmail', emailVal);
                localStorage.setItem('recuperoCodigo', codigo);
                localStorage.setItem('recuperoTimestamp', new Date().getTime());
                
                alert('Tu código de recuperación es: ' + codigo);
                window.location.href = 'codigo.html';
            } else {
                alert(data.mensaje);
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
        }
    });
});