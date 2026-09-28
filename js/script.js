document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. CURSOR MAGNÉTICO
    ========================================= */
    const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-outline");
    if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
        window.addEventListener("mousemove", (e) => {
            cursorDot.style.left = `${e.clientX}px`; cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 150, fill: "forwards" });
        });
        document.querySelectorAll(".magnetic, a, button, input[type='range'], .switch, .pricing-card").forEach(el => {
            el.addEventListener("mouseenter", () => { cursorDot.classList.add("hover"); cursorOutline.classList.add("hover"); });
            el.addEventListener("mouseleave", () => { cursorDot.classList.remove("hover"); cursorOutline.classList.remove("hover"); });
        });
    }

    /* =========================================
       2. NOTIFICAÇÕES AO VIVO (SOCIAL PROOF)
    ========================================= */
    const msgs = [
        "Comércio Físico em Natal economizou 20h esta semana.",
        "Clínica em Ponta Negra conciliou R$ 15k via IA agora.",
        "Novo DRE gerado com sucesso via Prisma App.",
        "Agência aprovou lote de pagamentos com segurança AES-256."
    ];
    const toast = document.getElementById('live-toast');
    const toastText = document.getElementById('toast-text');
    if(toast) {
        setInterval(() => {
            toastText.innerText = msgs[Math.floor(Math.random() * msgs.length)];
            toast.classList.add('show');
            playTickSound(); // Micro-som para alertar
            setTimeout(() => toast.classList.remove('show'), 4000);
        }, 18000); // Mostra a cada 18s
    }

    /* =========================================
       3. LIVE SANDBOX (HERO INTERATIVO)
    ========================================= */
    window.switchTab = (tab) => {
        document.querySelectorAll('.s-tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.s-content').forEach(c => c.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById(`tab-${tab}`).classList.add('active');
    };

    window.aprovarLote = () => {
        const btn = document.getElementById('btn-aprovar');
        const badge = document.getElementById('badge-boletos');
        const saldo = document.getElementById('s-balance');
        
        btn.innerText = "A processar...";
        setTimeout(() => {
            document.querySelectorAll('.s-item').forEach(i => i.classList.add('cleared'));
            btn.innerText = "✓ Lote Aprovado Seguro";
            btn.classList.add('done');
            badge.innerText = "0";
            badge.style.background = "#059669";
            saldo.innerText = "R$ 140.950,00"; // Saldo descontado
            saldo.classList.add('success');
            playTickSound();
            if(navigator.vibrate) navigator.vibrate([50, 50, 50]);
        }, 800);
    };

    /* =========================================
       4. TOGGLE MENSAL / ANUAL
    ========================================= */
    window.togglePricing = () => {
        const isAnual = document.getElementById('billing-toggle').checked;
        document.getElementById('label-mensal').classList.toggle('active', !isAnual);
        document.getElementById('label-anual').classList.toggle('active', isAnual);
        
        document.querySelectorAll('.price-val').forEach(price => {
            // Animação de contador rápido na mudança de preço
            const target = isAnual ? price.getAttribute('data-anual') : price.getAttribute('data-mensal');
            price.innerText = target;
        });
    };

    /* =========================================
       5. RAIO-X (ANTES E DEPOIS)
    ========================================= */
    const baContainer = document.getElementById('ba-container');
    if(baContainer) {
        const slideMove = (e) => {
            let clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let percentage = Math.max(0, Math.min(100, ((clientX - baContainer.getBoundingClientRect().left) / baContainer.offsetWidth) * 100));
            document.getElementById('ba-after').style.clipPath = `inset(0 0 0 ${percentage}%)`;
            document.getElementById('ba-slider').style.left = `${percentage}%`;
        };
        baContainer.addEventListener('mousemove', slideMove);
        baContainer.addEventListener('touchmove', slideMove, {passive: true});
    }

    /* =========================================
       6. ÁUDIO HAPTIC & CALCULADORA ROI
    ========================================= */
    let audioCtx = null;
    window.playTickSound = () => {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator(), gainNode = audioCtx.createGain();
            osc.connect(gainNode); gainNode.connect(audioCtx.destination);
            osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.03);
            gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime); 
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
            osc.start(); osc.stop(audioCtx.currentTime + 0.03);
        } catch(e) {}
    };

    const range = document.getElementById('faturamento');
    if(range) {
        let lastVal = range.value;
        ['mousedown', 'touchstart'].forEach(evt => range.addEventListener(evt, () => { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }, {passive:true}));
        range.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            if(Math.abs(val - lastVal) >= 5000) { playTickSound(); if(navigator.vibrate) navigator.vibrate(2); lastVal = val; }
            document.getElementById('faturamento-val').innerText = `R$ ${val.toLocaleString('pt-BR')}`;
            document.getElementById('tempo-poupado').innerText = `${20 + Math.floor(val / 10000)}h / mês`;
            document.getElementById('dinheiro-poupado').innerText = `R$ ${Math.floor(val * 0.045).toLocaleString('pt-BR')}`;
        });
    }

    /* =========================================
       7. ANIMAÇÕES (Scroll & Tilt 3D)
    ========================================= */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show'); });
    }, { threshold: 0.1 }); 
    document.querySelectorAll('[data-anime="fade"]').forEach(el => observer.observe(el));

    if (window.matchMedia("(pointer: fine)").matches) {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const rotateX = (((e.clientY - rect.top) - (rect.height / 2)) / (rect.height / 2)) * -4; 
                const rotateY = (((e.clientX - rect.left) - (rect.width / 2)) / (rect.width / 2)) * 4;  
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
        });
    }

    /* =========================================
       8. GESTÃO DE MODAIS E CHATBOT
    ========================================= */
    window.abrirLogin = () => document.getElementById('loginModal').classList.add('ativo');
    window.fecharLogin = () => document.getElementById('loginModal').classList.remove('ativo');

    window.abrirChat = () => document.getElementById('chat-box').classList.toggle('open');
    window.fecharChat = () => document.getElementById('chat-box').classList.remove('open');
    window.chatResponder = (texto) => {
        const chatBody = document.getElementById('chat-body');
        chatBody.innerHTML += `<div class="chat-msg user">${texto}</div>`;
        document.getElementById('chat-options').style.display = 'none';
        setTimeout(() => {
            chatBody.innerHTML += `<div class="chat-msg bot">Perfeito! A transferir para o Consultor Raul Paiva...</div>`;
            chatBody.scrollTop = chatBody.scrollHeight;
            playTickSound();
            setTimeout(() => window.open("https://wa.me/5584999999999?text=Ol%C3%A1%2C%20estou%20no%20site%20da%20Prisma%20e%20gostaria%20de%20ver%20os%20planos.", "_blank"), 1500);
        }, 800);
    };

    /* =========================================
       9. DIAGNÓSTICO COM AGENDAMENTO (Typeform)
    ========================================= */
    let diagData = {};
    window.abrirDiagnostico = () => {
        document.getElementById('diagModal').classList.add('ativo');
        document.querySelectorAll('.diag-step').forEach(el => el.classList.remove('ativo'));
        document.getElementById('step-1').classList.add('ativo');
    };
    window.fecharDiagnostico = () => document.getElementById('diagModal').classList.remove('ativo');
    
    window.nextStep = (num, chave, valor) => {
        diagData[chave] = valor;
        document.querySelectorAll('.diag-step').forEach(el => el.classList.remove('ativo'));
        document.getElementById(`step-${num}`).classList.add('ativo');

        if(num === 4) { // Tela de carregamento IA
            setTimeout(() => {
                document.getElementById('step-4').classList.remove('ativo');
                document.getElementById('step-5').classList.add('ativo');
                playTickSound();
            }, 2500);
        }
    };

    window.enviarWhatsApp = () => {
        const txt = `*Diagnóstico Prisma Finance*\nSegmento: ${diagData['Segmento']}\nTempo perdido: ${diagData['Horas']}\nPreferência de Agendamento: *${diagData['Horario']}*\n\nOlá Raul, quero automatizar a minha gestão!`;
        window.open(`https://wa.me/5584999999999?text=${encodeURIComponent(txt)}`, '_blank');
    };

    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) { if(e.target === this) this.classList.remove('ativo'); });
    });
});