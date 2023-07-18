const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const Leaderboard = sequelize.define('leaderboard' ,{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      username: Sequelize.STRING,
      totalexpense: Sequelize.STRING
})

module.exports = Leaderboard;