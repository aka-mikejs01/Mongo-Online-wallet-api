import mongoose from "mongoose";
import logger from "../middleware/logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Connected to MongoDB");
  } catch (err) {
    logger.error(`DB died. ${err.message}`);
  }
};

export default connectDB;
