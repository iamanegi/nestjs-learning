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

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DataSource, useClass: jest.fn() },
        { provide: getRepositoryToken(User), useClass: jest.fn() },
        { provide: AuthService, useClass: jest.fn() },
        { provide: CreateUserProvider, useClass: jest.fn() },
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
});
