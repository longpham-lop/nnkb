import express from "express";
import RequestLog from "../models/RequestLog.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const logs = await RequestLog.findAll({ order: [["createdAt", "DESC"]] });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
