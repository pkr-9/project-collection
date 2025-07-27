import uniqueValidator from "mongoose-unique-validator";
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
});
categorySchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });
categorySchema.pre("save", function (next) {
  this.categoryName = this.categoryName.trim();
  next();
});
categorySchema.index({ categoryName: 1 }, { unique: true });
export const Category = mongoose.model("Category", categorySchema);
