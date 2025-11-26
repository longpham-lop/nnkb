import BlockedIP from "../models/BlockedIP.js";

const blockIP = async (req, res, next) => {
  try {
    const ip = req.ip; // Express sẽ lấy IP thật nếu trust proxy được bật

    // Kiểm tra xem IP có bị chặn không
    const blocked = await BlockedIP.findOne({ where: { ip } });

    if (blocked) {
      return res.status(403).json({ message: "IP bị chặn" });
    }
  } catch (err) {
    console.error("Error checking blocked IP:", err.message);
  }

  next();
};

export default blockIP;