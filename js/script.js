// ==========================================
// 1. O CRONÓMETRO IMPARÁVEL DO PRELOADER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Exibe o brasão por 1.5 segundos e apaga de forma segura!
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                if(typeof window.animateCharts === 'function') window.animateCharts();
            }, 500);
        }, 1500);
    }
});

// ==========================================
// 2. FUNÇÕES GLOBAIS DA INTERFACE (BOTÕES)
// ==========================================
window.abrirLogin = () => {
    document.getElementById('loginModal').classList.add('ativo');
    document.getElementById('login-scanner').classList.add('active');
    document.getElementById('login-form').style.display = 'none';
    
    document.getElementById('scan-text').innerText = "Aguardando leitura...";
    
    setTimeout(() => { 
        document.getElementById('scan-text').innerText = "Estabelecendo conexão AES-256..."; 
    }, 800);
    
    setTimeout(() => {
        document.getElementById('login-scanner').classList.remove('active');
        document.getElementById('login-form').style.display = 'block';
    }, 2500);
};

window.fecharLogin = () => {
    document.getElementById('loginModal').classList.remove('ativo');
};

window.animateCharts = () => {
    document.querySelectorAll('.s-bar').forEach(bar => {
        bar.style.height = bar.getAttribute('data-target');
    });
};

window.switchTab = (tab) => {
    document.querySelectorAll('.s-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.s-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active'); 
    document.getElementById(`tab-${tab}`).classList.add('active');
    if(tab === 'caixa') window.animateCharts();
};

window.aprovarLote = () => {
    const btn = document.getElementById('btn-aprovar'); 
    btn.innerText = "A processar...";
    setTimeout(() => {
        document.querySelectorAll('.s-item').forEach(i => i.classList.add('cleared'));
        btn.innerText = "✓ Lote Seguro Aprovado"; 
        btn.classList.add('done');
        document.getElementById('badge-boletos').innerText = "0"; 
        document.getElementById('badge-boletos').style.background = "#059669";
        document.getElementById('s-balance').innerText = "R$ 140.950,00"; 
        document.getElementById('s-balance').classList.add('success');
    }, 800);
};

// ==========================================
// 3. CONFIGURAÇÃO SUPABASE E FORMULÁRIO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const supabaseUrl = 'https://ebomgngzpwaaghtcjllz.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib21nbmd6cHdhYWdodGNqbGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NjU5MzMsImV4cCI6MjEwNjE0MTkzM30.0EBSn49Y0Bak3G6FlfVsGqXc3MxtJKdIzAutq0KnB-I';
    let supabase = null;
    
    if (window.supabase) {
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    }

    // Login Real e Redirecionamento
    const loginForm = document.getElementById('login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            const btnSubmit = loginForm.querySelector('button[type="submit"]');

            btnSubmit.innerText = "A encriptar...";
            btnSubmit.style.opacity = "0.7";

            if(!supabase) {
                alert("Falha de ligação ao servidor.");
                return;
            }

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) throw error;

                btnSubmit.innerText = "✓ Acesso Autorizado";
                btnSubmit.style.background = "#059669";
                
                // Leva o utilizador para a Sala do Trono
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);

            } catch (err) {
                btnSubmit.innerText = "✖ Acesso Negado";
                btnSubmit.style.background = "#ef4444";
                
                setTimeout(() => {
                    btnSubmit.innerText = "Acessar Cofre Digital";
                    btnSubmit.style.background = ""; 
                    btnSubmit.style.opacity = "1";
                }, 2000);
            }
        });
    }

    // Calculadora ROI Matemática
    const range = document.getElementById('faturamento');
    if(range) {
        range.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            document.getElementById('faturamento-val').innerText = `R$ ${val.toLocaleString('pt-BR')}`;
            document.getElementById('tempo-poupado').innerText = `${20 + Math.floor(val / 10000)}h / mês`;
            document.getElementById('dinheiro-poupado').innerText = `R$ ${Math.floor(val * 0.045).toLocaleString('pt-BR')}`;
        });
    }
});