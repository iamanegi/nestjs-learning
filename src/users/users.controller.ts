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

@Controller('users')
export class UsersController {
  @Get('/{:id}')
  getUsers(
    @Param('id', ParseIntPipe) id: number | undefined,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return `Hello User ${id} ${limit} ${page}`;
  }

  @Post()
  createUser(@Body() body: any) {
    return `Hello User ${JSON.stringify(body)}`;
  }
}
