// ============================================================
// admin.js — painel administrativo: produtos, categorias,
// estoque, entregas e relatórios gerenciais
// ============================================================

let categoriasCache = []

function money(v) {
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function mostrarAlerta(id, tipo, texto) {
    document.getElementById(id).innerHTML = `<div class="alerta ${tipo}">${texto}</div>`
    setTimeout(() => { document.getElementById(id).innerHTML = '' }, 4000)
}

// ---------------- TABS ----------------

function initTabs() {
    const botoes = document.querySelectorAll('.tab-btn')
    botoes.forEach(btn => {
        btn.addEventListener('click', () => {
            botoes.forEach(b => b.classList.remove('ativo'))
            document.querySelectorAll('.tab-painel').forEach(p => p.classList.remove('ativo'))
            btn.classList.add('ativo')
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('ativo')

            if (btn.dataset.tab === 'relatorios') carregarRelatorios()
        })
    })
}

// ---------------- CATEGORIAS ----------------

async function carregarCategorias() {
    const resp = await fetch(`${API_URL}/categorias`)
    categoriasCache = await resp.json()

    const select = document.getElementById('produto-categoria')
    select.innerHTML = categoriasCache.map(c => `<option value="${c.codCategoria}">${c.nome}</option>`).join('')

    const tbody = document.getElementById('tabela-categorias')
    tbody.innerHTML = categoriasCache.map(c => `
        <tr>
            <td>${c.codCategoria}</td>
            <td>${c.nome}</td>
            <td>${c.descricao || '--'}</td>
            <td class="tabela-acoes">
                <button class="btn btn-outline btn-sm" data-editar-categoria="${c.codCategoria}">Editar</button>
                <button class="btn btn-danger btn-sm" data-excluir-categoria="${c.codCategoria}">Excluir</button>
            </td>
        </tr>
    `).join('')

    tbody.querySelectorAll('[data-editar-categoria]').forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = categoriasCache.find(c => c.codCategoria == btn.dataset.editarCategoria)
            document.getElementById('categoria-id').value = cat.codCategoria
            document.getElementById('categoria-nome').value = cat.nome
            document.getElementById('categoria-descricao').value = cat.descricao || ''
            document.getElementById('titulo-form-categoria').textContent = `Editando: ${cat.nome}`
            document.getElementById('btn-salvar-categoria').textContent = 'Salvar Alterações'
            document.getElementById('btn-cancelar-categoria').classList.remove('hidden')
        })
    })

    tbody.querySelectorAll('[data-excluir-categoria]').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('Remover esta categoria?')) return
            const resp = await Auth.authFetch(`${API_URL}/categorias/${btn.dataset.excluirCategoria}`, { method: 'DELETE' })
            const dados = await resp.json()
            mostrarAlerta('alerta-categoria', resp.ok ? 'sucesso' : 'erro', dados.message)
            carregarCategorias()
        })
    })
}

function resetFormCategoria() {
    document.getElementById('form-categoria').reset()
    document.getElementById('categoria-id').value = ''
    document.getElementById('titulo-form-categoria').textContent = 'Cadastrar Categoria'
    document.getElementById('btn-salvar-categoria').textContent = 'Cadastrar'
    document.getElementById('btn-cancelar-categoria').classList.add('hidden')
}

function initFormCategoria() {
    document.getElementById('form-categoria').addEventListener('submit', async (e) => {
        e.preventDefault()
        const id = document.getElementById('categoria-id').value
        const payload = {
            nome: document.getElementById('categoria-nome').value.trim(),
            descricao: document.getElementById('categoria-descricao').value.trim()
        }

        const url = id ? `${API_URL}/categorias/${id}` : `${API_URL}/categorias`
        const method = id ? 'PUT' : 'POST'

        const resp = await Auth.authFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const dados = await resp.json()
        mostrarAlerta('alerta-categoria', resp.ok ? 'sucesso' : 'erro', dados.message)
        if (resp.ok) {
            resetFormCategoria()
            carregarCategorias()
        }
    })

    document.getElementById('btn-cancelar-categoria').addEventListener('click', resetFormCategoria)
}

// ---------------- PRODUTOS ----------------

