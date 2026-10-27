const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Usuario = db.define('usuario', {
    codUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true
    },
    cep: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    rua: {
        type: DataTypes.STRING(255)
    },
    bairro: {
        type: DataTypes.STRING(255)
    },
    cidade: {
        type: DataTypes.STRING(255)
    },
    uf: {
        type: DataTypes.STRING(2)
    },
    numero: {
        type: DataTypes.STRING(20)
    },
    tipo: {
        type: DataTypes.ENUM('CLIENTE', 'ADMIN'),
        allowNull: false,
        defaultValue: 'CLIENTE'
    }
}, {
    timestamps: false,
    tableName: 'usuarios'
})

module.exports = Usuario
