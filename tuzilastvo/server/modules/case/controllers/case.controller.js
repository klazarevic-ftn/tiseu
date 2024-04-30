const Case = require('../models/case.model');
const caseService = require('../services/case.service');
const userService = require('../../user/services/user.service');

const create = async (req, res) => {
  try {
    const latestCase = await caseService.findLast();
    let caseNumber = 1;

    if (latestCase) {
      caseNumber = parseInt(latestCase.caseNo) + 1;
    }

    const paddedCaseNumber = caseNumber.toString().padStart(7, '0');

    const { caseTitle, caseDescription, caseType, plaintiffUPIN, defendantUPIN, witnessUPIN } = req.body;

    const newCase = new Case({
      caseNo: paddedCaseNumber,
      caseTitle,
      caseDescription,
      caseType,
      caseAssignee: '',
      plaintiffUPIN,
      defendantUPIN,
      witnessUPIN,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    const savedCase = await caseService.add(newCase);

    res.status(201).json({ message: 'Case added successfully', case: savedCase });
  } catch (error) {
    console.error('Error adding case:', error);
    res.status(500).json({ message: 'Failed to add case', error: error.message });
  }
};

const allCases = async (req, res) => {
  try {
    let allCases = await caseService.getAll();
    for (let i = 0; i < allCases.length; i++) {
      const currentCase = allCases[i];
      if (currentCase.caseAssignee) {
        const prosecutor = await userService.findByUPIN(currentCase.caseAssignee);
        console.log(prosecutor);
        
        currentCase.caseAssignee = prosecutor;
        console.log(currentCase.caseAssignee);

      }
    }
    res.status(200).json({ cases: allCases });
  } catch (error) {
    console.error('Error getting all cases:', error);
    res.status(500).json({ message: 'Failed to get all cases', error: error.message });
  }
};




const assignCase = async (req, res) => {
  try {
    const { caseNumber, prosecutorUPIN } = req.body;
    const existingCase = await caseService.findByNo(caseNumber);
    console.log(existingCase);
    if (!existingCase) {
      return res.status(404).json({ message: 'Case not found' });
    }
    console.log(prosecutorUPIN);
    existingCase.caseAssignee = prosecutorUPIN;
    const updatedCase = await caseService.update(caseNumber, existingCase);
    // const updatedCase = await existingCase.save();
    console.log(updatedCase);

    res.status(200).json({ message: 'Case assigned successfully', case: updatedCase });
  } catch (error) {
    console.error('Error assigning case:', error);
    res.status(500).json({ message: 'Failed to assign case', error: error.message });
  }
};


module.exports = {
    create,
    allCases,
    assignCase,
};