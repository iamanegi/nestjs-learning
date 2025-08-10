import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-options.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    const post = this.postsRepository.create(createPostDto);
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    console.log(user);
    return await this.postsRepository.find();
  }

  public async delete(id: number) {
    const post = await this.postsRepository.findOneBy({ id: id });

    await this.postsRepository.delete(id);

    const metaOptionId = post?.metaOptions?.id;
    if (metaOptionId) {
      await this.metaOptionsRepository.delete(metaOptionId);
    }

    return { deleted: true, id };
  }
}
