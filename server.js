import express from "express";
import dotenv from "dotenv";
import cloudinary from "./src/config/cloudinary.js";
import uploadRoute from './src/router/uploadRoute.js';
import userRoute from "./src/router/userRoute.js";
import db from "./src/config/db.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use('/api', uploadRoute);
//user
app.use("/api", userRoute);


////////////////////////////////////////////

app.get("/api/test-cloud", async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      { public_id: "test_api_image" }
    );
    res.json({ success: true, url: result.secure_url });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
/////////////////////////////////

(async () => {
    try {
        await db.authenticate();
        console.log("✅ PostgreSQL connected");
        await db.sync(); // tạo bảng nếu chưa có
    } catch (error) {
        console.error("❌ DB connection error:", error);
    }
})();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
