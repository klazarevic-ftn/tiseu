const Trial = require('../models/trial.model');
const Case = require('../../case/models/case.model');
const trialService = require('../services/trial.service');
const caseService = require('../../case/services/case.service');
const orderController = require('../../order/controllers/order.controller');

const create = async (req, res) => {
  try {
    const latestTrial = await trialService.findLast();
    let trialNumber = 1;

    if (latestTrial) {
      trialNumber = parseInt(latestTrial.trialNo) + 1;
    }

    const { caseNo, date, location } = req.body;

    const attendance = {
      prosecutorAttendance: false,
      defendantAttendance: false,
      witnessAttendance: false
    };

    const newTrial = new Trial({
      trialNo: trialNumber,
      caseNo: caseNo,
      trialDate: date,
      location: location,
      attendance: attendance,
      createdOn: Date.now(),
      updatedOn: Date.now(),
      verdict: 0,
    });

    const savedTrial = await trialService.add(newTrial);

    res.status(201).json({ message: 'Trial added successfully', trial: savedTrial });
  } catch (error) {
    console.error('Error adding trial:', error);
    res.status(500).json({ message: 'Failed to add trial', error: error.message });
  }
};

const getTrialsByUser = async (req, res) => {
  try {
    const { UPIN } = req.params;
    const userTrials = await trialService.getUserTrials(UPIN);
    res.status(200).json(userTrials);
  } catch (error) {
    console.error('Error getting user trials:', error);
    res.status(500).json({ message: 'Failed to get user trials', error: error.message });
  }
};

const attendTrial = async (req, res) => {
  try {
    const { UPIN, trialNo } = req.body;
    const trial = await Trial.findOne({ trialNo });
    if (!trial) {
      return res.status(404).json({ message: 'Trial not found' });
    }
    console.log("UPIN", UPIN)
    const caseData = await Case.findOne({ caseNo: trial.caseNo });
    if (!caseData) {
      return res.status(404).json({ message: 'Case not found for the trial' });
    }
    if (caseData.plaintiffUPIN === UPIN) {
      trial.attendance.plaintiffAttendance = true;
    } else if (caseData.defendantUPIN === UPIN) {
      trial.attendance.defendantAttendance = true;
    } else if (caseData.witnessUPIN === UPIN) {
      trial.attendance.witnessAttendance = true;
    }
    const updatedTrial = await trial.save();
    res.status(200).json({ message: 'Attendance marked successfully', trial: updatedTrial });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
  }
}; 

const allTrials = async (req, res) => {
  try {
    let allTrials = await trialService.getAll();
    // console.log('TRIALS: ', allTrials);


    res.status(200).json({ trials: allTrials });
  } catch (error) {
    console.error('Error getting all trials:', error);
    res.status(500).json({ message: 'Failed to get all trials', error: error.message });
  }
};

const getTrial = async (req, res) => {
  try {
    const { trialNo } = req.params;
    const trialInfo = await trialService.findByNo(trialNo);
    if (!trialInfo) {
      return res.status(404).json({ message: 'Trial not found' });
    }
    const caseInfo = await caseService.findByNo(trialInfo.caseNo);
    if (!caseInfo) {
      return res.status(404).json({ message: 'Case not found' });
    }
    res.status(200).json({ trialInfo, caseInfo });
  } catch (error) {
    console.error('Error getting trial information:', error);
    res.status(500).json({ message: 'Failed to get trial information', error: error.message });
  }
};

const verdict = async (req, res) => {
  try {
    const { trialNo, verdict, caseNo} = req.body;
    if (!verdict || verdict < 1 || verdict > 3) {
      return res.status(400).json({ message: 'Verdict is not set or invalid' });
    }
    const trial = await trialService.findByNo(trialNo);
    if (!trial) {
      return res.status(404).json({ message: 'Trial not found' });
    }
    trial.verdict = verdict;
    const updatedTrial = await trial.save();
    const order = await orderController.create(caseNo);

    return res.status(200).json({ message: 'Final decision successfully established.', trial: updatedTrial, order: order});
  } catch (error) {
    console.error('Error updating verdict:', error);
    return res.status(500).json({ message: 'Failed to update verdict', error: error.message });
  }
};

module.exports = {
    create,
    getTrialsByUser,
    attendTrial,
    allTrials,
    getTrial,
    verdict
};
