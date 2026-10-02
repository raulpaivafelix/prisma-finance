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
            // 1. Faz o login normal no cofre do Supabase
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            // 2. A MÁGICA: Vai à tabela clientes_bpo puxar o CNPJ deste e-mail
            const { data: clienteData, error: clienteError } = await supabase
                .from('clientes_bpo')
                .select('cnpj')
                .eq('email_login', email)
                .single();

            if (clienteError) throw clienteError;

            // 3. Guarda o CNPJ na memória do navegador (localStorage)
            if (clienteData && clienteData.cnpj) {
                localStorage.setItem('cnpjLogado', clienteData.cnpj);
            }

            // 4. Animação visual de sucesso e redirecionamento
            btnSubmit.innerText = "✓ Bem-vindo";
            btnSubmit.style.background = "#059669";
            setTimeout(() => { window.location.href = "dashboard.html"; }, 800);
            
           // ==========================================
        // RENDERIZAR O GRÁFICO DINÂMICO POR MÊS
        // ==========================================
        const ctx = document.getElementById('graficoFaturamento');
        
        if (ctx) {
            // 1. Array com todos os meses do ano
            const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            
            // 2. Prepara os valores zerados para os 12 meses
            let faturamentoMensal = new Array(12).fill(0);

            // 3. Lê nota por nota da base de dados e soma no mês correto
            dadosNotas.forEach(nota => {
                if (nota.created_at) {
                    const dataCriacao = new Date(nota.created_at);
                    const mesDaNota = dataCriacao.getMonth(); // 0 é Jan, 9 é Out
                    faturamentoMensal[mesDaNota] += (nota.valor_nota || 0); 
                }
            });

            // 4. Limpa o gráfico antigo ao atualizar
            if (window.meuGrafico) window.meuGrafico.destroy();

            // 5. Desenha o gráfico definitivo com os dados reais
            window.meuGrafico = new Chart(ctx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: nomesMeses,
                    datasets: [{
                        label: 'Faturamento Bruto (R$)',
                        data: faturamentoMensal,
                        backgroundColor: '#059669',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { 
                            beginAtZero: true, 
                            grid: { color: '#374151' }, 
                            ticks: { color: '#9ca3af' } 
                        },
                        x: { 
                            grid: { display: false }, 
                            ticks: { color: '#9ca3af' } 
                        }
                    }
                }
            });
        }
        } catch (err) {
            console.error("Erro completo:", err);
            btnSubmit.innerText = "X Erro no Login";
            btnSubmit.style.background = "#ef4444";
            setTimeout(() => { btnSubmit.innerText = "Acessar Dados Seguros"; btnSubmit.style.background = ""; btnSubmit.style.opacity = "1"; }, 2000);
        }
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

// --- SISTEMA DE LOGOUT ---
async function sairDoSistema() {
    localStorage.removeItem('cnpjLogado');
    await prismaDB.auth.signOut();
    window.location.replace("index.html");
}

// --- SISTEMA DE ATUALIZAÇÃO ---
function forcarAtualizacao() {
    const cnpj = localStorage.getItem('cnpjLogado');
    if (cnpj) {
        console.log("A sincronizar dados atualizados...");
        atualizarDashboard(cnpj);
    }
}