import express from "express";
import passport from "../config/passport.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  (req, res) => {
    const { token, user } = req.user;

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.redirect("http://localhost:5173/auth/google/callback");
  }
);

router.get("/failed", (req, res) => {
  res.status(401).json({ error: "Đăng nhập thất bại" });
});



export default router;
