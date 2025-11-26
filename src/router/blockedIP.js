// src/routes/blockedIP.js
import express from "express";
import BlockedIP from "../models/BlockedIP.js";

const router = express.Router();

// --- Lấy danh sách IP bị chặn ---
router.get("/", async (req, res) => {
  try {
    const ips = await BlockedIP.findAll({ order: [["createdAt", "DESC"]] });
    res.json(ips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// --- Thêm IP mới ---
router.post("/", async (req, res) => {
  try {
    const { ip } = req.body;
    if (!ip) return res.status(400).json({ message: "Thiếu IP" });

    const [blockedIP, created] = await BlockedIP.findOrCreate({
      where: { ip },
    });

    if (!created) return res.status(400).json({ message: "IP đã tồn tại" });

    res.json({ message: "Đã thêm IP", blockedIP });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// --- Xóa IP ---
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BlockedIP.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: "Không tìm thấy IP" });

    res.json({ message: "Đã xóa IP" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
