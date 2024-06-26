const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  docNo: {
    type: Number,
    required: true,
    unique: true
  },
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
  createdOn: {
    type: Date,
    default: Date.now 
  },
  updatedOn: {
    type: Date,
    default: Date.now 
  }
});

const Document = mongoose.model('Document', documentSchema, 'docs');

module.exports = Document;
