const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/add', orderController.add);
router.get('/all', orderController.all);
router.put('/:id/execute', orderController.executeOrder);

module.exports = router;
