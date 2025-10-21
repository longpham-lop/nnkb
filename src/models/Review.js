import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Event from "./Event.js";

const Review = sequelize.define("Review", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

Event.hasMany(Review, { foreignKey: "event_id" });
Review.belongsTo(Event, { foreignKey: "event_id" });

export default Review;
