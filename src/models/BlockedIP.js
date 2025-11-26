// src/models/BlockedIP.js
import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const BlockedIP = sequelize.define(
  "blocked_ips",
  {
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default BlockedIP;
