import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const CategoryModel = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "Categories",
    timestamps: true,
  },
);
