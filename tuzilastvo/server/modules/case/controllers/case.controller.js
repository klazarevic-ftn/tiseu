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
      createdOn: Date.now(),
      updatedOn: Date.now(),
      documents: [String],
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
    // for (let i = 0; i < allCases.length; i++) {
    //   const currentCase = allCases[i];
    //   if (currentCase.caseAssignee) {
    //     const prosecutor = await userService.findByUPIN(currentCase.caseAssignee);
    //     console.log(prosecutor);
        
    //     currentCase.caseAssignee = prosecutor.UPIN;
    //     console.log(currentCase.caseAssignee);

    //   }
    // }
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

const getCase = async (req, res) => {
  try {
    const { caseNo } = req.params;
    const caseInfo = await caseService.findByNo(caseNo);
    if (!caseInfo) {
      return res.status(404).json({ message: 'Case not found' });
    }
    res.status(200).json({ caseInfo });
  } catch (error) {
    console.error('Error getting case information:', error);
    res.status(500).json({ message: 'Failed to get case information', error: error.message });
  }
};

const assignDocumentToCase = async (req, res) => {
  try {
      const { caseNo, documentNo } = req.body;
      let existingCase = await caseService.findByNo(caseNo);
      if (!existingCase) {
          return res.status(404).json({ message: 'Case not found' });
      }
      if (!existingCase.documents) {
          existingCase.documents = [];
      }
      if (existingCase.documents.includes(documentNo)) {
          return res.status(400).json({ message: 'Document is already assigned to the case' });
      }
      existingCase.documents.push(documentNo);
      existingCase = await caseService.update(caseNo, existingCase);
      res.status(200).json({ message: 'Document assigned to case successfully', case: existingCase });
  } catch (error) {
      console.error('Error assigning document to case:', error);
      res.status(500).json({ message: 'Failed to assign document to case', error: error.message });
  }
};

const getPartiesInfo = async (req, res) => {
  try {
    const { caseNo } = req.params;
    // const caseNo = req.query.caseNo; 
    const caseInfo = await caseService.findByNo(caseNo);
    // console.log(`Case Info: `, caseInfo);

    if (!caseInfo) {
      return res.status(404).json({ message: 'Case not found' });
    }
    const { plaintiffUPIN, defendantUPIN, witnessUPIN } = caseInfo;
    const partiesInfo = {};

    console.log(`caseInfo: `, caseInfo);
    console.log(`plaintiffUPIN: `, plaintiffUPIN);
    console.log(`defendantUPIN: `, defendantUPIN);
    console.log(`witnessUPIN: `, witnessUPIN);

    if (plaintiffUPIN) {
      const plaintiff = await userService.findByUPIN(caseInfo.plaintiffUPIN);
      console.log(`dasdasadsa`, plaintiff);
      if (plaintiff) {
        partiesInfo.plaintiff = plaintiff;
      } else {
        // console.log(`Plaintiff not found for case ${caseNo}`);
      }
    }

    // Fetch defendant info
    if (defendantUPIN) {
      const defendant = await userService.findByUPIN(caseInfo.defendantUPIN);
      if (defendant) {
        partiesInfo.defendant = defendant;
      } else {
        // console.log(`Defendant not found for case ${caseNo}`);
      }
    }

    // Fetch witness info
    if (witnessUPIN) {
      const witness = await userService.findByUPIN(caseInfo.witnessUPIN);

      // const witness = await userService.findUser({ UPIN: caseInfo.witnessUPIN });
      if (witness) {
        partiesInfo.witness = witness;
      } else {
        // console.log(`Witness not found for case ${caseNo}`);
      }
    }


    res.status(200).json(partiesInfo);
    // console.log(`INFOOOOOOOOOOOOOOOOOOOOOO`, partiesInfo);

  } catch (error) {
    console.error('Error getting parties info:', error);
    res.status(500).json({ message: 'Failed to get parties info', error: error.message });
  }
};

module.exports = {
    create,
    allCases,
    assignCase,
    getCase,
    assignDocumentToCase,
    getPartiesInfo
};