        
        let index = 0;
        const slides = document.querySelectorAll(".carousel-slide");

        function cambiarSlide() {
            slides[index].classList.remove("active");
            index = (index + 1) % slides.length;
            slides[index].classList.add("active");
        }



/* Materia Prima Script */
        

