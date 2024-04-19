const Case = require('../models/case.model');

const findById = async (caseId) => {
  try {
    const existingCase = await Case.findById(caseId);
    return existingCase;
  } catch (error) {
    throw new Error(`Error finding case by ID: ${error.message}`);
  }
};

module.exports = {
  findById,
};
