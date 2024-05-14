const Trial = require('../models/trial.model');
const Case = require('../../case/models/case.model');

async function findLast() {
  try {
    const latestTrial = await Trial.findOne().sort({ createdAt: -1 });
    return latestTrial;
  } catch (error) {
    console.error('Error fetching latest trial:', error);
    throw new Error('Internal server error');
  }
}

const add = async (newTrial) => {
    try {
      const savedTrial = await newTrial.save();
      return savedTrial;
    } catch (error) {
      throw new Error(`Failed to add trial: ${error.message}`);
    }
  };

  const getUserTrials = async (userUPIN) => {
    try {
      const cases = await Case.find({
        $or: [
          { plaintiffUPIN: userUPIN },
          { defendantUPIN: userUPIN },
          { witnessUPIN: userUPIN }
        ]
      });
      const caseNumbers = cases.map(caseItem => caseItem.caseNo);
      const userTrials = await Trial.find({ caseNo: { $in: caseNumbers } });
      return userTrials;
    } catch (error) {
      throw new Error('Failed to get trials for the user');
    }
  };
  
  const getAll = async () => {
    try {
      const allTrials = await Trial.find();
      return allTrials;
    } catch (error) {
      console.error('Error getting all trials:', error);
      throw new Error('Internal server error');
    }
  };

  const findByNo = async (trialNo) => {
    try {
      const existingTrial = await Trial.findOne({ trialNo });
      return existingTrial;
    } catch (error) {
      throw new Error(`Error finding trial by trial number: ${error.message}`);
    }
  };
  
  module.exports = {
      findLast,
      add,
      getUserTrials,
      getAll,
      findByNo,
  };