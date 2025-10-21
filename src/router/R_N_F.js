import express from "express";
import { getAllReviews, createReview, updateReview, deleteReview } from "../controllers/reviewController.js";
import { getAllNotifications, createNotification, markAsRead, deleteNotification } from "../controllers/notificationController.js";
import { getFavoritesByUser, addFavorite, removeFavorite } from "../controllers/favoriteController.js";

const router = express.Router();

// Reviews
router.get("/reviews", getAllReviews);
router.post("/reviews", createReview);
router.put("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);

// Notifications
router.get("/notifications", getAllNotifications);
router.post("/notifications", createNotification);
router.put("/notifications/:id/read", markAsRead);
router.delete("/notifications/:id", deleteNotification);

// Favorites
router.get("/favorites/:user_id", getFavoritesByUser);
router.post("/favorites", addFavorite);
router.delete("/favorites/:id", removeFavorite);

export default router;
