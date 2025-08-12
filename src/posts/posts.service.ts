import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    const author = await this.usersService.findOneById(createPostDto.authorId);

    if (!author) {
      return { message: 'Invalid author' };
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
    });
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: number) {
    const user = this.usersService.findOneById(userId);
    console.log(user);
    return await this.postsRepository.find();
  }

  public async delete(id: number) {
    return await this.postsRepository.delete(id);
  }
}
