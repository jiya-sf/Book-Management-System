import {expect, sinon} from '@loopback/testlab';
import {BookController} from '../../controllers';
import {BookRepository} from '../../repositories/book.repository';
import axios from 'axios';

describe('BookController (unit)', () => {
  let bookRepo: sinon.SinonStubbedInstance<BookRepository>;
  let controller: BookController;

  beforeEach(() => {
    bookRepo = sinon.createStubInstance(BookRepository);
    controller = new BookController(bookRepo);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('creates a book when author and category exist', async () => {
    const axiosGetStub = sinon.stub(axios, 'get');
     const fakeAuthorResponse: any = {
      data: [{ id: 1 }],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    const fakeCategoryResponse: any = {
      data: [{ id: 3 }],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
        axiosGetStub.onCall(0).resolves(fakeAuthorResponse);
    axiosGetStub.onCall(1).resolves(fakeCategoryResponse);

    bookRepo.create.resolves({
      id: 1,
      title: 'Test Book',
      authorId: 1,
      categoryId: 3,
    } as any);

    const result = await controller.create({
      title: 'Test Book',
      pubDate: '2025-08-14',
      isbn: 12345,
      bookType: 'printed',
      author: 'John',
      genre: 'Fiction',
    });

    expect(result).to.containEql({
      title: 'Test Book',
      authorId: 1,
      categoryId: 3,
    });
    sinon.assert.calledOnce(bookRepo.create);
  });

  it('creates a book when author does not exist', async () => {
    const axiosGetStub = sinon.stub(axios, 'get');
    const axiosPostStub = sinon.stub(axios, 'post');
const fakeAuthorNotFoundResponse: any = {
      data: [],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    const fakeCategoryResponse: any = {
      data: [{ id: 3 }],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    const fakeAuthorCreateResponse: any = {
      data: { id: 2 },
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    };

    axiosGetStub.onCall(0).resolves(fakeAuthorNotFoundResponse);
    axiosGetStub.onCall(1).resolves(fakeCategoryResponse);
    axiosPostStub
      .withArgs('http://localhost:3002/authors', sinon.match.any)
      .resolves(fakeAuthorCreateResponse);
    bookRepo.create.resolves({
      id: 2,
      title: 'New Author Book',
      authorId: 2,
      categoryId: 3,
    } as any);

    const result = await controller.create({
      title: 'New Author Book',
      pubDate: '2025-08-15',
      isbn: 67890,
      bookType: 'ebook',
      author: 'New Author',
      genre: 'Fiction',
    });

    expect(result).to.containEql({
      title: 'New Author Book',
      authorId: 2,
      categoryId: 3,
    });
    sinon.assert.calledOnce(bookRepo.create);
    sinon.assert.calledWith(axiosPostStub, 'http://localhost:3002/authors', {
      name: 'New Author',
    });
  });
});
