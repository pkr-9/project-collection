import uniqueValidator from "mongoose-unique-validator";
import {
  hashPasswordHook,
  comparePasswordMethod,
} from "../utils/passwordUtils.js";
import { USER_ROLES } from "../enums";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "customer",
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add unique validator plugin
userSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });
// Attach external utilities
userSchema.pre("save", hashPasswordHook);
userSchema.methods.matchPassword = comparePasswordMethod;

const User = mongoose.model("User", userSchema);
export default User;
