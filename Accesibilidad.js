
// Espera a que todo el HTML se cargue antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    
    //  Capturamos elementos Obteniendo los botones, sliders y menús por su ID
    const btnMain = document.getElementById('boton-accesibilidad'); // El círculo naranja
    const menu = document.getElementById('menu-accesibilidad');   // El panel de opciones
    const sliderSize = document.getElementById('slider-size');     // La barra de tamaño (100-150%)
    const selectFont = document.getElementById('select-font');     // El selector de tipo de letra
    const valSizeText = document.getElementById('val-size');       // El texto donde dice "100%"

    // Abre y cierra el menú al hacer clic, añade o quita la clase 'active' para mostrar el panel
    if (btnMain) btnMain.onclick = () => menu.classList.toggle('active');

    // creamos una funcion principal par aplicar ambios ya que es la que hace todo el trabajo.
    function aplicarCambios() {
        const porcentaje = sliderSize.value; // Obtiene el valor del slider.
        const fuente = selectFont.value;     // Obtiene la fuente elegida.
        const factor = porcentaje / 100;     // Convierte el porcentaje en decimal.

        // condicional que ctualiza el texto del porcentaje en el panel para que el usuario vea el cambio
        if(valSizeText) valSizeText.innerText = porcentaje + '%';

        // Cambia la fuente de toda la página osea el body usando !important para que nada la bloquee
        document.body.style.setProperty('font-family', fuente, 'important');

        // Selecciona TODOS los elementos de texto de la página que queremos agrandar.
        const elementos = document.querySelectorAll('p, h1, h2, h3, h4, span, a, li, button, label, b, i');
        
        elementos.forEach(el => {
            // Si es la primera vez que tocamos el elemento, guardamos su tamaño original
            // para que los cálculos futuros siempre se basen en el tamaño real y no se deformen.
            if (!el.dataset.origSize) {
                el.dataset.origSize = window.getComputedStyle(el).fontSize; 
            }
            
            const tamanoBase = parseFloat(el.dataset.origSize); // Convierte "16px" a 16
            // Aplica el nuevo tamaño: Tamaño Original * Factor ( 16px * 1.2 = 19.2px)
            el.style.setProperty('font-size', (tamanoBase * factor) + 'px', 'important');
            
            // Refuerza la fuente elegida en cada elemento individual
            el.style.setProperty('font-family', fuente, 'important');
        });

        //Guarda la configuración en el navegador para que no se borre al recargar
        localStorage.setItem('acc-size', porcentaje);
        localStorage.setItem('acc-font', fuente);
    }

    // Ejecuta la función cada vez que el usuario mueve el slider o cambia la fuente
    if (sliderSize) sliderSize.oninput = aplicarCambios;
    if (selectFont) selectFont.onchange = aplicarCambios;

    //  Si el usuario ya había configurado algo antes, lo carga al abrir la web
    const sSize = localStorage.getItem('acc-size');
    const sFont = localStorage.getItem('acc-font');
    if (sSize) { sliderSize.value = sSize; }
    if (sFont) { selectFont.value = sFont; }

    // Pequeño retraso para asegurar que los estilos de la página cargaron antes de aplicar los cambios
    setTimeout(aplicarCambios, 500);

    // Carga el estado del modo oscuro (si estaba activo o no)
    if (localStorage.getItem('acc-modo-oscuro') === 'true') {
        document.body.classList.add('modo-oscuro-accesible');
    }
});

// creamos funcion para los contrastes Se ejecuta al pulsar el botón de Modo Oscuro
function toggleContrast() {
    // Alterna la clase en el body. El CSS se encarga de cambiar los colores.
    const activo = document.body.classList.toggle('modo-oscuro-accesible');
    // Guarda si el modo oscuro quedó encendido (true) o apagado (false)
    localStorage.setItem('acc-modo-oscuro', activo);
}