import { Worker } from 'worker_threads';
import { Book } from '../models/book.model';
import { BookRepository } from '../repositories/book.repository';
import { EventEmitter } from 'events';

export class BookBulkService {
  private emitter = new EventEmitter();

  constructor(private booksRepository: BookRepository) {}

  async bulkUpload(books: Book[]): Promise<{ success: boolean; count: number }> {
    this.emitter.emit('uploadStart');

    return new Promise((resolve, reject) => {
      const worker = new Worker('./dist/service/book-worker.js'); // compiled JS file
      worker.postMessage({ books, bookRepo: this.booksRepository });

      worker.on('message', (result) => {
        this.emitter.emit('uploadComplete', result.count);
        resolve(result);
      });

      worker.on('error', (err) => {
        this.emitter.emit('error', err);
        reject(err);
      });
    });
  }
}
