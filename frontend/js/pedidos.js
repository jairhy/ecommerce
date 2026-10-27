// ============================================================
// pedidos.js — histórico de pedidos do cliente logado
// ============================================================

function formatarData(dataStr) {
    if (!dataStr) return '--'
    const [ano, mes, dia] = dataStr.split('-')
    return `${dia}/${mes}/${ano}`
}

function cardPedidoHTML(pedido) {
    const itens = pedido.itemPedidos || []
    const entrega = pedido.entrega
    const statusEntrega = entrega ? entrega.status : null

    const linhasItens = itens.map(item => `
        <tr>
            <td>${item.produto ? item.produto.nome : `Produto #${item.idProduto}`}</td>
            <td>${item.quantidade}</td>
            <td>${formatarPreco(item.precoUnitario)}</td>
            <td>${formatarPreco(item.precoUnitario * item.quantidade)}</td>
        </tr>
    `).join('')

    return `
    <div class="painel mb-24">
        <div class="flex-between mb-16" style="flex-wrap:wrap; gap:10px;">
            <div>
                <p class="eyebrow">PEDIDO #${pedido.codPedido}</p>
                <p class="muted mono" style="font-size:0.8rem;">Realizado em ${formatarData(pedido.dataPedido)}</p>
            </div>
            <div class="flex gap-8" style="align-items:center;">
                <span class="badge-status badge-${pedido.status}">${pedido.status}</span>
                ${statusEntrega ? `<span class="badge-status badge-${statusEntrega}">${statusEntrega.replace('_', ' ')}</span>` : ''}
            </div>
        </div>

        <div class="tabela-wrap">
            <table class="tabela-nm">
                <thead>
                    <tr><th>Produto</th><th>Qtd.</th><th>Preço Un.</th><th>Subtotal</th></tr>
                </thead>
                <tbody>${linhasItens}</tbody>
            </table>
        </div>

        <div class="flex-between mt-16">
            <span class="mono muted">${entrega && entrega.codigoRastreio ? `Rastreio: ${entrega.codigoRastreio}` : 'Sem código de rastreio ainda'}</span>
            <span class="preco">Total: ${formatarPreco(pedido.valorTotal)}</span>
        </div>
    </div>`
}

async function carregarPedidos() {
    const container = document.getElementById('lista-pedidos')
    try {
        const resp = await Auth.authFetch(`${API_URL}/pedidos/meus-pedidos`)
        const pedidos = await resp.json()

        if (!Array.isArray(pedidos) || pedidos.length === 0) {
            container.innerHTML = `<p class="vazio">Você ainda não fez nenhum pedido. <a href="./produtos.html" style="color:var(--c-cyan)">Ver catálogo →</a></p>`
            return
        }

        const ordenados = [...pedidos].sort((a, b) => b.codPedido - a.codPedido)
        container.innerHTML = ordenados.map(cardPedidoHTML).join('')
    } catch (err) {
        console.error('Erro ao carregar pedidos', err)
        container.innerHTML = `<p class="vazio">FALHA DE CONEXÃO :: não foi possível carregar seus pedidos.</p>`
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Auth.exigirLogin()
    carregarPedidos()
})
