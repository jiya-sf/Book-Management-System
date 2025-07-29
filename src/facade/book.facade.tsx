import { BookService } from '../utils/bookService';
import type { BookData, NewBookData } from '../utils/bookInfo';

export class BookFacade {
  private static bookService = new BookService();

  static async getAllBooks(): Promise<BookData[]> {
    return await this.bookService.getBooks();
  }
  static async getBookById(id: number): Promise<BookData> {
    return await this.bookService.getBookById(id);
  }
  static async addBook(data: NewBookData): Promise<BookData> {
    return await this.bookService.addBook(data);
  }
  static async updateBook(id: number, data: NewBookData): Promise<BookData> {
    return await this.bookService.updateBook(id, data);
  }
  static async deleteBook(id: number): Promise<void> {
    return await this.bookService.deleteBook(id);
  }
}
