// ============================================================
// carrinho.js — listagem, edição de quantidade e checkout
// ============================================================

function renderizarCarrinho() {
    const itens = Cart.get()
    const container = document.getElementById('lista-carrinho')
    const resumoItens = document.getElementById('resumo-itens')
    const resumoTotal = document.getElementById('resumo-total')
    const btnCheckout = document.getElementById('btn-checkout')

    if (itens.length === 0) {
        container.innerHTML = `<p class="vazio">Seu carrinho está vazio. <a href="./produtos.html" style="color:var(--c-cyan)">Ver catálogo →</a></p>`
        resumoItens.textContent = '0'
        resumoTotal.textContent = formatarPreco(0)
        btnCheckout.disabled = true
        return
    }

    container.innerHTML = itens.map(item => `
        <div class="linha-carrinho" data-id="${item.idProduto}">
            <div class="thumb-mini">
                ${item.imagem ? `<img src="${item.imagem}" alt="${item.nome}" onerror="this.style.display='none'">` : ''}
            </div>
            <div>
                <h3 style="font-size:1rem; text-transform:none;">${item.nome}</h3>
                <span class="mono muted">${formatarPreco(item.preco)} / un.</span>
            </div>
            <div class="qty-control">
                <button data-acao="menos" data-id="${item.idProduto}">-</button>
                <span>${item.quantidade}</span>
                <button data-acao="mais" data-id="${item.idProduto}">+</button>
            </div>
            <span class="mono">${formatarPreco(item.preco * item.quantidade)}</span>
            <button class="btn btn-danger btn-sm" data-acao="remover" data-id="${item.idProduto}">Remover</button>
        </div>
    `).join('')

    resumoItens.textContent = itens.reduce((acc, i) => acc + i.quantidade, 0)
    resumoTotal.textContent = formatarPreco(Cart.total())
    btnCheckout.disabled = false

    container.querySelectorAll('button[data-acao]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id)
            const acao = btn.dataset.acao
            const itemAtual = Cart.get().find(i => i.idProduto === id)
            if (!itemAtual) return

            if (acao === 'mais') Cart.atualizarQuantidade(id, itemAtual.quantidade + 1)
            if (acao === 'menos') Cart.atualizarQuantidade(id, itemAtual.quantidade - 1)
            if (acao === 'remover') Cart.remover(id)

            renderizarCarrinho()
        })
    })
}

function mostrarAlerta(tipo, texto) {
    const area = document.getElementById('alerta-area')
    area.innerHTML = `<div class="alerta ${tipo}">${texto}</div>`
}

async function finalizarPedido() {
    const msg = document.getElementById('msg-checkout')

    if (!Auth.isLoggedIn()) {
        mostrarAlerta('aviso', 'VOCÊ PRECISA ESTAR LOGADO :: faça login para finalizar o pedido.')
        setTimeout(() => window.location.href = './login.html', 1400)
        return
    }

    const itens = Cart.get()
    if (itens.length === 0) return

    const payload = {
        itens: itens.map(i => ({ idProduto: i.idProduto, quantidade: i.quantidade }))
    }

    const btn = document.getElementById('btn-checkout')
    btn.disabled = true
    msg.textContent = 'Processando pedido...'

    try {
        const resp = await Auth.authFetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const dados = await resp.json()

        if (resp.ok) {
            Cart.limpar()
            mostrarAlerta('sucesso', `PEDIDO #${dados.codPedido} CONFIRMADO :: total de ${formatarPreco(dados.valorTotal)}`)
            renderizarCarrinho()
            msg.textContent = ''
            setTimeout(() => window.location.href = './pedidos.html', 1600)
        } else {
            mostrarAlerta('erro', dados.message || 'Erro ao finalizar pedido')
            btn.disabled = false
        }
    } catch (err) {
        console.error('Erro ao finalizar pedido', err)
        mostrarAlerta('erro', 'FALHA DE CONEXÃO :: não foi possível concluir o pedido')
        btn.disabled = false
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrinho()
    document.getElementById('btn-checkout').addEventListener('click', finalizarPedido)
})
