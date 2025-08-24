import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { AuthService } from 'src/auth/auth.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { ConfigType } from '@nestjs/config';
import userConfig from './config/user.config';
import { CreateUserProvider } from './provider/create-user.provider';
import { FindOneUserByEmailProvider } from './provider/find-one-user-by-email.provider';
import { FindOneUserByGoogleIdProvider } from './provider/find-one-user-by-google-id.provider';
import { CreateGoogleUserProvider } from './provider/create-google-user.provider';
import { GoogleUser } from './interfaces/google-user.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(userConfig.KEY)
    private readonly userConfiguration: ConfigType<typeof userConfig>,
    private readonly createUserProvider: CreateUserProvider,
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
    private readonly findOneUserByGoogleIdProvider: FindOneUserByGoogleIdProvider,
    private readonly createGoogleUserProvider: CreateGoogleUserProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    return this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  public async findOneById(id: number) {
    let user: User | null = null;
    try {
      user = await this.userRepository.findOneBy({ id: id });
    } catch {
      throw new RequestTimeoutException('Error connecting to database');
    }
    if (!user) {
      throw new NotFoundException('User not found with specified id.');
    }
    return user;
  }

  public async fineOneByEmail(email: string) {
    return this.findOneUserByEmailProvider.execute(email);
  }

  public async findOneByGoogleId(googleId: string) {
    return this.findOneUserByGoogleIdProvider.execute(googleId);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    return this.createGoogleUserProvider.createGoogleUser(googleUser);
  }
}
