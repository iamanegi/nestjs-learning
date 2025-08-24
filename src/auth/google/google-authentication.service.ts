import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { UsersService } from 'src/users/users.service';
import { GenerateTokensProvider } from '../providers/generate-tokens.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    this.oauthClient = new OAuth2Client(
      this.jwtConfiguration.googleClientId,
      this.jwtConfiguration.googleClientSecret,
    );
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      const payload = loginTicket.getPayload();

      if (!payload) {
        throw new BadRequestException('Invalid token');
      }

      const {
        sub: googleId,
        email,
        given_name: firstName,
        family_name: lastName,
      } = payload;

      let user = await this.usersService.findOneByGoogleId(googleId);

      if (!user) {
        const newUser = await this.usersService.createGoogleUser({
          googleId,
          email: email ?? '',
          firstName: firstName ?? '',
          lastName: lastName ?? '',
        });
        user = newUser;
      }

      return this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Invalid token');
    }
  }
}
