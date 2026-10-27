// ============================================================
// index.js — página inicial / vitrine
// ============================================================

let produtosCache = []

async function carregarVitrine() {
    const lista = document.getElementById('lista-destaques')
    const statProdutos = document.getElementById('stat-produtos')
    const statCategorias = document.getElementById('stat-categorias')

    try {
        const [respProdutos, respCategorias] = await Promise.all([
            fetch(`${API_URL}/produtos`),
            fetch(`${API_URL}/categorias`)
        ])
        const produtos = await respProdutos.json()
        const categorias = await respCategorias.json()

        const produtosApi = Array.isArray(produtos) ? produtos : []
        const categoriasApi = Array.isArray(categorias) ? categorias : []

        // fallback: enquanto o backend não estiver populado, usa o catálogo local de peças
        produtosCache = produtosApi.length > 0 ? produtosApi : MOCK_PRODUTOS
        const totalCategorias = categoriasApi.length > 0 ? categoriasApi.length : MOCK_CATEGORIAS.length

        statProdutos.textContent = produtosCache.length
        statCategorias.textContent = totalCategorias

        const destaques = produtosCache.slice(0, 4)
        lista.innerHTML = destaques.map(cardProdutoHTML).join('')
        ativarBotoesCarrinho(lista, produtosCache)
    } catch (err) {
        console.error('Erro ao carregar vitrine, usando catálogo local', err)
        // backend fora do ar: usa o catálogo local de peças pra vitrine não ficar vazia
        produtosCache = MOCK_PRODUTOS
        statProdutos.textContent = produtosCache.length
        statCategorias.textContent = MOCK_CATEGORIAS.length

        const destaques = produtosCache.slice(0, 4)
        lista.innerHTML = destaques.map(cardProdutoHTML).join('')
        ativarBotoesCarrinho(lista, produtosCache)
    }
}

document.addEventListener('DOMContentLoaded', carregarVitrine)
