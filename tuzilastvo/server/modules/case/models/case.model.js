const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  caseNo: {
    type: Number,
    required: true,
    unique: true
  },
  caseTitle: {
    type: String,
    required: true
  },
  caseDescription: {
    type: String,
    required: true
  },
  caseType: {
    type: String,
    required: true
  },
  caseAssignee: {
    type: String,
    default: '' 
  },
  plaintiffUPIN: {
    type: String,
    required: true
  },
  defendantUPIN: {
    type: String,
    required: true
  },
  witnessUPIN: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now 
  }
});

const Case = mongoose.model('Case', caseSchema, 'cases');

module.exports = Case;
