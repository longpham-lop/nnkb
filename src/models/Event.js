import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Category from "./Category.js";
import Location from "./Location.js";

const Event = sequelize.define("Event", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  organizer_id: DataTypes.INTEGER,
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  category_id: DataTypes.INTEGER,
  location_id: DataTypes.INTEGER,
  start_date: DataTypes.DATE,
  end_date: DataTypes.DATE,
  cover_image: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: "active",
  },
}, {
  tableName: "events",
  timestamps: true,
});

Event.belongsTo(User, { foreignKey: "organizer_id" });
Event.belongsTo(Category, { foreignKey: "category_id" });
Event.belongsTo(Location, { foreignKey: "location_id" });

export default Event;
