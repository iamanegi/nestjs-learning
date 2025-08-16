import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { In, Repository } from 'typeorm';
import { TagsCreateManyProvider } from './provider/tags-create-many.provider';
import { CreateManyTagDto } from './dtos/create-many-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
    private readonly tagsCreateManyProvider: TagsCreateManyProvider,
  ) {}

  public async create(createTagDto: CreateTagDto) {
    const tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  public async createMany(createManyTagDto: CreateManyTagDto) {
    return await this.tagsCreateManyProvider.createMany(createManyTagDto);
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
