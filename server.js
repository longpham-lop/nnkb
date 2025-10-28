import express from "express";
import dotenv from "dotenv";
import cloudinary from "./src/config/cloudinary.js";
import session from "express-session";
import passport from "./src/config/passport.js";
import authRoutes from "./src/router/auth.js";
import uploadRoute from './src/router/uploadRoute.js';
import userRoute from "./src/router/userRoute.js";
import db from "./src/config/db.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";


import categoryRoutes from "./src/router/categoryRoutes.js";
import locationRoutes from "./src/router/locationRoutes.js";
import eventRoutes from "./src/router/eventRoutes.js";
import ticketRoutes from "./src/router/ticketRoutes.js";
import orderRoutes from "./src/router/orderRoutes.js";
import paymentRoutes from "./src/router/paymentRoutes.js";
import orderItemRoutes from "./src/router/orderItemRoutes.js";
import transactionRoutes from "./src/router/transactionRoutes.js";
import RNF from "./src/router/R_N_F.js"
import morgan from "morgan";




dotenv.config();
const app = express();
const server = http.createServer(app);

// Kích hoạt Socket.IO
const io = new Server(server, {
  cors: { origin: "*" },
});
app.use(cors());
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join_user", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
export { io };

app.use(cookieParser());
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
app.use("/api/order-items", orderItemRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/rnf", RNF);
//goggle
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/auth/me", (req, res) => {
  const token = req.cookies.token; // ✅ lấy từ cookie

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({
      user: decoded,
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

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
