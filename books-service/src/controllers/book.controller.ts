import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Book} from '../models/book.model';
import {BookRepository} from '../repositories/book.repository';
import axios from 'axios';
import {LogExecution} from '../decorators/log.decorator';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class BookController {
  constructor(
    @repository(BookRepository)
    public bookRepository: BookRepository,
  ) {}

  @LogExecution()
  @post('/books')
  @response(200, {
    description: 'Book model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(Book)},
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'title',
              'pubDate',
              'isbn',
              'bookType',
              'author',
              'genre',
            ],
            properties: {
              title: {type: 'string'},
              pubDate: {type: 'string'},
              isbn: {type: 'number'},
              bookType: {type: 'string', enum: ['ebook', 'printed']},
              author: {type: 'string'}, 
              genre: {type: 'string'}, 
            },
            additionalProperties: true, 
          },
        },
      },
    })
    bookData: any,
  ): Promise<Book> {
    const authorId = await this.getAuthorIdByName(bookData.author);

    const categoryId = await this.getCategoryIdByName(bookData.genre);

    const bookToCreate: Partial<Book> = {
      title: bookData.title,
      pubDate: bookData.pubDate,
      isbn: bookData.isbn,
      bookType: bookData.bookType,
      authorId,
      categoryId,
    };

    //Save in books DB
    return this.bookRepository.create(bookToCreate);
  }

  private async getAuthorIdByName(name: string): Promise<number> {
    try {
      const searchUrl = `http://localhost:3002/authors?filter=${encodeURIComponent(JSON.stringify({where: {name}}))}`;
          type AuthorResponse = { id: number; name: string }[];
      const searchRes = await axios.get<AuthorResponse>(searchUrl);

      if (searchRes.data.length > 0) {
        return searchRes.data[0].id;
      }

      const createRes = await axios.post<{ id: number }>('http://localhost:3002/authors', {
        name,
      });
      return createRes.data.id;
    } catch (err) {
      console.error('Error resolving author ID:', err.message);
      throw new Error('Failed to resolve or create author');
    }
  }

  private async getCategoryIdByName(genre: string): Promise<number> {
    try {
      const searchUrl = `http://localhost:3003/categories?filter=${encodeURIComponent(JSON.stringify({where: {genre}}))}`;
      type CategoryResponse = { id: number; genre: string }[];
      const searchRes = await axios.get<CategoryResponse>(searchUrl);

      if (searchRes.data.length > 0) {
        return searchRes.data[0].id;
      }
      const createRes = await axios.post<{ id: number }>('http://localhost:3003/categories', {
        genre,
      });
      return createRes.data.id;
    } catch (err) {
      console.error('Error resolving category ID:', err.message);
      throw new Error('Failed to resolve or create category');
    }
  }

  @LogExecution()
  @get('/books/count')
  @response(200, {
    description: 'Book model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Book) where?: Where<Book>): Promise<Count> {
    return this.bookRepository.count(where);
  }

  @LogExecution()
  @get('/books')
  @response(200, {
    description: 'Array of Book model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Book, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Book) filter?: Filter<Book>): Promise<any[]> {
    const books = await this.bookRepository.find(filter);

    const results = await Promise.all(
      books.map(async book => {
        let authorName = null;
        let categoryName = null;
        try {
          const authorResp = await axios.get<{ name: string }>(
            `http://localhost:3002/authors/${book.authorId}`,
          );
          authorName = authorResp.data?.name || null;
        } catch {}

        try {
          const categoryResp = await axios.get<{ genre: string }>(
            `http://localhost:3003/categories/${book.categoryId}`,
          );
          categoryName = categoryResp.data?.genre || null;
        } catch {}
        return {
          ...book,
          author: authorName,
          genre: categoryName,
        };
      }),
    );

    return results;
  }

  @LogExecution()
  @patch('/books')
  @response(200, {
    description: 'Book patch success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {partial: true}),
        },
      },
    })
    book: Book,
    @param.where(Book) where?: Where<Book>,
  ): Promise<Count> {
    return this.bookRepository.updateAll(book, where);
  }

  @LogExecution()
  @get('/books/{id}')
  @response(200, {
    description: 'Book model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Book, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Book, {exclude: 'where'}) filter?: FilterExcludingWhere<Book>,
  ): Promise<Book> {
    return this.bookRepository.findById(id, filter);
  }

  @LogExecution()
  @patch('/books/{id}')
  @response(204, {
    description: 'Book patch success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {partial: true}),
        },
      },
    })
    book: Book,
  ): Promise<void> {
    await this.bookRepository.updateById(id, book);
  }

  @LogExecution()
  @put('/books/{id}')
  @response(204, {
    description: 'Book put success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() book: Book,
  ): Promise<void> {
    await this.bookRepository.replaceById(id, book);
  }

  @LogExecution()
  @del('/books/{id}')
  @response(204, {
    description: 'Book dleete success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.bookRepository.deleteById(id);
  }

  @LogExecution()
  @get('/books/{id}/details')
  @response(200, {
    description: 'Book model instance with author and category details',
    content: {
      'application/json': {
        schema: {type: 'object'},
      },
    },
  })
  async findByIdWithDetails(@param.path.number('id') id: number): Promise<any> {
    //fetching book
    const book = await this.bookRepository.findById(id);
    const details: any = {...book};

    try {
      const authorResp = await axios.get(
        `http://localhost:3002/authors/${book.authorId}`,
      );
      details.author = authorResp.data;
    } catch (e) {
      details.author = null;
    }

    //fetching category
    try {
      const categoryResp = await axios.get(
        `http://localhost:3003/categories/${book.categoryId}`,
      );
      details.category = categoryResp.data;
    } catch (e) {
      details.category = null;
    }

    return details;
  }
}
