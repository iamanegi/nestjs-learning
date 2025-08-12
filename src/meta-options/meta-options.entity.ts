import { Post } from 'src/posts/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'meta_options' })
export class MetaOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'meta_value',
    type: 'json',
    nullable: false,
  })
  metaValue: JSON;

  @CreateDateColumn({ name: 'created_on' })
  createdOn: Date;

  @UpdateDateColumn({ name: 'updated_on' })
  updatedOn: Date;

  @OneToOne(() => Post, (post) => post.metaOptions)
  @JoinColumn()
  post: Post;
}
