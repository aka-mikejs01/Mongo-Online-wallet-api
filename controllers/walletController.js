import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { matchedData } from "express-validator";
import mongoose from "mongoose";
import logger from "../middleware/logger.js";

export const transfer = async (req, res) => {
  const { senderId, recieverId, amount } = matchedData(req);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await User.findById(senderId).session(session);
    const reciever = await User.findById(recieverId).session(session);

    if (!sender || !reciever) throw new Error("User not found");
    if (sender.balance < amount) throw new Error("Insufficient balance");

    sender.balance -= amount;
    reciever.balance += amount;

    await sender.save({ session });
    await reciever.save({ session });

    logger.info(`User ${sender.name} transfer ${amount}$ to ${reciever.name}`);

    await Transaction.create(
      [
        {
          sender: sender._id,
          reciever: reciever._id,
          amount,
          status: "success",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.json({ message: "Transfer successfull" });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json(err.message);
  } finally {
    await session.endSession();
  }
};

export const history = async (req, res) => {
  const transactions = await Transaction.find({
    $or: [{ sender: req.userId }, { reciever: req.userId }],
  })
    .populate("sender", "name email")
    .populate("reciever", "name email");

  if (!transactions.length)
    return res.status(404).json({ message: "No transaction history" });

  res.json(transactions);
};

export const balance = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    res.json({ message: `Your current balance is: ${user.balance}$` });
  } catch (err) {}
};
