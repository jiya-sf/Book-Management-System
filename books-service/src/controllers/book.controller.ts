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

export class BookController {
  constructor(
    @repository(BookRepository)
    public bookRepository: BookRepository,
  ) {}
  @LogExecution()
  @post('/books')
  @response(200, {
    description: 'Book model instance',
    content: {'application/json': {schema: getModelSchemaRef(Book)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {
            title: 'NewBook',
            exclude: ['id'],
          }),
        },
      },
    })
    book: Omit<Book, 'id'>,
  ): Promise<Book> {
    return this.bookRepository.create(book);
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
    description: 'Array of Book model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Book, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Book) filter?: Filter<Book>): Promise<Book[]> {
    return this.bookRepository.find(filter);
  }

  @LogExecution()
  @patch('/books')
  @response(200, {
    description: 'Book PATCH success count',
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
    description: 'Book PATCH success',
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
    description: 'Book PUT success',
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
    description: 'Book DELETE success',
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
    // fetching book
    const book = await this.bookRepository.findById(id);
    const details: any = {...book};

    // 2. fetching author from author-services
    try {
      const authorResp = await axios.get(
        `http://localhost:3002/authors/${book.authorId}`,
      );
      details.author = authorResp.data;
    } catch (e) {
      details.author = null;
    }

    // 3. Fetching category
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
