import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'meta_options' })
export class MetaOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'meta_value',
    type: 'json',
    nullable: false,
  })
  metaValue: string;

  @CreateDateColumn({ name: 'created_on' })
  createdOn: Date;

  @UpdateDateColumn({ name: 'updated_on' })
  updatedOn: Date;
}
