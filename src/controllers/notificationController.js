import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { io } from "../server.js";

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({ include: [User], order: [["created_at", "DESC"]] });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    io.to(`user_${notification.user_id}`).emit("new_notification", notification);

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const noti = await Notification.findByPk(req.params.id);
    if (!noti) return res.status(404).json({ error: "Không tìm thấy thông báo" });
    await noti.update({ is_read: true });
    res.json({ message: "Đã đánh dấu là đã đọc" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const noti = await Notification.findByPk(req.params.id);
    if (!noti) return res.status(404).json({ error: "Không tìm thấy thông báo" });
    await noti.destroy();
    res.json({ message: "Đã xóa thông báo" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
