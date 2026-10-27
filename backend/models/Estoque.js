const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Estoque = db.define('estoque', {
    codEstoque: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idProduto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            key: 'codProduto',
            model: 'produtos'
        }
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    quantidadeMinima: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5
    }
}, {
    timestamps: false,
    tableName: 'estoques'
})

module.exports = Estoque
