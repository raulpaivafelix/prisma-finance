// ==========================================
// 0. SUPABASE CONFIGURATION (O Seu Cofre)
// ==========================================
const supabaseUrl = 'https://ebomgngzpwaaghtcjllz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib21nbmd6cHdhYWdodGNqbGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NjU5MzMsImV4cCI6MjEwNjE0MTkzM30.0EBSn49Y0Bak3G6FlfVsGqXc3MxtJKdIzAutq0KnB-I';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Variáveis Globais de Vendas
window.currentFat = "50.000";
window.currentPoupa = "2.250";

document.addEventListener('DOMContentLoaded', () => {
    const isDesktop = window.matchMedia("(pointer: fine)").matches;

    /* --- 1. PRELOADER & SAUDAÇÃO --- */
    const preloader = document.getElementById('preloader');
    if(preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; window.animateCharts(); }, 800);
        }, 1200);
    }

    const hora = new Date().getHours();
    const greetEl = document.getElementById('dynamic-greeting');
    if(greetEl) {
        if(hora >= 5 && hora < 12) greetEl.innerText = "Bom dia. Já planeou o seu caixa de hoje?";
        else if(hora >= 12 && hora < 18) greetEl.innerText = "Boa tarde. A sua empresa no piloto automático.";
        else greetEl.innerText = "Boa noite. Nós cuidamos do financeiro enquanto descansa.";
    }

    /* --- 2. PROGRESSO & CTA FLUTUANTE --- */
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        document.getElementById('scroll-progress').style.width = (winScroll / height) * 100 + "%";

        const floatingCta = document.getElementById('floating-cta');
        if(floatingCta) {
            winScroll > 600 ? floatingCta.classList.add('visible') : floatingCta.classList.remove('visible');
        }
    });

    /* --- 3. CURSOR & TILT 3D --- */
    const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-outline");
    
    if (isDesktop && cursorDot && cursorOutline) {
        window.addEventListener("mousemove", (e) => {
            cursorDot.style.left = `${e.clientX}px`; cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 150, fill: "forwards" });
        });
        document.querySelectorAll(".magnetic, a, button, input[type='range'], .switch, .pricing-card").forEach(el => {
            el.addEventListener("mouseenter", () => { cursorDot.classList.add("hover"); cursorOutline.classList.add("hover"); });
            el.addEventListener("mouseleave", () => { cursorDot.classList.remove("hover"); cursorOutline.classList.remove("hover"); });
        });

        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                
                if(card.id === 'prisma-card') {
                    const glare = document.getElementById('card-glare');
                    if(glare) {
                        glare.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
                        glare.style.setProperty('--my', `${(y / rect.height) * 100}%`);
                    }
                }

                const rotateX = (((y) - (rect.height / 2)) / (rect.height / 2)) * -4; 
                const rotateY = (((x) - (rect.width / 2)) / (rect.width / 2)) * 4;  
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
        });
    }

    /* --- 4. COMMAND PALETTE --- */
    window.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault(); window.abrirCommandPalette();
        }
    });

    /* --- 5. AUDIO E CALCULADORA ROI --- */
    let audioCtx = null;
    window.playTickSound = () => {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator(), gainNode = audioCtx.createGain();
            osc.connect(gainNode); gainNode.connect(audioCtx.destination);
            osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.03);
            gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
            osc.start(); osc.stop(audioCtx.currentTime + 0.03);
        } catch(e) {}
    };

    const range = document.getElementById('faturamento');
    if(range) {
        let lastVal = range.value;
        ['mousedown', 'touchstart'].forEach(evt => range.addEventListener(evt, () => { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }, {passive:true}));
        range.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            if(Math.abs(val - lastVal) >= 5000) { window.playTickSound(); if(navigator.vibrate) navigator.vibrate(2); lastVal = val; }
            
            window.currentFat = val.toLocaleString('pt-BR');
            window.currentPoupa = Math.floor(val * 0.045).toLocaleString('pt-BR');

            document.getElementById('faturamento-val').innerText = `R$ ${window.currentFat}`;
            document.getElementById('tempo-poupado').innerText = `${20 + Math.floor(val / 10000)}h / mês`;
            document.getElementById('dinheiro-poupado').innerText = `R$ ${window.currentPoupa}`;
        });
    }

    /* --- 6. INTEGRAÇÃO REAL DO LOGIN (SUPABASE) --- */
    const loginForm = document.getElementById('login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede que a página recarregue

            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            const btnSubmit = loginForm.querySelector('button[type="submit"]');

            // Feedback visual no botão
            btnSubmit.innerText = "A encriptar credenciais...";
            btnSubmit.style.opacity = "0.7";

            try {
                // Comunicação segura com o Banco de Dados
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) throw error;

                // SUCESSO
                btnSubmit.innerText = "✓ Acesso Autorizado";
                btnSubmit.style.background = "#059669";
                window.playTickSound();
                
                setTimeout(() => {
                    alert(`Bem-vindo, ${data.user.email}! A redirecionar para o Workspace...`);
                    // window.location.href = "/dashboard.html"; // Redirecionamento futuro
                }, 1000);

            } catch (err) {
                // ERRO
                btnSubmit.innerText = "✖ Acesso Negado";
                btnSubmit.style.background = "#ef4444";
                
                const modalBox = document.querySelector('#loginModal .modal-box');
                modalBox.style.transform = "translateY(0) translateX(10px)";
                setTimeout(() => modalBox.style.transform = "translateY(0) translateX(-10px)", 100);
                setTimeout(() => modalBox.style.transform = "translateY(0) translateX(0)", 200);

                setTimeout(() => {
                    btnSubmit.innerText = "Acessar Cofre Digital";
                    btnSubmit.style.background = ""; 
                    btnSubmit.style.opacity = "1";
                }, 2000);
            }
        });
    }

    /* --- 7. ANIMAÇÕES SCROLL E MODAIS --- */
    const obsFade = new IntersectionObserver(e => e.forEach(i => { if(i.isIntersecting) i.target.classList.add('show'); }), { threshold: 0.1 }); 
    document.querySelectorAll('[data-anime="fade"]').forEach(el => obsFade.observe(el));

    document.querySelectorAll('.modal-overlay, .cmd-palette-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) { if(e.target === this) this.classList.remove('ativo'); });
    });
});

