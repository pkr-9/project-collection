import { Order } from "../models/order.model.js";

export const createOrderService = async (orderData) => {
  return await Order.create(orderData);
};

export const getOrdersByUserService = async (userId) => {
  return await Order.find({ userId }).sort({ createdAt: -1 });
};

export const getAllOrdersService = async () => {
  return await Order.find().sort({ createdAt: -1 });
};

export const getOrderByIdService = async (orderId) => {
  return await Order.findById(orderId)
    .populate("userId", "name email")
    .populate("products.productId", "name price");
};

export const updateOrderStatusService = async (orderId, status) => {
  return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
};
