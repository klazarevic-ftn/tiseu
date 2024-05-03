const Document = require('../models/document.model');

const add = async (newDocument) => {
  try {
    const savedDocument = await newDocument.save();
    return savedDocument;
  } catch (error) {
    throw new Error(`Failed to add document: ${error.message}`);
  }
};

module.exports = {
  add,
};
