import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileTypes } from './enums/file-types.enum';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'path',
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  path: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: FileTypes,
    default: FileTypes.IMAGE,
    nullable: false,
  })
  type: FileTypes;

  @Column({
    name: 'mime',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  mime: string;

  @Column({
    name: 'size',
    type: 'int',
    nullable: false,
  })
  size: number;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
