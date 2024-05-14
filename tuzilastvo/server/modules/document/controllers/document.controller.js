const Document = require('../models/document.model');
const documentService = require('../services/document.service');

const create = async (req, res) => {
  try {
    const latestDocument = await documentService.findLast();
    let documentNumber = 1;

    if (latestDocument) {
      documentNumber = parseInt(latestDocument.docNo) + 1;
    }

    const paddedDocumentNumber = documentNumber.toString().padStart(7, '0');

    const { docTitle, docDescription, docType } = req.body;

    const newDocument = new Document({
      docNo: paddedDocumentNumber,
      docTitle,
      docDescription,
      docType,
      createdOn: Date.now(),
      updatedOn: Date.now()
    });

    const savedDocument = await documentService.add(newDocument);

    res.status(201).json({ message: 'Document added successfully', document: savedDocument });
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).json({ message: 'Failed to add document', error: error.message });
  }
};

const allDocuments = async (req, res) => {
  try {
    let allDocuments = await documentService.getAll();
    res.status(200).json({ documents: allDocuments });
  } catch (error) {
    console.error('Error getting all documents:', error);
    res.status(500).json({ message: 'Failed to get all documents', error: error.message });
  }
};

module.exports = {
    create,
    allDocuments,
};