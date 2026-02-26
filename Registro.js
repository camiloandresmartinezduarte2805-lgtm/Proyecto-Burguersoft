// Se asigna una función al evento 'onsubmit' del formulario de registro.
// Esta función se ejecutará cuando el usuario haga clic en el botón de "Crear cuenta".
document.getElementById("registroForm").onsubmit = function(e) {
    
    // e.preventDefault() evita que la página se refresque automáticamente.
    // Esto nos permite procesar los datos con JavaScript antes de hacer cualquier otra cosa.
    e.preventDefault(); 

    // CAPTURA DE DATOS 
    // Extraemos los valores escritos por el usuario en cada campo de texto (input).
    // Es vital que el 'id' en el HTML coincida exactamente con los nombres entre paréntesis.
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let fecha = document.getElementById("fecha").value;
    let correo = document.getElementById("correo").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let rol = document.getElementById("rol").value;
    let genero = document.getElementById("genero").value;

    // VALIDACIÓN DE FORMATO 
    // Verificamos que el correo tenga la terminación obligatoria.
    // Si no cumple, mostramos un mensaje y cortamos la ejecución con 'return false'.
    if (!correo.endsWith("@gmail.com")) {
        alert("Solo se permiten correos que terminen en @gmail.com");
        return false;
    }

    //  RECUPERACIÓN DE DATOS PREVIOS 
    // Preparamos una lista vacía para los usuarios.
    let usuarios = [];

    // Revisamos si ya existen otros usuarios guardados anteriormente en el navegador (LocalStorage).
    if (localStorage.getItem("usuarios") != null) {
        try {
            // Convertimos el texto guardado (JSON) de nuevo a una lista de objetos de JavaScript.
            usuarios = JSON.parse(localStorage.getItem("usuarios"));
        } catch (error) { // Si el texto no es JSON, lo tratamos como si no hubiera sido guardado.
            // Si el archivo está dañado o vacío, nos aseguramos de empezar con una lista limpia.
            usuarios = []; // Preparamos una array vacío para los usuarios.
        }
    }

    // CONTROL DE USUARIOS DUPLICADOS 
    // Recorremos la lista de usuarios existentes para ver si el correo nuevo ya está registrado.
    var existe = false; // Declaramos una variable para marcar si existe o no.
    for (var i = 0; i < usuarios.length; i++) { // Recorremos la lista de usuarios con un for.
        if (usuarios[i].correo == correo) { // Si el correo coincide...
            existe = true; // Marcamos que encontramos una coincidencia
            break; // Salimos del bucle para ahorrar recursos
        }
    }

    // Si el correo ya existía, avisamos al usuario y cancelamos el registro.
    if (existe) {  // Si el correo ya existe...
        alert("Este correo ya está registrado"); // Mostramos un mensaje de confirmacion.
        return false; // Cancelamos el registro.
    }

    //  VALIDACIÓN DE SEGURIDAD
    // Comparamos los dos campos de contraseña para asegurarnos de que el usuario no cometió un error al escribir.
    if (password != confirmPassword) { // Si las contraseñas no coinciden...
        alert("Las contraseñas no coinciden"); // Mostramos un mensaje de error.
        return false; // Terminamos el registro.
    }

    //  EMPAQUETADO DE INFORMACIÓN 
    // Creamos un "objeto" (una ficha técnica) que agrupa toda la información del nuevo usuario.
    let nuevoUsuario = {
        nombre: nombre,
        apellido: apellido,
        fecha: fecha,
        correo: correo,
        password: password,
        rol: rol,
        genero: genero
    };

    // Agregamos la nueva "ficha" a nuestra lista general de usuarios.
    usuarios.push(nuevoUsuario); // Agregamos la nueva ficha a la lista.

    // Guardamos la lista actualizada en el LocalStorage.
    // JSON.stringify convierte la lista en texto plano, ya que LocalStorage solo puede guardar texto.
    localStorage.setItem("usuarios", JSON.stringify(usuarios)); // Guardamos la lista actualizada como datos JSON en el localStorage.

    //  FINALIZACIÓN 
    alert("Tu cuenta ha sido creada correctamente");

    // Borramos los datos de los cuadritos del formulario para dejarlo limpio.
    document.getElementById("registroForm").reset(); // Borramos los datos de los cuadritos del formulario para dejarlo limpio.

    // Redirigimos automáticamente al usuario a la página de Login para que pueda entrar.
    window.location.href = "login.html"; // Redirigimos al login.
    return false; // Evita acciones secundarias del formulario
};

// Función para generar usuario automáticamente (nombre + apellido)
function generarUsuario(nombre, apellido) {
    return (nombre + apellido)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s/g, "");
}

document.getElementById("registroForm").onsubmit = function(e) {
    e.preventDefault(); 

    // CAPTURA DE DATOS 
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let fecha = document.getElementById("fecha").value;
    let correo = document.getElementById("correo").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let rol = document.getElementById("rol").value;
    let genero = document.getElementById("genero").value;

    // VALIDACIÓN DE FORMATO 
    if (!correo.endsWith("@gmail.com")) {
        alert("Solo se permiten correos que teminen en @gmail.com");
        return false;
    }

    // RECUPERACIÓN DE DATOS PREVIOS 
    let usuarios = [];
    if (localStorage.getItem("usuarios") != null) {
        try {
            usuarios = JSON.parse(localStorage.getItem("usuarios"));
        } catch (error) {
            usuarios = [];
        }
    }

    // CONTROL DE USUARIOS DUPLICADOS 
    var existe = false;
    for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo == correo) {
            existe = true;
            break;
        }
    }

    if (existe) {
        alert("Este correo ya está registrado");
        return false;
    }

    // VALIDACIÓN DE SEGURIDAD
    if (password != confirmPassword) {
        alert("Las contraseñas no coinciden");
        return false;
    }

    // Generamos el usuario automáticamente
    let usuarioGenerado = generarUsuario(nombre, apellido);

    // EMPAQUETADO DE INFORMACIÓN 
    let nuevoUsuario = {
        nombre: nombre,
        apellido: apellido,
        nombreCompleto: nombre + " " + apellido, // Útil para el sidebar
        fecha: fecha,
        correo: correo,
        password: password,
        rol: rol,
        genero: genero,
        usuario: usuarioGenerado
    };

    // --- ESTO REEMPLAZA TU BLOQUE ANTERIOR ---

    // Enviamos el objeto 'nuevoUsuario' a nuestro servidor Node.js
    fetch('http://localhost:3000/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
    })
    .then(respuesta => respuesta.json())
    .then(data => {
        // Si el servidor responde con éxito
        alert("¡Registro exitoso en la base de datos BURGUERSOFT!");
        
        // Opcional: seguimos guardando el usuario actual para la sesión
        localStorage.setItem("usuarioActual", JSON.stringify(nuevoUsuario));

        // Limpiamos y redirigimos
        document.getElementById("registroForm").reset();
        window.location.href = "login.html";
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error al conectar con el servidor. Verifica que el CMD tenga el servidor corriendo.");
    });

    return false; // Evita que la página se recargue
};