/* =========================================
   FUNÇÕES GLOBAIS DA INTERFACE (WINDOW)
========================================= */
// Paleta de Comandos
window.abrirCommandPalette = () => { document.getElementById('cmd-palette').classList.add('ativo'); setTimeout(() => document.getElementById('cmd-input').focus(), 100); };
window.fecharCommandPalette = () => { document.getElementById('cmd-palette').classList.remove('ativo'); };

// Login UI
window.abrirLogin = () => {
    document.getElementById('loginModal').classList.add('ativo');
    document.getElementById('login-scanner').classList.add('active');
    document.getElementById('login-form').style.display = 'none';
    const scanText = document.getElementById('scan-text');
    scanText.innerText = "Aguardando leitura...";
    setTimeout(() => { scanText.innerText = "Estabelecendo conexão AES-256..."; window.playTickSound(); }, 800);
    setTimeout(() => {
        document.getElementById('login-scanner').classList.remove('active');
        document.getElementById('login-form').style.display = 'block';
    }, 2500);
};
window.fecharLogin = () => document.getElementById('loginModal').classList.remove('ativo');

// Sandbox Vivos
window.animateCharts = () => document.querySelectorAll('.s-bar').forEach(bar => bar.style.height = bar.getAttribute('data-target'));
window.switchTab = (tab) => {
    document.querySelectorAll('.s-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.s-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active'); document.getElementById(`tab-${tab}`).classList.add('active');
    if(tab === 'caixa') window.animateCharts();
};
window.aprovarLote = () => {
    const btn = document.getElementById('btn-aprovar'); btn.innerText = "A processar...";
    setTimeout(() => {
        document.querySelectorAll('.s-item').forEach(i => i.classList.add('cleared'));
        btn.innerText = "✓ Lote Seguro Aprovado"; btn.classList.add('done');
        document.getElementById('badge-boletos').innerText = "0"; document.getElementById('badge-boletos').style.background = "#059669";
        document.getElementById('s-balance').innerText = "R$ 140.950,00"; document.getElementById('s-balance').classList.add('success');
        window.playTickSound(); if(navigator.vibrate) navigator.vibrate([50, 50]);
    }, 800);
};

window.togglePricing = () => {
    const isAnual = document.getElementById('billing-toggle').checked;
    document.getElementById('label-mensal').classList.toggle('active', !isAnual);
    document.getElementById('label-anual').classList.toggle('active', isAnual);
    document.querySelectorAll('.price-val').forEach(p => p.innerText = isAnual ? p.getAttribute('data-anual') : p.getAttribute('data-mensal'));
};

// Chatbot
window.abrirChat = () => document.getElementById('chat-box').classList.toggle('open');
window.fecharChat = () => document.getElementById('chat-box').classList.remove('open');
window.chatResponder = (txt) => {
    document.getElementById('chat-body').innerHTML += `<div class="chat-msg user">${txt}</div>`;
    document.getElementById('chat-options').style.display = 'none';
    setTimeout(() => {
        document.getElementById('chat-body').innerHTML += `<div class="chat-msg bot">A transferir para Raul Paiva...</div>`;
        window.playTickSound(); setTimeout(() => window.enviarWhatsAppDireto(), 1500);
    }, 800);
};

// Diagnóstico Typeform
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
    if(num === 4) {
        setTimeout(() => {
            document.getElementById('step-4').classList.remove('ativo');
            document.getElementById('step-5').classList.add('ativo'); window.playTickSound();
        }, 2000);
    }
};

// WhatsApp Tracking
window.enviarWhatsAppInteligente = () => {
    const txt = `*Diagnóstico Prisma Finance*\nSegmento: ${diagData['Segmento']}\nTempo perdido: ${diagData['Horas']}\nAgendamento VIP: *${diagData['Horario']}*\n\n💰 *Dados da Empresa:*\nFaturamento aproximado: R$ ${window.currentFat}\nVi que posso poupar cerca de R$ ${window.currentPoupa} com a automação.\n\nOlá Raul, quero começar a minha jornada com o Prisma App!`;
    window.open(`https://wa.me/5584999999999?text=${encodeURIComponent(txt)}`, '_blank');
};
window.enviarWhatsAppDireto = () => {
    const txt = `Olá Raul! Estava na plataforma Prisma e quero automatizar o meu negócio. O meu faturamento é de cerca de R$ ${window.currentFat}. Podemos conversar?`;
    window.open(`https://wa.me/5584999999999?text=${encodeURIComponent(txt)}`, '_blank');
};