const express = require('express');
const router = express.Router();
const trialController = require('../controllers/trial.controller');

router.post('/create', trialController.create);
router.get('/user/:UPIN', trialController.getTrialsByUser);
router.patch('/trial/attend', trialController.attendTrial);
router.get('/', trialController.allTrials);
router.get('/trial/:trialNo', trialController.getTrial);
router.patch('/trial/verdict', trialController.verdict);

module.exports = router;
