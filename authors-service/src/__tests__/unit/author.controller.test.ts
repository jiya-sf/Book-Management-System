import {expect, sinon} from '@loopback/testlab';
import {AuthorController} from '../../controllers';
import {AuthorRepository} from '../../repositories/author.repository';
import {Author} from '../../models/author.model';
import axios from 'axios';

describe('AuthorController (unit)', () => {
  let authorRepo: sinon.SinonStubbedInstance<AuthorRepository>;
  let controller: AuthorController;

  beforeEach(() => {
    authorRepo = sinon.createStubInstance(AuthorRepository);
    controller = new AuthorController(authorRepo);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('creates an author', async () => {
    const authorData = {name: 'Test Author'} as Author;
    authorRepo.create.resolves({...authorData, id: 1} as Author);

    const result = await controller.create(authorData);

    expect(result).to.deepEqual({id: 1, name: 'Test Author'});
    sinon.assert.calledWith(authorRepo.create, authorData);
  });

  it('finds authors', async () => {
    const authors = [{id: 1, name: 'A1'}] as Author[];
    authorRepo.find.resolves(authors);

    const result = await controller.find();
    expect(result).to.eql(authors);
    sinon.assert.calledOnce(authorRepo.find);
  });
  it('deletes author by id', async () => {
    authorRepo.deleteById.resolves();

    await controller.deleteById(5);
    sinon.assert.calledWith(authorRepo.deleteById, 5);
  });


});
