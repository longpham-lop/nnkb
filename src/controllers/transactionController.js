import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: User, as: "Sender", attributes: ["id", "name", "email"] },
        { model: User, as: "Receiver", attributes: ["id", "name", "email"] },
      ],
      order: [["id", "DESC"]],
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [
        { model: User, as: "Sender", attributes: ["id", "name", "email"] },
        { model: User, as: "Receiver", attributes: ["id", "name", "email"] },
      ],
    });
    if (!transaction) return res.status(404).json({ error: "Không tìm thấy giao dịch" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { sender_id, receiver_id, amount } = req.body;

    if (!sender_id || !receiver_id || !amount)
      return res.status(400).json({ error: "Thiếu thông tin cần thiết" });

    const transaction = await Transaction.create({
      sender_id,
      receiver_id,
      amount,
    });

    const full = await Transaction.findByPk(transaction.id, {
      include: [
        { model: User, as: "Sender", attributes: ["id", "name", "email"] },
        { model: User, as: "Receiver", attributes: ["id", "name", "email"] },
      ],
    });

    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);
    if (!transaction) return res.status(404).json({ error: "Không tìm thấy giao dịch" });

    await transaction.update(req.body);
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);
    if (!transaction) return res.status(404).json({ error: "Không tìm thấy giao dịch" });

    await transaction.destroy();
    res.json({ message: "Đã xóa giao dịch thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
