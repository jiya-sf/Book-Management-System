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
    jsonSchema: {
      minLength: 1,
      maxLength: 255,
      pattern: '^[a-zA-Z0-9 ]+$',
    },
  })
  title: string;

  // @property({
  //   type: 'number',
  //   required: true,
  //   jsonSchema: {
  //     minimum: 1900,
  //     maximum: new Date().getFullYear(),
  //   },
  // })
  // pubDate: number;
@property({
    type: 'string',
    required: true,
  })
  pubDate: string;

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

    @property({
    type: 'number',
    required: true,
  })
  isbn: number;

    @property({
    type: 'string',
    jsonSchema: {
      enum: ['ebook', 'printed'],
    },
    required: true,
  })
  bookType: string;

@property({
    type: 'string',
  })
  author?: string;

  @property({
    type: 'string',
  })
  genre?: string;
  
  constructor(data?: Partial<Book>) {
    super(data);
  }
}

export interface BookRelations {}

export type BookWithRelations = Book & BookRelations;
