const Law = require('../models/law.model');

async function findLast() {
  try {
    const latestLaw = await Law.findOne().sort({ createdOn: -1 });
    return latestLaw;
  } catch (error) {
    console.error('Error fetching latest law:', error);
    throw new Error('Internal server error');
  }
}

const add = async (newLaw) => {
  try {
    const savedLaw = await newLaw.save();
    return savedLaw;
  } catch (error) {
    throw new Error(`Failed to add law: ${error.message}`);
  }
};

const getAll = async () => {
  try {
    const allLaws = await Law.find();
    return allLaws;
  } catch (error) {
    console.error('Error getting all laws:', error);
    throw new Error('Internal server error');
  }
};

module.exports = {
    findLast,
    add,
    getAll
};
  