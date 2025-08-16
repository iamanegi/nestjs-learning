import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tag } from '../tag.entity';
import { CreateManyTagDto } from '../dtos/create-many-tag.dto';

@Injectable()
export class TagsCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  public async createMany(createManyTagDto: CreateManyTagDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } catch {
      throw new RequestTimeoutException('Error connecting to database');
    }

    const newTags: Tag[] = [];
    try {
      for (const createTagDto of createManyTagDto.tags) {
        const newTag = queryRunner.manager.create(Tag, createTagDto);
        const result = await queryRunner.manager.save(newTag);
        newTags.push(result);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Failed to complete the transaction', {
        description: String(error),
      });
    } finally {
      try {
        await queryRunner.release();
      } catch (error) {
        console.error(
          'TagsCreateManyProvider :: createMany :: Failed to release connection',
          error,
        );
      }
    }
    return newTags;
  }
}
