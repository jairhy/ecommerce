const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const ItemPedido = db.define('itemPedido', {
    codItemPedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idPedido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'codPedido',
            model: 'pedidos'
        }
    },
    idProduto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'codProduto',
            model: 'produtos'
        }
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precoUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'itens_pedido'
})

module.exports = ItemPedido
