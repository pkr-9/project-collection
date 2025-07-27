import { State } from "../models/state.model.js";

export const createStateService = async (stateName) => {
  const exists = await State.findOne({ stateName });
  if (exists) throw new Error("State already exists");
  const state = await State.create({ stateName });
  return state;
};

export const getAllStatesService = async () => {
  return await State.find({}).sort("stateName");
};
