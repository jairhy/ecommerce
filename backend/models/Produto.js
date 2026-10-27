const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Produto = db.define('produto', {
    codProduto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING(500)
    },
    marca: {
        type: DataTypes.STRING(100)
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    imagem: {
        type: DataTypes.STRING(500)
    },
    idCategoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'codCategoria',
            model: 'categorias'
        }
    }
}, {
    timestamps: false,
    tableName: 'produtos'
})

module.exports = Produto
