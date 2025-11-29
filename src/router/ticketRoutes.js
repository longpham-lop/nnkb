import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController.js";

const router = express.Router();

router.get("/",verifyToken, getAllTickets);
router.get("/:id",verifyToken, getTicketById);
router.post("/", verifyToken,createTicket);
router.put("/:id",verifyToken, updateTicket);
router.delete("/:id",verifyToken, isAdmin, deleteTicket);

export default router;
