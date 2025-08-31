import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
    private readonly mailService: MailService,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null = null;

    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      console.error(error);
      throw new RequestTimeoutException('Error connecting to database');
    }

    if (existingUser) {
      throw new BadRequestException('Email is already registered.');
    }

    let newUser = this.userRepository.create({
      ...createUserDto,
      passwordHash: await this.hashingProvider.hash(createUserDto.password),
    });

    try {
      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      console.error(error);
      throw new RequestTimeoutException('Error connecting to database');
    }

    try {
      await this.mailService.sendWelcomeEmail(newUser);
    } catch {
      throw new RequestTimeoutException('Error sending welcome email');
    }

    return newUser;
  }
}
