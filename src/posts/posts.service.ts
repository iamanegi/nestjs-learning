import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  public findAll(userId: string) {
    console.log('findAll', userId);
    return [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
      },
      {
        id: 2,
        title: 'Post 2',
        content: 'Content 2',
      },
    ];
  }
}
