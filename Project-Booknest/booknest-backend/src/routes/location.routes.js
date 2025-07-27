import express from "express";
import { createState, getAllStates } from "../controllers/stateController.js";
import { createCity, getCitiesByState } from "../controllers/cityController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/authController.js";

const router = express.Router();

// STATE ROUTES
router.post("/states", authenticate, isAdmin, createState);
router.get("/states", getAllStates);

// CITY ROUTES
router.post("/cities", authenticate, isAdmin, createCity);
router.get("/cities/:stateId", getCitiesByState);

export const locationRoutes = router;
