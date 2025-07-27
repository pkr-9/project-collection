import { createCityService, getCitiesByStateService } from "../services";

export const createCity = async (req, res, next) => {
  try {
    const { name, stateId } = req.body;
    const city = await createCityService(name, stateId);
    res.status(201).json(city);
  } catch (error) {
    next(error);
  }
};

export const getCitiesByState = async (req, res, next) => {
  try {
    const stateId = req.params.stateId;
    const cities = await getCitiesByStateService(stateId);
    res.json(cities);
  } catch (error) {
    next(error);
  }
};
