const db = require('../db/conn')
const { QueryTypes } = require('sequelize')

// GET /relatorios/vendas - faturamento por categoria de peça (para gráfico de barras/colunas)
const vendasPorCategoria = async (req, res) => {
    try {
        const dados = await db.query(`
            SELECT c.nome AS categoria, SUM(ip.quantidade * ip.precoUnitario) AS faturamento
            FROM itens_pedido ip
            JOIN produtos p ON p.codProduto = ip.idProduto
            JOIN categorias c ON c.codCategoria = p.idCategoria
            JOIN pedidos pe ON pe.codPedido = ip.idPedido
            WHERE pe.status = 'PAGO'
            GROUP BY c.nome
            ORDER BY faturamento DESC
        `, { type: QueryTypes.SELECT })

        res.status(200).json(dados)
    } catch (err) {
        console.error('Erro ao gerar relatório de vendas', err)
        res.status(500).json({ message: 'Erro ao gerar relatório de vendas' })
    }
}

// GET /relatorios/estoque - faturamento/quantidade vendida por mês (para gráfico de linhas)
const faturamentoMensal = async (req, res) => {
    try {
        const dados = await db.query(`
            SELECT DATE_FORMAT(dataPedido, '%Y-%m') AS mes, SUM(valorTotal) AS faturamento
            FROM pedidos
            WHERE status = 'PAGO'
            GROUP BY mes
            ORDER BY mes ASC
        `, { type: QueryTypes.SELECT })

        res.status(200).json(dados)
    } catch (err) {
        console.error('Erro ao gerar relatório de faturamento mensal', err)
        res.status(500).json({ message: 'Erro ao gerar relatório de faturamento mensal' })
    }
}

module.exports = { vendasPorCategoria, faturamentoMensal }
