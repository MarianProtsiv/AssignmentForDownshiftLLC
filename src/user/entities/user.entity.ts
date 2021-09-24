import { Column, Entity, OneToMany } from 'typeorm';
import bcrypt from 'bcrypt';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/core/db/base.entity';
import { Child } from 'src/child/entities/child.entity';
import { Card } from 'src/card/entities/card.entity';

@Entity({
  name: 'users'
})
export class User extends BaseEntity {
  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Child, (child) => child.userId)
  childs: Child[];

  @OneToMany(() => Card, (card) => card.userId)
  cards: Card[];

  isPasswordValid(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
