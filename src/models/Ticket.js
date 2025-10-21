import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Event from "./Event.js";

const Ticket = sequelize.define("Ticket", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Event,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  sold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  sale_start: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  sale_end: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  seat_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "tickets",
  timestamps: false,
});

// Quan hệ
Event.hasMany(Ticket, { foreignKey: "event_id" });
Ticket.belongsTo(Event, { foreignKey: "event_id" });

export default Ticket;
