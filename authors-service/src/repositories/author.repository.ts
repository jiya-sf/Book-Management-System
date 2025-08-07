import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources/db.datasource';
import {Author, AuthorRelations} from '../models/author.model';

export class AuthorRepository extends DefaultCrudRepository<
  Author,
  typeof Author.prototype.id,
  AuthorRelations
> {


  constructor(
    @inject('datasources.db') dataSource: DbDataSource, 
  ) {
    super(Author, dataSource);
  }
}
