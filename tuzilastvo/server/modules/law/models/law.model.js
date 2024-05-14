const mongoose = require('mongoose');

const lawSchema = new mongoose.Schema({
  lawNo: {
    type: Number,
    required: true,
    unique: true
  },
  lawTitle: {
    type: String,
    required: true
  },
  fullLawText: {
    type: String,
    required: true
  },
  lawType: {
    type: String,
    required: true
  },
  authority: {
    type: String,
    default: '' 
  },
  createdOn: {
    type: Date,
    default: Date.now 
  },
  updatedOn: {
    type: Date,
    default: Date.now 
  },
});

const Law = mongoose.model('Law', lawSchema, 'laws');

module.exports = Law;
