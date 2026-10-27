// ============================================================
// perfil.js — consulta e atualização dos dados do usuário logado
// ============================================================

async function carregarPerfil() {
    try {
        const resp = await Auth.authFetch(`${API_URL}/usuarios/perfil`)
        if (!resp.ok) return
        const u = await resp.json()

        document.getElementById('titulo-perfil').textContent = `Perfil de ${u.nome}`
        document.getElementById('nome').value = u.nome || ''
        document.getElementById('email').value = u.email || ''
        document.getElementById('cpf').value = u.cpf || ''
        document.getElementById('tipo').value = u.tipo || ''
        document.getElementById('cep').value = u.cep || ''
        document.getElementById('numero').value = u.numero || ''
        document.getElementById('rua').value = u.rua || ''
        document.getElementById('bairro').value = u.bairro || ''
        document.getElementById('cidade').value = `${u.cidade || ''} / ${u.uf || ''}`
    } catch (err) {
        console.error('Erro ao carregar perfil', err)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Auth.exigirLogin()
    carregarPerfil()

    const form = document.getElementById('form-perfil')
    const alertaArea = document.getElementById('alerta-area')
    const btn = document.getElementById('btn-salvar')

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        alertaArea.innerHTML = ''

        const usuario = Auth.getUsuario()
        const payload = {
            nome: document.getElementById('nome').value.trim(),
            email: document.getElementById('email').value.trim(),
            cep: document.getElementById('cep').value.trim(),
            numero: document.getElementById('numero').value.trim()
        }
        const senha = document.getElementById('senha').value
        if (senha) payload.senha = senha

        btn.disabled = true
        btn.textContent = 'Salvando...'

        try {
            const resp = await Auth.authFetch(`${API_URL}/usuarios/${usuario.codUsuario}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            const dados = await resp.json()

            if (resp.ok) {
                alertaArea.innerHTML = `<div class="alerta sucesso">${dados.message || 'Dados atualizados'}</div>`
                if (payload.nome) {
                    usuario.nome = payload.nome
                    localStorage.setItem('nm_usuario', JSON.stringify(usuario))
                }
                document.getElementById('senha').value = ''
                carregarPerfil()
            } else {
                alertaArea.innerHTML = `<div class="alerta erro">${dados.message || 'Erro ao atualizar'}</div>`
            }
        } catch (err) {
            console.error('Erro ao salvar perfil', err)
            alertaArea.innerHTML = `<div class="alerta erro">FALHA DE CONEXÃO :: não foi possível salvar</div>`
        } finally {
            btn.disabled = false
            btn.textContent = 'Salvar Alterações'
        }
    })
})
