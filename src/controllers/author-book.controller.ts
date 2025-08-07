import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Author,
  Book,
} from '../models';
import {AuthorRepository} from '../repositories';

export class AuthorBookController {
  constructor(
    @repository(AuthorRepository) protected authorRepository: AuthorRepository,
  ) { }

  @get('/authors/{id}/books', {
    responses: {
      '200': {
        description: 'Array of Author has many Book',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Book)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Book>,
  ): Promise<Book[]> {
    return this.authorRepository.books(id).find(filter);
  }

  @post('/authors/{id}/books', {
    responses: {
      '200': {
        description: 'Author model instance',
        content: {'application/json': {schema: getModelSchemaRef(Book)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Author.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {
            title: 'NewBookInAuthor',
            exclude: ['id'],
            optional: ['authorId']
          }),
        },
      },
    }) book: Omit<Book, 'id'>,
  ): Promise<Book> {
    return this.authorRepository.books(id).create(book);
  }

  @patch('/authors/{id}/books', {
    responses: {
      '200': {
        description: 'Author.Book PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {partial: true}),
        },
      },
    })
    book: Partial<Book>,
    @param.query.object('where', getWhereSchemaFor(Book)) where?: Where<Book>,
  ): Promise<Count> {
    return this.authorRepository.books(id).patch(book, where);
  }

  @del('/authors/{id}/books', {
    responses: {
      '200': {
        description: 'Author.Book DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Book)) where?: Where<Book>,
  ): Promise<Count> {
    return this.authorRepository.books(id).delete(where);
  }
}
