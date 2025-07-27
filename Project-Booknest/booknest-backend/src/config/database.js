import mongoose from "mongoose";
import dotenv from "dotenv"; // Import dotenv to load environment variables
import "colors"; // Import colors for colored console output

dotenv.config(); // used to load environment variables from a .env file into process.env

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Uses new MongoDB connection string parser.
      useUnifiedTopology: true, // Opts into using the new topology engine for monitoring server status.
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`MongoDB connection Error: ${error.message}`.red);
    process.exit(1); // Exit process with failure
  }
};
export default connectDB;
