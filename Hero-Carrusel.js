
document.addEventListener("DOMContentLoaded", () => {
    // Selecciona todos los contenedores de carrusel en la página.
    // Permite tener varios carruseles independientes si existen.
    const containers = document.querySelectorAll('.carousel-container');

    // Recorre cada contenedor y aplica la lógica del carrusel individualmente.
    containers.forEach(container => {
        // `slides` es un array con todos los elementos que representan cada slide.
        const slides = Array.from(container.querySelectorAll('.carousel-slide'));
        if (!slides.length) return; // Si no hay slides, salir.

        // `index` mantiene la posición del slide actualmente visible.
        // Se intenta encontrar un slide que ya tenga la clase `active`.
        let index = slides.findIndex(s => s.classList.contains('active'));
        if (index < 0) index = 0; // Si ninguno está marcado, empezar en 0.

        /* Controles prev/next
           Se crean botones `prev` y `next` dinámicamente para navegar manualmente. */
        const prev = document.createElement('button');
        prev.className = 'carousel-prev';
        prev.setAttribute('aria-label', 'Anterior'); // Accesibilidad
        prev.innerHTML = '&#10094;'; // Flecha izquierda (HTML entity)

        const next = document.createElement('button');
        next.className = 'carousel-next';
        next.setAttribute('aria-label', 'Siguiente');
        next.innerHTML = '&#10095;'; // Flecha derecha

        // Se añaden los botones al contenedor para que sean visibles y funcionales.
        container.appendChild(prev);
        container.appendChild(next);

        /* Indicadores (dots)
           Un pequeño grupo de botones que muestran la posición y permiten saltar a un slide. */
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-indicator';
            dot.setAttribute('data-slide', i); // Almacena el índice del slide
            if (i === index) dot.classList.add('active'); // Marca el dot activo
            indicators.appendChild(dot);
        });
        container.appendChild(indicators);

        // Array con las referencias a cada indicador (dot)
        const dots = Array.from(indicators.querySelectorAll('.carousel-indicator'));

        /* showSlide(i)
           - Quita la clase `active` de todos los slides e indicadores.
           - Calcula el índice correcto usando módulo para permitir bucle infinito.
           - Añade `active` al slide y al indicador correspondiente.
           Esto es la función central que actualiza la vista del carrusel. */
        function showSlide(i) {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            index = (i + slides.length) % slides.length; // Ajuste circular
            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
        }

        // Funciones de conveniencia para avanzar o retroceder un slide.
        function nextSlide() { showSlide(index + 1); }
        function prevSlide() { showSlide(index - 1); }

        // Eventos click para los botones prev/next: navegan y reinician el temporizador.
        prev.addEventListener('click', () => { prevSlide(); resetTimer(); });
        next.addEventListener('click', () => { nextSlide(); resetTimer(); });

        // Eventos para cada dot: saltar a un slide concreto.
        dots.forEach(d => d.addEventListener('click', (e) => {
            const i = parseInt(e.currentTarget.getAttribute('data-slide'), 10);
            showSlide(i);
            resetTimer(); // Reinicia autoplay al interactuar
        }));

        /* Autoplay
           - `interval` es la duración entre cambios automáticos (ms).
           - `timer` es el ID devuelto por setInterval, usado para pausar/reiniciar. */
        let interval = 3000; // 3 segundos por defecto
        let timer = setInterval(nextSlide, interval);

        // resetTimer: limpia y vuelve a crear el interval para reiniciar el conteo.
        function resetTimer() {
            clearInterval(timer);
            timer = setInterval(nextSlide, interval);
        }

        /* Pausar al pasar el ratón o ganar foco, y reanudar al salir.
           Esto mejora la usabilidad evitando que cambie mientras el usuario interactúa. */
        container.addEventListener('mouseenter', () => clearInterval(timer));
        container.addEventListener('mouseleave', () => { resetTimer(); });
        container.addEventListener('focusin', () => clearInterval(timer));
        container.addEventListener('focusout', () => { resetTimer(); });

        /* Soporte táctil (swipe)
           - Captura la posición inicial y final del toque para detectar swipe horizontal.
           - Si la distancia es significativa (>40px) se considera un swipe y se navega. */
        let touchStartX = 0;
        let touchEndX = 0;
        container.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; clearInterval(timer); });
        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchEndX - touchStartX;
            if (Math.abs(diff) > 40) {
                if (diff < 0) nextSlide(); else prevSlide();
            }
            resetTimer();
        });

        /* Soporte de teclado
           - `tabIndex = 0` hace que el contenedor sea enfocables con teclado.
           - Flechas izquierda/derecha navegan entre slides. */
        container.tabIndex = 0;
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { nextSlide(); resetTimer(); }
            if (e.key === 'ArrowLeft') { prevSlide(); resetTimer(); }
        });
    });
});
