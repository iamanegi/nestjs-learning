import {
  Controller,
  Body,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';

@Controller('users')
export class UsersController {
  @Get('/{:id}')
  getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return `Hello User ${JSON.stringify(getUsersParamDto)} ${limit} ${page}`;
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return `Hello User ${JSON.stringify(createUserDto)}`;
  }
}
