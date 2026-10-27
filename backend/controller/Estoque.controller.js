const Estoque = require('../models/Estoque')
const Produto = require('../models/Produto')

const cadastrar = async (req, res) => {
    const { idProduto, quantidade, quantidadeMinima } = req.body
    try {
        if (!idProduto) return res.status(400).json({ message: 'idProduto é obrigatório' })

        const produto = await Produto.findByPk(idProduto)
        if (!produto) return res.status(404).json({ message: 'Produto informado não existe' })

        const jaExiste = await Estoque.findOne({ where: { idProduto } })
        if (jaExiste) return res.status(409).json({ message: 'Este produto já possui registro de estoque' })

        const estoque = await Estoque.create({ idProduto, quantidade, quantidadeMinima })
        res.status(201).json({ message: 'Estoque cadastrado com sucesso', estoque })
    } catch (err) {
        console.error('Erro ao cadastrar estoque', err)
        res.status(500).json({ message: 'Erro ao cadastrar estoque' })
    }
}

const listar = async (req, res) => {
    try {
        const estoques = await Estoque.findAll({ include: [Produto] })
        res.status(200).json(estoques)
    } catch (err) {
        console.error('Erro ao listar estoques', err)
        res.status(500).json({ message: 'Erro ao listar estoques' })
    }
}

const buscarPorId = async (req, res) => {
    try {
        const estoque = await Estoque.findByPk(req.params.id, { include: [Produto] })
        if (!estoque) return res.status(404).json({ message: 'Estoque não encontrado' })
        res.status(200).json(estoque)
    } catch (err) {
        console.error('Erro ao buscar estoque', err)
        res.status(500).json({ message: 'Erro ao buscar estoque' })
    }
}

// consulta por nome do produto vinculado
const buscarPorNome = async (req, res) => {
    const { Op } = require('sequelize')
    try {
        const estoques = await Estoque.findAll({
            include: [{ model: Produto, where: { nome: { [Op.like]: `%${req.query.nome}%` } } }]
        })
        res.status(200).json(estoques)
    } catch (err) {
        console.error('Erro ao buscar estoque por nome do produto', err)
        res.status(500).json({ message: 'Erro ao buscar estoque por nome do produto' })
    }
}

const atualizar = async (req, res) => {
    try {
        const estoque = await Estoque.findByPk(req.params.id)
        if (!estoque) return res.status(404).json({ message: 'Estoque não encontrado' })

        await estoque.update(req.body)
        res.status(200).json({ message: 'Estoque atualizado com sucesso' })
    } catch (err) {
        console.error('Erro ao atualizar estoque', err)
        res.status(500).json({ message: 'Erro ao atualizar estoque' })
    }
}

const atualizarParcial = async (req, res) => atualizar(req, res)

const deletar = async (req, res) => {
    try {
        const estoque = await Estoque.findByPk(req.params.id)
        if (!estoque) return res.status(404).json({ message: 'Estoque não encontrado' })

        await estoque.destroy()
        res.status(200).json({ message: 'Estoque removido com sucesso' })
    } catch (err) {
        console.error('Erro ao remover estoque', err)
        res.status(500).json({ message: 'Erro ao remover estoque' })
    }
}

module.exports = { cadastrar, listar, buscarPorId, buscarPorNome, atualizar, atualizarParcial, deletar }
