import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateGoogleUserProvider } from './provider/create-google-user.provider';
import { AuthService } from 'src/auth/auth.service';
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { CreateUserProvider } from './provider/create-user.provider';
import { FindOneUserByEmailProvider } from './provider/find-one-user-by-email.provider';
import { FindOneUserByGoogleIdProvider } from './provider/find-one-user-by-google-id.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const mockCreateUserProvider: Partial<CreateUserProvider> = {
      createUser: (createUserDto: CreateUserDto) =>
        Promise.resolve({
          id: 12,
          firstName: createUserDto.firstName ?? '',
          lastName: createUserDto.lastName ?? '',
          email: createUserDto.email,
          posts: [],
        }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DataSource, useClass: jest.fn() },
        { provide: getRepositoryToken(User), useClass: jest.fn() },
        { provide: AuthService, useClass: jest.fn() },
        { provide: CreateUserProvider, useValue: mockCreateUserProvider },
        { provide: FindOneUserByEmailProvider, useClass: jest.fn() },
        { provide: FindOneUserByGoogleIdProvider, useClass: jest.fn() },
        { provide: CreateGoogleUserProvider, useClass: jest.fn() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should be defined', () => {
      expect(service.createUser.bind(service)).toBeDefined();
    });

    it('should call createUser on createUserProvider', async () => {
      const user = await service.createUser({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@gmail.com',
        password: 'password',
      });
      expect(user.firstName).toEqual('John');
    });
  });
});
