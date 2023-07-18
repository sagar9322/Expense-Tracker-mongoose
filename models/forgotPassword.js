const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ForgotPasswordRequest = sequelize.define('ForgotPasswordRequest', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  uid: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  isactive: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

module.exports = ForgotPasswordRequest;