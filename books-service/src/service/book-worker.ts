import {parentPort} from 'worker_threads';
import {BookRepository} from '../repositories/book.repository';
import {Book} from '../models/book.model';
import axios from 'axios';

parentPort?.on(
  'message',
  async (data: {books: Book[]; bookRepo: BookRepository}) => {
    const {books, bookRepo} = data;
    let count = 0;

    // Helper functions (not private, just normal async)
    async function resolveAuthorId(name: string): Promise<number> {
      const res = await axios.get<{id: number; name: string}[]>(
        `http://localhost:3002/authors?filter=${JSON.stringify({where: {name}})}`,
      );
      if (res.data.length > 0) return res.data[0].id;
      const createRes = await axios.post<{id: number; name: string}>(
        'http://localhost:3002/authors',
        {name},
      );
      return createRes.data.id;
    }

    async function resolveCategoryId(genre: string): Promise<number> {
      const res = await axios.get<{id: number; genre: string}[]>(
        `http://localhost:3003/categories?filter=${JSON.stringify({where: {genre}})}`,
      );
      if (res.data.length > 0) return res.data[0].id;
      const createRes = await axios.post<{id: number; genre: string}>(
        'http://localhost:3003/categories',
        {genre},
      );
      return createRes.data.id;
    }

    for (const book of books) {
      const authorId = await resolveAuthorId(book.author ?? 'Unknown Author');
      const categoryId = await resolveCategoryId(book.genre ?? 'Unknown Genre');

      await bookRepo.create({...book, authorId, categoryId});
      count++;
    }

    parentPort?.postMessage({success: true, count});
  },
);
