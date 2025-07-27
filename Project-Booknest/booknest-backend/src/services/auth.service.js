import User from "../models/user.model.js";
import { generateToken } from "../utils/jwtUtils.js";

export const registerUserService = async ({
  name,
  email,
  password,
  role,
  profileImage,
  address,
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    profileImage,
    address,
  });

  return {
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    },
  };
};

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return {
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    },
  };
};
