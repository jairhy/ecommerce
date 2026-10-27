const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Pedido = db.define('pedido', {
    codPedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'codUsuario',
            model: 'usuarios'
        }
    },
    dataPedido: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    valorTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDENTE', 'PAGO', 'CANCELADO'),
        allowNull: false,
        defaultValue: 'PENDENTE'
    }
}, {
    timestamps: false,
    tableName: 'pedidos'
})

module.exports = Pedido
