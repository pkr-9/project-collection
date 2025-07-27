import { City } from "../models/city.model.js";
import { State } from "../models/state.model.js";

export const createCityService = async (cityName, stateId) => {
  const state = await State.findById(stateId);
  if (!state) throw new Error("State not found");

  const exists = await City.findOne({ name: cityName, stateId });
  if (exists) throw new Error("City already exists in this state");

  const city = await City.create({ name: cityName, stateId });
  return city;
};

export const getCitiesByStateService = async (stateId) => {
  return await City.find({ stateId }).sort("name");
};
