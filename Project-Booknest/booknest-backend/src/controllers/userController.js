import {
  createUserService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "../services";

export const createUser = async (req, res, next) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await updateUserService(req.params.id, req.body, req.user);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await deleteUserService(req.params.id, req.user);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
