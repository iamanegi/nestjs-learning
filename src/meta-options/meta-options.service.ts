import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from './meta-options.entity';
import { Repository } from 'typeorm';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  public async createMetaOption(
    createPostMetaOptionsDto: CreatePostMetaOptionsDto,
  ) {
    const newMetaOptions = this.metaOptionRepository.create(
      createPostMetaOptionsDto,
    );
    return await this.metaOptionRepository.save(newMetaOptions);
  }
}
