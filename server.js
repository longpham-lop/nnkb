import express from "express";
import dotenv from "dotenv";
import ticketRouter from "./src/router/ticketRouter.js";
import db from "./src/models/index.js";

dotenv.config();
const app = express();

app.use(express.json());

// Test DB connection
(async () => {
    try {
        await db.sequelize.authenticate();
        console.log("✅ PostgreSQL connected");
        await db.sequelize.sync(); // tạo bảng nếu chưa có
    } catch (error) {
        console.error("❌ DB connection error:", error);
    }
})();

// Routes
app.use("/api/tickets", ticketRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
