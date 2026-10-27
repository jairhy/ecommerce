// ============================================================
// Helpers compartilhados de renderização de produtos (cards)
// ============================================================

function formatarPreco(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function cardProdutoHTML(produto) {
    const estoque = produto.estoque ? produto.estoque.quantidade : 0
    const zerado = estoque <= 0
    const categoriaNome = produto.categoria ? produto.categoria.nome : ''

    return `
    <article class="card-produto" data-id="${produto.codProduto}">
        <div class="thumb">
            ${produto.imagem
                ? `<img src="${produto.imagem}" alt="${produto.nome}" onerror="this.parentElement.innerHTML='<span class=\\'sem-img\\'>SEM IMAGEM</span>'">`
                : `<span class="sem-img">SEM IMAGEM</span>`}
        </div>
        <div class="info">
            ${categoriaNome ? `<span class="tag-categoria">${categoriaNome}</span>` : ''}
            <h3>${produto.nome}</h3>
            <span class="estoque-info ${zerado ? 'zerado' : ''}">${zerado ? 'ESTOQUE ZERADO' : `${estoque} un. em estoque`}</span>
            <span class="preco">${formatarPreco(produto.preco)}</span>
        </div>
        <div class="card-actions">
            <button class="btn btn-primary btn-block btn-sm btn-add-carrinho" data-id="${produto.codProduto}" ${zerado ? 'disabled' : ''}>
                ${zerado ? 'Indisponível' : 'Adicionar ao carrinho'}
            </button>
        </div>
    </article>`
}

// delega clique nos botões "adicionar ao carrinho" dentro de um container
function ativarBotoesCarrinho(container, produtosCache) {
    container.querySelectorAll('.btn-add-carrinho').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id)
            const produto = produtosCache.find(p => p.codProduto === id)
            if (!produto) return

            const resultado = Cart.adicionar(produto, 1)
            if (resultado.ok) {
                btn.textContent = 'Adicionado ✓'
                setTimeout(() => { btn.textContent = 'Adicionar ao carrinho' }, 1200)
            } else {
                alert(resultado.motivo)
            }
        })
    })
}
