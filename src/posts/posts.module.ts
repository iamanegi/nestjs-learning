import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { MetaOption } from 'src/meta-options/meta-options.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Post, MetaOption])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
