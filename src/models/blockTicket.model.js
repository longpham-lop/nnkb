import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // file export instance Sequelize
import Order from "./Order.js";
import Ticket from "./Ticket.js";

const BlockTicket = sequelize.define("BlockTicket", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ticket_unique_id:{
    type: DataTypes.INTEGER,
    allowNull: false,},
  token_id:{
    type: DataTypes.INTEGER,
    allowNull: false,},
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: "id",
    },
  },
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Ticket,
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  checked_in: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  tx_hash: {
    type: DataTypes.STRING,
  },
  wallet_address: {
    type: DataTypes.STRING,
  },
}, {
  tableName: "block_ticket",
  timestamps: true,
});

Order.hasMany(BlockTicket, { foreignKey: "order_id" });
BlockTicket.belongsTo(Order, { foreignKey: "order_id" });

Ticket.hasMany(BlockTicket, { foreignKey: "ticket_id" });
BlockTicket.belongsTo(Ticket, { foreignKey: "ticket_id" });

export default BlockTicket;
