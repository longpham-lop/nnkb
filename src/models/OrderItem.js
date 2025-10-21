import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Order from "./Order.js";
import Ticket from "./Ticket.js";

const OrderItem = sequelize.define("OrderItem", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  ticket_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  unit_price: { type: DataTypes.FLOAT, allowNull: false },
  qr_code: { type: DataTypes.STRING, allowNull: true },
  checked_in: { type: DataTypes.BOOLEAN, defaultValue: false },
});

//quan hệ
OrderItem.belongsTo(Order, { foreignKey: "order_id" });
OrderItem.belongsTo(Ticket, { foreignKey: "ticket_id" });

export default OrderItem;
