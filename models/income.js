const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const incomeDetail = sequelize.define('income', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  income: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = incomeDetail;