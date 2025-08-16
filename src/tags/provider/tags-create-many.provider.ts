import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tag } from '../tag.entity';
import { CreateManyTagDto } from '../dtos/create-many-tag.dto';

@Injectable()
export class TagsCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  public async createMany(createManyTagDto: CreateManyTagDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const newTags: Tag[] = [];
    try {
      for (const createTagDto of createManyTagDto.tags) {
        const newTag = queryRunner.manager.create(Tag, createTagDto);
        const result = await queryRunner.manager.save(newTag);
        newTags.push(result);
      }
      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return newTags;
  }
}
