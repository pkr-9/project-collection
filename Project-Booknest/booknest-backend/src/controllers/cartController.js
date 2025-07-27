import {
  getCartByUserIdService,
  addToCartService,
  removeFromCartService,
  updateCartItemQuantityService,
  clearCartService,
} from "../services";

export const getCart = async (req, res, next) => {
  try {
    const cart = await getCartByUserIdService(req.user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.body;
    const cart = await addToCartService(req.user.id, bookId, quantity);
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

export const updateCartItemQuantity = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { quantity } = req.body;
    const cart = await updateCartItemQuantityService(
      req.user.id,
      bookId,
      quantity
    );
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await clearCartService(req.user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const cart = await removeFromCartService(req.user.id, bookId);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};
