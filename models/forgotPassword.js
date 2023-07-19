const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    allowNull: false
  },

  isactive: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('ForgotPasswordLink', forgotPasswordSchema);