import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { matchedData } from "express-validator";
import { getAccessToken, getRefreshToken } from "../utils/getToken.js";
import logger from "../middleware/logger.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, balance } = matchedData(req);

    const exist = await User.findOne({ email });
    if (exist) {
      logger.warn("Someone tried to register with existing email");
      return res.status(401).json({ message: "Email already in use" });
    }

    const user = new User({ name, email, password, balance });
    await user.save();

    logger.info(`New user registered: ${user.name}`);

    const accessToken = getAccessToken(user._id);
    const refreshToken = getRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res
      .status(201)
      .json({ message: "User registered successfully", accessToken });
  } catch (err) {
    res.status(500).json({ message: "Error Occured", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    logger.info(`User ${user.name} logged in`);

    const accessToken = getAccessToken(user._id);
    const refreshToken = getRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: "User logged in successfully", accessToken });
  } catch (err) {
    res.status(500).json({ message: "Error Occured", error: err.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.json({ message: "Logged out successfully" });
};

export const refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(403).json({ message: "No token provided" });

  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const accessToken = getAccessToken(decoded.userId);

    res.json({ accessToken });
  });
};
