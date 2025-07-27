import { registerUserService, loginUserService } from "../services";

export const register = async (req, res, next) => {
  try {
    const user = await registerUserService(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUserService(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
