import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PostType } from './enums/post-type.enum';
import { PostStatus } from './enums/post-status.enum';
import { CreatePostMetaOptionsDto } from '../meta-options/dtos/create-post-meta-options.dto';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  title: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: PostType,
    nullable: false,
    default: PostType.POST,
  })
  postType: PostType;

  @Column({
    name: 'slug',
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PostStatus,
    nullable: false,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Column({
    name: 'content',
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    name: 'schema',
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({
    name: 'featured_image_url',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  featuredImageUrl?: string;

  @Column({
    name: 'publish_on',
    type: 'timestamp',
    nullable: true,
  })
  publishOn?: Date;

  tags?: string[];
  metaOptions?: CreatePostMetaOptionsDto[];
}
