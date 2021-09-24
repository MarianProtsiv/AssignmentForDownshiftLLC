import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique
} from 'typeorm';
import { IsNotEmpty, Length } from 'class-validator';
import { BaseEntity } from 'src/core/db/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Child } from 'src/child/entities/child.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Entity({
  name: 'cards'
})
@Unique(['number', 'childId'])
export class Card extends BaseEntity {
  @Column()
  @IsNotEmpty()
  type: string;

  @Column({ length: 16 })
  @Length(16, 16)
  @IsNotEmpty()
  number: string;

  @Column({ length: 3 })
  @Length(3, 3)
  @IsNotEmpty()
  securityCode: string;

  @Column({ length: 5 })
  @Length(5, 5)
  @IsNotEmpty()
  expireAt: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNotEmpty()
  monthlyLimit: number;

  @ManyToOne(() => User, (user) => user.cards)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Child, (child) => child.cards)
  @JoinColumn({ name: 'childId' })
  child: Child;

  @Column()
  childId: number;

  @OneToMany(() => Transaction, (transaction) => transaction.cardId)
  transactions: Transaction[];
}
