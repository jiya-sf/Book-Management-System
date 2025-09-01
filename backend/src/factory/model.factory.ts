import { BookModel } from "../models/book.model";
import { AuthorModel } from "../models/author.model";
import { CategoryModel } from "../models/category.model";

export class ModelFactory {
  static async create(model: string, data: any) {
    switch (model) {
      case "book":
        const author = await AuthorModel.findByPk(data.author_id);
        if (!author) throw new Error("Author not found");
        const category = await CategoryModel.findByPk(data.category_id);
        if (!category) throw new Error("Category not found");
        return BookModel.create(data);

      case "author":
        return AuthorModel.create(data);

      case "category":
        return CategoryModel.create(data);

      default:
        throw new Error("Unknown model type");
    }
  }
}
