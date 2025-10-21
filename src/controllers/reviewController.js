import Review from "../models/Review.js";
import User from "../models/User.js";
import Event from "../models/Event.js";

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ include: [User, Event] });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: "Không tìm thấy đánh giá" });
    await review.update(req.body);
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: "Không tìm thấy đánh giá" });
    await review.destroy();
    res.json({ message: "Đã xóa đánh giá" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
