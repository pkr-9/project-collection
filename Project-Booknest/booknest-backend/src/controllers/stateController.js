import { createStateService, getAllStatesService } from "../services";

export const createState = async (req, res, next) => {
  try {
    const state = await createStateService(req.body.stateName);
    res.status(201).json(state);
  } catch (error) {
    next(error);
  }
};

export const getAllStates = async (req, res, next) => {
  try {
    const states = await getAllStatesService();
    res.json(states);
  } catch (error) {
    next(error);
  }
};
