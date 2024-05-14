const Case = require('../models/case.model');

// const findById = async (caseId) => {
//   try {
//     const existingCase = await Case.findById(caseId);
//     return existingCase;
//   } catch (error) {
//     throw new Error(`Error finding case by ID: ${error.message}`);
//   }
// };

async function findLast() {
  try {
    const latestCase = await Case.findOne().sort({ createdOn: -1 });
    return latestCase;
  } catch (error) {
    console.error('Error fetching latest case:', error);
    throw new Error('Internal server error');
  }
}

const add = async (newCase) => {
  try {
    const savedCase = await newCase.save();
    return savedCase;
  } catch (error) {
    throw new Error(`Failed to add case: ${error.message}`);
  }
};

const getAll = async () => {
  try {
    const allCases = await Case.find();
    return allCases;
  } catch (error) {
    console.error('Error getting all cases:', error);
    throw new Error('Internal server error');
  }
};

const update = async (caseNumber, updatedCaseData) => {
  try {
    const existingCase = await findByNo(caseNumber);
    if (!existingCase) {
      throw new Error('Case not found');
    }
    console.log(existingCase);

    // existingCase.caseAssignee = updatedCaseData.caseAssignee;
    Object.assign(existingCase, updatedCaseData);
    console.log(updatedCaseData);

    const updatedCase = await existingCase.save();
    return updatedCase;
  } catch (error) {
    throw new Error(`Failed to update case: ${error.message}`);
  }
};

const findByNo = async (caseNo) => {
  try {
    const existingCase = await Case.findOne({ caseNo });
    return existingCase;
  } catch (error) {
    throw new Error(`Error finding case by case number: ${error.message}`);
  }
};


module.exports = {
  // findById,
  findLast,
  add,
  getAll,
  update,
  findByNo,
};
