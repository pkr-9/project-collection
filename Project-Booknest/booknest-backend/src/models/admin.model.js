import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { hashPasswordHook } from "../utils/passwordUtils.js";
import { USER_ROLES } from "../enums";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
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
      default: "admin",
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
  },
  {
    timestamps: true,
  }
);

adminSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });
adminSchema.pre("save", hashPasswordHook);
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
export const Admin = mongoose.model("Admin", adminSchema);
