document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => { preloader.style.opacity = '0'; setTimeout(() => { preloader.style.display = 'none'; }, 500); }, 1500);
    }

    // LIGAÇÃO SUPABASE
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

            btnSubmit.innerHTML = "<span class='spinner-small'></span> A processar...";
            btnSubmit.style.opacity = "0.8";

            if(!supabase) return;

            try {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                btnSubmit.innerText = "✓ Bem-vindo";
                btnSubmit.style.background = "#059669";
                setTimeout(() => { window.location.href = "dashboard.html"; }, 800);
            } catch (err) {
                btnSubmit.innerText = "✖ Erro no Login";
                btnSubmit.style.background = "#ef4444";
                setTimeout(() => { btnSubmit.innerText = "Acessar Dados Seguros"; btnSubmit.style.background = ""; btnSubmit.style.opacity = "1"; }, 2000);
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
    document.getElementById('scan-text').innerText = "A encriptar canal...";
    setTimeout(() => { document.getElementById('scan-text').innerText = "Ligação Segura."; }, 800);
    setTimeout(() => { document.getElementById('login-scanner').classList.remove('active'); document.getElementById('login-form').style.display = 'block'; }, 2000);
};

window.fecharLogin = () => document.getElementById('loginModal').classList.remove('ativo');
window.togglePricing = () => {
    const isAnual = document.getElementById('billing-toggle').checked;
    document.getElementById('label-mensal').style.color = isAnual ? 'var(--text-muted)' : 'white';
    document.getElementById('label-anual').style.color = isAnual ? 'white' : 'var(--text-muted)';
    document.querySelectorAll('.price-val').forEach(p => { p.innerText = isAnual ? p.getAttribute('data-anual') : p.getAttribute('data-mensal'); });
};
window.toggleMobileMenu = () => { document.querySelector('.nav-links').classList.toggle('active'); };