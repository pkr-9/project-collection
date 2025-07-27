import uniqueValidator from "mongoose-unique-validator";
import mongoose from "mongoose";
import { PAYMENT_MODES, ORDER_STATUS } from "../enums";

const orderItemSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const shippingSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    orderItem: [orderItemSchema],
    shippingAddress: shippingSchema,
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMode: {
      type: String,
      enum: PAYMENT_MODES,
      default: "COD",
    },
    contactPerson: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ORDER_STATUS,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });
orderSchema.pre("save", function (next) {
  this.contactPerson = this.contactPerson.trim();
  this.shippingAddress.street = this.shippingAddress.street.trim();
  this.shippingAddress.city = this.shippingAddress.city.trim();
  this.shippingAddress.state = this.shippingAddress.state.trim();
  next();
});
orderSchema.index({ userId: 1, orderStatus: 1 });
orderSchema.index({ cartId: 1, orderStatus: 1 });
export const Order = mongoose.model("Order", orderSchema);
