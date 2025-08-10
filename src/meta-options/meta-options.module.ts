import { Module } from '@nestjs/common';
import { MetaOptionsController } from './meta-options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaOption } from './meta-options.entity';
import { MetaOptionsService } from './meta-options.service';

@Module({
  imports: [TypeOrmModule.forFeature([MetaOption])],
  controllers: [MetaOptionsController],
  providers: [MetaOptionsService],
})
export class MetaOptionsModule {}
