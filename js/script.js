document.addEventListener('DOMContentLoaded', () => {

    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => { preloader.style.opacity = '0'; setTimeout(() => { preloader.style.display = 'none'; }, 500); }, 1500);
    }

    const supabaseUrl = 'https://ebomgngzpwaaghtcjllz.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib21nbmd6cHdhYWdodGNqbGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NjU5MzMsImV4cCI6MjEwNjE0MTkzM30.0EBSn49Y0Bak3G6FlfVsGqXc3MxtJKdIzAutq0KnB-I';
    let supabase = null;
    if (window.supabase) supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    const loginForm = document.getElementById('login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            const btnSubmit = loginForm.querySelector('button[type="submit"]');

            btnSubmit.innerHTML = "<span class='spinner-small'></span> Criptografando conexão...";
            btnSubmit.style.opacity = "0.8";

            if(!supabase) {
                window.simularAcao("Erro Crítico: Bloqueio de rede detetado.", true);
                btnSubmit.innerText = "Tentar Novamente"; return;
            }

            try {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                btnSubmit.innerText = "✓ Chave Validada";
                btnSubmit.style.background = "#059669";
                btnSubmit.style.opacity = "1";
                setTimeout(() => { window.location.href = "dashboard.html"; }, 800);

            } catch (err) {
                btnSubmit.innerText = "✖ Acesso Negado";
                btnSubmit.style.background = "#ef4444";
                setTimeout(() => {
                    btnSubmit.innerText = "Acessar Dados Seguros";
                    btnSubmit.style.background = ""; btnSubmit.style.opacity = "1";
                }, 2000);
            }
        });
    }

    const range = document.getElementById('faturamento');
    if(range) {
        range.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            document.getElementById('faturamento-val').innerText = `R$ ${val.toLocaleString('pt-BR')}`;
            document.getElementById('tempo-poupado').innerText = `${30 + Math.floor(val / 8000)}h / mês`;
            document.getElementById('dinheiro-poupado').innerText = `R$ ${Math.floor(val * 0.065).toLocaleString('pt-BR')}`;
        });
    }
});

window.abrirLogin = () => {
    document.getElementById('loginModal').classList.add('ativo');
    document.getElementById('login-scanner').classList.add('active');
    document.getElementById('login-form').style.display = 'none';
    
    document.getElementById('scan-text').innerText = "Verificando protocolos de segurança...";
    setTimeout(() => { document.getElementById('scan-text').innerText = "Conexão AES-256 estabelecida."; }, 800);
    setTimeout(() => {
        document.getElementById('login-scanner').classList.remove('active');
        document.getElementById('login-form').style.display = 'block';
    }, 2000);
};

window.fecharLogin = () => document.getElementById('loginModal').classList.remove('ativo');

window.togglePricing = () => {
    const isAnual = document.getElementById('billing-toggle').checked;
    document.getElementById('label-mensal').style.color = isAnual ? 'var(--text-muted)' : 'white';
    document.getElementById('label-anual').style.color = isAnual ? 'white' : 'var(--text-muted)';
    document.querySelectorAll('.price-val').forEach(p => { p.innerText = isAnual ? p.getAttribute('data-anual') : p.getAttribute('data-mensal'); });
};

// TOAST - Notificações para os botões da página
window.simularAcao = (mensagem, isError = false) => {
    const container = document.getElementById('toast-container');
    if(!container) return;
    
    const toast = document.createElement('div');
    toast.className = `custom-toast ${isError ? 'error' : ''}`;
    toast.innerHTML = `<span style="margin-right:8px;">${isError ? '⚠️' : '✨'}</span> ${mensagem}`;
    
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};