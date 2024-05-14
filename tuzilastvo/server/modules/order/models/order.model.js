const mongoose = require('mongoose');

const statusEnum = ['ISSUED', 'PENDING', 'EXECUTED'];

const orderSchema = new mongoose.Schema({
  orderNo: {
    type: String,
    required: true,
    unique: true,
  },
  caseNo: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: statusEnum,
    default: 'ISSUED',
  },
  createdOn: {
    type: Date,
    default: Date.now 
  },
  updatedOn: {
    type: Date,
    default: Date.now 
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
