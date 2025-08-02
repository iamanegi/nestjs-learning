import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public login(email: string, password: string) {
    const user = this.usersService.findOneById('123');
    console.log('login', email, password, user);
    return '***TOKEN***';
  }

  public isAuthenticated() {
    return true;
  }
}
