import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Event from "../models/Event.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [User, Event, Payment],
      order: [["id", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [User, Event, Payment],
    });
    if (!order) return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Không tìm thấy đơn hàng" });

    await order.update(req.body);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Không tìm thấy đơn hàng" });

    await order.destroy();
    res.json({ message: "Đã xóa đơn hàng thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const realUserId = req.user.id;  // Lấy user từ token

    const orders = await Order.findAll({
      where: { user_id: realUserId },
      include: [
        { model: Event, attributes: ["id", "name", "category_id", "location_id"] }
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// ⚠️ LỖ HỔNG: lấy user_id từ URL → mô phỏng IDOR
export const getOrdersByUser_UNSAFE = async (req, res) => {
  try {
    const victimId = req.params.user_id;   

    const orders = await Order.findAll({
      where: { user_id: victimId },
      include: [
        { model: Event, attributes: ["id", "name", "category_id", "location_id"] }
      ]
    });

    return res.json({
      success: true,
      data: orders,
      warning: "⚠️ Đây là API mô phỏng IDOR (KHÔNG sử dụng trong production)"
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
