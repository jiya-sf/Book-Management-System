import {expect, sinon} from '@loopback/testlab';
import {AuthController} from '../../controllers';
import {UserRepository} from '../../repositories';
import {HttpErrors} from '@loopback/rest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User} from '../../models';

describe('AuthController (unit)', () => {
  let userRepo: sinon.SinonStubbedInstance<UserRepository>;
  let controller: AuthController;

  beforeEach(() => {
    userRepo = sinon.createStubInstance(UserRepository);
    controller = new AuthController(userRepo);
  });

  afterEach(() => {
    sinon.restore();
  });

  // ====== Signup tests ======
  it('registers a new user successfully', async () => {
    userRepo.findOne.resolves(null);
    const hashStub = sinon.stub(bcrypt, 'hash').resolves('hashed123');
    userRepo.create.resolves({id: 1} as User);

    const result = await controller.signup({
      email: 'test@example.com',
      password: 'pass123',
      role: 'user',
    });

    expect(result).to.eql({message: 'User registered successfully'});
    sinon.assert.calledWith(userRepo.findOne, {where: {email: 'test@example.com'}});
    sinon.assert.calledWith(hashStub, 'pass123', 10);
    sinon.assert.calledWith(userRepo.create, {
      email: 'test@example.com',
      password: 'hashed123',
      role: 'user',
    });
  });

  it('signup: throws error if email already exists', async () => {
    userRepo.findOne.resolves({id: 1, email: 'existing@example.com'} as User);

    try {
      await controller.signup({
        email: 'existing@example.com',
        password: 'pass123',
        role: 'user',
      });
      throw new Error('Expected error not thrown');
    } catch (err) {
      expect(err).to.be.instanceOf(HttpErrors.BadRequest);
      expect(err.message).to.equal('Email already registered');
    }
  });

  // ====== Login tests ======
  it('login: logs in successfully and returns a token', async () => {
    const fakeUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'user',
    } as User;

    userRepo.findOne.resolves(fakeUser);
    const compareStub = sinon.stub(bcrypt, 'compare').resolves(true);
    const jwtStub = sinon.stub(jwt, 'sign').returns('fake-jwt-token' as any);

    const result = await controller.login({
      email: 'test@example.com',
      password: 'pass123',
    });

    expect(result).to.eql({token: 'fake-jwt-token'});
    sinon.assert.calledOnce(compareStub);
    sinon.assert.calledOnce(jwtStub);
  });

  it('login: throws Unauthorized if user not found', async () => {
    userRepo.findOne.resolves(null);

    try {
      await controller.login({email: 'missing@example.com', password: 'pass123'});
      throw new Error('Expected error not thrown');
    } catch (err) {
      expect(err).to.be.instanceOf(HttpErrors.Unauthorized);
      expect(err.message).to.equal('Invalid email or password');
    }
  });

  it('login: throws Unauthorized if password does not match', async () => {
    userRepo.findOne.resolves({
      id: 1,
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'user',
    } as User);

    const compareStub = sinon.stub(bcrypt, 'compare').resolves(false);

    try {
      await controller.login({email: 'test@example.com', password: 'wrongpass'});
      throw new Error('Expected error not thrown');
    } catch (err) {
      expect(err).to.be.instanceOf(HttpErrors.Unauthorized);
      expect(err.message).to.equal('Invalid email or password');
    }

    sinon.assert.calledOnce(compareStub);
  });
});














































// import {expect, sinon} from '@loopback/testlab';
// import {AuthController} from '../../controllers';
// import {UserRepository} from '../../repositories';
// import {HttpErrors} from '@loopback/rest';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import {User} from '../../models';

// describe('AuthController (unit)', () => {
//   let userRepo: sinon.SinonStubbedInstance<UserRepository>;
//   let controller: AuthController;

//   beforeEach(() => {
//     userRepo = sinon.createStubInstance(UserRepository);
//     controller = new AuthController(userRepo);
//   });

//   afterEach(() => {
//     sinon.restore();
//   });
// ///for signup
//   it('registers a new user successfully', async () => {
//     userRepo.findOne.resolves(null);
//     const bcryptStub = sinon.stub(bcrypt, 'hash').resolves('hashed123');
//     userRepo.create.resolves({id: 1} as User);
//     const result = await controller.signup({
//       email: 'test@example.com',
//       password: 'pass123',
//       role: 'user',
//     });

//     expect(result).to.eql({message: 'User registered successfully'});
//     sinon.assert.calledWith(userRepo.findOne, {
//       where: {email: 'test@example.com'},
//     });
//     sinon.assert.calledWith(bcryptStub, 'pass123', 10);
//     sinon.assert.calledWith(userRepo.create, {
//       email: 'test@example.com',
//       password: 'hashed123',
//       role: 'user',
//     });
//   });

//   it('signup: throws error if email already exists', async () => {
//     userRepo.findOne.resolves({id: 1, email: 'existing@example.com'} as User);

//     await expect(
//       controller.signup({
//         email: 'existing@example.com',
//         password: 'pass123',
//         role: 'user',
//       }),
//     ).to.be.rejectedWith(HttpErrors.BadRequest, 'Email already registered');
//   });

//   //login
//   it('login: logs in successfully and returns a token', async () => {
//     const fakeUser = {
//       id: 1,
//       email: 'test@example.com',
//       password: 'hashedpassword',
//       role: 'user',
//     } as User;

//     userRepo.findOne.resolves(fakeUser);
//     sinon.stub(bcrypt, 'compare').resolves(true);
//     sinon.stub(jwt, 'sign').returns('fake-jwt-token' as any);

//     const result = await controller.login({
//       email: 'test@example.com',
//       password: 'pass123',
//     });

//     expect(result).to.eql({token: 'fake-jwt-token'});
//     sinon.assert.calledWith(userRepo.findOne, {
//       where: {email: 'test@example.com'},
//     });
//     const compareStub = sinon.stub(bcrypt, 'compare').resolves(true);

//     sinon.assert.calledOnce(compareStub);
//     compareStub.restore();
//     const jwtSignStub = sinon
//       .stub(jwt, 'sign')
//       .returns('fake-jwt-token' as any);
//     sinon.assert.calledOnce(jwtSignStub);
//     jwtSignStub.restore();
//   });

//   it('login: throws Unauthorized if user not found', async () => {
//     userRepo.findOne.resolves(null);

//     await expect(
//       controller.login({email: 'missing@example.com', password: 'pass123'}),
//     ).to.be.rejectedWith(HttpErrors.Unauthorized, 'Invalid email or password');
//   });

//   it('login: throws Unauthorized if password does not match', async () => {
//     userRepo.findOne.resolves({
//       id: 1,
//       email: 'test@example.com',
//       password: 'hashedpassword',
//       role: 'user',
//     } as User);

//     sinon.stub(bcrypt, 'compare').resolves(false);

//     await expect(
//       controller.login({email: 'test@example.com', password: 'wrongpass'}),
//     ).to.be.rejectedWith(HttpErrors.Unauthorized, 'Invalid email or password');
//   });
// });
