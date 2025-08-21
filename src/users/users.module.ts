import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import userConfig from './config/user.config';
import { CreateUserProvider } from './provider/create-user.provider';
import { FindOneUserByEmail } from './provider/find-one-user-by-email.provider';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(userConfig),
  ],
  controllers: [UsersController],
  providers: [UsersService, CreateUserProvider, FindOneUserByEmail],
  exports: [UsersService],
})
export class UsersModule {}
