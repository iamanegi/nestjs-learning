import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/users.service';
import { TagsService } from 'src/tags/tags.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author: User | null = null;
    let tags: Tag[] | null = null;

    try {
      author = await this.usersService.findOneById(user.sub);
      tags = createPostDto.tagIds
        ? await this.tagsService.findAllById(createPostDto.tagIds)
        : null;
    } catch {
      throw new BadRequestException('Invalid author or tags');
    }

    if (createPostDto.tagIds?.length != tags?.length) {
      throw new BadRequestException('Invalid tag ids');
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags ?? undefined,
    });
    return await this.postsRepository.save(post);
  }
}
