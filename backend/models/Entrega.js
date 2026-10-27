const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Entrega = db.define('entrega', {
    codEntrega: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idPedido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            key: 'codPedido',
            model: 'pedidos'
        }
    },
    status: {
        type: DataTypes.ENUM('PROCESSANDO', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA'),
        allowNull: false,
        defaultValue: 'PROCESSANDO'
    },
    codigoRastreio: {
        type: DataTypes.STRING(50)
    },
    dataEnvio: {
        type: DataTypes.DATEONLY
    },
    dataEntrega: {
        type: DataTypes.DATEONLY
    }
}, {
    timestamps: false,
    tableName: 'entregas'
})

module.exports = Entrega
