import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Language",
      required: true,
    },
    edition: {
      type: String,
      required: true,
      trim: true,
    },
    publicationDate: {
      type: String,
      required: true,
      trim: true,
    },
    isDonated: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      validate: [(v) => v.length > 0, "At least one image is required"],
      message: "At least one image is required",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "city",
      trim: true,
    },
    permission: {
      type: Boolean,
      default: false,
    },
    pincode: {
      type: Number,
      required: true,
      trim: true,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });
bookSchema.index({ title: "text", author: "text", language: "text" });
bookSchema.index({ userId: 1, cityId: 1, categoryId: 1 });
bookSchema.index({ isSold: 1, isDonated: 1 });
bookSchema.index({ cityId: 1, categoryId: 1, isSold: 1 });
bookSchema.index({ cityId: 1, isSold: 1, isDonated: 1 });

export const Book = mongoose.model("Book", bookSchema);
