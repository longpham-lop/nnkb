import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Event from "./Event.js";

const Favorite = sequelize.define("Favorite", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

User.hasMany(Favorite, { foreignKey: "user_id" });
Favorite.belongsTo(User, { foreignKey: "user_id" });

Event.hasMany(Favorite, { foreignKey: "event_id" });
Favorite.belongsTo(Event, { foreignKey: "event_id" });

export default Favorite;
