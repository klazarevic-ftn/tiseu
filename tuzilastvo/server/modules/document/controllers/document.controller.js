const Document = require('../models/document.model');
const documentService = require('../services/document.service');

const create = async (req, res) => {
    try {
      const { docTitle, docDescription, docType } = req.body;
  
      const newDocument = new Document({
        docTitle,
        docDescription,
        docType,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
  
      const savedDocument = await documentService.add(newDocument);
  
      res.status(201).json({ message: 'Document added successfully', document: savedDocument });
    } catch (error) {
      console.error('Error adding document:', error);
      res.status(500).json({ message: 'Failed to add document', error: error.message });
    }
  };

module.exports = {
    create,
};