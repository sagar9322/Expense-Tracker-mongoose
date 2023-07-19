const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const leaderBoardSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  totalExpense: {
    type: Number,
    require: true
  }
})

module.exports = mongoose.model('Leaderboard', leaderBoardSchema);