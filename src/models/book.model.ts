import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Category} from './category.model';
import {Author} from './author.model';
@model()
export class Book extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'number',
    required: true,
  })
  pubDate: number;

  @belongsTo(() => Author)
  authorId: number;

  @belongsTo(() => Category)
  categoryId: number;

  constructor(data?: Partial<Book>) {
    super(data);
  }
}

export interface BookRelations {
  // describe navigational properties here
  author?: Author;
  category?: Category;
}

export type BookWithRelations = Book & BookRelations;
