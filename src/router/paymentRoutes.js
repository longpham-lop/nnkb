import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/",verifyToken, getAllPayments);
router.post("/",verifyToken,createPayment);
router.put("/:id",verifyToken, updatePayment);
router.delete("/:id",verifyToken, deletePayment);

export default router;
