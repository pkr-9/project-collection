import {
  createOrderService,
  getOrdersByUserService,
  getAllOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
} from "../services";

export const createOrder = async (req, res, next) => {
  try {
    const order = await createOrderService(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrdersByUser = async (req, res, next) => {
  try {
    const orders = await getOrdersByUserService(req.user.id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await getOrderByIdService(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const updatedOrder = await updateOrderStatusService(orderId, status);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await getAllOrdersService();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};
