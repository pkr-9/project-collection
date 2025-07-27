import User from "../models/user.model.js";
import { generateToken } from "../utils/jwtUtils.js";

export const createUserService = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }
  const user = await User.create(data);
  return {
    message: "User created successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    },
  };
};

export const getUserByIdService = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserService = async (id, data, currentUser) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  if (
    user._id.toString() !== currentUser._id.toString() &&
    currentUser.role !== "admin"
  ) {
    const error = new Error("Unauthorized to update this user");
    error.statusCode = 403;
    throw error;
  }

  Object.assign(user, data);
  return await user.save();
};

export const deleteUserService = async (id, currentUser) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  if (
    user._id.toString() !== currentUser._id.toString() &&
    currentUser.role !== "admin"
  ) {
    const error = new Error("Unauthorized to delete this user");
    error.statusCode = 403;
    throw error;
  }

  await user.remove();
  return { message: "User deleted successfully" };
};
