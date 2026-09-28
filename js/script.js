/* 1. FUNÇÃO DO MENU DE OPÇÕES (CABEÇALHO) */
function alternarOpcoes() {
    const caixa = document.getElementById("caixa-opcoes");
    caixa.classList.toggle("mostrar-menu");
}

/* 2. LÓGICA DO ACORDEÃO DE SOLUÇÕES */
const accordions = document.querySelectorAll(".accordion-header");

accordions.forEach(acc => {
    acc.addEventListener("click", function() {
        // Alterna a classe 'active' no botão clicado (muda cor e roda o ícone)
        this.classList.toggle("active");
        
        // Seleciona a caixa de texto (div) imediatamente abaixo do botão
        const content = this.nextElementSibling;
        
        // Se estiver aberta, fecha; se estiver fechada, calcula a altura necessária e abre
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
});

/* 3. ANIMAÇÕES DE SCROLL (FADE-IN DEDICADO) */
// Cria um observador para detetar quando os elementos entram no ecrã
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('animar');
        }
    });
}, {
    threshold: 0.1 // O efeito dispara quando 10% do elemento fica visível
});

// Aplica o observador a todos os elementos com data-anime="scroll"
const elementosAnimados = document.querySelectorAll('[data-anime="scroll"]');
elementosAnimados.forEach(el => observer.observe(el));