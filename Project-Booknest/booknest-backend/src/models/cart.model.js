import uniqueValidator from "mongoose-unique-validator";
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  { _id: false },
  {
    timestamps: true,
  }
);

cartSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });
export const Cart = mongoose.model("Cart", cartSchema);
