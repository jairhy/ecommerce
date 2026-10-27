const Entrega = require('../models/Entrega')
const Pedido = require('../models/Pedido')

const cadastrar = async (req, res) => {
    const { idPedido, codigoRastreio, dataEnvio } = req.body
    try {
        if (!idPedido) return res.status(400).json({ message: 'idPedido é obrigatório' })

        const pedido = await Pedido.findByPk(idPedido)
        if (!pedido) return res.status(404).json({ message: 'Pedido informado não existe' })

        const jaExiste = await Entrega.findOne({ where: { idPedido } })
        if (jaExiste) return res.status(409).json({ message: 'Este pedido já possui uma entrega registrada' })

        const entrega = await Entrega.create({ idPedido, codigoRastreio, dataEnvio, status: 'PROCESSANDO' })
        res.status(201).json({ message: 'Entrega cadastrada com sucesso', entrega })
    } catch (err) {
        console.error('Erro ao cadastrar entrega', err)
        res.status(500).json({ message: 'Erro ao cadastrar entrega' })
    }
}

const listar = async (req, res) => {
    try {
        const entregas = await Entrega.findAll({ include: [Pedido] })
        res.status(200).json(entregas)
    } catch (err) {
        console.error('Erro ao listar entregas', err)
        res.status(500).json({ message: 'Erro ao listar entregas' })
    }
}

const buscarPorId = async (req, res) => {
    try {
        const entrega = await Entrega.findByPk(req.params.id, { include: [Pedido] })
        if (!entrega) return res.status(404).json({ message: 'Entrega não encontrada' })
        res.status(200).json(entrega)
    } catch (err) {
        console.error('Erro ao buscar entrega', err)
        res.status(500).json({ message: 'Erro ao buscar entrega' })
    }
}

const atualizar = async (req, res) => {
    try {
        const entrega = await Entrega.findByPk(req.params.id)
        if (!entrega) return res.status(404).json({ message: 'Entrega não encontrada' })

        await entrega.update(req.body)
        res.status(200).json({ message: 'Entrega atualizada com sucesso' })
    } catch (err) {
        console.error('Erro ao atualizar entrega', err)
        res.status(500).json({ message: 'Erro ao atualizar entrega' })
    }
}

const atualizarParcial = async (req, res) => atualizar(req, res)

const deletar = async (req, res) => {
    try {
        const entrega = await Entrega.findByPk(req.params.id)
        if (!entrega) return res.status(404).json({ message: 'Entrega não encontrada' })

        await entrega.destroy()
        res.status(200).json({ message: 'Entrega removida com sucesso' })
    } catch (err) {
        console.error('Erro ao remover entrega', err)
        res.status(500).json({ message: 'Erro ao remover entrega' })
    }
}

module.exports = { cadastrar, listar, buscarPorId, atualizar, atualizarParcial, deletar }
