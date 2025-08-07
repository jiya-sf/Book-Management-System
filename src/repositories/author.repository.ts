import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Author, AuthorRelations, Book} from '../models';
import {BookRepository} from './book.repository';

export class AuthorRepository extends DefaultCrudRepository<
  Author,
  typeof Author.prototype.id,
  AuthorRelations
> {

  public readonly books: HasManyRepositoryFactory<Book, typeof Author.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('BookRepository') protected bookRepositoryGetter: Getter<BookRepository>,
  ) {
    super(Author, dataSource);
    this.books = this.createHasManyRepositoryFactoryFor('books', bookRepositoryGetter,);
    this.registerInclusionResolver('books', this.books.inclusionResolver);
  }
}
