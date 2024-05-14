const express = require('express');
const router = express.Router();
const lawController = require('../controllers/law.controller');

router.post('/law/create', lawController.create);
router.get('/', lawController.allLaws);

module.exports = router;
