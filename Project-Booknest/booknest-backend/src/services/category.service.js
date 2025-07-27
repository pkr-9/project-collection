import { Category } from "../models/category.model.js";

export const createCategoryService = async (categoryName) => {
  const exists = await Category.findOne({ categoryName });
  if (exists) throw new Error("Category already exists");
  return await Category.create({ categoryName });
};

export const getAllCategoriesService = async () => {
  return await Category.find({}).sort("categoryName");
};
