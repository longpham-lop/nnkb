import express from "express";
import passport from "../config/passport.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    console.log("✅ OAuth callback triggered");
    console.log("❌ Error:", err);
    console.log("ℹ️ Info:", info);
    console.log("👤 User:", user);

    if (err || !user) {
      return res.redirect("https://nnkb-fe-iota.vercel.app/login?error=google_failed");
    }

    const { token } = user;
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.redirect("https://nnkb-fe-iota.vercel.app/auth/google/callback");
  })(req, res, next);
});

router.get("/failed", (req, res) => {
  res.status(401).json({ error: "Đăng nhập thất bại" });
});



export default router;
