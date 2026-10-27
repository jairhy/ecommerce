const jwt = require('jsonwebtoken')
require('dotenv').config()

function autenticar(req, res, next) {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido' })
    }

    const [, token] = authHeader.split(' ') // formato: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Formato de token inválido' })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'segredo_super_secreto')
        req.usuario = payload // { codUsuario, tipo }
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado' })
    }
}

// opcional: restringe a rota apenas para administradores
function somenteAdmin(req, res, next) {
    if (req.usuario?.tipo !== 'ADMIN') {
        return res.status(403).json({ message: 'Acesso restrito a administradores' })
    }
    next()
}

module.exports = { autenticar, somenteAdmin }
