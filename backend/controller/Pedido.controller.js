const db = require('../db/conn')
const Pedido = require('../models/Pedido')
const ItemPedido = require('../models/ItemPedido')
const Produto = require('../models/Produto')
const Estoque = require('../models/Estoque')
const Entrega = require('../models/Entrega')

// POST /pedidos - checkout: recebe { itens: [{ idProduto, quantidade }] }
const cadastrar = async (req, res) => {
    const { itens } = req.body
    const idUsuario = req.usuario.codUsuario // vem do token JWT (rota protegida)

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ message: 'O pedido precisa ter ao menos um item' })
    }

    const transacao = await db.transaction()

    try {
        let valorTotal = 0
        const itensValidados = []

        // 1. valida estoque de cada item ANTES de criar qualquer coisa
        for (const item of itens) {
            const produto = await Produto.findByPk(item.idProduto, { transaction: transacao })
            if (!produto) {
                throw new Error(`Produto ${item.idProduto} não encontrado`)
            }

            const estoque = await Estoque.findOne({ where: { idProduto: item.idProduto }, transaction: transacao })
            if (!estoque || estoque.quantidade < item.quantidade) {
                throw new Error(`Estoque insuficiente para o produto "${produto.nome}"`)
            }

            valorTotal += Number(produto.preco) * item.quantidade
            itensValidados.push({ produto, estoque, quantidade: item.quantidade })
        }

        // 2. cria o pedido
        const pedido = await Pedido.create({
            idUsuario,
            valorTotal,
            status: 'PAGO'
        }, { transaction: transacao })

        // 3. cria os itens e deduz o estoque
        for (const { produto, estoque, quantidade } of itensValidados) {
            await ItemPedido.create({
                idPedido: pedido.codPedido,
                idProduto: produto.codProduto,
                quantidade,
                precoUnitario: produto.preco
            }, { transaction: transacao })

            await estoque.update(
                { quantidade: estoque.quantidade - quantidade },
                { transaction: transacao }
            )
        }

        // 4. cria a entrega inicial
        await Entrega.create({
            idPedido: pedido.codPedido,
            status: 'PROCESSANDO'
        }, { transaction: transacao })

        await transacao.commit()
        res.status(201).json({ message: 'Pedido realizado com sucesso', codPedido: pedido.codPedido, valorTotal })
    } catch (err) {
        await transacao.rollback()
        console.error('Erro ao cadastrar pedido', err)
        res.status(400).json({ message: err.message || 'Erro ao cadastrar pedido' })
    }
}

const listar = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [{ model: ItemPedido, include: [Produto] }, Entrega]
        })
        res.status(200).json(pedidos)
    } catch (err) {
        console.error('Erro ao listar pedidos', err)
        res.status(500).json({ message: 'Erro ao listar pedidos' })
    }
}

// GET /pedidos/meus-pedidos - histórico do usuário logado
const meusPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            where: { idUsuario: req.usuario.codUsuario },
            include: [{ model: ItemPedido, include: [Produto] }, Entrega]
        })
        res.status(200).json(pedidos)
    } catch (err) {
        console.error('Erro ao buscar histórico de pedidos', err)
        res.status(500).json({ message: 'Erro ao buscar histórico de pedidos' })
    }
}

const buscarPorId = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id, {
            include: [{ model: ItemPedido, include: [Produto] }, Entrega]
        })
        if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' })
        res.status(200).json(pedido)
    } catch (err) {
        console.error('Erro ao buscar pedido', err)
        res.status(500).json({ message: 'Erro ao buscar pedido' })
    }
}

const atualizar = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id)
        if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' })

        await pedido.update(req.body)
        res.status(200).json({ message: 'Pedido atualizado com sucesso' })
    } catch (err) {
        console.error('Erro ao atualizar pedido', err)
        res.status(500).json({ message: 'Erro ao atualizar pedido' })
    }
}

const atualizarParcial = async (req, res) => atualizar(req, res)

const deletar = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id)
        if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' })

        await pedido.destroy()
        res.status(200).json({ message: 'Pedido removido com sucesso' })
    } catch (err) {
        console.error('Erro ao remover pedido', err)
        res.status(500).json({ message: 'Erro ao remover pedido' })
    }
}

module.exports = { cadastrar, listar, meusPedidos, buscarPorId, atualizar, atualizarParcial, deletar }
