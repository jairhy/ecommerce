const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
const Usuario = require('../models/Usuario')
const validaCpf = require('../utils/validaCpf')
const buscarEnderecoPorCep = require('../utils/viaCep')

const cadastrar = async (req, res) => {
    const { nome, email, senha, cpf, cep, numero, tipo } = req.body

    try {
        if (!nome || !email || !senha || !cpf || !cep) {
            return res.status(400).json({ message: 'Campos obrigatórios: nome, email, senha, cpf, cep' })
        }

        if (!validaCpf(cpf)) {
            return res.status(400).json({ message: 'CPF inválido' })
        }

        const jaExiste = await Usuario.findOne({
            where: { [Op.or]: [{ email }, { cpf: cpf.replace(/\D/g, '') }] }
        })
        if (jaExiste) {
            return res.status(409).json({ message: 'E-mail ou CPF já cadastrado' })
        }

        const endereco = await buscarEnderecoPorCep(cep)
        const senhaHash = await bcrypt.hash(senha, 10)

        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha: senhaHash,
            cpf: cpf.replace(/\D/g, ''),
            cep: cep.replace(/\D/g, ''),
            numero,
            rua: endereco.rua,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            uf: endereco.uf,
            tipo: tipo === 'ADMIN' ? 'ADMIN' : 'CLIENTE'
        })

        const { senha: _omit, ...usuarioSemSenha } = novoUsuario.toJSON()
        res.status(201).json({ message: 'Usuário cadastrado com sucesso', usuario: usuarioSemSenha })
    } catch (err) {
        console.error('Erro ao cadastrar usuário', err)
        res.status(500).json({ message: 'Erro ao cadastrar usuário' })
    }
}

const listar = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({ attributes: { exclude: ['senha'] } })
        res.status(200).json(usuarios)
    } catch (err) {
        console.error('Erro ao listar usuários', err)
        res.status(500).json({ message: 'Erro ao listar usuários' })
    }
}

const buscarPorId = async (req, res) => {
    const { id } = req.params
    try {
        const usuario = await Usuario.findByPk(id, { attributes: { exclude: ['senha'] } })
        if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' })
        res.status(200).json(usuario)
    } catch (err) {
        console.error('Erro ao buscar usuário', err)
        res.status(500).json({ message: 'Erro ao buscar usuário' })
    }
}

const buscarPorNome = async (req, res) => {
    const { nome } = req.query
    try {
        const usuarios = await Usuario.findAll({
            where: { nome: { [Op.like]: `%${nome}%` } },
            attributes: { exclude: ['senha'] }
        })
        res.status(200).json(usuarios)
    } catch (err) {
        console.error('Erro ao buscar usuário por nome', err)
        res.status(500).json({ message: 'Erro ao buscar usuário por nome' })
    }
}

const atualizar = async (req, res) => {
    const { id } = req.params
    try {
        const usuario = await Usuario.findByPk(id)
        if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' })

        const dados = { ...req.body }
        if (dados.senha) dados.senha = await bcrypt.hash(dados.senha, 10)
        if (dados.cpf && !validaCpf(dados.cpf)) {
            return res.status(400).json({ message: 'CPF inválido' })
        }

        await usuario.update(dados)
        res.status(200).json({ message: 'Usuário atualizado com sucesso' })
    } catch (err) {
        console.error('Erro ao atualizar usuário', err)
        res.status(500).json({ message: 'Erro ao atualizar usuário' })
    }
}

const atualizarParcial = async (req, res) => {
    // PATCH usa a mesma lógica do PUT aqui, pois .update() já só altera os campos enviados
    return atualizar(req, res)
}

const deletar = async (req, res) => {
    const { id } = req.params
    try {
        const usuario = await Usuario.findByPk(id)
        if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' })

        await usuario.destroy()
        res.status(200).json({ message: 'Usuário removido com sucesso' })
    } catch (err) {
        console.error('Erro ao remover usuário', err)
        res.status(500).json({ message: 'Erro ao remover usuário' })
    }
}

module.exports = { cadastrar, listar, buscarPorId, buscarPorNome, atualizar, atualizarParcial, deletar }
