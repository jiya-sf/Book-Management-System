import { BookModel, AuthorModel, CategoryModel } from "../models";
import { ModelFactory } from "../factory/model.factory";

export class BookFacade {
  static async create(data: any) {
    const [author] = await AuthorModel.findOrCreate({
      where: { name: data.author },
    });
    const [category] = await CategoryModel.findOrCreate({
      where: { name: data.genre },
    });

    const book = await ModelFactory.create("book", {
      ...data,
      author_id: author.get("id"),
      category_id: category.get("id"),
    });
    return book;
  }

  static async getAllBooks() {
    return await BookModel.findAll({
      include: [
        { model: AuthorModel, as: "Author", attributes: ["id", "name"] },
        { model: CategoryModel, as: "Category", attributes: ["id", "name"] },
      ],
    });
  }

  static async getBookById(id: string) {
    return await BookModel.findByPk(id, {
      include: [
        { model: AuthorModel, as: "Author", attributes: ["id", "name"] },
        { model: CategoryModel, as: "Category", attributes: ["id", "name"] },
      ],
    });
  }

  static async updateBook(id: string, data: any) {
    const book = await BookModel.findByPk(id);
    if (!book) return null;
    await book.update(data);
    return book;
  }

  static async deleteBook(id: string) {
    const book = await BookModel.findByPk(id);
    if (!book) return null;
    await book.destroy();
    return book;
  }
}
