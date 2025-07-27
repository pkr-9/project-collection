import {
  createAdminService,
  listAllUsersService,
  toggleBookPermissionService,
  deleteUserByAdminService,
} from "../services";

export const createAdmin = async (req, res, next) => {
  try {
    const result = await createAdminService(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const listAllUsers = async (req, res, next) => {
  try {
    const users = await listAllUsersService();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const toggleBookPermission = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { status } = req.body;
    const result = await toggleBookPermissionService(bookId, status);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteUserByAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await deleteUserByAdminService(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
