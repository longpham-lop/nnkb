import express from "express";
import { createTicket, getTickets, getTicketById } from "../controllers/ticketControllers.js";

const router = express.Router();

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/:id", getTicketById);

export default router;
