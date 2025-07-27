import { Admin } from "../models/admin.model.js";
import User from "../models/user.model.js";
import Book from "../models/book.model.js";

export const createAdminService = async (adminData) => {
  const exists = await Admin.findOne({ email: adminData.email });
  if (exists) {
    const error = new Error("Admin with this email already exists");
    error.statusCode = 400;
    throw error;
  }
  const admin = await Admin.create(adminData);
  return {
    message: "Admin created successfully",
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      contact: admin.contact,
    },
  };
};

export const listAllUsersService = async () => {
  const users = await User.find({}, "name email role status createdAt");
  return users;
};

export const toggleBookPermissionService = async (bookId, status) => {
  const book = await Book.findById(bookId);
  if (!book) throw new Error("Book not found");
  book.permission = status;
  await book.save();
  return {
    message: `Book ${status ? "approved" : "revoked"} successfully`,
  };
};

export const deleteUserByAdminService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  await user.remove();
  return { message: "User deleted successfully" };
};
