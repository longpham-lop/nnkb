import express from "express";
import { passportInstance } from "../config/passport.js";

const router = express.Router();

// Step 1: redirect user tới Google login
router.get("/google", 
  passportInstance.authenticate("google", { 
    scope: ["profile", "email"], 
    prompt: "select_account" 
  })
);

// Step 2: callback từ Google
router.get("/google/callback", (req, res, next) => {
  passportInstance.authenticate("google", { session: false }, (err, data, info) => {
    console.log("✅ OAuth callback triggered");
    console.log("❌ Error:", err);
    console.log("ℹ️ Info:", info);
    console.log("👤 Data:", data);

    if (err || !data) {
      return res.redirect("https://nnkb-fe-iota.vercel.app/login?error=google_failed");
    }

    const { token, user } = data;

    // Set cookie JWT
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.redirect("https://nnkb-fe-iota.vercel.app/auth/google/callback");
  })(req, res, next);
});

// Route thất bại (dùng khi muốn trả JSON)
router.get("/failed", (req, res) => {
  res.status(401).json({ error: "Đăng nhập thất bại" });
});

export default router;
