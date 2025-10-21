import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Location = sequelize.define(
  "Location",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    map_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "locations",
    timestamps: true,
  }
);

export default Location;
