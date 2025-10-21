import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Order from "./Order.js";

const Payment = sequelize.define("Payment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  method: { type: DataTypes.STRING, allowNull: false }, // "vnpay" | "momo" | "cash"
  status: { type: DataTypes.STRING, defaultValue: "pending" },
  transaction_code: { type: DataTypes.STRING },
  paid_at: { type: DataTypes.DATE },
  total_paid: { type: DataTypes.FLOAT, allowNull: false },
});

Order.hasOne(Payment, { foreignKey: "order_id" });
Payment.belongsTo(Order, { foreignKey: "order_id" });

export default Payment;
