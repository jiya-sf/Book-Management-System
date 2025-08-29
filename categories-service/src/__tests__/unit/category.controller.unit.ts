import {expect, sinon} from '@loopback/testlab';
import {CategoryController} from '../../controllers';
import {CategoryRepository} from '../../repositories/category.repository';
import {Category} from '../../models/category.model';
import axios from 'axios';
import {HttpErrors} from '@loopback/rest';

describe('CategoryController(unit)', () => {
  let categoryRepo: sinon.SinonStubbedInstance<CategoryRepository>;
  let controller: CategoryController;

  beforeEach(() => {
    categoryRepo = sinon.createStubInstance(CategoryRepository);
    controller = new CategoryController(categoryRepo);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('creates a category :success ', async () => {
    const categoryData = {name: ' Books '} as Omit<Category, 'id'>;
    categoryRepo.create.resolves({id: 1, name: 'Books'} as Category);

    const result = await controller.create(categoryData);

    expect(result).to.deepEqual({id: 1, name: 'Books'});
    sinon.assert.calledWith(categoryRepo.create, {name: 'Books'});
  });

  it('throws error when category name is missing', async () => {
    await expect(controller.create({name: ''} as any)).to.be.rejectedWith(
      HttpErrors.BadRequest,
    );
    await expect(controller.create({name: '   '} as any)).to.be.rejectedWith(
      HttpErrors.BadRequest,
    );
    await expect(controller.create({} as any)).to.be.rejectedWith(
      HttpErrors.BadRequest,
    );
  });
  
  it('deletes a category by id', async () => {
    categoryRepo.deleteById.resolves();
    await controller.deleteById(7);
    sinon.assert.calledWith(categoryRepo.deleteById, 7);
  });

  describe('getBooksForCategory()', () => {
    it('returns books for category when call succeeds', async () => {
      categoryRepo.findById.resolves({id: 1, name: 'Fiction'} as Category);
      const axiosStub = sinon.stub(axios, 'get').resolves({
        data: [
          {bookId: 15, title: 'Book Title 1', categoryId: 1},
          {bookId: 16, title: 'Book Title 2', categoryId: 1},
        ],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {url: 'http://localhost:3001/books?categoryId=1'},
      });
      const result = await controller.getBooksForCategory(1);
      expect(result).to.eql([
        {bookId: 15, title: 'Book Title 1', categoryId: 1},
        {bookId: 16, title: 'Book Title 2', categoryId: 1},
      ]);
      sinon.assert.calledWith(categoryRepo.findById, 1);
      sinon.assert.calledWith(
        axiosStub,
        'http://localhost:3001/books?categoryId=1',
        {timeout: 5000},
      );
    });

    it('throws NotFound if category isnt found', async () => {
      categoryRepo.findById.rejects(
        new HttpErrors.NotFound('Category not found'),
      );
      await expect(controller.getBooksForCategory(999)).to.be.rejectedWith(
        HttpErrors.NotFound,
      );
    });
  });
});
