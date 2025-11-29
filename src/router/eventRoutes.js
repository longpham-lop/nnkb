import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import express from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvents,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/",verifyToken, getAllEvents);
router.get("/search",verifyToken, searchEvents);
router.get("/:id",verifyToken, getEventById);
router.post("/",verifyToken, createEvent);
router.put("/:id",verifyToken, updateEvent);
router.delete("/:id",verifyToken, deleteEvent);

export default router;
