const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.SEQUELIZE_SCHEMAS, process.env.SEQUELIZE_USER, process.env.SEQUELIZE_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST
});

module.exports = sequelize;