const express = require('express');
const router = express.Router();
const caseController = require('../controllers/case.controller');

// router.get('/case-num', caseController.returnCaseNumber);
router.post('/create', caseController.create);
router.get('/', caseController.allCases);
router.patch('/assign', caseController.assignCase);
router.get('/case/:caseNo', caseController.getCase);
router.patch('/case/assign-doc', caseController.assignDocumentToCase);
router.get('/case/parties/:caseNo', caseController.getPartiesInfo);


module.exports = router;
