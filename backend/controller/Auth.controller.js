const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Usuario = require('../models/Usuario')

const login = async (req, res) => {
    const { email, senha } = req.body

    try {
        if (!email || !senha) {
            return res.status(400).json({ message: 'Informe e-mail e senha' })
        }

        const usuario = await Usuario.findOne({ where: { email } })
        if (!usuario) {
            return res.status(401).json({ message: 'E-mail ou senha inválidos' })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha)
        if (!senhaValida) {
            return res.status(401).json({ message: 'E-mail ou senha inválidos' })
        }

        const token = jwt.sign(
            { codUsuario: usuario.codUsuario, tipo: usuario.tipo },
            process.env.JWT_SECRET || 'segredo_super_secreto',
            { expiresIn: '8h' }
        )

        res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            usuario: { codUsuario: usuario.codUsuario, nome: usuario.nome, tipo: usuario.tipo }
        })
    } catch (err) {
        console.error('Erro ao autenticar', err)
        res.status(500).json({ message: 'Erro ao autenticar' })
    }
}

module.exports = { login }
