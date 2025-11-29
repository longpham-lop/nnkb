import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
  getOrdersByUser_UNSAFE,
} from "../controllers/orderController.js";

const router = express.Router();
router.get("/who",verifyToken, getMyOrders)
//can be attack
router.get("/unsafe/:user_id", verifyToken, getOrdersByUser_UNSAFE);
router.get("/:id",verifyToken, getOrderById);
//
router.get("/",verifyToken, isAdmin , getAllOrders);

router.post("/",verifyToken, createOrder);
router.put("/:id",verifyToken, isAdmin , updateOrder);
router.delete("/:id",verifyToken, deleteOrder);



export default router;
