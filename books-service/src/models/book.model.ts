import {belongsTo, Entity, model, property} from '@loopback/repository';
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

  @property({
    type: 'number',
    required: true,
  })
  authorId: number;   

  @property({
    type: 'number',
    required: true,
  })
  categoryId: number;

  constructor(data?: Partial<Book>) {
    super(data);
  }
}

export interface BookRelations {
}

export type BookWithRelations = Book & BookRelations;
