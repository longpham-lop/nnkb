import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import {
  register,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
  updateMyProfile,
  changePassword,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/users/register", register);
router.post("/users/login", login);

router.get("/users", verifyToken, isAdmin, getAllUsers);
router.put("/users/:id",verifyToken, updateUser);

router.put("/me",verifyToken,updateMyProfile);
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

router.put("/change-password", authMiddleware, changePassword);

export default router;
