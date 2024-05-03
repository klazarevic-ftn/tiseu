const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');

router.post('/create', documentController.create);


module.exports = router;
