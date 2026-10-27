// ============================================================
// NIGHT MARKET // CART.SYS — carrinho em localStorage
// ============================================================

const Cart = {
    KEY: 'nm_carrinho',

    get() {
        return JSON.parse(localStorage.getItem(this.KEY) || '[]')
    },

    save(itens) {
        localStorage.setItem(this.KEY, JSON.stringify(itens))
        atualizarBadgeCarrinho()
    },

    // produto: { codProduto, nome, preco, imagem, estoque: { quantidade } }
    adicionar(produto, quantidade = 1) {
        const disponivel = produto.estoque ? produto.estoque.quantidade : 0

        if (disponivel <= 0) {
            return { ok: false, motivo: 'ESTOQUE ZERADO :: este item está indisponível no momento' }
        }

        const itens = this.get()
        const existente = itens.find(i => i.idProduto === produto.codProduto)
        const qtdAtual = existente ? existente.quantidade : 0

        if (qtdAtual + quantidade > disponivel) {
            return { ok: false, motivo: `LIMITE DE ESTOQUE :: restam apenas ${disponivel} unidade(s)` }
        }

        if (existente) {
            existente.quantidade += quantidade
        } else {
            itens.push({
                idProduto: produto.codProduto,
                nome: produto.nome,
                preco: Number(produto.preco),
                imagem: produto.imagem,
                quantidade,
                estoqueDisponivel: disponivel
            })
        }

        this.save(itens)
        return { ok: true }
    },

    remover(idProduto) {
        const itens = this.get().filter(i => i.idProduto !== idProduto)
        this.save(itens)
    },

    atualizarQuantidade(idProduto, quantidade) {
        const itens = this.get()
        const item = itens.find(i => i.idProduto === idProduto)
        if (!item) return
        if (quantidade > item.estoqueDisponivel) quantidade = item.estoqueDisponivel
        if (quantidade < 1) {
            return this.remover(idProduto)
        }
        item.quantidade = quantidade
        this.save(itens)
    },

    limpar() {
        localStorage.removeItem(this.KEY)
        atualizarBadgeCarrinho()
    },

    total() {
        return this.get().reduce((acc, i) => acc + (i.preco * i.quantidade), 0)
    }
}