async function carregarProdutosAdmin() {
    const resp = await fetch(`${API_URL}/produtos`)
    const produtos = await resp.json()

    const tbody = document.getElementById('tabela-produtos')
    if (!Array.isArray(produtos) || produtos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="muted">Nenhum produto cadastrado.</td></tr>`
        return
    }

    tbody.innerHTML = produtos.map(p => `
        <tr>
            <td>${p.codProduto}</td>
            <td>${p.nome}</td>
            <td>${p.categoria ? p.categoria.nome : '--'}</td>
            <td>${money(p.preco)}</td>
            <td>${p.estoque ? p.estoque.quantidade : 0}</td>
            <td class="tabela-acoes">
                <button class="btn btn-outline btn-sm" data-editar-produto="${p.codProduto}">Editar</button>
                <button class="btn btn-danger btn-sm" data-excluir-produto="${p.codProduto}">Excluir</button>
            </td>
        </tr>
    `).join('')

    tbody.querySelectorAll('[data-editar-produto]').forEach(btn => {
        btn.addEventListener('click', () => {
            const p = produtos.find(x => x.codProduto == btn.dataset.editarProduto)
            document.getElementById('produto-id').value = p.codProduto
            document.getElementById('produto-nome').value = p.nome
            document.getElementById('produto-categoria').value = p.idCategoria
            document.getElementById('produto-marca').value = p.marca || ''
            document.getElementById('produto-preco').value = p.preco
            document.getElementById('produto-imagem').value = p.imagem || ''
            document.getElementById('produto-descricao').value = p.descricao || ''
            document.getElementById('campo-qtd-inicial').classList.add('hidden')
            document.getElementById('titulo-form-produto').textContent = `Editando: ${p.nome}`
            document.getElementById('btn-salvar-produto').textContent = 'Salvar Alterações'
            document.getElementById('btn-cancelar-produto').classList.remove('hidden')
            window.scrollTo({ top: 0, behavior: 'smooth' })
        })
    })

    tbody.querySelectorAll('[data-excluir-produto]').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('Remover este produto?')) return
            const resp = await Auth.authFetch(`${API_URL}/produtos/${btn.dataset.excluirProduto}`, { method: 'DELETE' })
            const dados = await resp.json()
            mostrarAlerta('alerta-produto', resp.ok ? 'sucesso' : 'erro', dados.message)
            carregarProdutosAdmin()
        })
    })
}

function resetFormProduto() {
    document.getElementById('form-produto').reset()
    document.getElementById('produto-id').value = ''
    document.getElementById('campo-qtd-inicial').classList.remove('hidden')
    document.getElementById('titulo-form-produto').textContent = 'Cadastrar Peça'
    document.getElementById('btn-salvar-produto').textContent = 'Cadastrar'
    document.getElementById('btn-cancelar-produto').classList.add('hidden')
}

function initFormProduto() {
    document.getElementById('form-produto').addEventListener('submit', async (e) => {
        e.preventDefault()
        const id = document.getElementById('produto-id').value

        const payload = {
            nome: document.getElementById('produto-nome').value.trim(),
            idCategoria: Number(document.getElementById('produto-categoria').value),
            marca: document.getElementById('produto-marca').value.trim(),
            preco: Number(document.getElementById('produto-preco').value),
            imagem: document.getElementById('produto-imagem').value.trim(),
            descricao: document.getElementById('produto-descricao').value.trim()
        }
        if (!id) payload.quantidadeInicial = Number(document.getElementById('produto-qtd-inicial').value || 0)

        const url = id ? `${API_URL}/produtos/${id}` : `${API_URL}/produtos`
        const method = id ? 'PUT' : 'POST'

        const resp = await Auth.authFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const dados = await resp.json()
        mostrarAlerta('alerta-produto', resp.ok ? 'sucesso' : 'erro', dados.message)
        if (resp.ok) {
            resetFormProduto()
            carregarProdutosAdmin()
            carregarEstoque()
        }
    })

    document.getElementById('btn-cancelar-produto').addEventListener('click', resetFormProduto)
}

// ---------------- ESTOQUE ----------------

async function carregarEstoque() {
    const resp = await Auth.authFetch(`${API_URL}/estoque`)
    const estoques = await resp.json()

    const tbody = document.getElementById('tabela-estoque')
    if (!Array.isArray(estoques) || estoques.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="muted">Nenhum registro de estoque.</td></tr>`
        return
    }

    tbody.innerHTML = estoques.map(e => `
        <tr>
            <td>${e.produto ? e.produto.nome : `Produto #${e.idProduto}`}</td>
            <td><input type="number" min="0" value="${e.quantidade}" id="qtd-${e.codEstoque}" style="width:90px; background:var(--c-bg-alt); border:1px solid var(--c-border); color:var(--c-text); padding:6px 8px;"></td>
            <td><input type="number" min="0" value="${e.quantidadeMinima}" id="min-${e.codEstoque}" style="width:90px; background:var(--c-bg-alt); border:1px solid var(--c-border); color:var(--c-text); padding:6px 8px;"></td>
            <td class="tabela-acoes">
                <button class="btn btn-primary btn-sm" data-salvar-estoque="${e.codEstoque}">Salvar</button>
            </td>
        </tr>
    `).join('')

    tbody.querySelectorAll('[data-salvar-estoque]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.salvarEstoque
            const quantidade = Number(document.getElementById(`qtd-${id}`).value)
            const quantidadeMinima = Number(document.getElementById(`min-${id}`).value)

            const resp = await Auth.authFetch(`${API_URL}/estoque/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantidade, quantidadeMinima })
            })
            const dados = await resp.json()
            mostrarAlerta('alerta-estoque', resp.ok ? 'sucesso' : 'erro', dados.message)
            if (resp.ok) carregarProdutosAdmin()
        })
    })
}

