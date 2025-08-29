import {Client, expect} from '@loopback/testlab';
import {AuthorsServiceApplication} from '../../application';
import {setupApplication} from '../acceptance/test-helper';
import {AuthorRepository} from '../../repositories/author.repository';

describe('authorController (E2E)', () => {
  let app: AuthorsServiceApplication;
  let client: Client;
  let authorRepo: AuthorRepository;

  before('setupApplication', async () => {
    const appWithClient = await setupApplication();
    app = appWithClient.app;
    client = appWithClient.client;
    authorRepo = await app.getRepository(AuthorRepository);
  });

  after(async () => {
    await app.stop();
  });
  afterEach(async () => {
    await authorRepo.deleteAll();
  });

  let createdAuthorId: number;

  it('POST /authors will create an author', async () => {
    const response = await client
      .post('/authors')
      .send({name: 'E2E Author'})
      .expect(200);

    createdAuthorId = response.body.id;
    expect(createdAuthorId).to.be.Number();
    expect(response.body.name).to.eql('E2E Author');
  });



  it('DELETE /authors/{id}  deletes author by id', async () => {
    const author = await authorRepo.create({name: 'Delete Author'});

    await client.delete(`/authors/${author.id}`).expect(204);

    await client.get(`/authors/${author.id}`).expect(404);
  });
});
