import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
    private readonly dataSource: DataSource,
  ) {}

  public async create(createTagDto: CreateTagDto) {
    const tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  public async createMany(createTagsDto: CreateTagDto[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const newTags: Tag[] = [];
    try {
      for (const createTagDto of createTagsDto) {
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
  }

  public async findAllById(ids: number[]) {
    return await this.tagsRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  public async delete(id: number) {
    return await this.tagsRepository.delete(id);
  }

  public async softDelete(id: number) {
    return await this.tagsRepository.softDelete(id);
  }
}
