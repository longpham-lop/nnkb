import express from "express";
import passport from "../config/passport.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failed" }),
  (req, res) => {
    const { token, user } = req.user;
    res.json({
      message: "Đăng nhập Google thành công",
      token,
      user,
    });
  }
);

router.get("/failed", (req, res) => {
  res.status(401).json({ error: "Đăng nhập thất bại" });
});

export default router;
