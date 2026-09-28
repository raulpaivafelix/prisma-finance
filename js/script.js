/* --- 1. MODAL DE LOGIN --- */
function abrirLogin() {
    document.getElementById('loginModal').classList.add('ativo');
}

function fecharLogin() {
    document.getElementById('loginModal').classList.remove('ativo');
}

document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target === this) fecharLogin();
});

/* --- 2. EFEITO DE LUZ (GLOW) NOS CARTÕES --- */
// Ouve o movimento do rato em toda a página e passa as coordenadas para o CSS
document.onmousemove = e => {
    for(const card of document.getElementsByClassName("card")) {
      const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
  
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };
}
  
/* --- 3. ANIMAÇÃO DE APARECIMENTO (FADE-UP) --- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.1 }); // Dispara quando 10% do elemento fica visível
  
document.querySelectorAll('[data-anime="fade"]').forEach(el => observer.observe(el));

/* --- 4. CALCULADORA DE ROI (RETORNO DE INVESTIMENTO) --- */
const range = document.getElementById('faturamento');
if(range) {
    const fatVal = document.getElementById('faturamento-val');
    const tempoPoupado = document.getElementById('tempo-poupado');
    const dinPoupado = document.getElementById('dinheiro-poupado');

    range.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        fatVal.innerText = `R$ ${val.toLocaleString('pt-BR')}`;
        
        // Regra de negócio: 20h fixas + 1h extra a cada R$ 10.000 de faturação
        const hours = 20 + Math.floor(val / 10000);
        // Economia estimada: 5% do faturamento (custos invisíveis, juros, etc.)
        const money = Math.floor(val * 0.05); 
        
        tempoPoupado.innerText = `${hours}h / mês`;
        dinPoupado.innerText = `R$ ${money.toLocaleString('pt-BR')}`;
    });
}

/* --- 5. EFEITO 3D (TILT) COM BASE NA GRAVIDADE DO RATO --- */
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calcula a rotação para criar o efeito de profundidade
        const rotateX = ((y - centerY) / centerY) * -5; // Força de inclinação Y
        const rotateY = ((x - centerX) / centerX) * 5;  // Força de inclinação X
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    // Reseta a carta suavemente quando o rato sai
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});