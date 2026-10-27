// ============================================================
// login.js — autenticação
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    if (Auth.isLoggedIn()) {
        window.location.href = './perfil.html'
        return
    }

    const form = document.getElementById('form-login')
    const alertaArea = document.getElementById('alerta-area')
    const btn = document.getElementById('btn-login')

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        alertaArea.innerHTML = ''

        const email = document.getElementById('email').value.trim()
        const senha = document.getElementById('senha').value

        btn.disabled = true
        btn.textContent = 'Autenticando...'

        try {
            const resp = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            })
            const dados = await resp.json()

            if (resp.ok) {
                Auth.salvarSessao(dados.token, dados.usuario)
                alertaArea.innerHTML = `<div class="alerta sucesso">ACESSO CONCEDIDO :: bem-vindo(a), ${dados.usuario.nome}</div>`
                setTimeout(() => window.location.href = './perfil.html', 700)
            } else {
                alertaArea.innerHTML = `<div class="alerta erro">${dados.message || 'Credenciais inválidas'}</div>`
                btn.disabled = false
                btn.textContent = 'Entrar'
            }
        } catch (err) {
            console.error('Erro ao autenticar', err)
            alertaArea.innerHTML = `<div class="alerta erro">FALHA DE CONEXÃO :: não foi possível contatar o servidor</div>`
            btn.disabled = false
            btn.textContent = 'Entrar'
        }
    })
})
