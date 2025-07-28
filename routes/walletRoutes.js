import { Router } from "express";
import { transfer, history, balance } from "../controllers/walletController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { walletValidator } from "../validators/walletValidator.js";

const router = Router();

router.post("/transfer", authMiddleware, walletValidator, transfer);
router.get("/history", authMiddleware, history);
router.get("/balance", authMiddleware, balance);

export default router;
