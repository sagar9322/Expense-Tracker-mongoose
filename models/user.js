const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isPremeumuser: {
    type: Boolean,
    required: true
  },
  expenseId: [{
    type: Schema.Types.ObjectId,
    required: true,
      ref: 'Expense'
  }],
  income: {
    type: Number,
    required: true
  },
  orderId: [{
    type: Schema.Types.ObjectId,
    required: true,
      ref: 'Order'
  }],
  forgotPasswordId: [{
    type: Schema.Types.ObjectId,
    required: true,
      ref: 'ForgotPasswordLink'
  }]

});

module.exports = mongoose.model('User', userSchema);