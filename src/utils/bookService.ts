// src/utils/bookService.ts
import { api } from './api'; 
import type { NewBookData,BookData } from './bookInfo';

export class BookService {
  // get all books
  async getBooks(): Promise<BookData[]> {
    const response = await api.get('/api/books');
    return response.data;
  }

  // get book by ID
  async getBookById(id: number): Promise<BookData> {
    const response = await api.get(`/api/books/${id}`);
    return response.data;
  }

  // adding
  async addBook(bookData: NewBookData): Promise<BookData> {
    const response = await api.post('/api/books', bookData);
    return response.data;
  }

  // update an existing book
  async updateBook(id: number, bookData: NewBookData): Promise<BookData> {
    const response = await api.put(`/api/books/${id}`,  bookData);
    return response.data;
  }
  //delete book by id
  async deleteBook(id: number): Promise<void> {
    await api.delete(`/api/books/${id}`);
  }
}

