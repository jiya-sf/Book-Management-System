import {post, requestBody, HttpErrors} from '@loopback/rest';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  //signup
  @post('/signup')
  async signup(
    @requestBody({
      description: 'User signup data',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password', 'role'],
            properties: {
              email: {type: 'string'},
              password: {type: 'string'},
              role: {type: 'string'},
            },
          },
        },
      },
    })
    newUser: { email: string; password: string; role: string },

    // newUser: Omit<User, 'id'>,
  ): Promise<{message: string}> {
    const existing = await this.userRepository.findOne({
      where: {email: newUser.email},
    });
    if (existing) {
      throw new HttpErrors.BadRequest('Email already registered');
    }

    //hash pwd
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    await this.userRepository.create({
      ...newUser,
      password: hashedPassword,
    });

    return {message: 'User registered successfully'};
  }

  // login
  @post('/login')
  async login(
    @requestBody({
      description: 'User login credentials',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {type: 'string'},
              password: {type: 'string'},
            },
          },
        },
      },
    })
    credentials: {
      email: string;
      password: string;
    },
  ): Promise<{token: string}> {
    const user = await this.userRepository.findOne({
      where: {email: credentials.email},
    });
    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid email or password');
    }

    // comparing password
    const passwordMatched = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Invalid email or password');
    }

    // generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'changeme'
    );
    console.log(token);
    return {token};
  }
}
