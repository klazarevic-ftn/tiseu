const Order = require('../models/order.model');

const add = async (newOrder) => {
  try {
    const savedOrder = await Order.create(newOrder);
    return savedOrder;
  } catch (error) {
    throw new Error(`Error adding order: ${error.message}`);
  }
};

const findById = async (orderId) => {
  try {
    const existingOrder = await Order.findById(orderId);
    return existingOrder;
  } catch (error) {
    throw new Error(`Error finding order by ID: ${error.message}`);
  }
};

const findByOrderId = async (orderId) => {
  try {
    const existingOrder = await Order.findOne({ orderId: orderId });
    return existingOrder;
  } catch (error) {
    throw new Error(`Error finding order by ID: ${error.message}`);
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
module.exports = {
  add,
  findById,
  findByOrderId,
  findAll,
};
