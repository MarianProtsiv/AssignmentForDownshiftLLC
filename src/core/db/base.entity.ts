import { Exclude } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn({
    name: 'createdAt'
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt'
  })
  public updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn({
    name: 'deletedAt'
  })
  public deletedAt?: Date;

  validate(): Promise<void> {
    return validateOrReject(this);
  }
}
