const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');

router.post('/create', documentController.create);
router.get('/', documentController.allDocuments);


module.exports = router;
