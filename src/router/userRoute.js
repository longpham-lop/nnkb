import express from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import {
  register,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/users/register", register);
router.post("/users/login", login);

router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.put("/users/:id", authMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, isAdmin, deleteUser);

export default router;
