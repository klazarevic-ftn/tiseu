const axios = require('axios');
const Order = require('../models/order.model');
const orderService = require('../services/order.service');

const add = async (req, res) => {
  try {
    const { orderId, caseId } = req.body;

    // const existingCase = await caseService.findById(caseId);
    // if (!existingCase) {
    //   return res.status(404).json({ message: `Case with given ID was not found` });
    // }
    // const existingOrder = await orderService.findById(orderId);
    // if (existingOrder) {
    //   return res.status(400).json({ message: 'Order with the given ID already exists' });
    // }


    //MUP
    // const externalResponse = await axios.post('external_server_url', { orderId, caseId });

    // if (externalResponse.status === 200) {
    //   const newOrder = new Order({
    //     orderId,
    //     caseId,
    //     status: 'PENDING',
    //   });
    //   const savedOrder = await orderService.add(newOrder);
    //   return res.status(201).json(savedOrder);
    // } else {

    const newOrder = new Order({
        orderId,
        caseId,
        status: 'ISSUED',
      });
      const savedOrder = await orderService.add(newOrder);
      // return res.status(201).json(savedOrder);
      return res.status(201).json({ message: 'Order added successfully', order: savedOrder });
      // }
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add order', error: error.message });
  }
};

const all = async (req, res) => {
  try {
    const orders = await orderService.findAll();
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

const executeOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await orderService.findByOrderId(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = 'EXECUTED';
    
    await order.save();

    return res.status(200).json({ message: `Order with ID ${orderId} has been successfully executed.`, order });
  } catch (error) {
    return res.status(500).json({ message: `Failed to execute order with ID ${orderId}.`, error: error.message });
  }
};
module.exports = {
  add,
  all,
  executeOrder,
};
