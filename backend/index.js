const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const conn = require('./db/conn')
require('./models/rel') // garante que todos os models sejam carregados antes do sync

const { autenticar, somenteAdmin } = require('./middleware/auth')

const AuthController = require('./controller/Auth.controller')
const UsuarioController = require('./controller/Usuario.controller')
const CategoriaController = require('./controller/Categoria.controller')
const ProdutoController = require('./controller/Produto.controller')
const EstoqueController = require('./controller/Estoque.controller')
const PedidoController = require('./controller/Pedido.controller')
const EntregaController = require('./controller/Entrega.controller')
const RelatorioController = require('./controller/Relatorio.controller')

const hostname = 'localhost'
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API da loja de peças de computadores rodando!' })
})

//// ---------- ROTAS PÚBLICAS ----------

app.post('/login', AuthController.login)
app.post('/usuarios', UsuarioController.cadastrar)

app.get('/produtos', ProdutoController.listar)
app.get('/produtos/buscar', ProdutoController.buscarPorNome)
app.get('/produtos/:id', ProdutoController.buscarPorId)

app.get('/categorias', CategoriaController.listar)
app.get('/categorias/buscar', CategoriaController.buscarPorNome)
app.get('/categorias/:id', CategoriaController.buscarPorId)

//// ---------- ROTAS PRIVADAS (JWT) ----------

// perfil do usuário logado
app.get('/usuarios/perfil', autenticar, (req, res) => UsuarioController.buscarPorId({ params: { id: req.usuario.codUsuario } }, res))
app.put('/usuarios/:id', autenticar, UsuarioController.atualizar)
app.patch('/usuarios/:id', autenticar, UsuarioController.atualizarParcial)
app.delete('/usuarios/:id', autenticar, somenteAdmin, UsuarioController.deletar)

// checkout e histórico
app.post('/pedidos', autenticar, PedidoController.cadastrar)
app.get('/pedidos/meus-pedidos', autenticar, PedidoController.meusPedidos)
app.get('/pedidos/:id', autenticar, PedidoController.buscarPorId)
app.put('/pedidos/:id', autenticar, somenteAdmin, PedidoController.atualizar)
app.patch('/pedidos/:id', autenticar, somenteAdmin, PedidoController.atualizarParcial)

// gestão de catálogo (admin)
app.post('/categorias', autenticar, somenteAdmin, CategoriaController.cadastrar)
app.put('/categorias/:id', autenticar, somenteAdmin, CategoriaController.atualizar)
app.patch('/categorias/:id', autenticar, somenteAdmin, CategoriaController.atualizarParcial)
app.delete('/categorias/:id', autenticar, somenteAdmin, CategoriaController.deletar)

app.post('/produtos', autenticar, somenteAdmin, ProdutoController.cadastrar)
app.put('/produtos/:id', autenticar, somenteAdmin, ProdutoController.atualizar)
app.patch('/produtos/:id', autenticar, somenteAdmin, ProdutoController.atualizarParcial)
app.delete('/produtos/:id', autenticar, somenteAdmin, ProdutoController.deletar)

// gestão de estoque (admin)
app.post('/estoque', autenticar, somenteAdmin, EstoqueController.cadastrar)
app.get('/estoque', autenticar, somenteAdmin, EstoqueController.listar)
app.get('/estoque/buscar', autenticar, somenteAdmin, EstoqueController.buscarPorNome)
app.get('/estoque/:id', autenticar, somenteAdmin, EstoqueController.buscarPorId)
app.put('/estoque/:id', autenticar, somenteAdmin, EstoqueController.atualizar)
app.patch('/estoque/:id', autenticar, somenteAdmin, EstoqueController.atualizarParcial)
app.delete('/estoque/:id', autenticar, somenteAdmin, EstoqueController.deletar)

// gestão de entregas (admin)
app.post('/entregas', autenticar, somenteAdmin, EntregaController.cadastrar)
app.get('/entregas', autenticar, somenteAdmin, EntregaController.listar)
app.get('/entregas/:id', autenticar, EntregaController.buscarPorId)
app.put('/entregas/:id', autenticar, somenteAdmin, EntregaController.atualizar)
app.patch('/entregas/:id', autenticar, somenteAdmin, EntregaController.atualizarParcial)
app.delete('/entregas/:id', autenticar, somenteAdmin, EntregaController.deletar)

// relatórios gerenciais (admin)
app.get('/relatorios/vendas', autenticar, somenteAdmin, RelatorioController.vendasPorCategoria)
app.get('/relatorios/estoque', autenticar, somenteAdmin, RelatorioController.faturamentoMensal)

//// ---------- SERVIDOR ----------

conn.sync()
    .then(() => {
        app.listen(PORT, hostname, () => {
            console.log(`Servidor rodando em http://${hostname}:${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Erro ao rodar no servidor', err)
    })
