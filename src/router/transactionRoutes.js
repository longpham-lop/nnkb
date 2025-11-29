import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/",verifyToken, getAllTransactions);
router.get("/:id",verifyToken, getTransactionById);
router.post("/",verifyToken, createTransaction);
router.put("/:id",verifyToken, updateTransaction);
router.delete("/:id",verifyToken, deleteTransaction);

export default router;
