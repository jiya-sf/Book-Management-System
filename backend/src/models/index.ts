import { sequelize } from '../config/db';
import { AuthorModel } from './author.model';
import { BookModel } from './book.model';
import { CategoryModel } from './category.model';

// AuthorModel.hasMany(BookModel, { foreignKey: 'author_id', as: 'books' });
// CategoryModel.hasMany(BookModel, { foreignKey: 'category_id', as: 'books' });

// BookModel.belongsTo(AuthorModel, { foreignKey: 'author_id', as: 'author' });
// BookModel.belongsTo(CategoryModel, { foreignKey: 'category_id', as: 'category' });

AuthorModel.hasMany(BookModel, { foreignKey: 'author_id', as: 'Books' });
BookModel.belongsTo(AuthorModel, { foreignKey: 'author_id', as: 'Author' });

CategoryModel.hasMany(BookModel, { foreignKey: 'category_id', as: 'Books' });
BookModel.belongsTo(CategoryModel, { foreignKey: 'category_id', as: 'Category' });


export {
  sequelize,
  AuthorModel,
  BookModel,
  CategoryModel,
};
