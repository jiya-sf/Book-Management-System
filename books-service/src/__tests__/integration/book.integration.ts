import {Client, expect} from '@loopback/testlab';
import {BooksServiceApplication} from '../../application';
import {BookRepository} from '../../repositories/book.repository';
import {setupApplication, AppWithClient} from '../acceptance/test-helper';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('BookController (integration)', () => {
  let app: BooksServiceApplication;
  let client: Client;
  let bookRepo: BookRepository;
  let appWithClient: AppWithClient;
  let mockAxios: MockAdapter;

  before('setupApplication', async () => {
    appWithClient = await setupApplication();
    app = appWithClient.app;
    client = appWithClient.client;
    bookRepo = await app.getRepository(BookRepository);
    mockAxios = new MockAdapter(axios);

    mockAxios.onGet(/localhost:3002\/authors.*/).reply(config => {
      const url = new URL(config.url!);
      const params = url.searchParams;
      const filter = JSON.parse(params.get('filter') || '{}');
      const name = filter.where?.name;

      if (name === 'John') return [200, [{id: 1, name: 'John'}]];
      return [200, []]; // if no author found
    });

    mockAxios.onPost('http://localhost:3002/authors').reply(config => {
      const data = JSON.parse(config.data);
      return [200, {id: 2, name: data.name}];
    });
    mockAxios.onGet(/localhost:3003\/categories.*/).reply(config => {
      const url = new URL(config.url!);
      const params = url.searchParams;
      const filter = JSON.parse(params.get('filter') || '{}');
      const genre = filter.where?.genre;

      if (genre === 'Fiction') return [200, [{id: 1, genre: 'Fiction'}]];
      return [200, []]; // means no category found
    });

    mockAxios.onPost('http://localhost:3003/categories').reply(config => {
      const data = JSON.parse(config.data);
      return [200, {id: 2, genre: data.genre}];
    });
  });

  after(async () => {
    mockAxios.restore();

    await app.stop();
  });

  beforeEach(async () => {
    await bookRepo.deleteAll();
    mockAxios.resetHistory();
  });

  it('POST /books creates a book when author and category exist', async () => {
    const res = await client
      .post('/books')
      .send({
        title: 'Integration Book',
        pubDate: '2025-08-14',
        isbn: 12345,
        bookType: 'printed',
        author: 'John',
        genre: 'Fiction',
      })
      .expect(200);

    expect(res.body).to.containEql({
      title: 'Integration Book',
    });

    const stored = await bookRepo.findById(res.body.id);
    expect(stored).to.containEql({
      title: 'Integration Book',
    });
  });

  it('POST /books  creates a book when author does not exist', async () => {
    const res = await client
      .post('/books')
      .send({
        title: 'Book With New Author',
        pubDate: '2025-08-15',
        isbn: 67890,
        bookType: 'ebook',
        author: 'New Author',
        genre: 'Fiction',
      })
      .expect(200);

    expect(res.body.title).to.equal('Book With New Author');
    const postAuthorsCalls = mockAxios.history.post.filter(
      call => call.url === 'http://localhost:3002/authors',
    );
    expect(postAuthorsCalls.length).to.equal(1);

    const postedData = JSON.parse(postAuthorsCalls[0].data);
    expect(postedData).to.containEql({name: 'New Author'});
  });
});
