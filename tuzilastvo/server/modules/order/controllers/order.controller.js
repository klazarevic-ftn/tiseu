const Order = require('../models/order.model');
const orderService = require('../services/order.service');

const create = async (caseNo) => {
  try {
    const latestOrder = await orderService.findLast();
    
    let orderNo = 1;
    if (latestOrder && latestOrder.orderNo) {
      orderNo = parseInt(latestOrder.orderNo) + 1;
    }
    const newOrder = new Order({
      orderNo,
      caseNo,
      status: 'ISSUED',
      createdOn: Date.now(),
      updatedOn: Date.now(),
    });
    const savedOrder = await orderService.add(newOrder);

    // ORDER CREATION ON :8086
  
    // const postData = {
    //   orderNo: savedOrder.orderNo,
    //   caseNo: savedOrder.caseNo
    // };

    // await fetch('http://localhost:8086/order', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(postData)
    // });


    return savedOrder;
  } catch (error) {
    console.error('Failed to add order:', error);
    throw new Error('Failed to add order');
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
  const orderNo = req.params.orderNo;
  try {
    const order = await orderService.findByNo(orderNo);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = 'EXECUTED';
    order.updatedOn = Date.now();
    await order.save();

    return res.status(200).json({ message: `Order with No ${orderNo} has been successfully executed.`, order });
  } catch (error) {
    return res.status(500).json({ message: `Failed to execute order with No ${orderNo}.`, error: error.message });
  }
};
module.exports = {
  create,
  all,
  executeOrder,
};
