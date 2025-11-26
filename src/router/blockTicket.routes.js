import express from "express";
import {
  createBlockTicket,
  getAllBlockTickets,
  getBlockTicketById,
  getBlockTicketByOrder,
  updateCheckIn,
  deleteBlockTicket
} from "../controllers/blockTicket.controller.js";

const router = express.Router();

router.post("/", createBlockTicket);
router.get("/", getAllBlockTickets);
router.get("/:id", getBlockTicketById);
router.get("/order/:order_id", getBlockTicketByOrder);
router.put("/checkin/:id", updateCheckIn);
router.delete("/:id", deleteBlockTicket);

export default router;
