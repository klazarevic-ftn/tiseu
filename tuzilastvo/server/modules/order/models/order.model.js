const mongoose = require('mongoose');

const statusEnum = ['ISSUED', 'PENDING', 'EXECUTED'];

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  caseId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: statusEnum,
    default: 'ISSUED',
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
