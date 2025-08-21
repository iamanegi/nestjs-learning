import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/users.service';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SingInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    const user = await this.usersService.fineOneByEmail(signInDto.email);

    let isPasswordCorrect: boolean = false;

    try {
      isPasswordCorrect = await this.hashingProvider.compare(
        signInDto.password,
        user.passwordHash,
      );
    } catch (error) {
      console.error(error);
      throw new RequestTimeoutException('Failed to compare passwords');
    }

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Incorrect password');
    }

    return true;
  }
}
