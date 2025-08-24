import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SingInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    const user = await this.usersService.fineOneByEmail(signInDto.email);

    if (user?.passwordHash === undefined) {
      throw new BadRequestException(
        'User has no password set, please sign in with Google',
      );
    }

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

    return await this.generateTokensProvider.generateTokens(user);
  }
}
