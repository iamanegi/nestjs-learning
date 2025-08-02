import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    console.log('findAll', user);
    return [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        user: user,
      },
      {
        id: 2,
        title: 'Post 2',
        content: 'Content 2',
        user: user,
      },
    ];
  }
}
