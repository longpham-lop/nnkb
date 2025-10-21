import express from "express";
import dotenv from "dotenv";
import cloudinary from "./src/config/cloudinary.js";
import session from "express-session";
import passport from "./src/config/passport.js";
import authRoutes from "./src/router/auth.js";
import uploadRoute from './src/router/uploadRoute.js';
import userRoute from "./src/router/userRoute.js";
import db from "./src/config/db.js";
import categoryRoutes from "./src/router/categoryRoutes.js";
import locationRoutes from "./src/router/locationRoutes.js";
import eventRoutes from "./src/router/eventRoutes.js";
import ticketRoutes from "./src/router/ticketRoutes.js";
import orderRoutes from "./src/router/orderRoutes.js";
import paymentRoutes from "./src/router/paymentRoutes.js";
import morgan from "morgan";

dotenv.config();
const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use('/api', uploadRoute);
//user
app.use("/api", userRoute);
//etc...
app.use("/api/categories", categoryRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
//goggle
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("✅ API chạy OK");
});


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
