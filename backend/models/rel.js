const Usuario = require('./Usuario')
const Categoria = require('./Categoria')
const Produto = require('./Produto')
const Estoque = require('./Estoque')
const Pedido = require('./Pedido')
const ItemPedido = require('./ItemPedido')
const Entrega = require('./Entrega')

// Categoria 1:N Produto
Categoria.hasMany(Produto, { foreignKey: 'idCategoria', sourceKey: 'codCategoria' })
Produto.belongsTo(Categoria, { foreignKey: 'idCategoria', targetKey: 'codCategoria' })

// Produto 1:1 Estoque
Produto.hasOne(Estoque, { foreignKey: 'idProduto', sourceKey: 'codProduto' })
Estoque.belongsTo(Produto, { foreignKey: 'idProduto', targetKey: 'codProduto' })

// Usuario 1:N Pedido
Usuario.hasMany(Pedido, { foreignKey: 'idUsuario', sourceKey: 'codUsuario' })
Pedido.belongsTo(Usuario, { foreignKey: 'idUsuario', targetKey: 'codUsuario' })

// Pedido 1:N ItemPedido
Pedido.hasMany(ItemPedido, { foreignKey: 'idPedido', sourceKey: 'codPedido' })
ItemPedido.belongsTo(Pedido, { foreignKey: 'idPedido', targetKey: 'codPedido' })

// Produto 1:N ItemPedido
Produto.hasMany(ItemPedido, { foreignKey: 'idProduto', sourceKey: 'codProduto' })
ItemPedido.belongsTo(Produto, { foreignKey: 'idProduto', targetKey: 'codProduto' })

// Pedido 1:1 Entrega
Pedido.hasOne(Entrega, { foreignKey: 'idPedido', sourceKey: 'codPedido' })
Entrega.belongsTo(Pedido, { foreignKey: 'idPedido', targetKey: 'codPedido' })

module.exports = { Usuario, Categoria, Produto, Estoque, Pedido, ItemPedido, Entrega }
