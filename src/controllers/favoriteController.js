import Favorite from "../models/Favorite.js";
import User from "../models/User.js";
import Event from "../models/Event.js";

export const getFavoritesByUser = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { user_id: req.params.user_id },
      include: [Event],
    });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.create(req.body);
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await Favorite.findByPk(id);
    if (!favorite) return res.status(404).json({ error: "Không tìm thấy mục yêu thích" });
    await favorite.destroy();
    res.json({ message: "Đã xóa khỏi yêu thích" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