// ---------------- ENTREGAS ----------------

const STATUS_ENTREGA = ['PROCESSANDO', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA']

async function carregarEntregas() {
    const resp = await Auth.authFetch(`${API_URL}/entregas`)
    const entregas = await resp.json()

    const tbody = document.getElementById('tabela-entregas')
    if (!Array.isArray(entregas) || entregas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="muted">Nenhuma entrega registrada.</td></tr>`
        return
    }

    tbody.innerHTML = entregas.map(en => `
        <tr>
            <td>#${en.idPedido}</td>
            <td>
                <select id="status-${en.codEntrega}" style="background:var(--c-bg-alt); border:1px solid var(--c-border); color:var(--c-text); padding:6px 8px;">
                    ${STATUS_ENTREGA.map(s => `<option value="${s}" ${s === en.status ? 'selected' : ''}>${s.replace('_', ' ')}</option>`).join('')}
                </select>
            </td>
            <td><input type="text" value="${en.codigoRastreio || ''}" id="rastreio-${en.codEntrega}" placeholder="código" style="width:140px; background:var(--c-bg-alt); border:1px solid var(--c-border); color:var(--c-text); padding:6px 8px;"></td>
            <td class="tabela-acoes">
                <button class="btn btn-primary btn-sm" data-salvar-entrega="${en.codEntrega}">Salvar</button>
            </td>
        </tr>
    `).join('')

    tbody.querySelectorAll('[data-salvar-entrega]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.salvarEntrega
            const status = document.getElementById(`status-${id}`).value
            const codigoRastreio = document.getElementById(`rastreio-${id}`).value

            const resp = await Auth.authFetch(`${API_URL}/entregas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, codigoRastreio })
            })
            const dados = await resp.json()
            mostrarAlerta('alerta-entrega', resp.ok ? 'sucesso' : 'erro', dados.message)
        })
    })
}

// ---------------- RELATÓRIOS ----------------

let chartVendas = null
let chartFaturamento = null

async function carregarRelatorios() {
    try {
        const [respVendas, respFaturamento] = await Promise.all([
            Auth.authFetch(`${API_URL}/relatorios/vendas`),
            Auth.authFetch(`${API_URL}/relatorios/estoque`)
        ])
        const vendas = await respVendas.json()
        const faturamento = await respFaturamento.json()

        const ctxVendas = document.getElementById('grafico-vendas')
        if (chartVendas) chartVendas.destroy()
        chartVendas = new Chart(ctxVendas, {
            type: 'bar',
            data: {
                labels: vendas.map(v => v.categoria),
                datasets: [{
                    label: 'Faturamento (R$)',
                    data: vendas.map(v => Number(v.faturamento)),
                    backgroundColor: '#fcee0a'
                }]
            },
            options: {
                plugins: { legend: { labels: { color: '#eaeaee' } } },
                scales: {
                    x: { ticks: { color: '#8b8b97' }, grid: { color: '#2b2b33' } },
                    y: { ticks: { color: '#8b8b97' }, grid: { color: '#2b2b33' } }
                }
            }
        })

        const ctxFaturamento = document.getElementById('grafico-faturamento')
        if (chartFaturamento) chartFaturamento.destroy()
        chartFaturamento = new Chart(ctxFaturamento, {
            type: 'line',
            data: {
                labels: faturamento.map(f => f.mes),
                datasets: [{
                    label: 'Faturamento mensal (R$)',
                    data: faturamento.map(f => Number(f.faturamento)),
                    borderColor: '#00f0ff',
                    backgroundColor: 'rgba(0,240,255,0.15)',
                    tension: 0.25,
                    fill: true
                }]
            },
            options: {
                plugins: { legend: { labels: { color: '#eaeaee' } } },
                scales: {
                    x: { ticks: { color: '#8b8b97' }, grid: { color: '#2b2b33' } },
                    y: { ticks: { color: '#8b8b97' }, grid: { color: '#2b2b33' } }
                }
            }
        })
    } catch (err) {
        console.error('Erro ao carregar relatórios', err)
    }
}

// ---------------- INIT ----------------

document.addEventListener('DOMContentLoaded', () => {
    Auth.exigirLogin()

    if (!Auth.isAdmin()) {
        document.getElementById('acesso-negado').classList.remove('hidden')
        return
    }

    document.getElementById('conteudo-admin').classList.remove('hidden')

    initTabs()
    initFormCategoria()
    initFormProduto()

    carregarCategorias().then(carregarProdutosAdmin)
    carregarEstoque()
    carregarEntregas()
})
