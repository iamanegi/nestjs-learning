import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/tags.service';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    const author = await this.usersService.findOneById(createPostDto.authorId);

    if (!author) {
      return { message: 'Invalid author' };
    }

    const tags = createPostDto.tagIds
      ? await this.tagsService.findAllById(createPostDto.tagIds)
      : undefined;

    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });
    return await this.postsRepository.save(post);
  }

  public async update(updatePostDto: UpdatePostDto) {
    let tags: Tag[] | null = null;
    try {
      tags = updatePostDto.tagIds
        ? await this.tagsService.findAllById(updatePostDto.tagIds)
        : null;
    } catch {
      throw new RequestTimeoutException('Error connecting to database');
    }

    if (tags && tags.length !== updatePostDto.tagIds?.length) {
      throw new BadRequestException('One or more tag ids are invalid.');
    }

    let post: Post | null = null;

    try {
      post = await this.postsRepository.findOneBy({
        id: updatePostDto.id,
      });
    } catch {
      throw new RequestTimeoutException('Error connecting to database');
    }

    if (!post) {
      throw new NotFoundException('Post not found with specified id.');
    }

    // update the values
    post.title = updatePostDto.title ?? post?.title;
    post.content = updatePostDto.content ?? post?.content;
    post.status = updatePostDto.status ?? post?.status;
    post.postType = updatePostDto.postType ?? post?.postType;
    post.slug = updatePostDto.slug ?? post?.slug;
    post.featuredImageUrl =
      updatePostDto.featuredImageUrl ?? post?.featuredImageUrl;
    post.publishOn = updatePostDto.publishOn ?? post?.publishOn;
    post.tags = tags ?? post?.tags;

    try {
      return await this.postsRepository.save(post);
    } catch {
      throw new RequestTimeoutException('Error connecting to database');
    }
  }

  public async findAll(userId: number) {
    const user = this.usersService.findOneById(userId);
    console.log(user);
    return await this.postsRepository.find({
      relations: {
        metaOptions: true, // can also be set at entity level while defining the relationship
        // author: true, // can also be set at entity level while defining the relationship
        // tags: true, // can also be set at entity level while defining the relationship
      },
    });
  }

  public async delete(id: number) {
    return await this.postsRepository.delete(id);
  }
}
