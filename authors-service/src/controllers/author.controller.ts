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
import {Author} from '../models/author.model';
import {AuthorRepository} from '../repositories/author.repository';
import axios from 'axios';
import {LogExecution} from '../decorators/log.decorator';

export class AuthorController {
  constructor(
    @repository(AuthorRepository)
    public authorRepository: AuthorRepository,
  ) {}

  @LogExecution()
  @post('/authors')
  @response(200, {
    description: 'Author model instance',
    content: {'application/json': {schema: getModelSchemaRef(Author)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Author, {
            title: 'NewAuthor',
            exclude: ['id'],
          }),
        },
      },
    })
    author: Omit<Author, 'id'>,
  ): Promise<Author> {
    return this.authorRepository.create(author);
  }

  @LogExecution()
  @get('/authors/count')
  @response(200, {
    description: 'Author model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Author) where?: Where<Author>): Promise<Count> {
    return this.authorRepository.count(where);
  }

  @LogExecution()
  @get('/authors')
  @response(200, {
    description: 'Array of Author model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Author, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Author) filter?: Filter<Author>): Promise<Author[]> {
    return this.authorRepository.find(filter);
  }

  @LogExecution()
  @patch('/authors')
  @response(200, {
    description: 'Author PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Author, {partial: true}),
        },
      },
    })
    author: Author,
    @param.where(Author) where?: Where<Author>,
  ): Promise<Count> {
    return this.authorRepository.updateAll(author, where);
  }

  @LogExecution()
  @get('/authors/{id}')
  @response(200, {
    description: 'Author model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Author, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Author, {exclude: 'where'})
    filter?: FilterExcludingWhere<Author>,
  ): Promise<Author> {
    return this.authorRepository.findById(id, filter);
  }

  @LogExecution()
  @patch('/authors/{id}')
  @response(204, {
    description: 'Author PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Author, {partial: true}),
        },
      },
    })
    author: Author,
  ): Promise<void> {
    await this.authorRepository.updateById(id, author);
  }

  @LogExecution()
  @put('/authors/{id}')
  @response(204, {
    description: 'Author PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() author: Author,
  ): Promise<void> {
    await this.authorRepository.replaceById(id, author);
  }

  @LogExecution()
  @del('/authors/{id}')
  @response(204, {
    description: 'Author DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.authorRepository.deleteById(id);
  }
  @LogExecution()
  @get('/authors/{id}/books')
  @response(200, {
    description: 'Books for a given Author',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {type: 'object'}, // Or define a Book interface for precise typing
        },
      },
    },
  })
  async getBooksForAuthor(@param.path.number('id') id: number): Promise<any[]> {
    await this.authorRepository.findById(id);
    try {
      const response = await axios.get(
        `http://localhost:3001/books?authorId=${id}`,
      );
      return response.data;
    } catch (error) {
      return [];
    }
  }
}
