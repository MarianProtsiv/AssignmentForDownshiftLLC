import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/core/db/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Card } from 'src/card/entities/card.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Entity({
  name: 'childs'
})
export class Child extends BaseEntity {
  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;

  @Column()
  @IsNotEmpty()
  age: number;

  @ManyToOne(() => User, (user) => user.childs)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => Card, (card) => card.child)
  cards: Card[];

  @OneToMany(() => Transaction, (transaction) => transaction.childId)
  transactions: Transaction[];
}
