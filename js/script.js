// Aguarda o carregamento completo do HTML para evitar falhas
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. CURSOR MAGNÉTICO OTIMIZADO
    ========================================= */
    const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-outline");

    // Previne a execução do código de rato em dispositivos touch (telemóveis)
    if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
        window.addEventListener("mousemove", (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Animate garante fluidez no anel exterior
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

        // Adiciona classe 'hover' em botões e links
        const magneticElements = document.querySelectorAll(".magnetic, a, button, input[type='range']");
        magneticElements.forEach(el => {
            el.addEventListener("mouseenter", () => {
                cursorDot.classList.add("hover");
                cursorOutline.classList.add("hover");
            });
            el.addEventListener("mouseleave", () => {
                cursorDot.classList.remove("hover");
                cursorOutline.classList.remove("hover");
            });
        });
    }

    /* =========================================
       2. EFEITO GLOW GLOBAL (Luz de Fundo Bento)
    ========================================= */
    document.addEventListener("mousemove", (e) => {
        for(const card of document.getElementsByClassName("card")) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        };
    });

    /* =========================================
       3. TILT 3D (Com Proteção Mobile)
    ========================================= */
    const tiltCards = document.querySelectorAll('.tilt-card');
    if (window.matchMedia("(pointer: fine)").matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -4; 
                const rotateY = ((x - centerX) / centerX) * 4;  
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }

    /* =========================================
       4. CALCULADORA DE ROI
    ========================================= */
    const range = document.getElementById('faturamento');
    if(range) {
        const fatVal = document.getElementById('faturamento-val');
        const tempoPoupado = document.getElementById('tempo-poupado');
        const dinPoupado = document.getElementById('dinheiro-poupado');

        range.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            fatVal.innerText = `R$ ${val.toLocaleString('pt-BR')}`;
            
            const hours = 20 + Math.floor(val / 10000);
            const money = Math.floor(val * 0.045); 
            
            tempoPoupado.innerText = `${hours}h / mês`;
            dinPoupado.innerText = `R$ ${money.toLocaleString('pt-BR')}`;
        });
    }

    /* =========================================
       5. INTERSECTION OBSERVERS (Animações de Scroll)
    ========================================= */
    // Aparecimento em Fade
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if (entry.isIntersecting) entry.target.classList.add('show'); 
        });
    }, { threshold: 0.1 }); 
    document.querySelectorAll('[data-anime="fade"]').forEach(el => observer.observe(el));

    // Rotação Numérica (Contadores)
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                let current = 0;
                const increment = target / 40; 
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.innerText = target.toLocaleString('pt-BR');
                    }
                };
                updateCounter();
                obs.unobserve(entry.target); // Impede que a animação repita
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));

});

/* =========================================
   6. FUNÇÕES GLOBAIS (Modal)
========================================= */
function abrirLogin() { 
    document.getElementById('loginModal').classList.add('ativo'); 
}

function fecharLogin() { 
    document.getElementById('loginModal').classList.remove('ativo'); 
}

document.getElementById('loginModal').addEventListener('click', function(e) { 
    if (e.target === this) fecharLogin(); 
});