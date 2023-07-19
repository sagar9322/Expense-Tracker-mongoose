const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  category: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Expense', expenseSchema);