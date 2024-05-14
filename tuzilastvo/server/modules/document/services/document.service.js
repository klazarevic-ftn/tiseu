const Document = require('../models/document.model');

const add = async (newDocument) => {
  try {
    const savedDocument = await newDocument.save();
    return savedDocument;
  } catch (error) {
    throw new Error(`Failed to add document: ${error.message}`);
  }
};

const getAll = async () => {
  try {
    const allDocuments = await Document.find();
    return allDocuments;
  } catch (error) {
    console.error('Error getting all documents:', error);
    throw new Error('Internal server error');
  }
};

async function findLast() {
  try {
    const latestDocument = await Document.findOne().sort({ createdOn: -1 });
    return latestDocument;
  } catch (error) {
    console.error('Error fetching latest document:', error);
    throw new Error('Internal server error');
  }
}
module.exports = {
  add,
  getAll,
  findLast,
};
