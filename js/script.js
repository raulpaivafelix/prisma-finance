/* 1. EFEITO DE LUZ (GLOW) GLOBAL NOS CARTÕES BENTO */
// Anexamos o evento ao documento inteiro para detetar o rato de forma global
document.onmousemove = e => {
    for(const card of document.getElementsByClassName("card")) {
      const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
  
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };
}
  
/* 2. ANIMAÇÃO DE APARECIMENTO (FADE UP) NO SCROLL */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.1 });
  
document.querySelectorAll('[data-anime="fade"]').forEach(el => observer.observe(el));
  
/* 3. CONTADORES DE ALTA PERFORMANCE (NÚMEROS A ROLAR) */
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            let current = 0;
            const increment = target / 50; 
  
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