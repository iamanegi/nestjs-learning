import {
  BadRequestException,
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

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(userConfig.KEY)
    private readonly userConfiguration: ConfigType<typeof userConfig>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null = null;

    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch {
      throw new RequestTimeoutException('Error connecting to database');
    }

    if (existingUser) {
      throw new BadRequestException('Email is already registered.');
    }

    let newUser = this.userRepository.create(createUserDto);
    try {
      newUser = await this.userRepository.save(newUser);
    } catch {
      throw new RequestTimeoutException('Error connecting to database');
    }
    return newUser;
  }

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const isAuthenticated = this.authService.isAuthenticated();
    console.log(getUsersParamDto, limit, page, isAuthenticated);
    const secret = this.userConfiguration.apiKey;
    console.log(secret);
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
      {
        id: 2,
        name: 'Alice Smith',
        email: 'alice.smith@example.com',
      },
    ];
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
}
