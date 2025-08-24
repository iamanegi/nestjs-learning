import { Post } from 'src/posts/post.entity';
import { Exclude } from 'class-transformer';
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
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  @Exclude()
  passwordHash?: string;

  @Column({
    name: 'google_id',
    type: 'varchar',
    nullable: true,
  })
  @Exclude()
  googleId?: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
