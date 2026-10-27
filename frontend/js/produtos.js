// ============================================================
// produtos.js — catálogo público com busca e filtro por categoria
// ============================================================

let todosProdutos = []

async function carregarCategorias() {
    const select = document.getElementById('filtro-categoria')
    let categorias = []
    try {
        const resp = await fetch(`${API_URL}/categorias`)
        const dados = await resp.json()
        categorias = Array.isArray(dados) && dados.length > 0 ? dados : MOCK_CATEGORIAS
    } catch (err) {
        console.error('Erro ao carregar categorias, usando catálogo local', err)
        categorias = MOCK_CATEGORIAS
    }
    categorias.forEach(cat => {
        const opt = document.createElement('option')
        opt.value = cat.codCategoria
        opt.textContent = cat.nome
        select.appendChild(opt)
    })
}

function renderizarLista(produtos) {
    const lista = document.getElementById('lista-produtos')
    if (produtos.length === 0) {
        lista.innerHTML = `<p class="vazio">Nenhuma peça encontrada com esse filtro.</p>`
        return
    }
    lista.innerHTML = produtos.map(cardProdutoHTML).join('')
    ativarBotoesCarrinho(lista, todosProdutos)
}

function aplicarFiltros() {
    const termo = document.getElementById('busca-nome').value.trim().toLowerCase()
    const categoriaId = document.getElementById('filtro-categoria').value

    let filtrados = todosProdutos
    if (termo) filtrados = filtrados.filter(p => p.nome.toLowerCase().includes(termo))
    if (categoriaId) filtrados = filtrados.filter(p => String(p.idCategoria) === String(categoriaId))

    renderizarLista(filtrados)
}

async function carregarProdutos() {
    const lista = document.getElementById('lista-produtos')
    try {
        const resp = await fetch(`${API_URL}/produtos`)
        const produtos = await resp.json()
        const produtosApi = Array.isArray(produtos) ? produtos : []
        // fallback: enquanto o backend não estiver populado, usa o catálogo local de peças
        todosProdutos = produtosApi.length > 0 ? produtosApi : MOCK_PRODUTOS
        renderizarLista(todosProdutos)
    } catch (err) {
        console.error('Erro ao carregar produtos, usando catálogo local', err)
        todosProdutos = MOCK_PRODUTOS
        renderizarLista(todosProdutos)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias()
    carregarProdutos()
    document.getElementById('busca-nome').addEventListener('input', aplicarFiltros)
    document.getElementById('filtro-categoria').addEventListener('change', aplicarFiltros)
})
