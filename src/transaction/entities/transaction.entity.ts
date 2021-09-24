import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/core/db/base.entity';
import { Card } from 'src/card/entities/card.entity';
import { Child } from 'src/child/entities/child.entity';

@Entity({
  name: 'transactions'
})
export class Transaction extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNotEmpty()
  amount: number;

  @ManyToOne(() => Card, (card) => card.transactions)
  @JoinColumn({ name: 'cardId' })
  card: Card;

  @Column()
  cardId: number;

  @ManyToOne(() => Child, (child) => child.cards)
  @JoinColumn({ name: 'childId' })
  child: Child;

  @Column()
  childId: number;
}
