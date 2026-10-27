const { Op } = require('sequelize')
const Produto = require('../models/Produto')
const Categoria = require('../models/Categoria')
const Estoque = require('../models/Estoque')

const cadastrar = async (req, res) => {
    const { nome, descricao, marca, preco, imagem, idCategoria, quantidadeInicial } = req.body
    try {
        if (!nome || !preco || !idCategoria) {
            return res.status(400).json({ message: 'Campos obrigatórios: nome, preco, idCategoria' })
        }

        const categoria = await Categoria.findByPk(idCategoria)
        if (!categoria) return res.status(404).json({ message: 'Categoria informada não existe' })

        const produto = await Produto.create({ nome, descricao, marca, preco, imagem, idCategoria })

        // já cria o registro de estoque vinculado ao produto
        await Estoque.create({
            idProduto: produto.codProduto,
            quantidade: quantidadeInicial || 0
        })

        res.status(201).json({ message: 'Produto cadastrado com sucesso', produto })
    } catch (err) {
        console.error('Erro ao cadastrar produto', err)
        res.status(500).json({ message: 'Erro ao cadastrar produto' })
    }
}

const listar = async (req, res) => {
    try {
        const produtos = await Produto.findAll({
            include: [Categoria, Estoque]
        })
        res.status(200).json(produtos)
    } catch (err) {
        console.error('Erro ao listar produtos', err)
        res.status(500).json({ message: 'Erro ao listar produtos' })
    }
}

const buscarPorId = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id, { include: [Categoria, Estoque] })
        if (!produto) return res.status(404).json({ message: 'Produto não encontrado' })
        res.status(200).json(produto)
    } catch (err) {
        console.error('Erro ao buscar produto', err)
        res.status(500).json({ message: 'Erro ao buscar produto' })
    }
}

const buscarPorNome = async (req, res) => {
    try {
        const produtos = await Produto.findAll({
            where: { nome: { [Op.like]: `%${req.query.nome}%` } },
            include: [Categoria, Estoque]
        })
        res.status(200).json(produtos)
    } catch (err) {
        console.error('Erro ao buscar produto por nome', err)
        res.status(500).json({ message: 'Erro ao buscar produto por nome' })
    }
}

const atualizar = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id)
        if (!produto) return res.status(404).json({ message: 'Produto não encontrado' })

        await produto.update(req.body)
        res.status(200).json({ message: 'Produto atualizado com sucesso' })
    } catch (err) {
        console.error('Erro ao atualizar produto', err)
        res.status(500).json({ message: 'Erro ao atualizar produto' })
    }
}

const atualizarParcial = async (req, res) => atualizar(req, res)

const deletar = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id)
        if (!produto) return res.status(404).json({ message: 'Produto não encontrado' })

        await produto.destroy()
        res.status(200).json({ message: 'Produto removido com sucesso' })
    } catch (err) {
        console.error('Erro ao remover produto', err)
        res.status(500).json({ message: 'Erro ao remover produto' })
    }
}

module.exports = { cadastrar, listar, buscarPorId, buscarPorNome, atualizar, atualizarParcial, deletar }
