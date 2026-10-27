const { Sequelize } = require('sequelize')
require('dotenv').config()

const db = new Sequelize(
    process.env.DB_NAME || 'dc_pecas',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'senai',
    {
        dialect: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        logging: false
    }
)

module.exports = db
