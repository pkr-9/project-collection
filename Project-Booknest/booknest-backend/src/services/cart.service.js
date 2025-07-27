import Cart from "../models/cart.model.js";

export const getCartByUserIdService = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate("cartItems.bookId");
  return cart || { userId, cartItems: [] };
};

export const addToCartService = async (userId, bookId, quantity) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: "Invalid book ID." });
  }
  if (!validateQuantity(quantity)) {
    return res
      .status(400)
      .json({ message: "Quantity must be a positive integer." });
  }
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, cartItems: [{ bookId, quantity }] });
  } else {
    const item = cart.cartItems.find(
      (item) => item.bookId.toString() === bookId
    );
    if (item) {
      item.quantity += quantity;
    } else {
      cart.cartItems.push({ bookId, quantity });
    }
    await cart.save();
  }
  return cart;
};

export const removeFromCartService = async (userId, bookId) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: "Invalid book ID." });
  }
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");
  cart.cartItems = cart.cartItems.filter(
    (item) => item.bookId.toString() !== bookId
  );
  await cart.save();
  return cart;
};

export const updateCartItemQuantityService = async (
  userId,
  bookId,
  quantity
) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: "Invalid book ID." });
  }
  if (!validateQuantity(quantity)) {
    return res
      .status(400)
      .json({ message: "Quantity must be a positive integer." });
  }
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");
  const item = cart.cartItems.find((item) => item.bookId.toString() === bookId);
  if (!item) throw new Error("Item not found in cart");
  if (quantity <= 0) {
    cart.cartItems = cart.cartItems.filter(
      (item) => item.bookId.toString() !== bookId
    );
  } else {
    item.quantity = quantity;
  }
  await cart.save();
  return cart;
};

export const clearCartService = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");
  cart.cartItems = [];
  await cart.save();
  return cart;
};
