import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Event from "./Event.js";

const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  event_id: { type: DataTypes.INTEGER, allowNull: false },
  total_amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "pending" },
  payment_id: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

Event.hasMany(Order, { foreignKey: "event_id" });
Order.belongsTo(Event, { foreignKey: "event_id" });

export default Order;
