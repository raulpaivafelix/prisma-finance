document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. CURSOR MAGNÉTICO (Apenas Desktop) --- */
    const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-outline");

    if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
        window.addEventListener("mousemove", (e) => {
            cursorDot.style.left = `${e.clientX}px`; 
            cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 150, fill: "forwards" });
        });
        document.querySelectorAll(".magnetic, a, button, input[type='range']").forEach(el => {
            el.addEventListener("mouseenter", () => { cursorDot.classList.add("hover"); cursorOutline.classList.add("hover"); });
            el.addEventListener("mouseleave", () => { cursorDot.classList.remove("hover"); cursorOutline.classList.remove("hover"); });
        });
    }

    /* --- 2. SLIDER ANTES E DEPOIS (Raio-X) --- */
    const baContainer = document.getElementById('ba-container');
    const baAfter = document.getElementById('ba-after');
    const baSlider = document.getElementById('ba-slider');

    if(baContainer) {
        const slideMove = (e) => {
            const rect = baContainer.getBoundingClientRect();
            // Suporta perfeitamente rato e toque no ecrã (mobile)
            let clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let x = clientX - rect.left;
            let percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            
            baAfter.style.clipPath = `inset(0 0 0 ${percentage}%)`;
            baSlider.style.left = `${percentage}%`;
        };
        baContainer.addEventListener('mousemove', slideMove);
        baContainer.addEventListener('touchmove', slideMove, {passive: true});
    }

    /* --- 3. ÁUDIO DO ROI (Web Audio API) --- */
    let audioCtx = null;
    function playTickSound() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.type = 'sine'; 
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); 
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            
            osc.start(); osc.stop(audioCtx.currentTime + 0.05);
            if (navigator.vibrate) navigator.vibrate(5);
        } catch(e) {}
    }

    /* --- 4. CALCULADORA DE ROI --- */
    const range = document.getElementById('faturamento');
    if(range) {
        let lastVal = range.value;
        // Inicia o contexto de áudio no primeiro clique para respeitar regras de navegadores
        range.addEventListener('mousedown', () => { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); });
        range.addEventListener('touchstart', () => { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }, {passive: true});

        range.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            if(Math.abs(val - lastVal) >= 5000) {
                playTickSound();
                lastVal = val;
            }
            document.getElementById('faturamento-val').innerText = `R$ ${val.toLocaleString('pt-BR')}`;
            document.getElementById('tempo-poupado').innerText = `${20 + Math.floor(val / 10000)}h / mês`;
            document.getElementById('dinheiro-poupado').innerText = `R$ ${Math.floor(val * 0.045).toLocaleString('pt-BR')}`;
        });
    }

    /* --- 5. ANIMAÇÕES SCROLL E TILT --- */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show'); });
    }, { threshold: 0.1 }); 
    document.querySelectorAll('[data-anime="fade"]').forEach(el => observer.observe(el));

    const tiltCards = document.querySelectorAll('.tilt-card');
    if (window.matchMedia("(pointer: fine)").matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const rotateX = (((e.clientY - rect.top) - (rect.height / 2)) / (rect.height / 2)) * -4; 
                const rotateY = (((e.clientX - rect.left) - (rect.width / 2)) / (rect.width / 2)) * 4;  
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
        });
    }
});

/* =========================================
   6. FUNÇÕES GLOBAIS DE SISTEMA
========================================= */
// Modal Login
window.abrirLogin = () => document.getElementById('loginModal').classList.add('ativo');
window.fecharLogin = () => document.getElementById('loginModal').classList.remove('ativo');

// Modal Diagnóstico
let diagRespostas = { Segmento: '', Horas: '' };
window.abrirDiagnostico = () => {
    document.getElementById('diagModal').classList.add('ativo');
    document.querySelectorAll('.diag-step').forEach(el => el.classList.remove('ativo'));
    document.getElementById('step-1').classList.add('ativo');
};
window.fecharDiagnostico = () => document.getElementById('diagModal').classList.remove('ativo');

window.nextStep = (num, chave, valor) => {
    diagRespostas[chave] = valor;
    document.querySelectorAll('.diag-step').forEach(el => el.classList.remove('ativo'));
    document.getElementById(`step-${num}`).classList.add('ativo');

    if(num === 3) {
        setTimeout(() => {
            document.getElementById('step-3').classList.remove('ativo');
            document.getElementById('step-4').classList.add('ativo');
        }, 2500); // Falso carregamento de 2.5s para criar expectativa
    }
};

window.enviarWhatsApp = () => {
    const texto = `Olá Raul! Fiz o diagnóstico no site. O meu segmento é *${diagRespostas['Segmento']}* e perco *${diagRespostas['Horas']}* com o financeiro. Quero conhecer o Prisma App!`;
    const numero = "5584999999999"; // Lembre-se de colocar o seu número aqui
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, '_blank');
};

// Fechar modais ao clicar na área exterior (fundo negro)
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function(e) { if(e.target === this) this.classList.remove('ativo'); });
});

// Chatbot IA
window.abrirChat = () => document.getElementById('chat-box').classList.toggle('open');
window.fecharChat = () => document.getElementById('chat-box').classList.remove('open');
window.chatResponder = (texto) => {
    const chatBody = document.getElementById('chat-body');
    chatBody.innerHTML += `<div class="chat-msg user">${texto}</div>`;
    document.getElementById('chat-options').style.display = 'none';
    
    // Simula a escrita da IA
    setTimeout(() => {
        chatBody.innerHTML += `<div class="chat-msg bot">Excelente escolha! Vou encaminhar-te diretamente para o Consultor Raul Paiva. A transferir...</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
        setTimeout(() => window.open("https://wa.me/5584999999999?text=Ol%C3%A1%2C%20estava%20a%20conversar%20com%20a%20assistente%20no%20site%20e%20gostaria%20de%20ver%20os%20planos.", "_blank"), 2000);
    }, 1000);
};