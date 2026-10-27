// ============================================================
// cadastro.js — cadastro de cliente com validação de CPF e ViaCEP
// ============================================================

function mascararCpf(valor) {
    return valor.replace(/\D/g, '').slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function mascararCep(valor) {
    return valor.replace(/\D/g, '').slice(0, 8)
        .replace(/(\d{5})(\d)/, '$1-$2')
}

document.addEventListener('DOMContentLoaded', () => {
    const inputCpf = document.getElementById('cpf')
    const inputCep = document.getElementById('cep')
    const msgCpf = document.getElementById('msg-cpf')
    const msgCep = document.getElementById('msg-cep')
    const alertaArea = document.getElementById('alerta-area')
    const form = document.getElementById('form-cadastro')
    const btn = document.getElementById('btn-cadastrar')

    inputCpf.addEventListener('input', (e) => {
        e.target.value = mascararCpf(e.target.value)
    })

    inputCpf.addEventListener('blur', () => {
        if (!inputCpf.value) return
        if (validaCpf(inputCpf.value)) {
            msgCpf.textContent = 'CPF válido ✓'
            msgCpf.style.color = 'var(--c-green)'
        } else {
            msgCpf.textContent = 'CPF inválido :: verifique os dígitos'
            msgCpf.style.color = 'var(--c-red)'
        }
    })

    inputCep.addEventListener('input', (e) => {
        e.target.value = mascararCep(e.target.value)
    })

    inputCep.addEventListener('blur', async () => {
        const cepLimpo = inputCep.value.replace(/\D/g, '')
        if (cepLimpo.length !== 8) {
            msgCep.textContent = 'CEP deve conter 8 dígitos'
            msgCep.style.color = 'var(--c-red)'
            return
        }

        msgCep.textContent = 'Consultando ViaCEP...'
        msgCep.style.color = 'var(--c-cyan)'

        try {
            const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
            const dados = await resp.json()

            if (dados.erro) {
                msgCep.textContent = 'CEP não encontrado'
                msgCep.style.color = 'var(--c-red)'
                return
            }

            document.getElementById('rua').value = dados.logradouro || ''
            document.getElementById('bairro').value = dados.bairro || ''
            document.getElementById('cidade').value = `${dados.localidade || ''} / ${dados.uf || ''}`
            msgCep.textContent = 'Endereço localizado ✓'
            msgCep.style.color = 'var(--c-green)'
        } catch (err) {
            console.error('Erro ao consultar ViaCEP', err)
            msgCep.textContent = 'Falha ao consultar o ViaCEP'
            msgCep.style.color = 'var(--c-red)'
        }
    })

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        alertaArea.innerHTML = ''

        const nome = document.getElementById('nome').value.trim()
        const email = document.getElementById('email').value.trim()
        const senha = document.getElementById('senha').value
        const cpf = inputCpf.value
        const cep = inputCep.value
        const numero = document.getElementById('numero').value.trim()

        if (!validaCpf(cpf)) {
            alertaArea.innerHTML = `<div class="alerta erro">CPF INVÁLIDO :: corrija antes de continuar</div>`
            return
        }

        btn.disabled = true
        btn.textContent = 'Cadastrando...'

        try {
            const resp = await fetch(`${API_URL}/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha, cpf, cep, numero, tipo: 'CLIENTE' })
            })
            const dados = await resp.json()

            if (resp.ok) {
                alertaArea.innerHTML = `<div class="alerta sucesso">CONTA CRIADA :: agora é só fazer login</div>`
                setTimeout(() => window.location.href = './login.html', 1200)
            } else {
                alertaArea.innerHTML = `<div class="alerta erro">${dados.message || 'Erro ao cadastrar'}</div>`
                btn.disabled = false
                btn.textContent = 'Cadastrar'
            }
        } catch (err) {
            console.error('Erro ao cadastrar', err)
            alertaArea.innerHTML = `<div class="alerta erro">FALHA DE CONEXÃO :: não foi possível cadastrar</div>`
            btn.disabled = false
            btn.textContent = 'Cadastrar'
        }
    })
})
