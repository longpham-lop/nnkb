import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const RequestLog = sequelize.define(
  "request_logs",
  {
    ip: { type: DataTypes.STRING },
    method: { type: DataTypes.STRING },
    route: { type: DataTypes.STRING },
    user_agent: { type: DataTypes.STRING },
    token: { type: DataTypes.STRING, allowNull: false, defaultValue: "không có" },
  },
  { timestamps: true }
);

export default RequestLog;
