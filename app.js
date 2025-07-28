import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./config/db.js";
import logger from "./middleware/logger.js";
import authRoutes from "./routes/authRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  morgan("combined", { stream: { write: (msg) => logger.http(msg.trim()) } })
);

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      logger.info(`server running on port: http://localhost:${PORT}`)
    );
  } catch (err) {
    logger.error(err.message);
  }
};

startServer();
