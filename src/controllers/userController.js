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
        phone: user.phone,
        countryside: user.countryside,
        avata: user.avatar_url,
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


export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id; 

    const { name, phone, countryside, avatar_url } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    await user.update({
      name: name || user.name,
      phone: phone || user.phone,
      countryside: countryside || user.countryside,
      avatar_url: avatar_url || user.avatar_url,
    });

    return res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server", error: err.message });
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

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // 🔒 chống IDOR — chỉ đổi mật khẩu của chính mình

    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res.status(400).json({ 
        success: false,
        message: "Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới" 
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User không tồn tại" 
      });
    }

    // So sánh mật khẩu cũ
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: "Mật khẩu cũ không đúng" 
      });
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    await user.update({ password: hashedNewPassword });

    return res.json({
      success: true,
      message: "Đổi mật khẩu thành công"
    });

  } catch (err) {
    return res.status(500).json({ 
      success: false,
      message: "Lỗi server", 
      error: err.message 
    });
  }
};