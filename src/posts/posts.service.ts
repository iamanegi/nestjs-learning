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
import { GetPostsDto } from './dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { CreatePostProvider } from './providers/create-post.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    private readonly paginationProvider: PaginationProvider,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly createPostProvider: CreatePostProvider,
  ) {}

  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    return await this.createPostProvider.create(createPostDto, user);
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

  public async findAll(
    userId: number,
    getPostsDto: GetPostsDto,
  ): Promise<Paginated<Post>> {
    const user = this.usersService.findOneById(userId);
    console.log(user);
    // return await this.postsRepository.find({
    //   relations: {
    //     metaOptions: true, // can also be set at entity level while defining the relationship
    //     // author: true, // can also be set at entity level while defining the relationship
    //     // tags: true, // can also be set at entity level while defining the relationship
    //   },
    //   skip: (getPostsDto.page - 1) * getPostsDto.limit,
    //   take: getPostsDto.limit,
    // });
    return this.paginationProvider.paginateQuery(
      {
        page: getPostsDto.page,
        limit: getPostsDto.limit,
      },
      this.postsRepository,
    );
  }

  public async delete(id: number) {
    return await this.postsRepository.delete(id);
  }
}
