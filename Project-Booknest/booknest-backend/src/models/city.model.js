import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
    required: true,
  },
});
citySchema.index({ name: 1, stateId: 1 }, { unique: true });
citySchema.index({ name: "text" });
export const City = mongoose.model("City", citySchema);
