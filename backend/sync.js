const conn = require('./db/conn')
require('./models/rel') // carrega os 7 models na instância do Sequelize

async function syncDatabase() {
    try {
        await conn.sync({ force: true })
        console.log('Tabelas sincronizadas com sucesso!')
    } catch (err) {
        console.error('Erro de sincronização das tabelas', err)
    } finally {
        await conn.close()
    }
}

syncDatabase()
