import cron from "node-cron";
import { Op } from "sequelize";
import RequestLog from "../models/RequestLog.js";

cron.schedule("0 0 */7 * *", async () => {
  try {
    const deleted = await RequestLog.destroy({
      where: {
        createdAt: {
          [Op.lt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });
    console.log(`🧹 Đã xóa ${deleted} log cũ hơn 7 ngày`);
  } catch (err) {
    console.error("❌ Lỗi xóa log cũ:", err);
  }
});
