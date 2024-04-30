const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  docTitle: {
    type: String,
    required: true
  },
  docDescription: {
    type: String,
    required: true
  },
  docType: {
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

const Document = mongoose.model('Document', documentSchema, 'docs');

module.exports = Document;
