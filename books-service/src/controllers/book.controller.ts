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
import {BookBulkService} from '../service/bulk.service';
import {AuthorRepository} from '../repositories/author.repository';
import {CategoryRepository} from '../repositories/category.repository';

interface BookWithDetails extends Book {
  author?: string;
  genre?: string;
}
interface BookUpload {
  title: string;
  pubDate: string;
  isbn: number;
  bookType: 'ebook' | 'printed';
  author: string;
  genre: string;
}

@authenticate('jwt')
export class BookController {
  constructor(
    @repository(BookRepository)
    public bookRepository: BookRepository,
    @repository(AuthorRepository) 
    public authorRepository: AuthorRepository,
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
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
    bookData: BookUpload,
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
    const authors = await this.authorRepository.find({where: {name}});
    if (authors.length > 0) return authors[0].id!;
    const newAuthor = await this.authorRepository.create({name});
    return newAuthor.id!;
  }

  private async getCategoryIdByName(name: string): Promise<number> {
    const categories = await this.categoryRepository.find({where: {name}});
    if (categories.length > 0) return categories[0].id!;
    const newCategory = await this.categoryRepository.create({name});
    return newCategory.id!;
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
  async find(
    @param.filter(Book) filter?: Filter<Book>,
  ): Promise<BookWithDetails[]> {
    const books = await this.bookRepository.find(filter);

    return Promise.all(
      books.map(async book => {
        let author: string | undefined;
        let category: string | undefined;
        try {
          const authorResp = await axios.get<{name: string}>(
            `http://localhost:3002/authors/${book.authorId}`,
          );
          author = authorResp.data?.name ?? undefined;
        } catch {}

        try {
          const categoryResp = await axios.get<{genre: string}>(
            `http://localhost:3003/categories/${book.categoryId}`,
          );
          category = categoryResp.data?.genre ?? undefined;
        } catch {}
        return Object.assign(new Book(), {
          ...book,
          author,
          category,
        }) as BookWithDetails;
      }),
    );
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
  async findByIdWithDetails(
    @param.path.number('id') id: number,
  ): Promise<BookWithDetails> {
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

  @post('/books/bulk-upload')
  async bulkUpload(
    @requestBody({
      description: 'Bulk upload of books with author/genre strings',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: {type: 'string'},
                pubDate: {type: 'string'},
                isbn: {type: 'number'},
                bookType: {type: 'string'},
                author: {type: 'string'},
                genre: {type: 'string'},
              },
            },
          },
        },
      },
    })
    books: Partial<Book>[],
  ) {
    const booksToCreate: Partial<Book>[] = await Promise.all(
      books.map(async book => {
        const authorId = await this.getAuthorIdByName(book.author as string);
        const categoryId = await this.getCategoryIdByName(book.genre as string);

        return {
          title: book.title,
          pubDate: book.pubDate,
          isbn: book.isbn,
          bookType: book.bookType,
          authorId,
          categoryId,
        } as Partial<Book>;
      }),
    );
    return this.bookRepository.createAll(booksToCreate);
  }
}
