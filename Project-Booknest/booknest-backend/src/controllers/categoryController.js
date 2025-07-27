import { createCategoryService, getAllCategoriesService } from "../services";

export const createCategory = async (req, res, next) => {
  try {
    const category = await createCategoryService(req.body.categoryName);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategoriesService();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};
