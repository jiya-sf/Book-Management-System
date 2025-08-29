import {Client, expect} from '@loopback/testlab';
import {CategoriesServiceApplication} from '../../application';
import {setupApplication} from '../acceptance/test-helper';
import {Category} from '../../models/category.model';

describe('CategoryController (integration)', () => {
  let app: CategoriesServiceApplication;
  let client: Client;
  let createdCategory: Category;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('POST /categories creates a category', async () => {
    const response = await client
      .post('/categories')
      .send({name: 'Integration Category'})
      .expect(200);

    createdCategory = response.body;
    expect(createdCategory).to.have.property('id');
    expect(createdCategory.name).to.eql('Integration Category');
  });

  it('GET /categories returns array of categories', async () => {
    const response = await client.get('/categories').expect(200);
    expect(response.body).to.be.Array();
    expect(response.body).to.containDeep([createdCategory]);
  });

  it('DELETE /categories/{id} deletes category by id', async () => {
    await client.delete(`/categories/${createdCategory.id}`).expect(204);

    await client.get(`/categories/${createdCategory.id}`).expect(404);
  });

  it('GET /categories/{id}/books returns empty array if no books', async () => {
    const category = await client
      .post('/categories')
      .send({name: 'Bookless Category'})
      .expect(200);

    const response = await client
      .get(`/categories/${category.body.id}/books`)
      .expect(502);
    expect(response.body.error.message).to.eql('Bad Gateway');
  });
});
