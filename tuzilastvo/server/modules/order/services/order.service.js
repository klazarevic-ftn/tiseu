const Order = require('../models/order.model');

const add = async (newOrder) => {
  try {
    const savedOrder = await Order.create(newOrder);
    return savedOrder;
  } catch (error) {
    throw new Error(`Error adding order: ${error.message}`);
  }
};

// const findById = async (orderId) => {
//   try {
//     const existingOrder = await Order.findById(orderId);
//     return existingOrder;
//   } catch (error) {
//     throw new Error(`Error finding order by ID: ${error.message}`);
//   }
// };

const findByNo = async (orderNo) => {
  try {
    const existingOrder = await Order.findOne({ orderNo: orderNo });
    return existingOrder;
  } catch (error) {
    throw new Error(`Error finding order by No: ${error.message}`);
  }
};

const findAll = async () => {
  try {
    const orders = await Order.find();
    return orders;
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

async function findLast() {
  try {
    const latestOrder = await Order.findOne().sort({ createdOn: -1 });
    return latestOrder;
  } catch (error) {
    console.error('Error fetching latest order:', error);
    throw new Error('Internal server error');
  }
}

module.exports = {
  add,
  // findById,
  findByNo,
  findAll,
  findLast
};
