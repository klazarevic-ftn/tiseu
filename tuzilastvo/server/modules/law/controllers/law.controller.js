const Law = require('../models/law.model');
const lawService = require('../services/law.service');

const create = async (req, res) => {
  try {
    const latestLaw = await lawService.findLast();
    let lawNumber = 1;

    if (latestLaw) {
      lawNumber = parseInt(latestLaw.lawNo) + 1;
    }
    const { lawTitle, fullLawText, lawType, authority } = req.body;

    const newLaw = new Law({
      lawNo: lawNumber,
      lawTitle,
      fullLawText,
      lawType,
      authority,
      createdOn: Date.now(),
      updatedOn: Date.now(),
    });

    const savedLaw = await lawService.add(newLaw);

    res.status(201).json({ message: 'Law added successfully', law: savedLaw });
  } catch (error) {
    console.error('Error adding law:', error);
    res.status(500).json({ message: 'Failed to add law', error: error.message });
  }
};

const allLaws = async (req, res) => {
    try {
      let allLaws = await lawService.getAll();
      res.status(200).json({ laws: allLaws });
    } catch (error) {
      console.error('Error getting all laws:', error);
      res.status(500).json({ message: 'Failed to get all laws', error: error.message });
    }
};

module.exports = {
    create,
    allLaws,
};