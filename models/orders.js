const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
      paymentid: {
        type: String,
        default: null,
        required: false
      },
      orderid: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true
      }
})

module.exports = mongoose.model('Order', orderSchema);