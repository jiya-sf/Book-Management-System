import {Client, expect} from '@loopback/testlab';
import {Lb4Application} from '../../application';
import {UserRepository} from '../../repositories';
import {setupApplication, AppWithClient} from '../acceptance/test-helper';

describe('AuthController (integration)', () => {
  let app: Lb4Application;
  let client: Client;
  let userRepo: UserRepository;
  let appWithClient: AppWithClient;

  before('setupApplication', async () => {
    appWithClient = await setupApplication();
    app = appWithClient.app;
    client = appWithClient.client;
    userRepo = await app.getRepository(UserRepository);
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    await userRepo.deleteAll(); // clear users before each test
  });

  it('POST /signup → registers a new user', async () => {
    const res = await client
      .post('/signup')
      .send({
        email: 'test@example.com',
        password: 'password123',
        role: 'admin',
      })
      .expect(200);

    expect(res.body).to.containEql({
      message: 'User registered successfully',
    });

    const storedUser = await userRepo.findOne({where: {email: 'test@example.com'}});
    expect(storedUser).to.not.be.null();
    expect(storedUser?.password).to.not.equal('password123'); // hashed
  });

  it('POST /signup → fails if email exists', async () => {
    await userRepo.create({
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'admin',
    });

    await client
      .post('/signup')
      .send({
        email: 'test@example.com',
        password: 'password123',
        role: 'admin',
      })
      .expect(400);
  });

  it('POST /login → returns JWT for valid credentials', async () => {
    // First, create a user
    await client.post('/signup').send({
      email: 'test@example.com',
      password: 'password123',
      role: 'admin',
    });

    const res = await client
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(res.body.token).to.be.a.String();
    expect(res.body.token.length).to.be.greaterThan(10);
  });

  it('POST /login → fails for invalid password', async () => {
    await client.post('/signup').send({
      email: 'test@example.com',
      password: 'password123',
      role: 'admin',
    });

    await client
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
      .expect(401);
  });

  it('POST /login → fails for non-existing user', async () => {
    await client
      .post('/login')
      .send({
        email: 'notfound@example.com',
        password: 'password123',
      })
      .expect(401);
  });
});
