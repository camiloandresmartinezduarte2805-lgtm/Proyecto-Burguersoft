// --- FUNCIONES DE APOYO ---

// Función para generar un nombre de usuario basado en el nombre (opcional)
function generarUsuario(nombre) {
    return nombre.toLowerCase().replace(/\s+/g, '.') + Math.floor(Math.random() * 100);
}

// --- CARGA INICIAL DE DATOS ---

document.addEventListener('DOMContentLoaded', function() {
    // Intentar obtener los datos guardados en LocalStorage
    const datosGuardados = JSON.parse(localStorage.getItem('usuarioActual'));

    if (datosGuardados) {
        // Rellenar los campos usando las llaves correctas del registro
        document.getElementById('confNombre').value = datosGuardados.nombre || "";
        document.getElementById('confCorreo').value = datosGuardados.correo || "";
        
        // Aquí usamos .usuario (como está en Registro.js)
        document.getElementById('confUsuario').value = datosGuardados.usuario || "";
        
        // Ajustamos el rol (Asegúrate que los values de los <select> coincidan exactamente)
        document.getElementById('rol').value = datosGuardados.rol || "";
        
        // Actualizar el nombre en el sidebar (barra lateral)
        const nombreSidebar = document.getElementById('nombre-sidebar');
        if (nombreSidebar) {
            // Mostramos nombre y apellido si existe
            nombreSidebar.textContent = datosGuardados.nombre + " " + (datosGuardados.apellido || "");
        }
    } else {
        // SEGURIDAD: Si alguien intenta entrar sin loguearse, lo mandamos al login
        alert("Debes iniciar sesión primero");
        window.location.href = "login.html";
    }
});

// --- VALIDACIÓN Y GUARDADO DEL FORMULARIO ---

document.getElementById('formConfiguracion').addEventListener('submit', function(e) {
    e.preventDefault(); 

    // Obtener valores de los inputs por ID
    const nombre = document.getElementById('confNombre').value; 
    const correo = document.getElementById('confCorreo').value;
    const usuario = document.getElementById('confUsuario').value;
    const rol = document.getElementById('rol').value;
    const passwordActual = document.getElementById('confPassActual').value;
    const passwordNueva = document.getElementById('confPassNueva').value;

    // Validaciones básicas
    if (!nombre || !correo || !usuario || !rol || !passwordActual || !passwordNueva) {
        alert('Por favor completa todos los campos');
        return;
    }

    if (!correo.includes('@')) {
        alert('Por favor ingresa un correo válido');
        return;
    }

    if (passwordNueva.length < 6) {
        alert('La nueva contraseña debe tener al menos 6 caracteres');
        return;
    }

    // --- ACTUALIZAR DATOS ---
    const nuevosDatos = {
        nombre: nombre,
        correo: correo,
        usuario: usuario, // Mantenemos coherencia con el nombre 'usuario'
        rol: rol
    };

    // Guardar en LocalStorage para que los cambios persistan
    localStorage.setItem('usuarioActual', JSON.stringify(nuevosDatos));

    // Actualizar sidebar visualmente
    const nombreSidebar = document.getElementById('nombre-sidebar');
    if (nombreSidebar) nombreSidebar.textContent = nombre;

    alert('Cambios guardados exitosamente');
    console.log('Datos actualizados en LocalStorage:', nuevosDatos);
});

// --- BOTONES DE ACCIÓN (Sesión y Cuenta) ---

// Cerrar sesión
document.getElementById('cerrarSesion').addEventListener('click', function() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Al cerrar sesión es recomendable limpiar el usuario actual
        localStorage.removeItem('usuarioActual'); 
        alert('Sesión cerrada');
        window.location.href = 'Burguersoft.html';
    }
});

// Eliminar cuenta 
document.getElementById('eliminarCuenta').addEventListener('click', function() {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('usuarioActual'); // Borrar la sesión activa
        alert('Cuenta eliminada del sistema');
        window.location.href = 'Burguersoft.html';
    }
});