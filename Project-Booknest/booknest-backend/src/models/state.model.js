import uniqueValidator from "mongoose-unique-validator";
import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
  stateName: {
    type: String,
    required: true,
    unique: true,
  },
});

stateSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });
export const State = mongoose.model("State", stateSchema);
