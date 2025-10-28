import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {io} from "../../server.js"

export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, countryside } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email đã tồn tại" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      phone,
      countryside,
    });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Người dùng không tồn tại" });

    if (user.status === "locked") {
      return res.status(403).json({ error: "Tài khoản đã bị khóa do đăng nhập sai quá 5 lần" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      user.login_attempts += 1;
      if (user.login_attempts >= 5) {
        user.status = "locked";
      }
      await user.save();
      return res.status(401).json({
        error: `Sai mật khẩu (${user.login_attempts}/5)`,
      });
    }

    user.login_attempts = 0;
    await user.save();

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.update(req.body, { where: { id } });
    res.json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res.json({ success: true, message: "Đã xóa người dùng" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
