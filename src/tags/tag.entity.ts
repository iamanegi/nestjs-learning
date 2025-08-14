import { Post } from 'src/posts/post.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    name: 'slug',
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description?: string;

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

  @ManyToMany(() => Post, (post) => post.tags, {
    onDelete: 'CASCADE',
  })
  posts: Post[];

  @CreateDateColumn({ name: 'created_on' })
  createdOn: Date;

  @UpdateDateColumn({ name: 'updated_on' })
  updatedOn: Date;

  @DeleteDateColumn({ name: 'deleted_on' })
  deletedOn: Date;
}
