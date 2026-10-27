const { Op } = require('sequelize')
const Categoria = require('../models/Categoria')

const cadastrar = async (req, res) => {
    const { nome, descricao } = req.body
    try {
        if (!nome) return res.status(400).json({ message: 'O nome da categoria é obrigatório' })

        const jaExiste = await Categoria.findOne({ where: { nome } })
        if (jaExiste) return res.status(409).json({ message: 'Categoria já cadastrada' })

        const categoria = await Categoria.create({ nome, descricao })
        res.status(201).json({ message: 'Categoria cadastrada com sucesso', categoria })
    } catch (err) {
        console.error('Erro ao cadastrar categoria', err)
        res.status(500).json({ message: 'Erro ao cadastrar categoria' })
    }
}

const listar = async (req, res) => {
    try {
        const categorias = await Categoria.findAll()
        res.status(200).json(categorias)
    } catch (err) {
        console.error('Erro ao listar categorias', err)
        res.status(500).json({ message: 'Erro ao listar categorias' })
    }
}

const buscarPorId = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id)
        if (!categoria) return res.status(404).json({ message: 'Categoria não encontrada' })
        res.status(200).json(categoria)
    } catch (err) {
        console.error('Erro ao buscar categoria', err)
        res.status(500).json({ message: 'Erro ao buscar categoria' })
    }
}

const buscarPorNome = async (req, res) => {
    try {
        const categorias = await Categoria.findAll({
            where: { nome: { [Op.like]: `%${req.query.nome}%` } }
        })
        res.status(200).json(categorias)
    } catch (err) {
        console.error('Erro ao buscar categoria por nome', err)
        res.status(500).json({ message: 'Erro ao buscar categoria por nome' })
    }
}

const atualizar = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id)
        if (!categoria) return res.status(404).json({ message: 'Categoria não encontrada' })

        await categoria.update(req.body)
        res.status(200).json({ message: 'Categoria atualizada com sucesso' })
    } catch (err) {
        console.error('Erro ao atualizar categoria', err)
        res.status(500).json({ message: 'Erro ao atualizar categoria' })
    }
}

const atualizarParcial = async (req, res) => atualizar(req, res)

const deletar = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id)
        if (!categoria) return res.status(404).json({ message: 'Categoria não encontrada' })

        await categoria.destroy()
        res.status(200).json({ message: 'Categoria removida com sucesso' })
    } catch (err) {
        console.error('Erro ao remover categoria', err)
        res.status(500).json({ message: 'Erro ao remover categoria' })
    }
}

module.exports = { cadastrar, listar, buscarPorId, buscarPorNome, atualizar, atualizarParcial, deletar }
