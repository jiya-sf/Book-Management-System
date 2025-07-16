import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { AuthorModel } from './author.model';
import { CategoryModel } from './category.model';

export const BookModel = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },title: {
    type: DataTypes.STRING(200),
    allowNull:false,
  },isbn: {
    type: DataTypes.BIGINT,
    allowNull:false,
},pubDate: {
    type: DataTypes.DATE,
    allowNull:false,
  },bookType: {
    type: DataTypes.ENUM('ebook', 'printed'),
  },author_id: {
    type: DataTypes.INTEGER, allowNull: false,
     references: {
      model: AuthorModel, key: 'id',
    },
  },category_id: {
    type: DataTypes.INTEGER,allowNull: false,    references: {
      model: CategoryModel,key: 'id',
    },
  },
},
{
  tableName: 'Book'
});
