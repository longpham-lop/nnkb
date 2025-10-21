import QRCode from "qrcode";
import cloudinary from "../config/cloudinary.js";
import OrderItem from "../models/OrderItem.js";
import Order from "../models/Order.js";
import Ticket from "../models/Ticket.js";

// --- Tạo QR và upload lên Cloudinary ---
const generateQRAndUpload = async (data) => {
  try {
    const qrContent = `ORDER_${data.order_id}_TICKET_${data.ticket_id}_${Date.now()}`;
    const qrImage = await QRCode.toDataURL(qrContent);

    const upload = await cloudinary.uploader.upload(qrImage, {
      folder: "tickets_qr",
      public_id: `qr_${data.order_id}_${data.ticket_id}_${Date.now()}`,
      overwrite: true,
      access_mode: "authenticated", 
    });

    return upload.secure_url;
  } catch (err) {
    console.error("Lỗi khi tạo hoặc upload QR:", err);
    throw new Error("Không thể tạo QR code");
  }
};

export const getAllOrderItems = async (req, res) => {
  try {
    const items = await OrderItem.findAll({
      include: [Order, Ticket],
      order: [["id", "DESC"]],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderItemById = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.id, { include: [Order, Ticket] });
    if (!item) return res.status(404).json({ error: "Không tìm thấy chi tiết đơn hàng" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrderItem = async (req, res) => {
  try {
    const { order_id, ticket_id, quantity, unit_price } = req.body;

    const qr_url = await generateQRAndUpload({ order_id, ticket_id });

    const newItem = await OrderItem.create({
      order_id,
      ticket_id,
      quantity,
      unit_price,
      qr_code: qr_url,
    });

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await OrderItem.findByPk(id);
    if (!item) return res.status(404).json({ error: "Không tìm thấy chi tiết đơn hàng" });

    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await OrderItem.findByPk(id);
    if (!item) return res.status(404).json({ error: "Không tìm thấy chi tiết đơn hàng" });

    await item.destroy();
    res.json({ message: "Đã xóa chi tiết đơn hàng thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
