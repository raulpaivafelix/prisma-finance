/* 1. MÁQUINA DE ESCREVER (TYPEWRITER) */
const texto = "Terceirize o financeiro da sua empresa e compre o seu tempo de volta.";
const elementoTexto = document.getElementById("maquina-escrever");
let i = 0;

function escreverTexto() {
    if (i < texto.length) {
        elementoTexto.innerHTML += texto.charAt(i);
        i++;
        setTimeout(escreverTexto, 40); // 40 milissegundos por letra (velocidade)
    }
}
// Inicia quando a página carrega
window.onload = escreverTexto;

/* 2. MENU INTERATIVO */
function alternarOpcoes() {
    const caixa = document.getElementById("caixa-opcoes");
    caixa.classList.toggle("mostrar-menu");
}

/* 3. ACORDEÃO (SOLUÇÕES) */
const accordions = document.querySelectorAll(".accordion-header");
accordions.forEach(acc => {
    acc.addEventListener("click", function() {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
});

/* 4. ANIMAÇÕES FADE-IN NO SCROLL */
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('animar');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('[data-anime="scroll"]').forEach(el => fadeObserver.observe(el));

/* 5. CONTADORES ANIMADOS (NÚMEROS A SUBIR) */
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            let current = 0;
            // Velocidade e saltos (ajustado para ser rápido e fluído)
            const increment = target / 60; 

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    entry.target.innerText = Math.ceil(current);
                    setTimeout(updateCounter, 25);
                } else {
                    // Quando atinge o alvo exato (ex: 10000 -> 10.000)
                    entry.target.innerText = target.toLocaleString('pt-BR');
                }
            };
            updateCounter();
            // Pára de observar depois de animar a primeira vez
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 }); // Dispara quando metade da secção estiver visível

counters.forEach(counter => counterObserver.observe(counter));