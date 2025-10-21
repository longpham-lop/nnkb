import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({ include: [Order] });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ error: "Không tìm thấy thanh toán" });

    await payment.update(req.body);
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ error: "Không tìm thấy thanh toán" });

    await payment.destroy();
    res.json({ message: "Đã xóa thanh toán thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
