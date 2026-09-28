/* --- 1. MODAL DE LOGIN (PLATAFORMA SAAS) --- */
function abrirLogin() {
    document.getElementById('loginModal').classList.add('ativo');
}

function fecharLogin() {
    document.getElementById('loginModal').classList.remove('ativo');
}

// Fecha clicando no fundo escuro
document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target === this) fecharLogin();
});

/* --- 2. GLOW EFFECT (Mouse Track Global) --- */
document.onmousemove = e => {
    for(const card of document.getElementsByClassName("card")) {
      const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
  
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };
}
  
/* --- 3. FADE-UP ANIMATION (Intersection Observer) --- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.1 }); 
  
document.querySelectorAll('[data-anime="fade"]').forEach(el => observer.observe(el));

/* --- 4. CALCULADORA ROI (Lógica Matemática) --- */
document.addEventListener("DOMContentLoaded", () => {
    const range = document.getElementById('faturamento');
    if(range) {
        const fatVal = document.getElementById('faturamento-val');
        const tempoPoupado = document.getElementById('tempo-poupado');
        const dinPoupado = document.getElementById('dinheiro-poupado');

        range.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            fatVal.innerText = `R$ ${val.toLocaleString('pt-BR')}`;
            
            // Fórmula: 20h fixas + 1h por cada R$ 10.000
            const hours = 20 + Math.floor(val / 10000);
            // Fórmula: Retorno financeiro recuperado (4.5% do faturamento)
            const money = Math.floor(val * 0.045); 
            
            tempoPoupado.innerText = `${hours}h / mês`;
            dinPoupado.innerText = `R$ ${money.toLocaleString('pt-BR')}`;
        });
    }
});

/* --- 5. TILT 3D (Efeito Físico nos Cartões) --- */
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -6; 
        const rotateY = ((x - centerX) / centerX) * 6;  
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

/* --- 6. CONTADORES ANIMADOS --- */
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
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.8 });
  
counters.forEach(counter => counterObserver.observe(counter));