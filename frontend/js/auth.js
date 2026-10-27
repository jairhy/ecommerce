// ============================================================
// NIGHT MARKET // AUTH.SYS — sessão, token JWT e controle de nav
// ============================================================

const Auth = {
    getToken() {
        return localStorage.getItem('nm_token')
    },
    getUsuario() {
        const raw = localStorage.getItem('nm_usuario')
        return raw ? JSON.parse(raw) : null
    },
    isLoggedIn() {
        return !!this.getToken()
    },
    isAdmin() {
        const u = this.getUsuario()
        return !!u && u.tipo === 'ADMIN'
    },
    salvarSessao(token, usuario) {
        localStorage.setItem('nm_token', token)
        localStorage.setItem('nm_usuario', JSON.stringify(usuario))
    },
    logout() {
        localStorage.removeItem('nm_token')
        localStorage.removeItem('nm_usuario')
        window.location.href = this.resolveHome()
    },
    resolveHome() {
        return window.location.pathname.includes('/html/') ? '../index.html' : './index.html'
    },
    // fetch com o header Authorization já anexado
    async authFetch(url, options = {}) {
        const token = this.getToken()
        const headers = { ...(options.headers || {}) }
        if (token) headers['Authorization'] = `Bearer ${token}`
        const resp = await fetch(url, { ...options, headers })
        if (resp.status === 401) {
            this.logout()
        }
        return resp
    },
    // bloqueia páginas que exigem login
    exigirLogin() {
        if (!this.isLoggedIn()) {
            window.location.href = window.location.pathname.includes('/html/') ? './login.html' : './html/login.html'
        }
    },
    exigirAdmin() {
        this.exigirLogin()
        if (!this.isAdmin()) {
            alert('ACESSO NEGADO :: área restrita a administradores')
            window.location.href = this.resolveHome()
        }
    }
}

// Atualiza os elementos de navegação presentes em toda página
function montarNav() {
    const logado = Auth.isLoggedIn()
    const usuario = Auth.getUsuario()
    const admin = Auth.isAdmin()

    document.querySelectorAll('.nav-guest-only').forEach(el => el.style.display = logado ? 'none' : '')
    document.querySelectorAll('.nav-user-only').forEach(el => el.style.display = logado ? '' : 'none')
    document.querySelectorAll('.nav-admin-only').forEach(el => el.style.display = admin ? '' : 'none')

    const nomeSpan = document.querySelector('[data-nav="nome"]')
    if (nomeSpan && usuario) nomeSpan.textContent = usuario.nome.split(' ')[0]

    document.querySelectorAll('[data-logout]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault()
            Auth.logout()
        })
    })

    atualizarBadgeCarrinho()
}

function atualizarBadgeCarrinho() {
    const badge = document.querySelector('[data-cart-count]')
    if (!badge) return
    const carrinho = JSON.parse(localStorage.getItem('nm_carrinho') || '[]')
    const total = carrinho.reduce((acc, item) => acc + item.quantidade, 0)
    badge.textContent = total
    badge.style.display = total > 0 ? 'inline-flex' : 'none'
}

document.addEventListener('DOMContentLoaded', montarNav)
