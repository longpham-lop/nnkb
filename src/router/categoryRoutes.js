import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/",verifyToken, getAllCategories);
router.get("/:id",verifyToken, getCategoryById);
router.post("/",verifyToken, createCategory);
router.put("/:id",verifyToken, updateCategory);
router.delete("/:id",verifyToken, deleteCategory);

export default router;
