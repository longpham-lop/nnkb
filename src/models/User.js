import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "user" },
  countryside: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  avatar_url: { type: DataTypes.STRING },
  login_attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: "active" },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export default User;
