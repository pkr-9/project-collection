import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // to handle JSON payloads

// Routes
app.use("/api", routes);

app.use(errorHandler); // Custom error handler middleware

// Export the app for testing or further configuration
export default app;
