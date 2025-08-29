import {Client, expect} from '@loopback/testlab';
import {BooksServiceApplication} from '../../application';
import {BookRepository} from '../../repositories/book.repository';
import {setupApplication, AppWithClient} from '../acceptance/test-helper';

describe('bookController (E2E)', () => {
  let app: BooksServiceApplication;
  let client: Client;
  let bookRepo: BookRepository;
  let appWithClient: AppWithClient;

  before('setupApplication', async () => {
    appWithClient = await setupApplication();
    app = appWithClient.app;
    client = appWithClient.client;
    bookRepo = await app.getRepository(BookRepository);
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    await bookRepo.deleteAll();
  });

  it('creates a book with existing author/category', async () => {
    const res = await client
      .post('/books')
      .send({
        title: 'E2E Book',
        pubDate: '2025-08-26',
        isbn: 99999,
        bookType: 'printed',
        author: 'John',     
        genre: 'Fiction',  
      })
      .expect(200);
    expect(res.body).to.containEql({title: 'E2E Book'});
    const stored = await bookRepo.findById(res.body.id);
    expect(stored).to.containEql({title: 'E2E Book'});
  });

  it('creates a book with new author/category', async () => {
    const res = await client
      .post('/books')
      .send({
        title: 'e2e New Author Book',
        pubDate: '2025-08-26',
        isbn: 88888,
        bookType: 'ebook',
        author: 'New Author',  
        genre: 'New Genre',    
      })
      .expect(200);

    expect(res.body.title).to.equal('e2e New Author Book');
  });
});
