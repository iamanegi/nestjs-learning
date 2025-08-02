import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const isAuthenticated = this.authService.isAuthenticated();
    console.log(getUsersParamDto, limit, page, isAuthenticated);
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

  public findOneById(id: string) {
    console.log('findOneById', id);
    return {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    };
  }
}
