import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
export const AuthorModel=sequelize.define('Author', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'Author'
});
