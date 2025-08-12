import { Post } from 'src/posts/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  lastName: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 90,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  password: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
