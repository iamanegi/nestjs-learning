import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateTagDto } from './create-tag.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManyTagDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'CreateTagDto',
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  tags: CreateTagDto[];
}
