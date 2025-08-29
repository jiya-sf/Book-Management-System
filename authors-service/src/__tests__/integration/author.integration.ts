import {Client, expect} from '@loopback/testlab';
import {AuthorsServiceApplication} from '../../application';
import {setupApplication} from '../acceptance/test-helper';
import {Author} from '../../models/author.model';

describe('AuthorController (integration)', () => {
  let app: AuthorsServiceApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  let createdAuthor: Author;

  it('POST /authors creates an author', async () => {
    const response = await client
      .post('/authors')
      .send({name: 'Integration Author'})
      .expect(200);

    createdAuthor = response.body;
    expect(createdAuthor).to.have.property('id');
    expect(createdAuthor.name).to.eql('Integration Author');
  });

  it('GET /authors returns array of authors', async () => {
    const response = await client.get('/authors').expect(200);
    expect(response.body).to.be.Array();
    expect(response.body).to.containEql(createdAuthor);
  });

  it('GET /authors/{id} returns author by id', async () => {
    const response = await client
      .get(`/authors/${createdAuthor.id}`)
      .expect(200);

    expect(response.body).to.eql(createdAuthor);
  });

  it('DELETE /authors/{id} → deletes author by id', async () => {
    await client.delete(`/authors/${createdAuthor.id}`).expect(204);

    await client.get(`/authors/${createdAuthor.id}`).expect(404);
  });
});
