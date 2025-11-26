import RequestLog from "../models/RequestLog.js";

const dbLogger = async (req, res, next) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      req.ip ||
      "unknown";

    const method = req.method || "unknown";
    const route = req.originalUrl || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    const token = req.headers["authorization"] || "không có";

    console.log("📝 dbLogger data:", { ip, method, route, userAgent, token });

    await RequestLog.create({ ip, method, route, user_agent: userAgent, token });
  } catch (err) {
    console.error("❌ Lỗi ghi log DB:", err.message);
  }

  next();
};

export default dbLogger;
